import gsap from 'gsap';
import { SCENES, SCENE_STARTS, FILM_DURATION } from '@/src/data/journey';
export { SCENE_STARTS, FILM_DURATION } from '@/src/data/journey';

/** One reversible scroll timeline. Only the visible pair of scenes is animated. */
export function buildJourneyTimeline(film: HTMLElement, opening: HTMLElement, mobile: boolean) {
  const scenes = Array.from(film.querySelectorAll<HTMLElement>('.film-scene'));
  const timeline = gsap.timeline({ paused: true, defaults: { ease: 'none' } });
  gsap.set(scenes, { autoAlpha: 0 });
  gsap.set(film.querySelector('.film-progress'), { autoAlpha: 0 });
  scenes.forEach((scene, index) => {
    const beat = SCENES[index], start = SCENE_STARTS[index];
    const previous = scenes[index - 1];
    const duration = beat.transition === 'match' ? 0.72 : 1.05;
    // Match cuts use a brief push toward architectural forms, then a clean
    // change of photograph. No expensive masks on phones.
    if (beat.transition === 'match') {
      timeline.to(previous.querySelector('.film-editorial'), { opacity: 0, duration: 0.35 }, start);
      timeline.to(previous.querySelector('.film-photo-frame'), { scale: 1.16, duration: 0.7, ease: 'power2.in' }, start);
      timeline.set(scene, { autoAlpha: 1 }, start + duration);
      timeline.fromTo(scene.querySelector('.film-photo-frame'), { scale: 1.16 }, { scale: 1, duration: 1.4, ease: 'power2.out' }, start + duration);
    } else if (beat.transition === 'iris' && !mobile) {
      timeline.set(scene, { autoAlpha: 1 }, start);
      timeline.fromTo(scene, { clipPath: 'circle(0% at 55% 45%)' }, { clipPath: 'circle(110% at 55% 45%)', duration, ease: 'power1.inOut' }, start);
    } else {
      timeline.fromTo(scene, { autoAlpha: 0, xPercent: beat.transition === 'slide' ? (index % 2 ? -12 : 12) : 0, yPercent: beat.transition === 'rise' ? 18 : 0 }, { autoAlpha: 1, xPercent: 0, yPercent: 0, duration, ease: 'power2.inOut' }, start);
    }
    if (index === 0) {
      timeline.to(opening, { scale: 1.08, duration }, start);
      timeline.set(opening, { autoAlpha: 0 }, start + duration);
    }
    if (beat.photo && beat.transition !== 'match') {
      timeline.fromTo(scene.querySelector('.film-photo-frame'), { scale: mobile ? 1.035 : 1.065 }, { scale: 1, duration: beat.duration }, start);
    }
    const textDelay = beat.transition === 'match' ? 0.9 : 0.5;
    timeline.fromTo(scene.querySelectorAll('.film-word'), { yPercent: 108 }, { yPercent: 0, duration: 0.65, stagger: 0.1, ease: 'power3.out' }, start + textDelay);
    const prose = scene.querySelectorAll('.film-copy, .film-detail, .film-notes, .film-ending-intro');
    if (prose.length) timeline.fromTo(prose, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.12 }, start + textDelay + 0.5);
    timeline.fromTo(scene.querySelectorAll('.film-meta, .film-caption, .film-source'), { opacity: 0 }, { opacity: 1, duration: 0.4 }, start + 1.1);
    if (previous) timeline.set(previous, { autoAlpha: 0 }, start + duration);
  });
  const finale = SCENE_STARTS[SCENES.length - 1];
  timeline.fromTo(film.querySelector('.film-end-actions'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.7 }, finale + 1.7);
  timeline.to(film.querySelector('.film-progress'), { autoAlpha: 1, duration: 0.4 }, 1.05);
  timeline.fromTo(film.querySelector('.film-progress span'), { scaleX: 0 }, { scaleX: 1, duration: FILM_DURATION }, 0);
  return timeline;
}
