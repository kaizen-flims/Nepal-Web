'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import { assetUrl } from '@/lib/asset-url';

const ASSETS = {
  background: '/images/nepal/everest-background.webp',
  person: '/images/nepal/person-layer.webp',
  foreground: '/images/nepal/foreground-layer.webp',
} as const;

/** Fullscreen hero. The additional document height is only its scroll runway. */
export function ParallaxComponent({ children }: { children?: ReactNode }) {
  const extended = Boolean(children);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const root = parallaxRef.current;
    if (!root) return;
    gsap.registerPlugin(ScrollTrigger);
    let disposed = false;
    const images = Array.from(root.querySelectorAll<HTMLImageElement>('.parallax__visuals img'));
    Promise.all(images.map((img) => img.decode().catch(() => undefined))).then(() => {
      if (!disposed) {
        setReady(true);
        ScrollTrigger.refresh();
      }
    });

    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference) and (min-height: 741px)', () => {
      const lenis = new Lenis({ lerp: 0.09, smoothWheel: true, syncTouch: false });
      const tick = (seconds: number) => lenis.raf(seconds * 1000);
      lenis.on('scroll', ScrollTrigger.update);
      const replay = () => lenis.scrollTo(0, { immediate: true });
      window.addEventListener('nepal:replay', replay);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          // Keep the approved opening's original 60svh movement while its
          // sticky frame is extended to hold the continuation.
          end: extended
            ? () => `+=${(root.querySelector<HTMLElement>('.parallax__header')?.clientHeight ?? window.innerHeight) * 0.6}`
            : 'bottom bottom',
          scrub: 0,
          invalidateOnRefresh: true,
        },
      });

      // The supplied scroll-scrubbed layer concept, tuned for a sticky hero.
      // Short travel retains the composition. Equal person/ground motion
      // keeps the boots attached to their standing surface at every frame.
      const layers = [
        { layer: '1', yPercent: -3.5 },
        { layer: '2', yPercent: 1 },
        { layer: '3', yPercent: 4 },
        { layer: '4', yPercent: 1 },
      ];
      layers.forEach(({ layer, yPercent }) => {
        timeline.to(root.querySelectorAll(`[data-parallax-layer="${layer}"]`),
          { yPercent, ease: 'none', duration: 1 }, 0);
      });

      return () => {
        gsap.ticker.remove(tick);
        window.removeEventListener('nepal:replay', replay);
        lenis.off('scroll', ScrollTrigger.update);
        lenis.destroy();
      };
    }, root);

    return () => {
      disposed = true;
      media.revert(); // Reverts this component's animations and triggers only.
    };
  }, [extended]);

  return (
    <div ref={parallaxRef} className={`parallax relative${extended ? ' parallax--journey' : ''}`} data-ready={ready}>
      <section className="parallax__header" aria-labelledby="nepal-title">
        <div className="parallax__visuals">
          <div className="parallax__layers" data-parallax-layers>
            <img src={assetUrl(ASSETS.background)} width={1536} height={1024}
              fetchPriority="high" loading="eager" decoding="async"
              data-parallax-layer="1"
              alt="Mount Everest and the Nepal Himalayas in the first light of dawn."
              className="parallax__layer-img parallax__mountain" />
            <div data-parallax-layer="3" className="parallax__layer-title">
              <h1 id="nepal-title" className="parallax__title">NEPAL</h1>
            </div>
            <div data-parallax-layer="2" className="parallax__person-anchor">
              <img src={assetUrl(ASSETS.person)} width={1536} height={1024}
                loading="eager" decoding="async" alt=""
                className="parallax__layer-img parallax__person" />
            </div>
            <img src={assetUrl(ASSETS.foreground)} width={1536} height={1024}
              loading="eager" decoding="async" data-parallax-layer="4" alt=""
              className="parallax__layer-img parallax__foreground" />
          </div>
          <div className="parallax__grade" aria-hidden="true" />
          <div className="parallax__fade" aria-hidden="true" />
        </div>
        {children}
      </section>
    </div>
  );
}
