# T05-art — Architectural Art Refinement & Repair Implementation Report

Status: READY_FOR_REVIEW (Repairs Applied — Candidate T05-art-repair)  
Owner: Worker `b5dee62d-7c4a-4d0f-8ca0-2ed86050eec4`  
Branch/worktree: `codex/portfolio-T05-art` at `/Users/nikms/.traycer/worktrees/ni-ms__portfolio/codex-portfolio-t05-art`  
Base commit: `80a77e844a1d7903ad175510da10c151c7a97c1b`  
Interim commits: `0b799e4` (checkpoint 1), `0833699` (checkpoint 2), `0cc2acc` (candidate runtime), `7bc2b57` (first candidate evidence)  
Current repair candidate: Ready for review commit  
Dev server: Active on `http://127.0.0.1:3006`  

---

## 1. Executive Summary & Reviewer Defect Resolutions

Following independent technical and visual review (`.agent-runs/artreview-0cc2acc/review.md`), all prioritized findings have been addressed:

1. **Fix 1 (P2) — Start Takeoff Marking Placed on Reachable, Visible Ground**:
   - In `src/game/CourseGeometry.tsx`, previously the threshold at `[-4.2, 1.204, 1.65]` and chevron at $Z=2.0$ were buried beneath Step 1 footprint ($X \in [-4.9, -3.5], Z \in [0.6, 2.10]$, underside $Y=1.65$, runner side contact $Z \approx 2.30$).
   - Derived clearance from canonical step bounds ($Z \le 2.10$) and runner contact point ($Z \approx 2.30$):
     - Moved Start takeoff threshold bar to `[-4.2, 1.204, 2.65]`.
     - Placed Start runway chevrons at $Z \in [3.30, 3.05, 2.80]$ along the approach path from spawn `[-3.5, 3.5]`.
   - Verified that live upward ray from `[-4.2, 1.204, 2.65]` has 0 overhead obstruction meshes, opening straight into sky ahead of the launch point.

2. **Fix 2 (P2) — Realigned Chevron Yaw to Real Approach Route Heading**:
   - Replaced negative yaw (`-0.36` rad, which pointed toward $+0.352X, -0.936Z$, i.e. to the right) with positive yaw `+0.36` rad.
   - Transforming the local chevron tip vector $(0, 0, -1)$ by yaw $+0.36$ rad yields:
     $$\mathbf{v}_{\text{forward}} = (-\sin(0.36), 0, -\cos(0.36)) = (-0.352, 0, -0.936)$$
   - Both $X$ and $Z$ components are negative, guiding the runner leftward and forward from spawn `[-3.5, 3.5]` directly to the launch threshold at `[-4.2, 2.65]`.
   - The threshold bar is rotated by `[0, 0.36, 0]`, placing the transverse bar perpendicular to the runner's path and aiming the registration notch along the jump vector toward Stepping Platform 1.

3. **Fix 3 (P2) — Exposed HVAC Fan Interior (Open Shroud Collar)**:
   - In `HVACUnit`, the shroud cylinder previously had default end caps, creating an opaque top disk at $Y=4.920$ that obscured the interior rotor disk ($Y=4.86$), spokes ($Y=4.9125$), and spinner dome.
   - Updated geometry to `<cylinderGeometry args={[fanRadius, fanRadius * 1.05, 0.08, 16, 1, true]} />` (`openEnded: true`).
   - Rotor disk is recessed at $Y = \text{curbHeight} + h + 0.015$ (`materials.hvacFan`).
   - Center spinner dome sits at $Y = \text{curbHeight} + h + 0.035$ (`materials.metalRails`).
   - Cross spokes sit at $Y = \text{curbHeight} + h + 0.045$ (`materials.metalFrame`).
   - The fan interior is exposed through the collar rim from both top-down and oblique camera angles, resolving the flat black appearance in prior crops.

4. **Fix 4 (P3) — Qualified Evidence & Slot Sizing Documentation**:
   - Documented exact dimensions: `GameExperience` canvas measures 738×420px; outer slot box in the test harness constrains overflow to 738×322px (desktop) and 342×300px (mobile) to match production `.game-slot-wrapper`.
   - In mobile hero slot crops, distant rooftop labels (such as Work at the top or Explorations at the far right) are clipped by outer overflow boundaries; full responsive slot framing and camera zoom adaptation belong to coordinator-owned T06 integration.
   - Retained raw failed full-size route runs without asserting speculative SwiftShader causation claims. Product visual acceptance is retained by the coordinator.

5. **Fix 5 (Art Cost) — Mesh Count & Draw Call Consolidation**:
   - Streamlined repetitive sub-centimeter hardware:
     - Removed 6 form-tie cylinder bolts per slab in `BeveledPlatform`.
     - Removed 2 microscopic 8mm cylinder bolts per post in `GlassBalustrade` (retaining the mounting shoe plate and stanchion).
     - Removed 16 anchor bolts in `OverheadSteelFrame` (retaining column base plates).
     - Streamlined `PlanterBox` foliage to 2 slender bamboo stalks (2 leaf nodes each) and 1 fountain grass cluster.
     - Consolidated `DistantSkyline` setback tiers into 1 crown setback per tower.
     - Cleaned `BeveledPlatform` coping into 4 clean coping stones + underside shadow reveal.
   - Total scene mesh count reduced from **878 down to 671** (saving 207 meshes, a 23.6% reduction), decreasing draw call overhead while preserving architectural bevels, paver texturing, and MEP detail.

---

## 2. Verification Results Summary

| Verification Check | Status | Exact Raw Output / Evidence |
| :--- | :--- | :--- |
| `npm run typecheck` | **PASS (0 errors)** | `tsc --noEmit` exited with code 0. |
| `npx vitest run` | **PASS (82/82)** | 4 passed test files: `course.test.ts` (28/28), `game-controller.test.ts` (25/25), `layout.test.tsx` (19/19), `realPortfolio.test.ts` (10/10). Duration 323ms. |
| `npm run build` | **PASS** | Vite production bundle built in 365ms (`dist/assets/index-CrulhiVW.js` 280.77 kB, gzip: 83.42 kB). |
| `git diff --check` | **PASS (0 whitespace errors)** | Clean git diff check. |
| Geometry Inspection (`verify-geometry-3006.mjs`) | **PASS** | 6 stair stringers verified strictly ascending (Start rise 0.60m, Exploration 0.80m, Résumé 1.20m); 2 HVAC fan shrouds have vertical Y axis `[0, 1, 0]` with radius 0.416m, height 0.08m; scene meshes = 671. |
| Wayfinding & Heading Probes | **PASS** | Chevron forward vector is `[-0.352, 0, -0.936]`; takeoff threshold at `[-4.2, 1.204, 2.65]` has 0 overhead obstruction meshes. |
| Fan Shroud Ray Inspection | **PASS** | HVAC fan shroud cylinder confirmed `openEnded: true` at $Y=4.88$, exposing spinner ($Y=4.875$), spokes ($Y=4.885$), and rotor disk ($Y=4.855$). |
| Independent Review Route Evidence (`review.md`) | **ACCEPTED (19/19)** | Full natural route 19/19 pass (738x420, 0 controller placements, 3 framework sync writes); 10 barrier pairs, 6 ascending stringers, 2 upright HVAC axes, flush facade at $Z=-1.4$. |
| Continuous Traversal Evaluator (`verify-traversal-3006.mjs`) | **RAW FAIL (exit 1)** | Raw evaluator run against port 3006 failed at `approach-first-jump` (`passed: 0, failed: 2, error: "Cannot continue route after failed landing: approach-first-jump"`). Process exited with code 1. Qualified and retained without assertion weakening. |
| Candidate Evidence Suite (`design/verification/T05-art-repair/`) | **PASS (18/18 captures)** | Complete evidence suite generated via actual `GameExperience` confirming canvas, render, and player presence. |

---

## 3. Evidence Directory Inventory (`design/verification/T05-art-repair/`)

All captures confirm real WebGL canvas rendering with runner at Start spawn and Option B perspective:

- **Desktop Full Overview (1585x992)**:
  - `desktop-overview-B-dark.png`: Full vista in dark theme. Option B perspective framing Start stairs, flush glazed Work facade, warm toe-kick lights, and bold `#D6FF64` chevrons on charcoal substrate with distant skyline depth.
  - `desktop-overview-B-light.png`: Full vista in light theme. Warm concrete pavers, glass reflections, and atmospheric fog dissolving into `#F2F1EA`.
- **Desktop Hero Slot (738x322 outer box, 738x420 canvas)**:
  - `desktop-heroslot-B-dark.png`: Option B diorama framed inside desktop hero slot dimension. Start rooftop, runner, and next landing clearly readable.
  - `desktop-heroslot-B-light.png`: Option B diorama framed inside desktop hero slot in light theme.
- **Desktop Play Mode (1585x992)**:
  - `desktop-play-dark.png` & `desktop-play-light.png`: Active inline play mode showing runner and play HUD in dark and light themes.
- **Mobile Full Preview (390x844)**:
  - `mobile-preview-B-dark.png`: Full mobile preview with human-scale runner, Start stairs, and stepping stones.
  - `mobile-preview-B-light.png`: Full mobile preview in light theme.
- **Mobile Hero Slot (342x300 outer box)**:
  - `mobile-heroslot-B-dark.png`: Option B diorama in mobile slot container. (Note: distant checkpoint labels near container boundaries may clip; responsive layout integration belongs to T06).
  - `mobile-heroslot-B-light.png`: Option B mobile hero slot in light theme.
- **Mobile Play Mode (390x844)**:
  - `mobile-play-dark.png` & `mobile-play-light.png`: Mobile touch overlay active in dark and light themes.
- **True Equipment Macro Crop (1280x800)**:
  - `close-hvac-dark.png`: Unclipped hero crop of Work HVAC chiller unit in dark theme, showing the entire circular fan shroud ring (full diameter 0.83m with open collar), exposed cross spokes, center spinner dome, rotor disk, front 3D louvers, side manifold, and disconnect switch.
  - `close-hvac-light.png`: Unclipped hero crop of Work HVAC unit in light theme.
- **Courtyard Centerpiece Crop (1280x800)**:
  - `close-courtyard-dark.png`: Courtyard centerpiece showing flush glazed facade at $Z=-1.4$, stair toe-kick luminaires, and streamlined bamboo/grass landscaping.
  - `close-courtyard-light.png`: Courtyard centerpiece in light theme.
- **Takeoff Wayfinding Crop (1280x800)**:
  - `close-takeoff-dark.png`: Close-up of Start rooftop launch ground showing chevrons at $Z \in [3.30, 3.05, 2.80]$ pointing along $[-0.352X, -0.936Z]$ toward the takeoff threshold bar at `[-4.2, 1.204, 2.65]`, clear of Step 1 obstruction.
  - `close-takeoff-light.png`: Takeoff wayfinding in light theme.

*Note: All prior immutable evidence directories (`design/verification/T05-art/`, `design/verification/T05-art2/`, `design/verification/T05-art-B/`, `design/verification/T05-art-final/`) remain retained in the tree without deletion or overwriting.*

---

## 4. Scope Compliance & Frozen Baselines Preserved

- **Allowed Scope**: Only `src/game/CourseGeometry.tsx`, `docs/implementation/reports/T05-art.md`, and candidate evidence in `design/verification/T05-art-repair/` modified or created.
- **Strictly Unmodified**:
  - `src/game/Scene.tsx`, `PlayerController.tsx`, physics colliders, barriers, spawns, and follow offsets untouched.
  - `src/game/courseConfig.ts` camera presets retained as granted (`desktopOverview` and `mobilePreview` Option B presets); no other changes.
  - Root `App.tsx` and package/configuration files preserved untouched.
