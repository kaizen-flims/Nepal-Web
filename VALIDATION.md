# Stage 2 validation — 3 October 2026

## GitHub Pages adjustments — 3 October 2026

- Added the permanent watermark, an always-accessible credits link, the large Prem/Kaizen credit, and explicit photographer attribution.
- Strict TypeScript checking and the `/Nepal-Web/` production build pass. Generated HTML references resolve to output files, and all public files are copied into the build.
- All 27 WebP images decode successfully. Mobile photography falls from 1,295,688 to 803,306 bytes (38% smaller). Original hero images and global/hero CSS remain byte-identical.
- Phone transitions use transform/opacity handoffs. Removed scroll refreshes caused by fixed-frame journey image completion. Desktop transition masks and the opening's composition/layer travel are preserved.
- Actual device/GPU frame-rate measurements and browser layout screenshots remain unverified; browser installation is unavailable in this execution environment.
- DOM lifecycle checks pass for desktop, phone and reduced motion: StrictMode trigger counts, staged image mounting, Pages image URLs, credits from any scene, Escape, reversible timeline state, and removal of owned triggers after unmount.

## Original Stage 2 validation

- Strict TypeScript checking and the Vite production build pass.
- Compared against the approved Stage 1 source: the three hero image files, global/hero CSS, hero visual markup, layer travel, generation notes, package manifest/lockfile, shadcn configuration and Vite configuration are unchanged. The opening component has only the child slot, extended scroll endpoint and scoped replay listener needed for the continuation.
- A DOM-based GSAP check sampled 191 playhead positions forward and backward for both desktop and mobile. Animated visibility, opacity, masks and transform values match in both directions. The opening restores at playhead zero, every handoff has a visible composition, and the finale controls are available at the end.
- React StrictMode lifecycle checks passed at 1440 × 900 and 390 × 844: exactly two owned ScrollTriggers; staged image mounting; credits opening/closing and focus restoration; native/Lenis replay to zero; reduced-motion removal of scrub triggers and access to all eight photographs; no owned triggers or Lenis ticker remaining after unmount.
- All 24 responsive WebP files were decoded successfully. Combined size is 6,061,084 bytes; a viewport downloads its selected variants rather than all sizes. Eight original photographs were inspected for visible watermarks. One watermarked candidate was excluded entirely.
- Each photograph includes its author, source page, licence link, derivative licence and modification description. Credit links appear in the final scene. No Higgsfield capability was used.
- `git diff --check` passes. The supervised development preview runs successfully.

Live browser UI testing was unavailable because the environment does not provide the required control-browser skill. DOM checks do not verify actual browser layout, touch feel, GPU rendering, or the visual quality of every scroll frame. Those visual checks remain unverified; no browser screenshots or browser-performance measurements are claimed.
