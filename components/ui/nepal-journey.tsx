'use client';

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ParallaxComponent } from './parallax-scrolling';
import { PHOTOGRAPHS, PHOTO_BY_ID } from '@/src/data/photographs';
import { SCENES, SCENE_STARTS, SOURCES } from '@/src/data/journey';
import { buildJourneyTimeline } from '@/lib/journey-motion';
import { NepalSoundscape } from '@/lib/nepal-sound';

function KineticTitle({ lines, id }: { lines: readonly string[]; id: string }) {
  return <h2 id={`${id}-title`} className="film-title" aria-label={lines.join(' ')}>{lines.map((line) => <span className="film-title-line" key={line} aria-hidden="true"><span className="film-word">{line}</span></span>)}</h2>;
}

function SoundControl({ active, creditsOpen }: { active: number; creditsOpen: boolean }) {
  const engine = useRef<NepalSoundscape | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!enabled) return;
    const scene = SCENES[active];
    engine.current?.setMood(creditsOpen ? 'quiet' : scene?.mood ?? 'wind', !creditsOpen && ['sacred', 'wheels', 'festival', 'finale'].includes(scene?.id));
  }, [active, enabled, creditsOpen]);
  useEffect(() => {
    const mute = () => {
      if (document.hidden) { void engine.current?.destroy(); engine.current = null; setEnabled(false); }
    };
    document.addEventListener('visibilitychange', mute);
    return () => { document.removeEventListener('visibilitychange', mute); void engine.current?.destroy(); engine.current = null; };
  }, []);
  const toggle = async () => {
    if (busy) return;
    setBusy(true); setError('');
    try {
      if (enabled) { await engine.current?.destroy(); engine.current = null; setEnabled(false); }
      else {
        const sound = new NepalSoundscape(); engine.current = sound;
        await sound.enable();
        if (engine.current === sound && !document.hidden) setEnabled(true);
        else await sound.destroy();
      }
    } catch { void engine.current?.destroy(); engine.current = null; setError('Sound is unavailable in this browser.'); }
    finally { setBusy(false); }
  };
  return <div className="film-sound" inert={creditsOpen}><button type="button" onClick={toggle} aria-pressed={enabled} disabled={busy} aria-label={enabled ? 'Turn sound off' : 'Turn sound on'}><span className={`sound-bars${enabled ? ' sound-bars--on' : ''}`} aria-hidden="true"><i /><i /><i /></span>Sound {enabled ? 'on' : 'off'}</button><span role="status" className="sound-status">{error}</span></div>;
}

function JourneyScenes() {
  const filmRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState<Set<number>>(() => new Set([0]));
  const [active, setActive] = useState(-1);
  const [staticReading, setStaticReading] = useState(false);
  const [creditsOpen, setCreditsOpen] = useState(false);
  const creditsButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const openCredits = () => { returnFocus.current = document.activeElement as HTMLElement; setCreditsOpen(true); };
  useEffect(() => {
    window.addEventListener('nepal:credits', openCredits);
    return () => window.removeEventListener('nepal:credits', openCredits);
  }, []);
  useLayoutEffect(() => {
    const film = filmRef.current;
    const root = film?.closest<HTMLElement>('.parallax');
    const header = root?.querySelector<HTMLElement>('.parallax__header');
    if (!film || !root || !header) return;
    gsap.registerPlugin(ScrollTrigger);
    let disposed = false, lastScene = -2;
    const media = gsap.matchMedia();
    media.add({ motion: '(prefers-reduced-motion: no-preference) and (min-height: 741px)', reduced: '(prefers-reduced-motion: reduce)', short: '(max-height: 740px)', mobile: '(max-width: 700px)' }, (context) => {
      const { reduced, short, mobile } = context.conditions!;
      setStaticReading(Boolean(reduced || short));
      if (reduced || short) {
        setLoaded(new Set(SCENES.map((_, i) => i))); setActive(-1); return;
      }
      const timeline = buildJourneyTimeline(film, root.querySelector<HTMLElement>('.parallax__visuals')!, Boolean(mobile));
      const updateScene = (self: ScrollTrigger) => {
        const time = self.progress * timeline.duration();
        const index = self.progress === 0 ? -1 : SCENE_STARTS.reduce<number>((current, start, scene) => time >= start ? scene : current, 0);
        if (index === lastScene) return;
        lastScene = index; setActive(index);
        // Keep just the neighbouring photographs decoded. Search beyond text
        // chapters so the next image is already available for its entrance.
        const window = new Set<number>([Math.max(0, index)]);
        let ahead = 0, behind = 0;
        for (let i = Math.max(0, index + 1); i < SCENES.length && ahead < 2; i++) if (SCENES[i].photo) { window.add(i); ahead++; }
        for (let i = index - 1; i >= 0 && behind < 1; i--) if (SCENES[i].photo) { window.add(i); behind++; }
        if (index <= 0) { window.clear(); window.add(0); }
        setLoaded(window);
      };
      const trigger = ScrollTrigger.create({ trigger: root, start: () => `top -${header.clientHeight * 0.6}px`, end: 'bottom bottom', animation: timeline, scrub: true, invalidateOnRefresh: true, onUpdate: updateScene, onRefresh: updateScene });
      updateScene(trigger);
      return () => { lastScene = -2; };
    }, film);
    document.fonts.ready.then(() => { if (!disposed) ScrollTrigger.refresh(); });
    return () => { disposed = true; media.revert(); };
  }, []);
  useEffect(() => {
    if (creditsOpen) closeButton.current?.focus();
    else returnFocus.current?.focus();
  }, [creditsOpen]);
  useEffect(() => {
    if (!creditsOpen) return;
    const overflow = document.body.style.overflow;
    const watermark = document.querySelector<HTMLElement>('.prem-watermark');
    const wasInert = watermark?.inert ?? false;
    document.body.style.overflow = 'hidden';
    if (watermark) watermark.inert = true;
    return () => { document.body.style.overflow = overflow; if (watermark) watermark.inert = wasInert; };
  }, [creditsOpen]);
  const replay = () => { window.scrollTo({ top: 0, behavior: 'instant' }); window.dispatchEvent(new Event('nepal:replay')); };

  return <div ref={filmRef} className="journey-film" data-active-scene={active} data-reading={staticReading}>
    {SCENES.map((scene, index) => {
      const photo = scene.photo ? PHOTO_BY_ID[scene.photo] : undefined;
      const source = scene.source ? SOURCES[scene.source] : undefined;
      return <section className={`film-scene film-scene--${scene.id}${scene.kind === 'essay' ? ' film-essay' : ''}`} key={scene.id} data-scene={scene.id} data-transition={scene.transition} aria-labelledby={`${scene.id}-title`} aria-hidden={!staticReading && active !== index} inert={creditsOpen || (!staticReading && active !== index)}>
        {photo && <><div className="film-photo-frame">{loaded.has(index) && <picture><source media="(max-width: 700px)" srcSet={photo.mobile} /><img className="film-photo" src={photo.src} srcSet={photo.srcSet} sizes="100vw" alt={photo.alt} width={photo.width} height={photo.height} loading={staticReading ? 'lazy' : 'eager'} decoding="async" style={{ '--photo-focus': photo.focus, '--photo-focus-mobile': photo.mobileFocus } as CSSProperties} /></picture>}</div><div className="film-shade" aria-hidden="true" /></>}
        {scene.mark && <span className="film-mark" aria-hidden="true">{scene.mark}</span>}
        <div className="film-meta"><span>{String(index + 1).padStart(2, '0')} / {SCENES.length}</span><span>{scene.place}</span></div>
        <div className="film-editorial">{scene.id === 'finale' && <p className="film-ending-intro">{scene.copy}</p>}<KineticTitle lines={scene.lines} id={scene.id} />{scene.id !== 'finale' && <p className="film-copy">{scene.copy}</p>}{scene.detail && <p className="film-detail">{scene.detail}</p>}{scene.notes && <dl className="film-notes">{scene.notes.map(note => <div key={note.label}><dt>{note.label}</dt><dd>{note.text}</dd></div>)}</dl>}</div>
        <p className="film-caption">{scene.caption}</p>
        {source && <a className="film-source" href={source.url} target="_blank" rel="noreferrer">Read the research <span aria-hidden="true">↗</span><span className="film-source-name">{source.label}</span></a>}
        {scene.id === 'finale' && <div className="film-end-actions"><button type="button" onClick={replay}>Return to the beginning <span aria-hidden="true">↗</span></button><button ref={creditsButton} type="button" aria-expanded={creditsOpen} aria-controls="photography-credits" onClick={openCredits}>Photography & research <span aria-hidden="true">+</span></button></div>}
      </section>;
    })}
    <SoundControl active={active} creditsOpen={creditsOpen} />
    <div className="film-progress" aria-hidden="true"><span /></div>
    <aside id="photography-credits" className="film-credits" hidden={!creditsOpen} role="dialog" aria-modal="true" aria-label="Photography and research credits" data-lenis-prevent onKeyDown={(event) => {
      if (event.key === 'Escape') setCreditsOpen(false);
      if (event.key === 'Tab') {
        const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button, a[href]'));
        const first = controls[0], last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    }}>
      <div className="film-credits-heading"><h2>A Prem aka Kaizen Website</h2><button ref={closeButton} type="button" onClick={() => setCreditsOpen(false)}>Close ×</button></div>
      <p>All {PHOTOGRAPHS.length} journey photographs are by the creators credited below, sourced from Wikimedia Commons. They are resized, converted to WebP and cropped for this experience; each retains its linked Creative Commons licence. These photographers made the images. Prem made the website.</p>
      <ul className="photography-list">{PHOTOGRAPHS.map((photo) => <li key={photo.id}><a href={photo.source} target="_blank" rel="noreferrer">{photo.title} ↗</a><span>Photography by <strong>{photo.author}</strong></span><span><a href={photo.licenseUrl} target="_blank" rel="noreferrer">{photo.license}</a></span></li>)}</ul>
      <h3>Behind the story</h3><p>Research from Nepal Tourism Board, UNESCO, ICIMOD and scholarly work. The field notes connect to their sources so you can keep reading.</p>
      <ul className="research-list">{Object.values(SOURCES).map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a><span>{source.label}</span></li>)}</ul>
      <p className="film-credit-note">Opening Everest composition: AI-generated imagery from the original opening.<br />Sound design: original synthesized wind, water textures and chimes; these are not location recordings. Sound starts only when you choose it.<br />Website design and development: Prem Das aka Kaizen.</p>
    </aside>
  </div>;
}

export function NepalJourney() { return <ParallaxComponent><JourneyScenes /></ParallaxComponent>; }
