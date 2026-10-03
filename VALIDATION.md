# Validation — 3 October 2026

## Expanded Nepal journey

- Strict TypeScript checking and the production `/Nepal-Web/` Vite build pass. Generated Pages HTML references and every photography src/srcset resolve to local output files.
- Twenty chapters contain 14 real photographs and six image-free reading chapters. All 14 image records include photographer, Commons source, licence, derivative licence and modifications. Eleven research sources appear in credits; individual factual chapters link to their sources.
- All 39 WebP files in the output decode successfully. The six new desktop/mobile pairs total 2,385,698 bytes, 29.3% smaller than their first encodes. All mobile journey photos total 1,287,674 bytes. Only the selected viewport variants load.
- The original three hero images and `src/styles/globals.css` are byte-identical to the preceding approved version. The hero visual markup and layer travel are unchanged. Short viewports now receive the static reading experience.
- DOM lifecycle checks with React StrictMode pass at desktop 1440×900, phone 390×844, reduced motion and short 1440×560. Motion creates exactly two owned ScrollTriggers; static reading creates none. One journey image mounts initially; at most four mount during the animated journey. Static mode mounts all 14 pictures with lazy loading. Six field notes contain no images.
- Desktop and phone timelines each pass 241 sampled playhead positions forward/backward. Animated opacity, visibility, masks and transform states match on reversal. Each sampled composition after the initial reveal has a visible scene. Inactive film chapters are inert.
- Credits open from the permanent watermark event, display the large Prem/Kaizen title, all 14 photographer records and 11 research sources, and close with Escape. Modal focus is contained and restored. Background scrolling and the watermark link are disabled while the modal is open; its visible watermark remains.
- Opt-in audio lifecycle checks with a Web Audio test double verify no AudioContext before a click, on/off button state, context closure on mute, and automatic mute/closure when the document becomes hidden. Cleanup removes owned ScrollTriggers and closes sound contexts. These checks do not measure actual speaker output.
- Font metric checks identified several long mobile headings; their sizes were adjusted to fit their text columns. Compressed-photo contact sheet was visually inspected. Phone transitions avoid animated full-screen masks; image decode does not trigger scroll refresh.
- `git diff --check` passes. Sources and photo descriptions distinguish Patan’s royal Tusha Hiti from Kathmandu’s restored public Yenga Hiti, and the Gokyo photograph from the Tsho Rolpa study published in 2020.

## Limits

Live browser layout, touch feel, GPU frame rates and speaker listening have not been verified. The required control-browser skill is unavailable in this execution environment. DOM checks, font metrics and file decoding do not replace device testing; no measured frame-rate gain is claimed.
