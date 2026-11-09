# T05-art — Architectural Art Refinement Checkpoint

Status: CHECKPOINT (Early interim review of bounded architectural art iteration).
Owner: Worker `b5dee62d-7c4a-4d0f-8ca0-2ed86050eec4` (art refinement).
Branch/worktree: `codex/portfolio-T05-art` at `/Users/nikms/.traycer/worktrees/ni-ms__portfolio/codex-portfolio-t05-art`.
Base commit: `80a77e844a1d7903ad175510da10c151c7a97c1b`.
Dev server: PID `24785` listening on `http://127.0.0.1:3006`.

---

## 1. Summary of Implemented Architectural Art Refinements

### A. Primary Slab & Coping Polish
- **45° Corner Chamfer Pilasters**: Eliminated razor-sharp 90° box edges on all primary slabs (Start, Work, Exploration, Résumé) with vertical 45° beveled pilasters that catch crisp specular highlights from directional and environment lights.
- **Multi-Tiered Beveled Coping**: Installed 45° chamfered coping stones around all platform perimeters with physical drip-edge overhangs ($+0.04$m) and dark underside shadow reveal strips creating clean contact separation.
- **Architectural Base Plinths**: Grounded each platform with a recessed darker precast concrete water-table band at its base.
- **Modular Paver Decks**: Upgraded surface decks with a high-contrast 4x4 paver tile procedural texture featuring subtle individual tile tone shifts, aggregate speckles, and dark recessed expansion joints.

### B. Precast Facade Panel Relief & Hardware
- **Modular Rustication Joints**: Subdivided tall blank slab faces into balanced precast architectural panels using horizontal and vertical reveal seams.
- **Form-Tie Bolt Anchor Hardware**: Added metallic anchor plates / bolt heads (`materials.metalBolt`) at panel grid intersections, matching modern architectural concrete construction.
- **Recessed Service Louvers**: Added recessed ventilation grilles with true 3D angled metallic louver slats and perimeter metal trim on tall service facades.
- **MEP Conduit Risers**: Installed vertical external conduit pipes with wall-mounting brackets running along service facades.

### C. MEP Equipment Polish (Work Rooftop HVAC Units)
- **Beveled Sheet-Metal Casing**: Added 45° chamfered edge highlights to all 4 upper casing perimeters.
- **Vibration Isolators**: Installed corner neoprene/steel damping pads beneath the curb base.
- **3D Intake Louvers**: Built front and rear intake grilles with distinct horizontal metallic louver blades angled at 36°.
- **Top Exhaust Fan Assembly**: Retained vertical Y-axis cylinder shroud ($[0, 1, 0]$), adding an aerodynamic center motor dome, structural radial grille spokes, and recessed fan rotor plane.
- **Service Manifolds & Hardware**: Dual refrigerant conduits with elbow flanges, electrical disconnect switch box with lever, status LED (`#D6FF64`), and side maintenance access door with hinges and turn-handle.

### D. Refined Architectural Greenery (Exploration Planters)
- **Clustered Leaf Geometry**: Replaced blockout dodecahedrons with layered architectural boxwood shrubs composed of dense core masses and intersecting angular faceted leaf clusters that catch directional sunlight and cast soft self-shadows.
- **Layered Landscaping**: Added tapered ornamental fountain grass tufts and overhanging cascading ivy tendrils spilling over the beveled concrete planter rims.
- **Multi-Tonal Materials**: Rich chlorophyll botanical materials (`foliageMain`, `foliageLight`, `foliageAccent`, `foliageStem`).

### E. Overhead Steel Pavilion Centerpiece (Résumé Rooftop)
- **Structural Steel Detailing**: 4 vertical box columns with heavy base anchor shoes and visible anchor bolts; header box beams with welded corner plates.
- **Architectural Rafters & Lighting**: Intermediate rafters with underside recessed linear acid-lime (`#D6FF64`) light strips.
- **Sunshade Louvers**: Overhead horizontal sunshade louvers casting intricate geometric linear shadows across the Résumé rooftop deck.

### F. Purposeful Continuous Acid-Lime Wayfinding
- **Integrated Safe Course Guide**: Dedicated `CourseWayfinding` component with continuous acid-lime (`#D6FF64`) markings:
  - Start rooftop runway guide tracks and directional chevrons leading to lower landing.
  - Takeoff threshold bars at platform jump edges.
  - Runway centerlines and corner landing targets on stepping stones and bridge beam.
  - Landing threshold and guide track connecting landing to Checkpoint 1 on Work rooftop.
  - Landing mark, terrace guide path, and stair indicators on Exploration rooftop.
  - Runway line leading directly under the steel pavilion to Checkpoint 3.

### G. Layered Distant Skyline
- **Multi-Tiered Architectural Depth**: Mid-distance towers ($z pprox -22$ to $-28$) and far-distance towers ($z pprox -34$ to $-45$) receding into atmospheric depth fog.
- **Varied Typologies**: Stepped setback monoliths, slender curtain-wall glass towers with vertical mullions and illuminated window bands, angled glass spires, mechanical penthouses, and twin communications masts.
- **Mobile Optimization**: Filters far-distance towers on mobile tier to preserve draw calls.

---

## 2. Verification Outcomes

| Verification Check | Result | Details |
| :--- | :--- | :--- |
| `npm run typecheck` | **PASS (0 errors)** | `tsc --noEmit` clean across all files. |
| `npx vitest run tests/` | **PASS (53/53)** | 28 course tests, 25 game controller tests. |
| `verify-geometry-3006.mjs` | **PASS (6/6 stairs, 2/2 HVAC)** | 6 stair stringers ascend correctly matching step coordinates (Start beam rise 0.60m, Exploration 0.80m, Résumé 1.20m); 2 HVAC fan shrouds vertical Y axis `[0, 1, 0]` with radius 0.416m, height 0.08m. |
| `capture-t05-art.mjs` | **PASS (8/8 captures)** | Full dark/light desktop and mobile comparison screenshots generated under `design/verification/T05-art/`. |
| Material Closeups | **PASS (8/8 crops)** | Diagnostic closeups of HVAC, foliage planters, steel pavilion, and primary slab coping/facades generated in both dark and light themes. |

---

## 3. Captured Visual Evidence (`design/verification/T05-art/`)

- `desktop-overview-dark.png`: Calibrated isometric hero overview showing refined modular pavers, beveled coping highlights, continuous acid-lime course wayfinding, detailed MEP equipment, and multi-tiered skyline in dark mode.
- `desktop-overview-light.png`: Light mode overview showing warm sandstone concrete, tempered glass reflections, crisp coping bevels, and atmospheric fog dissolving into `#F2F1EA`.
- `desktop-play-dark.png`: Third-person inline play camera behind runner with active course markings and HUD.
- `desktop-play-light.png`: Third-person inline play camera in light theme.
- `mobile-preview-dark.png`: Centered mobile preview over Start rooftop, stepping stones, and Work rooftop.
- `mobile-preview-light.png`: Centered light theme mobile preview.
- `mobile-play-dark.png`: Mobile touch overlay in dark theme.
- `mobile-play-light.png`: Mobile touch overlay in light theme.
- `close-hvac-dark.png` & `close-hvac-light.png`: Closeup of Work rooftop chiller units showing 45° casing chamfers, 3D angled intake louvers, circular vertical Y shroud, piping manifold with flanges, and status LED.
- `close-planter-dark.png` & `close-planter-light.png`: Closeup of Exploration rooftop landscaping showing multi-faceted boxwood clusters, fountain grasses, and cascading ivy over beveled planter rim.
- `close-pavilion-dark.png` & `close-pavilion-light.png`: Closeup of Résumé rooftop steel pavilion showing base anchor shoes, bolts, linear lime underside lighting, and shadow louvers.
- `close-slab-dark.png` & `close-slab-light.png`: Closeup of Start rooftop primary slab showing corner chamfer pilasters, coping bevels, modular pavers, and facade panel seams.

---

## 4. Scope Compliance & Technical Baselines Preserved

- **Allowlist Compliance**:
  - `src/game/CourseGeometry.tsx`: Updated with architectural bevels, modular paver decks, precast panel seams, bolts, 3D louvers, refined foliage clusters, steel pavilion, continuous wayfinding, and multi-tiered skyline.
  - `src/game/materials.ts`: Added paver tile map, brushed metal roughness map, skyline window texture, bolt and foliage materials, while strictly preserving theme toggle contracts and color assertions.
  - `design/verification/T05-art/*`: High-resolution evidence captures and diagnostic material closeups.
  - `docs/implementation/reports/T05-art.md`: This report.
  - `.agent-runs/*`: Ignored diagnostic verification scripts.
  - Zero edits outside scope: No `package.json`, root layout, router, global CSS, physics, or controller edits.
- **Accepted Baselines Preserved**:
  - Canonical physics bounds, colliders, spawns, and 10 barrier openings untouched.
  - 6 ascending stair stringers with negative-X angle matching step coordinates.
  - 2 HVAC exhaust fan cylinder shrouds with vertical Y axis `[0, 1, 0]`.
  - Mast beacon motion gating with isolated `limeMastBeacon` and live `matchMedia` listener.
  - Environment lifecycle: single stable `CubeRenderTarget(128)`, memoized `Lightformer` reflection cards, 0 idle rebakes.

---

## 5. Honest Gaps & Performance Qualifications

- **Software Emulation vs Production WebGL**: Timings and frame observations on port 3006 were captured under headless Chromium using SwiftShader ANGLE Vulkan CPU software rasterization on macOS. Fragment sampling and draw performance on production GPU hardware remain unmeasured.
- **Traversal Route Suite**: Prior candidate exited with code 1 at `step-start-work-1` under SwiftShader software emulation (cause unproven). This early art checkpoint was requested to verify visible improvement BEFORE the broad full suite; traversal was not rerun in this bounded turn to maintain honest distinction from visual acceptance.

---

## 6. Exact Next Action

Coordinator reviews visible improvement from `design/verification/T05-art/*` and returns direction. Following coordinator direction, run final checks, build, and browser verification before submitting final READY_FOR_REVIEW.
