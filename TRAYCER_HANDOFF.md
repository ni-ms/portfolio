# Approved portfolio implementation handoff

## Objective and authority

Upgrade the existing portfolio into the approved green-accent dark/light design, including all pages and a more detailed playable rooftop world. Complete the implementation, visual verification, and production build locally.

This document replaces the former clean-rebuild brief. The app and dependencies already exist. A tiny photo beside the name and actual résumé content are now required; old no-portrait and placeholder-content requirements no longer apply.

Authority order: the owner's latest instructions; this approved brief; factual content; approved images for visual composition. Image-generation prompts are provenance only and must not override product requirements or résumé facts.

- Approved images: design/mockups/current-theme/{home,projects,fastcode,resume,about}-{dark,light}.png.
- Content: docs/portfolio-content.json.
- Detailed source: design/source/Resume_Nikhil_Sharma_2026-11.docx.
- Execution: docs/implementation/TASKS.md and tickets/T01.md through T08.md.
- Coordination: docs/implementation/AGENT_PROTOCOL.md.
- State: docs/implementation/state.json; concise recovery summary: PROGRESS.md.
- Shared boundaries: docs/implementation/CONTRACTS.md.

Do not load every image or ticket into every agent session. Load a relevant dark/light pair only. The raster concepts guide composition and visual quality; implement real accessible HTML and an actual 3D scene.

## Pages and content

| Route | Required experience |
| --- | --- |
| / | Small portrait placeholder beside Nikhil Sharma, role, short useful introduction, in-progress CMU degree, résumé link, three descriptive project previews, interactive rooftop preview |
| /projects | FastCode feature plus ScottyPi and Langmetric, concise descriptions, technologies, supported outcomes, real links |
| /projects/fastcode | Problem, approach, benchmark comparison, source-code link; 684 to 539 microseconds, 21% lower latency on the primary workload, about 91% theoretical single-core peak |
| /projects/scottypi | BM25 plus dense retrieval, reciprocal-rank fusion, fine-tuned MiniLM embeddings, 133 passages from 20 official CMU-SV pages, evaluation on 160 questions; no fabricated recall scores |
| /projects/langmetric | Rust/Loco RS/SeaORM service, structured model traces, latency/token/cost dashboards, real project link; no invented usage or customer numbers |
| /resume | Experience, employers and client relationships, dates, education, grouped skills, research marked In review, actual downloadable résumé |
| /about | Brief professional background, areas of focus, education, contact section; header/footer contact links may target /about#contact |

Use a reusable project-detail template, adapting visual evidence to each project. Derive About wording from real experience; do not invent a personal history, hobbies, job availability, testimonials, clients, or credentials.

The M.S. is in progress, expected 2027. Tech Mahindra is the employer for the Intuitive Surgical engagement; Styrone is the employer for the Nationwide engagement. Preserve that distinction. Use confirmed GitHub and LinkedIn URLs in the content file; no live LinkedIn scraping dependency.

A small passport-shaped photo belongs beside the name, roughly 40–48 by 52–64 CSS pixels at desktop scale. No headshot has been supplied; keep an accessible neutral placeholder. Show the name once in the identity area rather than repeating a name wordmark in the same page header.

The requested density is between an empty landing page and a full résumé on Home: a short introductory paragraph and one sentence per project. Full explanations belong on the dedicated pages. Remove obsolete Explorations placeholder content or map it meaningfully into the real projects; do not add an unapproved generic page.

Résumé export: convert the retained DOCX to a readable PDF if an available local renderer supports it, inspect it, and expose the actual file. If PDF export is unavailable, provide a clearly labelled working DOCX download and document that limitation. Never ship a fake PDF link. Source documents and handoff assets must not all be copied into the public build.

## Theme and shared design

Only the charcoal/concrete/lime design is approved.

| Token | Dark | Light |
| --- | --- | --- |
| Page | #101414 | #F2F1EA |
| Surface | #171D1E | warm off-white, slightly separated when needed |
| Text | #F2F1EA | #101414 |
| Secondary | #8E9596 | #565F60 |
| Accent | #D6FF64 | #D6FF64 |
| Concrete | #C8CAC7 | #C8CAC7 |

Dark on a first visit regardless of OS preference. A deliberate toggle persists across reloads and routes. Initialize before first paint; tolerate storage failure. Apply the same choice to game materials/lighting without restarting physics or player progress. Theme controls are keyboard accessible and have meaningful labels. Light-mode lime buttons have charcoal text; body text and essential links remain dark and readable.

Retain the existing font family direction where it fits the approved composition. Match visual hierarchy, margins, and rhythm instead of hardcoding the entire screenshot. Keep common components, navigation, active state, footer, and tokens consistent.

Use real routes with browser back/forward, direct navigation, refresh support on the intended host, meaningful titles, metadata, a clear 404, route focus handling, and scroll behavior. Document the host rewrite requirement if deployment is not configured.

## Playable world and visual fidelity

Retain the current R3F/Drei/Rapier foundation. Rebuild/extend the course as a coherent, compact futuristic architectural environment: beveled concrete, stairs, ramps, parapets, steel rails, glass, detailed service equipment, sparse greenery, distant skyline, and restrained lime wayfinding.

- Establish camera framing and readable course silhouette before expensive effects.
- Use a single source of truth for geometry dimensions, simplified colliders, checkpoints, and spawn transforms.
- Connect camera follow to a live player transform/ref; the current integration does not supply it.
- Consolidate conflicting checkpoint coordinates in courseConfig.ts and gameStore.ts.
- Keep forgiving jump buffering/coyote time, camera-relative movement, stable ground detection, reliable stairs and collisions, reset, and fall recovery. Review jump button edge handling to prevent unintended repeats.
- Use a refined lightweight faceless runner, with useful movement/jump/landing feedback if feasible. It is not the user's likeness.
- Desktop: keyboard movement/jump/reset, clear enter/exit. Mobile: simultaneous directional input and jump, safe-area controls, orientation/resize support. Input clears on blur, route changes, exit, and cancellation.
- Checkpoints offer an explicit portfolio-page action; never unexpectedly navigate away during a jump. Ordinary navigation stays available without playing.
- Maintain a single active gameplay simulation and keyboard input owner, including expanded play. Avoid duplicate canvases/input listeners when moving between preview and full-screen play.
- Refine concrete roughness/normal detail, metal/glass responses, soft key/environment lighting, contact darkening, readable shadows, restrained emissive lime, atmospheric depth, and consistent tone mapping.
- Procedural meshes are fine when finished; use available original/licensed local assets or optimized GLB only when needed. Retain editable scene sources/reproducible generation under design/scene/ and runtime assets under public/. No unapproved paid-asset dependency.

The game must remain genuinely playable. Neither a static image, a video background, nor an unlit cube blockout satisfies this brief.

## Soft boundary and purposeful motion

Remove the boxed game frame. Use a feathered mask, theme-matched atmospheric fade, and progressively blurred perimeter around a crisp central scene. Keep text, controls, player and next landings readable; reduce edge effects during expanded play. Use a single rendered scene plus a lightweight edge treatment, not a second WebGL renderer. Provide a simpler feathered fallback on weaker devices.

GSAP motion must explain a state change or guide attention:
- Short coordinated identity/copy reveal and camera settling on Home entry.
- Controlled camera approach and controls reveal when entering play; orderly exit back to preview.
- Checkpoint route/beacon activation and unobtrusive relevant-page prompt.
- Project preview/detail image continuity when navigating.
- Accurate benchmark bar reveals with visible values and workload qualifier.
- Brief coordinated theme transition without physics reset.
- Restrained section reveals where useful, without repeated long staggers or scroll hijacking.

One animation owner per property. GSAP controls transition targets; the frame loop interpolates the camera; physics owns the player. Stop obsolete timelines/ScrollTriggers on route changes. Reduced motion removes cinematic drift and long transitions and never hides content or disables ordinary gameplay.

## Performance, resilience, and verification

Load readable page content before the game. Lazy-load 3D assets, use adaptive resolution/effect tiers, pause offscreen/background work, and avoid running the game on text-only inner pages. Provide a theme-matched static preview and direct navigation when WebGL fails. Target approximately 60 fps on a representative desktop and 30 fps on a representative phone, then record observed devices/conditions and actual results; these are targets, not assumed guarantees.

Verify desktop 1585x992 and 1440x900, phone 390x844 and 360x740, tablet 768x1024, and phone landscape. Adapt the desktop concepts naturally; no separate approved mobile raster exists.

Checks: npm run typecheck; npm test; npm run build; updated npm run test:e2e. Existing browser tests assert old copy/no portrait/section links; replace those assertions with new requirements while preserving meaningful coverage. Add targeted coverage for theme persistence/first paint, direct routes, real project content, checkpoint consistency, camera follow, respawn, and mobile simultaneous input.

Save current-run screenshots and short measured results under design/verification/. Use deterministic review settings to compare both themes per page, fixed camera/seed, and settled fonts/assets. Inspect captures; do not claim visual parity from a test exit code. Retain only useful final evidence, with long raw logs ignored.

Done means: all routes and real links work; all requested pages match the approved direction in both themes; content is factual; dark default/toggle works; tiny photo slot exists; game is both visually finished and playable; blur and motion behave correctly; reduced motion/keyboard/touch/fallbacks work; checks pass or genuine environment limits are accurately reported. No production publication is requested.

## Execution boundaries

The owner has approved the implementation scope and autonomous bounded delegation. Work locally, preserve unrelated changes, use ordinary scoped commits, and do not push/deploy or force-reset. Prefer two independent implementation workers at most, with a coordinator and a reviewer as needed. Independent worktrees must receive the handoff files and approved assets from the current dirty checkout before starting; an old HEAD alone lacks these new untracked inputs.

Follow the supplied ticket graph. Finish and record each milestone, integrate and validate it, then move forward. If an agent approaches its context limit, checkpoint and hand off the remaining bounded work; do not discard completed work. This workflow reduces context pressure and preserves recoverability; no prompt can guarantee a provider never exhausts context or credits.

Effort estimate: approximately 55–85 focused engineering hours, with game asset/lighting polish as the main variable. This is a scope estimate, not an automatic runtime limit or a reason to stop unfinished work.
