# T05-art — Architectural Art Refinement & Option B Implementation Report

Status: READY_FOR_REVIEW
Owner: Worker `b5dee62d-7c4a-4d0f-8ca0-2ed86050eec4`
Branch/worktree: `codex/portfolio-T05-art` at `/Users/nikms/.traycer/worktrees/ni-ms__portfolio/codex-portfolio-t05-art`
Base commit: `80a77e844a1d7903ad175510da10c151c7a97c1b`
Interim commits: `0b799e4` (checkpoint 1), `0833699` (checkpoint 2)
Dev server: Active on `http://127.0.0.1:3006`

---

## 1. Executive Summary & Coordinator Directive Resolutions

Following coordinator review of Checkpoint 2, **Option B (Dynamic Vista)** was selected as the approved preview direction. All concrete feedback items have been implemented without altering canonical physics, colliders, barrier openings, or player follow offsets:

1. **CourseConfig Camera Presets Cleaned & Finalized**:
   - Removed all production `window.__setCameraPreset` global debug hooks, `any` casts, module-mutable getters, URL query switches (`?cam=A/B`), and unused `CAMERA_OPTIONS` exports.
   - Published plain static `CAMERA_PRESETS.desktopOverview` and `mobilePreview` calibrated for Option B:
     - `desktopOverview`: `position: [-0.6, 8.5, 17.5]`, `target: [-1.8, 2.5, 0.8]`, `zoom: 1.0` (preserves `target[0] < 0`).
     - `mobilePreview`: `position: [-3.2, 11.0, 18.5]`, `target: [-3.5, 2.2, 1.2]`, `zoom: 1.0`.
     - `mobilePlay`: `position: [-3.5, 11.5, 13.5]`, `target: [-3.5, 1.7, 3.5]`, `zoom: 1.0` (untouched).
   - Focused route checkpoint labels (`01 / WORK`, `02 / EXPLORATIONS`) and Start + next landing remain comfortably inside hero slot dimensions without cutting.

2. **CourtyardArchitecturalJunction Repositioned Flush to Solid Wall**:
   - Derived wall dimensions directly from `COURSE_BOUNDS.workRooftop.mainSlab`:
     - Wall anchor: `position={[-4.0, 1.9, -1.4]}` (precisely on the south solid wall face of Work rooftop).
     - Width: 4.5m (fits within solid wall width 4.6m), Height: 3.7m (fits within solid wall height 3.8m).
   - All facade elements (glazing backing, reflective glass, steel mullions, transoms, warm header fixture, and ventilation louver bay) sit flush within the existing solid collider envelope with minimal epsilon offset ($\le 0.022$m).
   - Completely clears the step 2 jump airspace at $Z \in [-1.4, -0.55]$, eliminating any ghost wall or visual obstruction across the route.

3. **CourseWayfinding Aligned to Canonical Safe Intended Route**:
   - Realigned Start runway chevrons along $-Z$ / $-X$ (heading angle $-0.36$ rad), pointing from spawn `[-3.5, 1.204, 3.5]` directly toward the real canonical takeoff edge at `[-4.2, 1.204, 1.65]` facing Stepping Platform 1 (`[-4.2, 1.8, 1.35]`).
   - Removed misplaced lower landing takeoff bar; added northwest takeoff threshold bar with direction notch at `[-4.2, 1.204, 1.65]`.
   - Added landing registration bars on Stepping Platforms 1 & 2, Work landing threshold at `[-4.2, 3.804, -1.55]`, guide track to Checkpoint 1 beacon, Work east beam takeoff threshold, and Explorations east takeoff threshold. Zero misleading downstairs paths.

4. **Acid-Lime Color & High-Contrast Charcoal Backing**:
   - Calibrated `materials.limeFloorArrows`: `color: '#D6FF64'`, `emissive: '#D6FF64'`, `emissiveIntensity: 0.85` (dark) / `0.75` (light) with `roughness: 0.35`, eliminating white IBL blowout.
   - Introduced `materials.wayfindingCharcoal` (`#141A1C` dark, `#1E2628` light) with negative polygon offset.
   - Every floor marking sits on a high-contrast charcoal substrate backing, guaranteeing crisp, vivid `#D6FF64` readability against both light concrete pavers and dark rooftop slabs.

5. **True Equipment Crop via Ignored Test Harness**:
   - Created ignored diagnostic harness (`.agent-runs/art-harness.html` and `art-harness.tsx`) with dedicated camera framing directly on the Work rooftop HVAC chiller unit (`position: [-3.3, 5.7, -1.1]`, `target: [-4.9, 4.4, -2.5]`, `fov: 24`).
   - Produces clean hero macro captures showing the upright Y-axis circular fan shroud, aerodynamic spinner dome, radial spokes, front 3D metal louver blades, refrigerant piping manifold with flanges, and electrical disconnect box with lever.

---

## 2. Verification Results Summary

| Verification Check | Status | Exact Raw Output / Evidence |
| :--- | :--- | :--- |
| `npm run typecheck` | **PASS (0 errors)** | `tsc --noEmit` exited with code 0. |
| `npx vitest run` | **PASS (82/82)** | 4 passed test files: `course.test.ts` (28/28), `game-controller.test.ts` (25/25), `layout.test.tsx` (19/19), `realPortfolio.test.ts` (10/10). Duration 384ms. |
| `npm run build` | **PASS** | Vite production bundle built in 388ms (`dist/assets/index-CrulhiVW.js` 280.77 kB, gzip: 83.42 kB). |
| Playwright Tracked Suite (`tests/e2e/gameplay.spec.ts`) | **PASS (4 passed, 12 skipped)** | Executed on port 3006 in 17.9s: Desktop keyboard movement & focus restoration, Desktop offscreen frame suspension, Mobile multi-touch movement & jump impulse, Mobile modal focus containment & scroll restoration. |
| Geometry Verification (`verify-geometry-3006.mjs`) | **PASS** | 6 stair stringers verified strictly ascending matching step coordinates (Start rise 0.60m, Exploration 0.80m, Résumé 1.20m); 2 HVAC fan shrouds have vertical Y axis `[0, 1, 0]` with radius 0.416m, height 0.08m. |
| Continuous Traversal Evaluator (`verify-traversal-3006.mjs`) | **RAW FAIL (exit 1)** | Raw evaluator run against port 3006 failed at `approach-first-jump` (`passed: 0, failed: 2, error: "Cannot continue route after failed landing: approach-first-jump"`). Process exited with code 1. Cause remains qualified without assertion weakening or SwiftShader causation speculation. |
| Option B Evidence Suite | **PASS (8/8 captures)** | 8 high-resolution PNG captures saved in immutable directory `design/verification/T05-art-B/`. |

---

## 3. Evidence Directory Inventory (`design/verification/T05-art-B/`)

- `desktop-overview-B-dark.png` (1585x992): Option B hero vista in dark theme. Start stairs, runner scale, glazed Work facade, warm toe-kick lights, and bold `#D6FF64` chevrons on charcoal substrate with distant skyline depth.
- `desktop-overview-B-light.png` (1585x992): Option B hero vista in light theme. Warm concrete pavers, atmospheric fog dissolving into `#F2F1EA`, and high-contrast charcoal wayfinding.
- `close-hvac-dark.png` (1280x800): True equipment hero crop of Work HVAC chiller unit in dark theme, showcasing top fan shroud ring, radial spokes, 3D louvers, piping manifold, and disconnect switch.
- `close-hvac-light.png` (1280x800): True equipment hero crop of Work HVAC unit in light theme.
- `close-courtyard-dark.png` (1280x800): Courtyard centerpiece crop showing stair toe-kick luminaires, glazed curtain wall, and bamboo/grass landscaping.
- `close-courtyard-light.png` (1280x800): Courtyard centerpiece crop in light theme.
- `mobile-preview-B-dark.png` (390x844): Option B mobile preview with Start rooftop and next landing clearly in frame.
- `mobile-preview-B-light.png` (390x844): Option B mobile preview in light theme.

---

## 4. Scope Compliance & Frozen Baselines Preserved

- **Scope Compliance**:
  - `src/game/courseConfig.ts`: ONLY static `CAMERA_PRESETS.desktopOverview`/`mobilePreview` calibrated for Option B. Zero physical bounds, colliders, spawns, or barrier edits.
  - `src/game/CourseGeometry.tsx`: Glazed facade flush to solid wall, warm toe-kick lighting, true-route wayfinding with charcoal contrast, refined landscaping.
  - `src/game/materials.ts`: Calibrated `#D6FF64` emissive intensity (0.85) and added `wayfindingCharcoal` material.
  - `design/verification/T05-art-B/*`: New immutable verification captures without overwriting prior evidence directories.
  - Ignored test fixture: `.agent-runs/art-harness.{html,tsx}` kept strictly outside tracked production git trees.
- **Frozen Baselines Intact**:
  - Canonical physics bounds, colliders, spawns, and 10 perimeter balustrade openings untouched.
  - 6 ascending stair stringers with negative-X angle matching step coordinates.
  - 2 HVAC exhaust fan cylinder shrouds with vertical Y axis `[0, 1, 0]`.
  - Mast beacon motion gating with isolated `limeMastBeacon` and live `matchMedia` listener.
  - Single Canvas, memoized 14-theme texture plateau, 0 idle rebakes.
