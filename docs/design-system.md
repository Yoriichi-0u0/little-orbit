# Visual specification

The complete generated mission-control concept is saved at `docs/design/mission-control-concept.png` (1536 × 1024). The user authorized creative implementation without a review gate; this is the selected design direction.

- True white page and panels; dark ink `#182a35`; teal `#157d79`; mist `#f0f5f4`; border `#d9e2e6`; muted text `#61717d`.
- Manrope locally bundled, headings 750–800 weight, 44px main heading at desktop, 26px mobile. Body 14–16px, compact controls 12–14px, captions 11–12px. No browser-default control typography.
- Header with orbit logo, brand, descriptive subtitle, three tab-like navigation buttons, and New mission action.
- Intro with exact heading “A small step. A big responsibility.” and supporting line “Build your outpost. Keep your crew safe. Make every resource count.” Destination/outpost identity sits on the right.
- Five compact resource panels followed by a 70:30 scene/flight-plan layout. The scene uses standalone generated art with no tint; interactive hotspots and view controls remain HTML. Catalog shows four primary modules, with other hardware in a consistent modal list.
- Use round 12px frames, thin borders, no broad decorative shadows; small outline icons with two-pixel strokes. Solid teal main buttons. Minimal motion and respect reduced-motion preferences.
- Four hardware illustrations sit in a compact horizontal catalog, rather than repeated landing-page sections.
- Below 1000px, flight plan moves below the outpost region; phone resource panels form a compact grid so all five stocks stay visible. The primary advance action stays at the bottom of the phone viewport for repeated turns. Catalog becomes two columns, then one below 370px so controls remain legible. Navigation remains reachable.

## Functional extensions to the concept

The concept is a primary-screen illustration, not the full simulation specification. Preserve its visual system while adding the following necessary functional details: actual module prices and cargo costs; editable mission setup; daily crew-plan selector; linked forecast; incident dialog; science library and questions; mission history and export; completed-mission debrief. These details are documented deviations from illustrative copy/numbers in the concept. The concept's NASA logo is replaced with a neutral book icon to avoid suggesting official NASA branding or endorsement.

The environment is a generated illustration with semantic equipment hotspots, not a tile-placement game. Construction changes installed counts and forecasts; the base image itself depicts starter hardware. New equipment is visible in the installation list/scene marker, with atlas art in details. Power and life-support views add state-derived engineering summaries over the scene. SVG is used only for UI icons and the quantitative history chart, not as a substitute for game illustration.
