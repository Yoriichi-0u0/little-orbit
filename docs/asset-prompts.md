# Artwork provenance and prompts

All game art was created with the built-in `image_gen` tool on 4 October 2026. No API key or external image service is needed to run the finished app. The illustrations are original fictional outpost art, not NASA imagery, terrain measurements, or engineering drawings.

The selected UI concept is `docs/design/mission-control-concept.png`. App text, controls, resource bars, installed counts, and engineering summaries are implemented in React; the concept itself is not used as website UI.

Final production files:

- `public/images/moon-outpost.webp` — 1536 × 1024 lunar environment.
- `public/images/mars-outpost.webp` — 1536 × 1024 Martian environment.
- `public/images/module-atlas.webp` — 1774 × 887 transparent hardware atlas, four columns and two rows.

The PNG outputs were converted with `cwebp` (quality 86 for environments and 88 for the hardware atlas). Transparency is preserved in the atlas. Conversion changes encoding, not illustration content.

## Lunar environment — final prompt

Use case: stylized-concept. The supplied image is a UI concept reference only. Generate a standalone complete production illustration of its large lunar outpost scene ONLY, without any of the UI, words, buttons, badges, frames or labels. Do not crop the screenshot; freshly render the scene. Landscape 1536x1024. Match the concept's exquisite realistic 3D miniature aesthetic, white rounded habitat modules with teal portholes, glass greenhouse green plants right foreground, two navy solar panel arrays left foreground, white utility tanks and rover and one small astronaut. Slightly elevated isometric wide angle view, cool light gray rugged lunar regolith, distant low lunar mountains under a narrow dark navy starry sky occupying the top 20%, Earth on the right horizon. Clean science-game artwork, bright matte terrain and buildings, subtle directional shadows. Generous space around all buildings; place important scene across central 80% of width and lower 70% height. The terrain and sky fill whole image without border or frame. Absolutely NO TEXT, NASA logos, white page background, black box or UI. Original fictional habitat, no claim of measured terrain.

## Martian environment — final prompt

Use case: stylized-concept. Supplied image is a UI concept style reference only. Create a standalone complete production Martian outpost environment illustration, no UI, no text, no logos, no buttons, no border, no watermarks. Landscape 1536x1024, exquisite realistic clean 3D miniature aesthetic like supplied concept scene. Same rounded white habitat cluster with muted teal portholes, glass greenhouse green plants right foreground, navy solar arrays left foreground, white oxygen and water tanks rear, small astronaut and six-wheel rover in front. Slightly elevated wide-angle isometric view of a dusty terracotta-red Martian plateau with subtle rust-colored rocks and gentle craters, distant rust mountains under a pale peach dusty sky top20%. Warm muted terrain and cool white buildings, soft directional shadows, bright legible premium science-game art, generous margins around buildings, structures across central80%width lower70%height. No Earth visible in sky; Mars horizon appropriate. Not a photographic real landing site.

## Hardware atlas — final prompt

Use case: stylized-concept. Supplied image is a style reference only. Generate a production game hardware atlas of EIGHT isolated matching detailed 3D miniatures, arranged in a precise regular four-column TWO-row grid. Transparent background; landscape1536x768. Each object centered in its equal384x384px tile with generous transparent margins, no object overlaps or touching tiles. Match the supplied concept's realistic soft 3D white rounded space equipment with teal details and navy blue solar cells. Row1 from left: a navy solar panel array with small white supports, white rounded life support cylindrical module with teal portholes and tanks, glass curved greenhouse with green plants, white sturdy compact storm shelter pod with closed hatch. Row2 from left: gray/white water recycling tanks with pipe connectors, white teal battery pack equipment cube, small white fission surface power generator tower, compact Mars atmospheric oxygen extractor machine with intake tubes. Equal scale isometric view35deg, little soft ground contact shadows, exquisitely detailed polished playful educational game art. No captions, letters, logos, borders, plate backgrounds, terrain, astronauts, extra objects or UI. ACTUAL TRANSPARENT alpha background.

## Design concept brief

The full-screen UI brief specified the Little Orbit brand; Manrope-style typography; a true-white, dark-ink, teal palette; a header with Mission control, Flight school, Mission log, and New mission; five resource gauges; an illustrated outpost with HTML hotspots; a daily flight-plan sidebar; a four-module catalog; and a science-learning entry point. Desktop composition was requested at 1536 × 1024. The selected concept and implementation inventory are preserved in [the design-system notes](design-system.md).
