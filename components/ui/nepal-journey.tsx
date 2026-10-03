'use client';

import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ParallaxComponent } from './parallax-scrolling';
import { PHOTOGRAPHS } from '@/src/data/photographs';
import { buildJourneyTimeline, SCENE_STARTS } from '@/lib/journey-motion';

const SCENES = [
  { id: 'land', place: 'THE LAND', lines: ['BEYOND', 'THE SUMMIT.'], copy: 'Forested hills. Fields of green. Valleys that open into another world.', caption: 'Balthali · The hills of Nepal' },
  { id: 'heritage', place: 'KATHMANDU VALLEY', lines: ['HISTORY,', 'STILL ALIVE.'], copy: 'In Bhaktapur, brick courtyards and tiered temples are part of the everyday.', caption: 'Bhaktapur · Kathmandu Valley' },
  { id: 'sacred', place: 'BOUDHANATH', lines: ['A MOMENT', 'OF STILLNESS.'], copy: 'Prayer flags above. Footsteps around the stupa. A city finding its rhythm.', caption: 'Boudhanath · Kathmandu' },
  { id: 'people', place: 'LIVING HERITAGE', lines: ['LIFE IN', 'MOTION.'], copy: 'Shared squares. Working hands. In Bhaktapur, daily life unfolds beside centuries of craftsmanship.', caption: 'Pottery Square · Bhaktapur' },
  { id: 'food', place: 'AT THE TABLE', lines: ['A TASTE', 'OF HOME.'], copy: 'Momo, warm from the steamer. A small parcel, made for sharing.', caption: 'Momo · A familiar favourite' },
  { id: 'festival', place: 'TIHAR', lines: ['LET THERE', 'BE LIGHT.'], copy: 'Oil lamps brighten homes and streets during Nepal’s festival of lights.', caption: 'Tihar · The festival of lights' },
  { id: 'adventure', place: 'THE WAY FORWARD', lines: ['TAKE THE', 'LONG WAY.'], copy: 'Trails connect villages. Bridges cross rivers. The journey becomes part of the place.', caption: 'Tatopani · Kali Gandaki Valley' },
  { id: 'finale', place: 'PHEWA LAKE · POKHARA', lines: ['NEPAL'], copy: 'A country. Countless worlds.', caption: 'Carry a little of it with you.' },
] as const;

function KineticTitle({ lines, id }: { lines: readonly string[]; id: string }) {
  return <h2 id={`${id}-title`} className="film-title" aria-label={lines.join(' ')}>{lines.map((line) => <span className="film-title-line" key={line} aria-hidden="true"><span className="film-word">{line}</span></span>)}</h2>;
}

function JourneyScenes() {
  const filmRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState<Set<number>>(() => new Set([0]));
  const [active, setActive] = useState(-1);
  const [creditsOpen, setCreditsOpen] = useState(false);
  const creditsButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const wasCreditsOpen = useRef(false);

  useLayoutEffect(() => {
    const openCredits = () => setCreditsOpen(true);
    window.addEventListener('nepal:credits', openCredits);
    return () => window.removeEventListener('nepal:credits', openCredits);
  }, []);

  useLayoutEffect(() => {
    const film = filmRef.current;
    const root = film?.closest<HTMLElement>('.parallax');
    const header = root?.querySelector<HTMLElement>('.parallax__header');
    if (!film || !root || !header) return;
    gsap.registerPlugin(ScrollTrigger);
    let disposed = false;
    let lastScene = -2;
    const media = gsap.matchMedia();
    media.add({ motion: '(prefers-reduced-motion: no-preference)', reduced: '(prefers-reduced-motion: reduce)', mobile: '(max-width: 700px)' }, (context) => {
      const { reduced, mobile } = context.conditions!;
      if (reduced) {
        setLoaded(new Set(SCENES.map((_, i) => i)));
        setActive(7);
        return;
      }
      const timeline = buildJourneyTimeline(film, root.querySelector<HTMLElement>('.parallax__visuals')!, Boolean(mobile));
      const updateScene = (self: ScrollTrigger) => {
          const time = self.progress * timeline.duration();
          const index = self.progress === 0 ? -1 : SCENE_STARTS.reduce<number>((current, start, scene) => time >= start ? scene : current, 0);
          if (index === lastScene) return;
          lastScene = index;
          setActive(index);
          setLoaded((previous) => new Set([...previous, Math.max(0, index), Math.min(7, index + 1)]));
        };
      const trigger = ScrollTrigger.create({ trigger: root, start: () => `top -${header.clientHeight * 0.6}px`, end: 'bottom bottom', animation: timeline, scrub: true, invalidateOnRefresh: true, onUpdate: updateScene, onRefresh: updateScene });
      updateScene(trigger);
      return () => { lastScene = -2; };
    }, film);
    document.fonts.ready.then(() => { if (!disposed) ScrollTrigger.refresh(); });
    return () => { disposed = true; media.revert(); };
  }, []);

  useLayoutEffect(() => {
    if (creditsOpen) closeButton.current?.focus();
    else if (wasCreditsOpen.current) (active === 7 ? creditsButton.current : document.querySelector<HTMLAnchorElement>('.prem-watermark'))?.focus();
    wasCreditsOpen.current = creditsOpen;
  }, [creditsOpen, active]);
  const closeCredits = () => setCreditsOpen(false);
  const replay = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    window.dispatchEvent(new Event('nepal:replay'));
  };

  return <div ref={filmRef} className="journey-film" data-active-scene={active}>
    {SCENES.map((scene, index) => {
      const photo = PHOTOGRAPHS[index];
      return <section className={`film-scene film-scene--${scene.id}`} key={scene.id} data-scene={scene.id} aria-labelledby={`${scene.id}-title`}>
        <div className="film-photo-frame">{loaded.has(index) && <picture><source media="(max-width: 700px)" srcSet={photo.mobile} /><img className="film-photo" src={photo.src} srcSet={photo.srcSet} sizes="100vw" alt={photo.alt} width={photo.width} height={photo.height} loading="eager" decoding="async" style={{ '--photo-focus': photo.focus, '--photo-focus-mobile': photo.mobileFocus } as CSSProperties} /></picture>}</div>
        <div className="film-shade" aria-hidden="true" />
        <div className="film-meta"><span>0{index + 1} / 08</span><span>{scene.place}</span></div>
        <div className="film-editorial">{scene.id === 'finale' && <p className="film-ending-intro">{scene.copy}</p>}<KineticTitle lines={scene.lines} id={scene.id} />{scene.id !== 'finale' && <p className="film-copy">{scene.copy}</p>}</div>
        {scene.id === 'heritage' && <span className="film-marquee" aria-hidden="true">KATHMANDU</span>}
        {scene.id === 'sacred' && <span className="film-quiet-rule" aria-hidden="true" />}
        <p className="film-caption">{scene.caption}</p>
        {scene.id === 'finale' && <div className="film-end-actions" inert={active !== 7 || creditsOpen}><button type="button" onClick={replay}>Return to the beginning <span aria-hidden="true">↗</span></button><button ref={creditsButton} type="button" aria-expanded={creditsOpen} aria-controls="photography-credits" onClick={() => setCreditsOpen(true)}>Photography & credits <span aria-hidden="true">+</span></button></div>}
      </section>;
    })}
    <div className="film-progress" aria-hidden="true"><span /></div>
    <aside id="photography-credits" className="film-credits" hidden={!creditsOpen} role="dialog" aria-modal="true" aria-label="Photography credits" data-lenis-prevent onKeyDown={(event) => {
      if (event.key === 'Escape') closeCredits();
      if (event.key === 'Tab') {
        const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button, a[href]'));
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    }}>
      <div className="film-credits-heading"><h2>A Prem aka Kaizen Website</h2><button ref={closeButton} type="button" onClick={closeCredits}>Close ×</button></div>
      <p>Photography by the creators below. All eight photographs in the journey belong to their credited photographers and are sourced from Wikimedia Commons. Resized, converted to WebP and cropped for this experience; each retains its linked Creative Commons licence.</p>
      <ul>{PHOTOGRAPHS.map((photo) => <li key={photo.id}><a href={photo.source} target="_blank" rel="noreferrer">{photo.title} ↗</a><span>Photography by <strong>{photo.author}</strong></span><span><a href={photo.licenseUrl} target="_blank" rel="noreferrer">{photo.license}</a></span></li>)}</ul>
      <p className="film-credit-note">Opening Everest composition: AI-generated imagery from the original opening.<br />Website design and development: Prem Das aka Kaizen.</p>
    </aside>
  </div>;
}

export function NepalJourney() { return <ParallaxComponent><JourneyScenes /></ParallaxComponent>; }
