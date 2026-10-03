# NEPAL — Countless Worlds

A continuous cinematic journey by Prem aka Kaizen: 20 chapters, 14 credited photographs and six text-only field notes. The original Everest opening leads into Nepal’s regional geography, Newar craftsmanship, public water heritage, Tharu traditions, Chitwan, Mustang’s rain shadow and Himalayan lake research, ending at Phewa Lake.

## Run and deploy

Use Node 22 or newer:

```sh
npm ci
npm run dev
VITE_BASE_PATH=/Nepal-Web/ npm run build
```

`npm run build` checks TypeScript and emits a static website in `dist/`. The GitHub Actions workflow publishes every `main` push to https://kaizen-flims.github.io/Nepal-Web/. Pages uses GitHub Actions as its source. Asset URLs, fonts and the favicon respect Vite’s base path.

## Story and credits

The permanent **make with ❤️‍🩹 by premm.** watermark opens credits from anywhere. **A Prem aka Kaizen Website** appears in large typography, followed by every photographer’s name, source page, Creative Commons licence and all 11 research sources. Research links also appear in the relevant chapters. The pictured royal bath at Patan is distinguished from the Yenga Hiti restoration in Kathmandu; the Gokyo photograph is distinguished from the Tsho Rolpa research case.

`src/data/journey.ts` owns chapter copy, source links, timing and transitions. `src/data/photographs.ts` reads the photo manifest in `public/images/nepal/journey/sources.json`. See [PHOTOGRAPHY.md](PHOTOGRAPHY.md) for image attribution.

## Motion and sound

`components/ui/nepal-journey.tsx` renders chapters, modal credits and sound controls. `lib/journey-motion.ts` builds one paused, reversible GSAP timeline. Related roof forms and gilded architectural details get clean match cuts; other chapters use measured fades, slides or desktop iris reveals. Reading chapters receive longer holds. `src/styles/journey.css` defines the editorial compositions, responsive reading pages and permanent watermark.

The desktop runway is 4200svh and phone runway 3800svh. The original Everest markup, images, global CSS and 60svh layer travel are preserved. One Lenis instance uses the GSAP ticker; touch scrolling remains native. Phones use transform/opacity transitions rather than animated full-screen masks. Reduced motion or viewports at most 740px high use native reading flow without Lenis or scrubbed animation.

One journey photograph is mounted initially. During the film, at most four neighbouring photographs are mounted; the next two photos preload across intervening reading pages and the previous photo remains available for reversal. Fixed-frame image completion causes no scroll refresh. Reduced-motion reading uses lazy-loaded images. All photographs/fonts are served locally.

`lib/nepal-sound.ts` provides original synthesized wind, water textures and restrained chimes. Audio starts only after clicking **Sound off**, fades between chapter moods, and closes when muted, backgrounded or unmounted. No field recordings, autoplay or audio dependencies. The credits support Escape, focus containment and focus restoration; inactive film chapters are inert.

## Validation

See [VALIDATION.md](VALIDATION.md) for checks and the limitation on actual browser/device performance verification. Original asset generation notes remain in [ASSET_PROMPTS.md](ASSET_PROMPTS.md).
