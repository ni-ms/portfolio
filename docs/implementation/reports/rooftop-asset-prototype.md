# Rooftop prototype and branch review

Prototype branch `codex/rooftop-asset-prototype` is based on `b89ebc3` from `traycer/portfolio-noble-walrus`. The older open checkout was at `39fb881`. The integrated branch contains routed pages, dark/light themes, résumé downloads and the newer game. All T02–T07 worker branches, including both T05 art branches, have patch equivalents in the integrated branch. GitHub advertised only `master` at `21e537c`. The older `worker-gameplay-physics` checkout has an uncommitted alternate design and copy. Its working tree was left intact.

The prototype uses free concrete, HVAC and dusk reflection assets for the existing route from the lower terrace, up the starter stairs, to the first landing. Replaced procedural HVAC geometry with shared model data, removed the unused overlay component, and simplified the live mobile status to one checkpoint count. The first landing’s near edge was shortened by 0.45 m so its underside interferes less with the jump. Its visual placement and collider use the same course dimensions. Plain-language content edits cover the introduction, Projects overview, project descriptions and About. The [asset manifest](../../../design/scene/rooftop-assets.md) identifies the files and sources.

## Evidence

- Type checking, 88 unit tests and the production build passed. The build continues to warn about the lazy game bundle, approximately 1.14 MB compressed.
- Five existing 390 × 844 Chromium checks passed, covering simultaneous movement and jump, pointer release and cancellation, overlay focus and exit, both themes and factual pages, project links and the résumé download. The fixture check also placed the player at the lower terrace, climbed under touch input, jumped with two contacts and landed on the first elevated platform with one canvas active. Body height progressed from about 0.59 m at the lower terrace to 1.36 m on takeoff and 2.16 m on landing.
- Chrome with Apple M4 Metal at 390 × 844, device scale factor 3 and game canvas 585 × 1266, reported around 30 animation callbacks per second over 4.5 s in expanded play with the player idle. The 95th percentile callback interval was 33.4 ms. The touch controls appeared about 168 ms after the Play click with assets already warm. This is laptop browser emulation, not a measured phone frame rate. An earlier comparison with software-rendered Chromium at forced review quality rendered about 4.2 fps before and after the initial asset pass.
- See [screenshots](../../../design/verification/rooftop-prototype/) for the home preview, starter stair and first landing.

## Next action

Open the prototype worktree and run `npm run dev`. Review the stair and landing in motion on a physical phone and run a cold-load and frame-time capture while playing. If the scene is worth keeping, use this checkout as the candidate for integration and keep the game to one short course until the look and phone performance meet the owner's expectations. The capsule runner and the rest of the world still use the integrated branch's stylized geometry. No implementation ticket was advanced by the prototype.
