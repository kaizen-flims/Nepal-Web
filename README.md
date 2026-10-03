# NEPAL — Countless Worlds

A continuous, scroll-controlled photographic journey. The approved Everest opening flows into Nepal's hills, Bhaktapur, Boudhanath, daily life, momo, Tihar, the Kali Gandaki Valley, and a quiet Phewa Lake finale.

## Run

```sh
npm ci
npm run dev
```

Use Node 22 or newer. `npm run build` runs strict TypeScript checking and produces a static website in `dist/`. The application already supports React, TypeScript, Tailwind CSS and the shadcn project structure.

## GitHub Pages

The repository is `kaizen-flims/Nepal-Web`. `.github/workflows/pages.yml` builds and deploys every push to `main`, and also supports a manual workflow run. GitHub Pages should use **GitHub Actions** as its publishing source in repository Settings → Pages. The workflow checks the production paths before uploading the build.

For a local Pages build:

```sh
npm run build -- --base /Nepal-Web/
node scripts/verify-build.mjs /Nepal-Web/
```

All public-image URLs and srcsets use Vite's deployment base, so the same source supports a root host or the `/Nepal-Web/` repository path. Compiled output and dependencies are excluded from source control.

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

One paused GSAP timeline controls the continuation. Scroll scrubs every reveal, pan, zoom, masked title and outgoing composition; reversing scroll reverses the same playhead. Desktop uses a 2100svh runway and mobile 1650svh, with separate photo crops, title placement and transition distances. Phones use transform/opacity handoffs instead of full-screen animated image masks. Only the two compositions involved in a handoff render; completed and future scenes use `display: none`, restoring correctly on reverse scroll. Cleanup reverts only the owning GSAP context and removes the Lenis ticker and replay listener; React StrictMode remains enabled.

Only the first transition photograph is mounted initially. Each scene mounts its next photograph ahead of the handoff; visited photographs remain available for reverse scrolling. Images have explicit dimensions and fixed composition frames. Fonts and the opening's initial decoded images refresh measurements once; later fixed-frame photographs do not force an unnecessary scroll refresh. All fonts and images are served locally. The mobile photographs total 840,828 bytes, 35% less than their previous versions, with 27% fewer decoded pixels for the portrait and square variants.

Reduced-motion visitors receive the original static opening followed by all eight readable photographic scenes without scrubbed movement or smooth scrolling. The final shot includes replay and photography credits; the credits support Escape, keyboard focus containment and focus restoration.

The permanent on-screen watermark reads **make with ❤️‍🩹 by premm**. The credits feature **A Prem aka Kaizen Website** in large typography and explicitly distinguish Prem's website work from the photographers' work.

## Photography

Stage 2 uses eight real photographs with verified Creative Commons reuse terms and no visible watermarks. All responsive WebP derivatives retain the source image licence. Credits, source links and licence links are available in the final scene, [PHOTOGRAPHY.md](PHOTOGRAPHY.md), and `public/images/nepal/journey/sources.json`. Mobile images are deliberately cropped; desktop widths are capped at the original resolution. No Higgsfield capability was used.

Stage 1's generated Everest layers and original notes are retained in [ASSET_PROMPTS.md](ASSET_PROMPTS.md).

## Validation

See [VALIDATION.md](VALIDATION.md) for the completed checks and the live-browser testing limitation.
