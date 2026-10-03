import gsap from 'gsap';

export const SCENE_STARTS = [0, 2.5, 4.7, 6.9, 9.1, 11.1, 13.1, 15.5] as const;
export const FILM_DURATION = 19;

/** A paused timeline: scroll controls every camera move and its reversal. */
export function buildJourneyTimeline(film: HTMLElement, opening: HTMLElement, mobile: boolean) {
  const scenes = Array.from(film.querySelectorAll<HTMLElement>('.film-scene'));
  const timeline = gsap.timeline({ paused: true, defaults: { ease: 'none' } });
  gsap.set(scenes, { autoAlpha: 0 });
  // The first frame is fully masked; keep its state identical on initial
  // load and when reversing all the way back to the opening.
  gsap.set(scenes[0], { autoAlpha: mobile ? 0 : 1 });
  gsap.set(film.querySelector('.film-progress'), { autoAlpha: 0 });

  scenes.forEach((scene, index) => {
    const start = SCENE_STARTS[index];
    const words = scene.querySelectorAll('.film-word');
    const copy = scene.querySelector('.film-copy');
    const photo = scene.querySelector('.film-photo-frame');
    const meta = scene.querySelectorAll('.film-meta, .film-caption');
    if (!mobile && index !== 5 && index !== 7) timeline.set(scene, { autoAlpha: 1 }, start);
    // Small screens use compositor-friendly fades/slides rather than
    // repainting full-screen curved and polygon masks on every scroll frame.
    if (mobile) {
      timeline.fromTo(scene,
        { autoAlpha: 0, xPercent: index === 1 ? 100 : index === 4 ? -100 : 0, yPercent: index === 3 || index === 6 ? 100 : 0 },
        { autoAlpha: 1, xPercent: 0, yPercent: 0, duration: index === 7 ? 1.75 : 1.3, ease: 'power1.inOut' }, start);
      if (index === 0) {
        timeline.to(opening, { scale: 1.08, duration: 1.6 }, start);
        timeline.set(opening, { autoAlpha: 0 }, start + 1.6);
      }
      if (index === 1) timeline.fromTo(scene.querySelector('.film-marquee'), { xPercent: 24 }, { xPercent: -20, duration: 3.2 }, start);
    } else if (index === 0) {
      timeline.fromTo(scene, { clipPath: 'ellipse(0% 0% at 50% 42%)' }, { clipPath: 'ellipse(100% 100% at 50% 42%)', duration: 1.6, ease: 'power1.inOut' }, start);
      timeline.to(opening, { scale: 1.08, duration: 1.6 }, start);
      timeline.set(opening, { autoAlpha: 0 }, start + 1.6);
    } else if (index === 1) {
      timeline.fromTo(scene, { clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)', duration: 1.2, ease: 'power2.inOut' }, start);
      timeline.to(scenes[index - 1].querySelector('.film-editorial'), { xPercent: -25, opacity: 0, duration: 1.2 }, start);
      timeline.fromTo(scene.querySelector('.film-marquee'), { xPercent: 24 }, { xPercent: -20, duration: 3.2 }, start);
    } else if (index === 2) {
      timeline.fromTo(scene, { clipPath: 'circle(0% at 58% 48%)' }, { clipPath: `circle(${mobile ? 125 : 90}% at 58% 48%)`, duration: 1.3, ease: 'power1.inOut' }, start);
      timeline.to(scenes[index - 1], { scale: 0.93, duration: 1.3 }, start);
    } else if (index === 3) {
      timeline.fromTo(scene, { yPercent: 100 }, { yPercent: 0, duration: 1.25, ease: 'power2.inOut' }, start);
      timeline.to(scenes[index - 1].querySelector('.film-editorial'), { yPercent: -35, duration: 1.25 }, start);
    } else if (index === 4) {
      timeline.fromTo(scene, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1.15, ease: 'power2.inOut' }, start);
      timeline.to(scenes[index - 1].querySelector('.film-photo-frame'), { xPercent: mobile ? 10 : 20, duration: 1.15 }, start);
    } else if (index === 5) {
      timeline.fromTo(scene, { autoAlpha: 0, scale: 1.12 }, { autoAlpha: 1, scale: 1, duration: 1.3 }, start);
      timeline.to(scenes[index - 1].querySelector('.film-editorial'), { scale: 1.12, opacity: 0, duration: 0.9 }, start);
    } else if (index === 6) {
      timeline.fromTo(scene, { clipPath: 'polygon(0 100%, 100% 80%, 100% 100%, 0 100%)' }, { clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0 100%)', duration: 1.4, ease: 'power2.inOut' }, start);
    } else {
      timeline.fromTo(scene, { clipPath: mobile ? 'inset(32% 20% 32% 20%)' : 'inset(24% 34% 24% 34%)', autoAlpha: 0 }, { clipPath: 'inset(0% 0% 0% 0%)', autoAlpha: 1, duration: 1.75, ease: 'power1.inOut' }, start);
      timeline.to(scenes[index - 1], { scale: 1.12, duration: 1.75 }, start);
    }
    timeline.fromTo(photo, { scale: index === 3 ? 1.02 : 1.14, ...(index === 1 ? { xPercent: -3 } : {}) }, { scale: 1, ...(index === 1 ? { xPercent: 3 } : {}), duration: index === 7 ? 3.5 : 3.6 }, start);
    timeline.fromTo(words, { yPercent: index === 3 ? -108 : 108, rotate: index === 4 ? 3 : 0 }, { yPercent: 0, rotate: 0, duration: 0.85, stagger: 0.14, ease: 'power3.out' }, start + (index === 7 ? 1.05 : 0.65));
    if (copy) timeline.fromTo(copy, { opacity: 0, x: index === 4 ? 25 : 0 }, { opacity: 1, x: 0, duration: 0.55 }, start + 1.35);
    timeline.fromTo(meta, { opacity: 0 }, { opacity: 1, duration: 0.55 }, start + 1.25);
    if (index > 0) timeline.set(scenes[index - 1], { autoAlpha: 0 }, start + (index === 7 ? 1.75 : 1.4));
  });
  timeline.fromTo(film.querySelector('.film-ending-intro'), { opacity: 0 }, { opacity: 1, duration: 1 }, 17);
  timeline.fromTo(film.querySelector('.film-end-actions'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.7 }, 17.6);
  timeline.to(film.querySelector('.film-progress'), { autoAlpha: 1, duration: 0.4 }, 1.6);
  timeline.fromTo(film.querySelector('.film-progress span'), { scaleX: 0 }, { scaleX: 1, duration: FILM_DURATION }, 0);
  return timeline;
}
