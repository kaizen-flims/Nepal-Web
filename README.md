# NEPAL — Countless Worlds

A continuous, scroll-controlled photographic journey. The approved Everest opening flows into Nepal's hills, Bhaktapur, Boudhanath, daily life, momo, Tihar, the Kali Gandaki Valley, and a quiet Phewa Lake finale.

## Run

```sh
npm ci
npm run dev
```

Use Node 22 or newer. `npm run build` runs strict TypeScript checking and produces a static website in `dist/`. The application already supports React, TypeScript, Tailwind CSS and the shadcn project structure.

## GitHub Pages

The complete source is in `kaizen-flims/Nepal-Web`. The Pages workflow builds on every push to `main` and supports manual runs. Set repository Settings → Pages → Source to **GitHub Actions**.

For a local Pages build, run `VITE_BASE_PATH=/Nepal-Web/ npm run build`. Public images, srcsets, fonts and the favicon use Vite's deployment base, so the source also supports a root host without that environment variable.

The permanent watermark reads **make with ❤️‍🩹 by premm.** and opens the credits from any scene. The credits feature **A Prem aka Kaizen Website** in large typography and explicitly credit all eight photographers, their source pages and licences.

## Project paths

| Purpose | Path |
| --- | --- |
| Approved opening | `/components/ui/parallax-scrolling.tsx` |
| Journey composition | `/components/ui/nepal-journey.tsx` |
| Scrubbed film timeline | `/lib/journey-motion.ts` |
| Original hero/global styles | `/src/styles/globals.css` |
| Continuation/responsive styles | `/src/styles/journey.css` |
| App entry | `/src/main.tsx` |
| Photo metadata and licences | `/src/data/photographs.ts` |
| Original generated layers | `/public/images/nepal/` |
| Responsive real photography | `/public/images/nepal/journey/` |
| shadcn configuration | `/components.json` |

The `@/*` alias maps to the project root. `/components/ui` matches shadcn's UI alias, keeping component imports and future CLI additions consistent. It is a project convention rather than a React requirement.

## Motion architecture

The existing GSAP ScrollTrigger and `@studio-freight/lenis` stack is retained. One Lenis instance is driven by the GSAP ticker; touch scrolling remains native. The original hero markup, CSS, images and layer travel are unchanged. Its original 60svh motion range is retained, while the sticky camera frame receives a longer scroll runway for the continuation.

One paused GSAP timeline controls the continuation. Scroll scrubs every reveal, pan, zoom, masked title and outgoing composition; reversing scroll reverses the same playhead. Desktop uses a 2100svh runway and mobile 1650svh, with separate photo crops, title placement and transition distances. Cleanup reverts only the owning GSAP context and removes the Lenis ticker and replay listener; React StrictMode remains enabled.

Only the first transition photograph is mounted initially. Each scene mounts its next photograph ahead of the handoff; visited photographs remain available for reverse scrolling. Images have explicit dimensions and fixed composition frames. Fonts and the hero's initial decoded images refresh scroll measurements; later fixed-frame photographs avoid unnecessary layout recalculations. All fonts and images are served locally. Mobile photographs total 803,306 bytes, 38% smaller than before, with smaller decoded dimensions. Phone transitions use fades and transforms instead of full-screen animated masks; desktop transitions retain their original masks.

Reduced-motion visitors receive the original static opening followed by all eight readable photographic scenes without scrubbed movement or smooth scrolling. The final shot includes replay and photography credits; the credits support Escape, keyboard focus containment and focus restoration.

## Photography

Stage 2 uses eight real photographs with verified Creative Commons reuse terms and no visible watermarks. All responsive WebP derivatives retain the source image licence. Credits, source links and licence links are available in the final scene, [PHOTOGRAPHY.md](PHOTOGRAPHY.md), and `public/images/nepal/journey/sources.json`. Mobile images are deliberately cropped; desktop widths are capped at the original resolution. No Higgsfield capability was used.

Stage 1's generated Everest layers and original notes are retained in [ASSET_PROMPTS.md](ASSET_PROMPTS.md).

## Validation

See [VALIDATION.md](VALIDATION.md) for the completed checks and the live-browser testing limitation.
