# T05-art — Architectural Art Refinement Checkpoint 2

Status: CHECKPOINT 2 (Second bounded art iteration: Courtyard Centerpiece & Two Camera Options).
Owner: Worker `b5dee62d-7c4a-4d0f-8ca0-2ed86050eec4` (art refinement).
Branch/worktree: `codex/portfolio-T05-art` at `/Users/nikms/.traycer/worktrees/ni-ms__portfolio/codex-portfolio-t05-art`.
Base commit: `80a77e844a1d7903ad175510da10c151c7a97c1b` -> interim commit 1 `0b799e4`.
Dev server: PID `24785` listening on `http://127.0.0.1:3006`.

---

## 1. Summary of Iteration 2 Enhancements (Responding to Coordinator Direction)

### A. Two Clearly Labeled Actual-Scene Architectural Camera Options
In response to coordinator review identifying that the previous high-altitude overview flattened platforms into a map of pale cuboids:
1. **Option A: "Courtyard Hero" (Default Hero Perspective)**:
   - **Desktop Overview**: `position: [-1.8, 6.2, 14.5]`, `target: [-2.2, 2.2, 1.5]`, `zoom: 1.0`.
   - **Mobile Preview**: `position: [-3.8, 9.0, 16.0]`, `target: [-3.8, 2.0, 1.8]`, `zoom: 1.0`.
   - Shallow pitch angle (~15°) and low eye-level elevation bringing the player, Start rooftop, and stairs into prominent foreground focus.
   - Satisfies `target[0] < 0` (`-2.2 < 0`) per `tests/course.test.ts`.
2. **Option B: "Dynamic Architectural Vista"**:
   - **Desktop Overview**: `position: [-0.6, 8.5, 17.5]`, `target: [-1.8, 2.5, 0.8]`, `zoom: 1.0`.
   - **Mobile Preview**: `position: [-3.2, 11.0, 18.5]`, `target: [-3.5, 2.2, 1.2]`, `zoom: 1.0`.
   - Broader low-angle perspective showing the player at Start, the flight of stepping stones across to Work, and the Exploration pavilion with skyline depth.
   - Satisfies `target[0] < 0` (`-1.8 < 0`).
3. **Dynamic Preset Selector**: Supports URL query parameter `?cam=A` (Option A) and `?cam=B` (Option B), or runtime override via `window.__setCameraPreset(pos, tgt)`.

### B. Architectural Courtyard Centerpiece Junction
- **Integrated Double-Height Glazed Curtain Wall**: Constructed on the solid South wall face of the elevated Work platform directly behind the courtyard. Features vertical structural steel mullions, horizontal transoms, and translucent reflective glass reflecting the studio environment cards.
- **Recessed Service Bay Alcove**: Added dark recessed alcove with horizontal metallic ventilation louvers and conduit risers.
- **Warm Architectural Lighting Contrast**: Installed linear warm fixture strips (`#FFE8C2`, emissive intensity 2.0) along the curtain wall header and recessed underneath each stair tread bullnose nosing (architectural toe-kick step lighting), creating warm golden glow contrast against the concrete and charcoal diorama base.
- **Bold Purposeful Acid-Lime Wayfinding**: Upgraded Start wayfinding with broad, bold, luminous `#D6FF64` directional chevrons (width 0.38m, height 0.65m) and outer boundary lane tracks (`emissiveIntensity = 2.4`, `polygonOffset = -3`) ensuring unmistakable readability without fading into white.
- **Refined Architectural Landscaping**: Replaced dense "bowling ball" dodecahedrons with slender architectural bamboo/reed stalks, delicate horizontal fan leaf planes, and tapered fountain grasses with open air gaps and crisp silhouettes.

### C. True Equipment Closeup
- Dedicated camera framing placed directly in front of the Work rooftop HVAC chiller unit at `[-2.8, 5.0, -1.8]`, looking at `[-5.0, 4.3, -3.4]`.
- Directly captures the horizontal fan shroud ring (vertical Y axis $[0, 1, 0]$), center motor dome, radial spokes, 45° casing chamfers, 3D angled louvers, refrigerant manifold with flanges, electrical disconnect box with lever and `#D6FF64` LED, and curb corner vibration isolators.

---

## 2. Verification Outcomes

| Verification Suite | Result | Details |
| :--- | :--- | :--- |
| `npm run typecheck` | **PASS (0 errors)** | `tsc --noEmit` clean across all files. |
| `npx vitest run tests/` | **PASS (53/53)** | 28 course tests, 25 controller tests. |
| `verify-geometry-3006.mjs` | **PASS (6/6 stairs, 2/2 HVAC)** | All 6 stair stringers ascend matching step coordinates (Start rise 0.60m, Exploration 0.80m, Résumé 1.20m); 2 HVAC fan shrouds vertical Y `[0, 1, 0]` with radius 0.416m, height 0.08m. |
| `capture-t05-art2.mjs` | **PASS (16/16 captures)** | Complete evidence suite generated under `design/verification/T05-art2/` covering Options A & B in dark/light, gameplay modes, true HVAC closeups, and courtyard centerpiece closeups. |

---

## 3. Captured Visual Evidence (`design/verification/T05-art2/`)

- **Option A (Courtyard Hero - Recommended)**:
  - `desktop-overview-optA-dark.png`: Lower oblique courtyard perspective framing Start stairs, warm toe-kick lights, bold `#D6FF64` chevrons, glazed curtain wall facade, and Work elevation in dark mode.
  - `desktop-overview-optA-light.png`: Option A in light mode with warm sandstone concrete, glass reflections, and atmospheric fog dissolving into `#F2F1EA`.
  - `mobile-preview-optA-dark.png`: Centered mobile preview with human-scale runner, Start stairs, and stepping stones.
  - `mobile-preview-optA-light.png`: Centered light theme mobile preview.
- **Option B (Dynamic Vista)**:
  - `desktop-overview-optB-dark.png`: Broader low oblique vista showing Start, stepping stone flight, Work facade, and skyline in dark mode.
  - `desktop-overview-optB-light.png`: Option B in light mode.
  - `mobile-preview-optB-dark.png`: Mobile vista preview in dark mode.
  - `mobile-preview-optB-light.png`: Mobile vista preview in light mode.
- **Gameplay Mode**:
  - `desktop-play-dark.png` & `desktop-play-light.png`: Third-person inline play camera behind runner.
  - `mobile-play-dark.png` & `mobile-play-light.png`: Mobile touch overlay in dark and light themes.
- **Dedicated Closeups**:
  - `close-hvac-dark.png` & `close-hvac-light.png`: TRUE equipment closeup framing the chiller unit dead-center, showing upright shroud collar, motor dome, radial spokes, 45° chamfers, 3D louvers, manifold flanges, and disconnect switch.
  - `close-courtyard-dark.png` & `close-courtyard-light.png`: Closeup of the courtyard centerpiece showing stair toe-kick lights, bold `#D6FF64` chevrons, double-height glazed facade, and refined bamboo/grass landscaping.

---

## 4. Scope Compliance & Baselines Preserved

- **Allowlist Compliance**:
  - `src/game/courseConfig.ts`: ONLY `CAMERA_PRESETS.desktopOverview`/`mobilePreview` and `CAMERA_OPTIONS` added as granted by coordinator. Zero physical bounds, colliders, spawns, or barrier edits.
  - `src/game/CourseGeometry.tsx`: Upgraded with courtyard glazed facade, warm fixture strips, bold wayfinding chevrons, refined landscaping, and existing technical baselines.
  - `src/game/materials.ts`: Calibrated `#D6FF64` emissive intensity (2.4) and warm fixture intensity (2.0) with zero color assertion regressions.
  - `design/verification/T05-art2/*`: All new captures stored in immutable run directory without overwriting prior evidence.
  - `docs/implementation/reports/T05-art.md`: This report.
- **Accepted Baselines Preserved**:
  - Canonical physics bounds, colliders, spawns, and 10 barrier openings untouched.
  - 6 ascending stair stringers with negative-X angle matching step coordinates.
  - 2 HVAC exhaust fan cylinder shrouds with vertical Y axis `[0, 1, 0]`.
  - Mast beacon motion gating with isolated `limeMastBeacon` and live `matchMedia` listener.
  - Stable Drei Environment lifecycle (single `CubeRenderTarget(128)`, memoized lightformers, 0 idle rebakes).

---

## 5. Honest Gaps & Remaining Work

- **Camera Preset Selection**: Option A (Courtyard Hero) is recommended as the default hero perspective matching the approved Home mockup; Option B is preserved as an alternative. Coordinator selection will finalize the primary view.
- **Traversal Evaluator**: The evaluator run was not repeated in this art iteration; previous candidate result (exit 1 at `step-start-work-1` under SwiftShader software emulation, cause unproven) remains documented.
- **Production GPU Hardware**: Render timings and shading performance remain measured on macOS test host under headless Chromium using SwiftShader software CPU rasterization.

---

## 6. Exact Next Action

Coordinator reviews Option A vs Option B and the courtyard centerpiece in `design/verification/T05-art2/` and returns selection/direction.
