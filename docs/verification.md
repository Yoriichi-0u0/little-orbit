# Verification

Checked on 4 October 2026.

## Local behavior

- `npm run test`: 18 passing domain/storage tests. Coverage includes oxygen-water-power coupling, greenhouse maturation, battery storage without free generation, recycling limits, cargo/budget/module constraints, Mars-only hardware, incident resolution, a free incident fallback with empty reserves, solar shielding, scripted low-light duration, exact forecast/next-stock agreement, successful Moon/Mars missions, evacuation, bounded resources, and invalid saved-state rejection.
- `npm run check`: strict TypeScript passed.
- `npm run build`: production build passed. Fonts and illustrated assets are bundled locally; no external font or image API is needed at runtime.
- `npm run test:browser`: complete 14-turn Moon and Mars missions passed through visible controls; forecasts, construction, incidents, resupply, reload persistence, local completed-mission records, lesson feedback/mastery persistence, 14 primary-source links, and Markdown export passed.
- Native dialogs trap keyboard focus, close with Escape, and explicitly restore the opener. Browser QA caught and repaired focus restoration during React StrictMode cleanup.
- Mission control, Flight school, and Mission log were checked at 1440, 768, 390, and 320 pixels: 12 responsive checks, no page overflow or missing images. New-mission and forecast dialogs also fit those widths. A 3-pixel rail overflow at 320 pixels was repaired.
- No relevant app console errors in the in-app browser or the automated Chromium pass.

## Browser evidence

The Codex in-app browser was used first for page identity, screenshot review, resource forecasts, construction, advancing time, mission setup, and responsive DOM measurements. Its screenshots clipped the desktop surface after a viewport override despite correct page dimensions. A headless Playwright Chromium pass therefore supplied reliable full screenshots and reproducible end-to-end workflows. This fallback supplements the in-app checks.

## Visual comparison ledger

Concept: `docs/design/mission-control-concept.png` at 1536 × 1024. Render: a full desktop capture at the same viewport width, with a longer page for functional controls and footer.

| Comparison           | Evidence and decision                                                                                                                                                                                                                                                                                                                                         |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Copy and hierarchy   | The primary heading, supporting line, brand, navigation, resource labels, flight-plan heading, catalog heading, and advance action retain the concept's hierarchy. Hardware prices and effects use the real game configuration rather than illustrative concept values.                                                                                       |
| Layout and spacing   | Five resource panels and a roughly 70:30 outpost/flight-plan split are preserved. Crew assignment, cargo status, and the help link extend the flight plan because they are necessary controls.                                                                                                                                                                |
| Typography           | Locally bundled Manrope provides consistent headings, text, controls, and charts. Compact UI labels scale separately from major headings; narrow layouts reflow without clipping.                                                                                                                                                                             |
| Palette and surfaces | True white page/panels, dark ink text, solid teal primary controls, thin gray borders, and pale mint tips match the selected design system.                                                                                                                                                                                                                   |
| Illustration         | Matching generated Moon/Mars environment art and an eight-part hardware atlas are used. No static UI screenshot is shipped as the interface. Art has no broad color tint; a short edge fade supports legible scene labels.                                                                                                                                    |
| Branding             | A neutral science-book symbol replaces the concept's NASA logo. A code-native planet glyph identifies destination; it is not scientific imagery. The independent-project attribution appears in the footer and source notes.                                                                                                                                  |
| Interaction          | Forecasts and construction alter real mission state. Equipment counts and the installation marker reflect new hardware; the rendered scene depicts starter modules. Scientific view overlays derive their values from the same simulation as the forecast.                                                                                                    |
| Mobile               | Navigation stays reachable; all five resource stocks are visible in a compact phone grid, lessons use a contained horizontal rail, and hardware becomes two columns or one at the narrowest width. The advance action stays reachable at the bottom of the viewport to avoid repeated long scrolling. These are functional extensions of the desktop concept. |
| Screenshot cleanup   | Product captures use a fresh session so transient QA notifications do not cover the catalog.                                                                                                                                                                                                                                                                  |

## Validation limits

The simulation is deliberately normalized and not calibrated to mission-design data, actual radiation dose, or crop times. The science relationships are sourced; numeric balancing is authored. Tests verify the implemented learning model, not a real outpost's safety. No physical devices or classroom user study were included in this run. Browser persistence is local to a browser/device, and no global leaderboard or server-side student data is claimed.
