# Traycer build prompt: parkour exploration portfolio

Plan and implement a complete personal portfolio from this clean branch. Recreate the attached design closely and turn its miniature parkour environment into a real playable experience. Carry the work through implementation, browser verification, and a successful production build; a plan or static rendering alone is not the deliverable.

## Inputs and scope

- Repository branch: `codex/parkour-portfolio-rebuild`.
- Authoritative desktop visual reference: `design/parkour-portfolio-reference.png`.
- Authoritative mobile visual reference: `design/parkour-portfolio-mobile-reference.png`. This presentation contains two states: the mobile landing page at left and expanded play mode at right. Its outer presentation backdrop, screen outlines, and captions are not website UI.
- Inspect both reference images before designing or coding. If your agent cannot inspect repository images, request the same PNGs as attachments and use the detailed specification below for independent work.
- The old application was deliberately removed. Build fresh; do not restore it from Git history or reproduce its old Svelte styling.
- Both references are the approved direction. Use the desktop image for the wide layout and the mobile image for narrow-layout hierarchy and play-mode controls. Match their composition, colors, lighting, typography, scale, and architectural character as closely as possible. Resolve any image-generation ambiguity into clean, buildable geometry and legible UI.
- Build locally on this branch. Do not push, deploy, or modify `master` as part of this task.
- Keep this brief and both source reference images available in the repository.

## Product idea and decisions already made

The theme is **exploration through movement**: a compact futuristic rooftop parkour world is the portfolio's signature visual. Visitors can play through it or navigate directly to the work. Routes, checkpoints, stairs, platforms, and a small angular route emblem should form one coherent identity throughout the site.

The landing page must have **no portrait, face, headshot, or author avatar**. A personal photo may be added later inside the résumé section only. The game uses a tiny faceless stylized player, not the owner's likeness. Do not introduce a large robot mascot or return to the abstract ribbon sculpture from earlier concepts.

Professional content may later come from the owner's LinkedIn profile. No LinkedIn URL, résumé, real project details, contact information, or final name have been supplied. Build a clear centralized content model with explicit placeholders. Do not invent a job title, employers, skills, qualifications, metrics, clients, availability, email address, or achievements. Do not scrape LinkedIn or make its API a runtime dependency. Missing personal details should not block the demo.

## Visual specification

Treat the reference as an art-directed homepage, not a generic game portal or SaaS template.

- Background: near-black charcoal `#101414`, with very subtle atmospheric depth around the 3D environment.
- Main text: warm off-white near `#F2F1EA`. Muted text should retain clear contrast.
- Accent: electric acid lime `#D6FF64`, used for route markings, checkpoint beacons, selected edges, small symbols, and calls to action.
- Architecture: matte pale concrete, warm gray surfaces, graphite ground, restrained weathering, and sparse hanging greenery. Avoid shiny neon plastic everywhere.
- Typography: a tightly spaced, extended geometric sans for the large heading; a clean readable sans for body copy; a precise monospaced or widely tracked face for navigation, labels, and controls. Use licensed fonts, preferably self-hosted. Match the reference proportions rather than using a stencil font.
- UI: thin low-contrast rules, generous negative space, crisp typography, restrained corner brackets, and angular line symbols. Avoid rounded card grids, purple gradients, orange accents, full-screen loading sequences, glass panels everywhere, and heavy science-fiction HUD clutter.

### Desktop composition

Use the reference's 1585 by 992 viewport as the primary comparison size. Also verify at 1440 by 900. At the primary size, use approximately 56px horizontal page padding, a header centered near y=44, the hero starting near y=150, and the selected-projects divider near y=768. Scale with fluid CSS; do not implement the entire page as fixed-position artwork.

1. **Header:** small original lime route emblem and `YOUR NAME` at left. Right-aligned navigation: `WORK`, `EXPLORATIONS`, `RÉSUMÉ`, `CONTACT ↗`. Use real section destinations and visible keyboard focus.
2. **Left hero:** small eyebrow `PERSONAL PORTFOLIO / 001`; large two-line headline `WORK` / `& IDEAS.`; supporting text `A collection of projects, ideas, and experiments.`; underlined lime link `VIEW PROJECTS ↗`.
3. **Right hero:** the rooftop diorama fills roughly the right 55–60% of the hero and visually blends into the dark background. It must feel substantial and sculptural. Preserve text legibility: no architecture, plant, glow, or canvas may cover the left copy. Leave the canvas transparent and use the page background behind it.
4. **Lower-left hero:** a small lime route line with a few outlined checkpoint circles and the caption `EXPLORE AT YOUR OWN PACE`. No profile card or portrait here.
5. **Scene labels:** place clear labels close to their rooftops: `01 / WORK`, `02 / EXPLORATIONS`, `03 / RÉSUMÉ`. Fine leaders and small marker dots should echo the reference. Use HTML overlays anchored to 3D positions for readable text and accessible actions where appropriate.
6. **Game controls:** small `DRONE VIEW` control at the scene's upper right; lime `START EXPLORING ↗` button near its lower right; a compact key legend near the bottom: `WASD MOVE · SPACE JUMP · R RESET`. Show an unobtrusive way to leave play mode when active.
7. **Selected work:** a fine horizontal divider leads into `SELECTED PROJECTS`, followed by three evenly spaced previews with thin vertical dividers. Their artwork echoes a rooftop model, a modular staircase, and a branching route schematic. Initial placeholder titles are `01 / PROJECT ONE ↗`, `02 / PROJECT TWO ↗`, `03 / PROJECT THREE ↗`. Keep these clearly identifiable as demo content; do not invent client work.

Build the rest of the page with the same visual language: selected work with accessible detail panels, an explorations section, a résumé section, and a compact contact/footer section. Do not let these sections change the approved first-screen composition. The initial header and hero should be the visual priority.

### Mobile landing composition

Use the left screen in `design/parkour-portfolio-mobile-reference.png` as the narrow-layout reference. Match its proportions at a 390 by 844 CSS-pixel viewport, while adapting naturally to shorter and taller devices. The two-screen presentation image is not itself a viewport screenshot; do not include its captions, borders, or second screen in the rendered page.

1. **Compact header:** the lime route emblem and `YOUR NAME` at left, with a keyboard- and touch-operable menu button at right. The menu exposes the same Work, Explorations, Résumé, and Contact destinations as desktop. Use an explicit accessible label and expanded state.
2. **Stacked introduction:** roughly 24px horizontal page padding, the small `PERSONAL PORTFOLIO / 001` eyebrow, the large two-line `WORK` / `& IDEAS.` heading, supporting copy, and the independent `VIEW PROJECTS ↗` link. Keep text readable and prevent horizontal overflow.
3. **Inline rooftop preview:** show the same course beneath the introduction in a reframed overhead drone view, with the start platform nearest the viewer and the checkpoint rooftops behind it. Give the preview approximately 240–280 CSS pixels of height at the target width; adapt as needed to preserve the reference's balance. Include the small `DRONE VIEW` recenter control and restrained route graphic. No touch pad or keyboard legend appears while the preview is idle.
4. **Play action:** a clearly tappable, nearly full-width lime `PLAY THE COURSE ↗` button below the preview opens the expanded game state described below. Browsing the page never requires playing.
5. **Selected projects:** a thin divider and `SELECTED PROJECTS` label lead into a vertical list of previews, each with a small architectural thumbnail, title/link, and restrained row separators. Show the beginning of this section near the first viewport where space allows. Do not shrink readable text or squash the course simply to force all content above the fold.
6. **Content continuation:** explorations, résumé, and contact continue down the page with the same spacing and palette. Keep the landing page free of any portrait or author avatar.

### Expanded mobile play mode and touch controls

Use the right screen of the mobile reference for the active game. On a narrow viewport, playing opens a viewport-filling overlay with a closer overhead camera and touch controls. This is a deliberate second state, not a permanently oversized game in the scrolling landing page.

- Implement a responsive fixed overlay using the dynamic viewport height and safe-area insets. It must work inside the browser without requiring the native Fullscreen API or a landscape rotation. Support landscape as an additional usable layout.
- Keep the same scene, controller, course configuration, and checkpoint progress across the preview and expanded views. Resize/reframe the canvas or transfer its presentation without creating a second independent physics simulation or losing progress on resize/orientation changes.
- The camera stays above the player with the next landing area visible. Reframe or smoothly follow within bounds as needed for narrow screens; never switch to first person. The scene should remain recognizably the same concrete/lime course.
- At the top, show the small `EXPLORATION / 01` and `ROOFTOPS` labels, a compact three-checkpoint progress indicator driven by real game state, and a prominent `EXIT` close button. Keep essential controls clear of the device notch and browser chrome. Never show desktop keyboard hints as the only controls on a touch device.
- At the bottom left, provide a four-direction pad with distinct arrow buttons. At the bottom right, provide a large lime `JUMP` button and a separate smaller `RESET` button above it. Minimum interactive targets are 44 by 44 CSS pixels with comfortable spacing; the main jump button should be larger. Preserve a clear view of the player and nearby obstacles.
- Direction buttons support press-and-hold movement; jumping can be used at the same time. Track pointer IDs and use pointer capture so one thumb can hold movement while the other jumps. Support diagonal input and normalize its speed. Reuse the keyboard controller's movement and jump logic.
- Release the relevant input on `pointerup`, `pointercancel`, and lost pointer capture. Clear all held input on blur, visibility change, overlay exit, and interrupted gestures. No stuck movement after a finger slides off a button or the browser interrupts a touch.
- Apply `touch-action: none` and gesture prevention only to active game/control surfaces. Do not install global touch handlers that disable ordinary scrolling, pinch zoom, or interaction in the rest of the portfolio.
- While the overlay is open, pause background page scrolling and contain focus within the accessible game dialog. `EXIT` and Escape close it, clear input, pause gameplay, and restore the previous page scroll position and focus to `PLAY THE COURSE`. Ensure normal scrolling and document interaction resume immediately.
- `RESET` returns to the latest checkpoint and clears velocity. A checkpoint's explicit section action closes the overlay and opens or scrolls to the relevant document section rather than trapping navigation behind the game.
- A small `MOVE + JUMP TO EXPLORE` hint may appear under the controls. Keep it concise. If WebGL is unavailable, preserve direct section navigation and show the existing fallback instead of opening an empty game overlay.

## The central 3D world

Build actual geometry, lighting, and gameplay. Both reference PNGs are for design comparison only: do not display either as the entire homepage or as a substitute for the playable scene. Do not fake the course with a pre-rendered video, CSS illustration, or a character moving over a flat screenshot.

Use a high overhead oblique, drone-style camera that shows the rooftops and their sides. An orthographic or lightly perspective camera is appropriate; tune it against the reference. Keep the overview composition stable rather than switching to a first-person view.

Recreate these recognizable elements:

- A low starting rooftop in the foreground-left, with a tiny player, stairs, lime floor arrows, and a start marking.
- A taller work rooftop in the back-left, with rooftop HVAC units and a lime checkpoint beacon.
- A central exploration rooftop with a staircase, sparse planter greenery, and another beacon.
- A résumé rooftop toward the far right, with stairs, a beacon, and a clean rectangular overhead frame.
- Floating stepping platforms, narrow beams, concrete ramps, rails, vertical supports, small yellow-green route accents, and a dark ground slab beneath the course.
- Soft directional lighting, ambient fill, contact shadows, and a restrained checkpoint glow. Make the scene look like carefully built architecture with real scale and depth. Keep greenery sparse and lightweight.

Construct an original angular route emblem and reuse its visual logic in the favicon, route graphic, checkpoint icons, and section accents. The miniature world, rather than a mascot, supplies the site's identity.

Use procedural meshes and materials wherever practical so the demo needs no missing paid model, remote asset pack, or external design service. Define render geometry, collision volumes, spawn points, and checkpoints from one course configuration so visuals and physics stay aligned.

### Visual fidelity pipeline

The reference images are generated raster concepts, not source 3D scenes. There is no supplied model, light rig, font package, or material library to import. Reconstruct those ingredients and iterate against the references. Installing the chosen libraries does not by itself satisfy the visual requirement, and a functional unlit box blockout is not the finished scene.

1. **Calibrate composition first:** establish a locked desktop reference camera, course bounds, roof heights, and key landmark positions before adding animation. Start with an orthographic camera; use restrained perspective only if it matches better. Tune zoom, target, azimuth, and elevation against the image. Keep separate explicit presets for desktop, mobile preview, and mobile play; resize must not silently reset a tuned view. Record these settings in the scene configuration.
2. **Finish the geometry:** build bevels that catch the light, credible stair thickness, roof parapets, slender rails, HVAC housings/louvers, planters, platform supports, and small surface seams. Plain sharp-edged cubes with flat colors are only the blockout. Use sensible normals and sufficiently smooth bevels without wasting polygons on unseen surfaces. Geometry that affects the silhouette must be modeled rather than painted into a texture.
3. **Author assets when needed:** procedural meshes are acceptable if they reach the target. If richer mesh work or baked lighting is needed, use an available local tool such as Blender and export optimized glTF/GLB. Keep editable scene sources or a reproducible generation script under `design/scene/`, runtime models under `public/models/`, and required local textures under `public/textures/`. Keep simple collision meshes separate from detailed render meshes. Do not make completion depend on a missing model or a new paid asset purchase.
4. **Use physically based materials:** concrete should have subtle albedo variation and restrained normal/roughness detail, with metalness near zero and high roughness as an initial tuning point. Rails and HVAC details need distinct material responses. Set texture scale consistently across surfaces; avoid stretched concrete, repetitive oversized grain, and glossy plastic roofs. Use local original or properly licensed textures. Three.js provides a metallic/roughness PBR workflow through [MeshStandardMaterial](https://threejs.org/docs/pages/MeshStandardMaterial.html).
5. **Build a deliberate light rig:** use a soft directional key from above-left/front, restrained fill/environment illumination, and deep but readable shadows. Enable cast/receive shadows on the appropriate geometry and fit the shadow camera tightly to the course. Start around a 2048px main shadow map on desktop and 1024px on mobile, then profile and tune bias/softness. Match shadow direction and contrast rather than increasing light intensity until the concrete washes out.
6. **Ground the architecture:** add contact darkening beneath stairs, roofs, rails, and planters using authored/baked ambient occlusion or a measured lightweight real-time AO pass. Preserve dynamic player shadows. If static contact or accumulated shadows are cached, do not bake the moving player into them or leave a ghost after movement. Do not stack multiple heavy shadow/AO techniques without demonstrating a visual benefit.
7. **Control color and glow:** use the chosen R3F/Three.js version's color-management pipeline correctly, with sRGB display output, a consistent tone-mapping/exposure setup, and appropriate texture color spaces. ACES filmic is a starting point to tune against the image, not a reason to apply a second tone-mapping or gamma pass. Lime beacons may use emissive surfaces and very restrained bloom; white type and concrete should remain crisp. If using `@react-three/postprocessing`, keep one compatible composer and make effects optional on weaker devices. Check renderer defaults against the installed version's [Canvas documentation](https://r3f.docs.pmnd.rs/api/canvas).
8. **Match the 2D design equally carefully:** select and self-host licensed fonts, measure heading width/weight/line spacing, match margins and rules, and tune label positions at the reference viewport sizes. Render interface text in HTML/SVG, outside scene postprocessing. The project thumbnails should come from the same world/assets and lighting rather than unrelated stock pictures.

Expose camera, lighting, exposure, shadow, material, and quality parameters in a small typed scene configuration. Include a deterministic visual-review mode that freezes idle animation, uses a fixed seed and player position, waits for fonts/assets/shadows to settle, and makes desktop/mobile captures repeatable. This mode should be available through a documented local development or test flag, not an extra public-facing settings panel.

## Game behavior

The mini-game must be enjoyable and optional. All work, résumé content, and contact navigation remain accessible without playing, even if WebGL fails or JavaScript is still loading.

### Idle and active states

- On load, show the completed rooftop composition immediately after lightweight scene loading. A very slow, tightly bounded camera drift may give it life; keep screenshot composition stable and disable automatic motion for reduced-motion users. Do not run an autoplay parkour sequence or demand interaction before showing the portfolio.
- Desktop `START EXPLORING` focuses the inline game and enters play mode. Mobile `PLAY THE COURSE` opens the expanded game overlay. Give a clear active-state indicator and a brief accessible controls hint; show controls appropriate to the input device.
- WASD and arrow keys move the player relative to the camera's ground-plane directions. Space jumps; R resets to the latest checkpoint; Escape leaves play mode and returns focus to the initiating button. Retain keyboard support inside the mobile overlay for devices with a connected keyboard.
- Capture movement and jump keys only while the game is focused and active. Do not hijack page scrolling, navigation, or text inputs outside it. Clear held inputs on blur, visibility changes, or exit so the player cannot become stuck moving.
- `DRONE VIEW` recenters the overview camera; it must perform a real action.

### Movement, collisions, and progression

- Implement gravity, grounded checks, reliable jumping, solid platform and wall collisions, and sensible edge behavior. Use a fixed physics timestep with safe frame-delta handling. Diagonal movement must not be faster than straight movement.
- Use a simple capsule or similarly lightweight player. Keep the avatar tiny, readable, and faceless with white/lime visual accents.
- Stairs must be reliably traversable; use a proper step controller or matched ramp colliders instead of expecting the player to jump each stair.
- Tune all gaps, beams, and height changes to be physically reachable. Prefer one short, polished route to a large broken course. Add subtle coyote time and jump buffering if they help reliability.
- Falling out of the course respawns the player safely at the latest checkpoint. Reset clears velocity as well as position. Do not add punitive death screens or a mandatory timer.
- Reaching a checkpoint gives restrained feedback and offers an explicit `View work`, `View explorations`, or `View résumé` action. Activating that action pauses the game, returns to normal document interaction, and opens or scrolls to the corresponding accessible section. Do not yank the page away during a jump.
- No account, leaderboard, combat, ads, multiplayer, collectible grind, or backend is needed.

## Implementation foundation

Start a fresh **Vite + React + TypeScript** project using the following implementation stack. Select current mutually compatible stable dependency versions during implementation and commit the lockfile. Do not reuse the deleted app's dependencies or lockfile.

| Responsibility | Technology and use |
| --- | --- |
| Application and semantic UI | React, TypeScript, Vite, and CSS custom properties for the visual system. |
| Real-time 3D | `three` and `@react-three/fiber` for the course, renderer, camera, and scene lifecycle. |
| Scene utilities | `@react-three/drei` for useful camera, HTML-label, asset-loading, and performance helpers; import only what is used. |
| Game physics | `@react-three/rapier` for reliable controller/collision behavior; keep collision meshes simple. |
| Motion | **`gsap` and `@gsap/react` are required**. Use GSAP timelines for deliberate interface/camera transitions and ScrollTrigger for restrained section reveals. |
| Optional finishing effects | `@react-three/postprocessing` only when a measured AO/bloom/antialiasing treatment improves fidelity within the performance budget. |
| Visual asset authoring | Procedural meshes, or locally authored Blender-to-glTF/GLB assets when needed for the fidelity described above. Blender is an authoring tool, not a runtime dependency. |
| Verification | Focused logic tests plus Playwright browser checks and visual-review captures at the specified desktop/mobile sizes. |

Suggested separation of responsibilities, with equivalent clean organization acceptable:

- `src/content/portfolio.ts`: all identity, hero copy, links, project entries, explorations, résumé, and optional portrait data.
- `src/components/`: semantic header, hero copy, project previews, accessible project details, résumé, and footer.
- `src/game/`: scene, shared course configuration, collision/controller logic, checkpoints, camera, and input lifecycle.
- Include an accessible expanded-game dialog and a pointer-based touch-controls component, sharing the same controller and game state as desktop.
- `src/styles/`: design tokens, fluid layout, responsive rules, focus and reduced-motion styles.
- `tests/`: focused controller/checkpoint and browser interaction coverage.

Keep game simulation outside React state updates on every frame. Separate the HTML portfolio from the canvas so the content remains usable without 3D. Provide `npm run dev`, `npm run build`, `npm run preview`, `npm run typecheck`, and an appropriate focused test command.

### GSAP motion direction and integration

Motion should reinforce the miniature-world theme while preserving the approved resting composition. Implement a small coherent motion system rather than adding unrelated effects to every element.

- **Intro:** a short staggered reveal for the eyebrow, headline, copy, and call to action; start around 12–20px of translation over 0.6–0.9 seconds, with restrained easing. Content must remain visible and usable if animations do not initialize; do not wait for the 3D bundle to finish before exposing navigation.
- **Route identity:** draw the small SVG route using a stroke-dash animation and light up its checkpoint dots in sequence. Reuse this treatment for relevant section accents. An extra SVG animation plugin is unnecessary for a simple path draw.
- **Scene transitions:** animate overview-to-play and recenter transitions over roughly 0.6–0.9 seconds, tuning to prevent disorientation. Use the same stable camera presets defined for fidelity review. Suspend idle drift and cancel any conflicting camera tween when play begins; keep the player visible throughout.
- **Interface transitions:** use short opacity/transform transitions for the mobile menu, game overlay, project details, button arrows, and hover/focus feedback. Start around 0.2–0.35 seconds. When opening mobile play, controls should be usable immediately rather than waiting for a decorative timeline.
- **ScrollTrigger:** reveal project rows and subsequent sections as they enter view, with modest motion and small staggers. Preserve native scrolling; do not pin the whole landing page, require scrubbed scrolling to access content, or add a smooth-scroll library by default. Recalculate relevant triggers after layout/font changes, without creating duplicate instances.
- **React lifecycle:** scope animations to their component refs using `useGSAP()` from `@gsap/react`; clean up timelines, callbacks, and triggers on teardown or mode changes. Use context-safe handlers when creating animations from later events. Follow the [official GSAP React integration guide](https://gsap.com/resources/React/).
- **Responsive motion:** use `gsap.matchMedia()` for breakpoint/input differences and `prefers-reduced-motion`. Reduced-motion mode shows the final composition directly, disables idle drift/pulsing and large travel, and uses immediate camera changes or minimal fades. Revert media-specific animation setup when conditions change, as described in the [GSAP matchMedia documentation](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/).
- **One owner per property:** GSAP may tween a camera-rig parameter object or non-physical visual properties. The R3F render loop applies those parameters. Rapier/controller logic owns player motion; do not tween player rigid bodies, moving collision surfaces, or gravity with GSAP. Avoid having GSAP and the frame loop independently write the same camera transform.
- **Render scheduling:** use the R3F renderer for drawing, not a second rendering loop in GSAP. If rendering on demand, invalidate while GSAP-driven scene values are changing and stop when motion settles; active gameplay still needs its normal simulation/render loop. See the [R3F performance guidance](https://r3f.docs.pmnd.rs/advanced/scaling-performance).

### Content and links

- Put all editable content in the central typed data model, with comments identifying where LinkedIn-derived information can be pasted later.
- Use `YOUR NAME` and clearly labeled sample entries until real content is supplied. Empty social or contact data should render an intentional empty state or omit the link, not point to a fake address or `#`.
- Placeholder project previews may open accessible demo detail panels, clearly marked as sample content. Every visible action must work.
- Make résumé content an ordinary accessible HTML section. Provide a PDF download only when an actual file exists; do not ship a broken download button. Keep any future portrait confined to this section.
- The first version needs no authentication, form service, CMS, analytics, LinkedIn integration, or database.

## Responsive layout, accessibility, and performance

- At narrow widths, use the mobile landing and expanded-play specifications above. Keep the reading order: navigation, hero copy, diorama preview, play action, project previews, remaining content. No horizontal scrolling or text over the course. Test at 390 by 844, a smaller 360 by 740 phone, and around 768px wide.
- On touch devices, show the directional pad, jump, and reset controls only during active play. At tablet sizes, retain readable spacing and use the expanded play view when inline controls cannot fit comfortably. All section links remain available independently of gameplay.
- Respect reduced motion and provide a pause/exit control. Use semantic headings, sufficient contrast, visible focus, descriptive control labels, accessible modal focus management, and keyboard-operable navigation. Put a short scene description outside the canvas; the game is not the only way to reach content.
- Lazy-load the 3D bundle without delaying the text/navigation. Show a stable, intentional local loading/fallback view for the scene area. On WebGL failure, preserve the page and direct links with a useful message rather than a blank or broken hero.
- Cap device pixel ratio, reuse meshes/materials, minimize draw calls and expensive effects, and reduce shadows/detail on small devices. Pause unnecessary rendering/physics when hidden or offscreen. Avoid a heavy postprocessing chain for a subtle glow.
- Define desktop and mobile quality presets. Keep architecture, composition, typography, and material character consistent; scale DPR, shadow resolution, greenery density, and optional postprocessing first. Profile actual devices or state the test environment. Aim for 60fps on a suitable desktop and stable, responsive play on a representative phone; do not claim a universal frame-rate guarantee from one browser run.

## Implementation and verification plan

Break the work into focused phases, then execute them:

1. Scaffold the new project, add tokens/content data, and reproduce the semantic responsive layout and typography.
2. Build and visually calibrate the rooftop diorama, camera presets, finished materials/geometry, shadows/AO, greenery, HTML labels, and scene loading/fallback. Capture and review the static composition before layering motion on top.
3. Add the actual player controller, reliable collision course, checkpoints, keyboard/multi-touch input, expanded mobile play dialog, focus/scroll lifecycle, and reset/exit behavior.
4. Finish content sections, real navigation, demo detail panels, mobile layout, the GSAP motion system, accessibility, quality presets, and documentation.
5. Run appropriate checks and compare browser screenshots against both references, including the mobile landing and expanded play states. Iterate on visible mismatches before finishing.

Verification must cover more than whether the app compiles:

- Production build and TypeScript check pass. Document the commands and results.
- Compare a browser screenshot at 1585 by 992 against `design/parkour-portfolio-reference.png`. Check text positions and sizes, scene scale and camera, visual hierarchy, lime/concrete materials, breathing room, and selected-work strip. Also inspect 1440 by 900 and mobile views.
- Save deterministic visual-review screenshots and an annotated comparison or opacity overlay under `design/verification/`. Review and correct composition/camera first, then finished geometry, materials/lighting/shadows, typography/spacing, and finally effects. A fully working game with visibly unfinished gray-box architecture does not pass the visual acceptance requirement. Report any remaining visual differences honestly; an AI raster reference is not an existing 3D asset or a guarantee of pixel-identical reconstruction.
- Capture mobile landing and active-play screenshots separately at 390 by 844 and compare them to the corresponding screens in `design/parkour-portfolio-mobile-reference.png`. Also inspect 360 by 740, a tablet viewport, and a phone landscape viewport. Verify safe-area spacing, readable labels, a visible next landing area, no clipped touch controls, and no horizontal overflow. Do not compare the entire two-screen presentation image as though it were one page screenshot.
- Verify movement, jumps, stairs, wall/platform collision, reachable gaps, checkpoint progression, falling/respawn, and R reset. Check that reset clears velocity, diagonal speed is normalized, and changing frame rate does not destabilize movement.
- Verify game keys do not capture normal page input; Escape and blur clear input and release focus. Test checkpoint actions and all navigation links without playing.
- Test simultaneous movement plus jump with two touch pointers, held directions, diagonal movement, a finger leaving its button, `pointercancel`, lost pointer capture, blur, reset, and exit. Verify no stuck input, no page scrolling during the active overlay, restored scrolling/focus after exit, and ordinary scrolling/zoom outside play mode. Confirm progress survives entering/exiting the overlay and orientation changes without duplicate physics loops.
- Test the mobile menu, reduced motion, keyboard navigation, game-dialog/project-modal focus, checkpoint section actions from the overlay, and a simulated WebGL failure/fallback. Confirm no portrait appears on the landing page at any breakpoint.
- Verify the GSAP intro, section reveals, menu/overlay transitions, and camera transitions with normal and reduced motion. Repeated opening/closing, React development remounts, breakpoint changes, and orientation changes must not multiply timelines/triggers, leave text hidden, fight the gameplay camera, or leak animation work.
- Check for browser console errors and missing assets. Add focused tests for real movement/checkpoint/input risks rather than superficial snapshots of every component.

Finish with concise setup/run instructions, the implemented feature list, verification results, and any remaining genuine limitation. List exactly which content fields still need the owner's LinkedIn information. The target is a polished usable portfolio and a working miniature parkour game matching the approved demo, not a rough starter page.
