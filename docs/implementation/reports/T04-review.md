---
kind: review
title: "T04 independent gameplay review"
---

# T04 independent gameplay review

**Verdict: request changes; do not release T05.** Reviewed `6211600..d62334d`, branch `codex/portfolio-T04-gameplay`, CONTRACTS revision 1. Reviewer: `fd6a9ad5-1fc8-499c-8080-16142de55261`. Actual GameExperience was exercised through an ignored port-3004 harness. Source/state remained read-only; this report is the only non-ignored change. No nested agents.

## Confirmed findings, in priority order

1. **P1 — Sensors count as ground, enabling airborne re-jumps.** `src/game/PlayerController.tsx:112–122` includes sensors. At foot y=2.194 above the 1.2 roof, its ray hit cp-start at TOI=0; excluding sensors returned no hit. Release/repress Space added vertical velocity +4.980. Evidence: `basics-results.json` sensorRay and `basics-physics.json`. **Repair acceptance:** exclude sensors; this airborne press must not add an impulse, while coyote/buffering still works.

2. **P1 — Intended Explorations→Résumé path is blocked.** `src/game/courseConfig.ts:150–153,207–217`: the second step (top 3.45) is entirely inside the solid Résumé slab (top 4.2). The exposed preceding step is 2.75 high; the 1.45 rise exceeds the theoretical 1.138 jump rise before damping. Actual jumps stopped at x≈3.701; Résumé remained locked. Evidence: `resume-wall.json/png` (initial Exploration placement was explicit setup). **Accept:** traverse this segment with ordinary single jumps and earn its sensor without setup or airborne re-jumps.

3. **P1 — Checkpoint activation teleports and zeros velocity.** `src/game/PlayerController.tsx:38–64,213` derives its placement effect and body position prop from the changing checkpoint. Walking from Exploration's lower landing triggered the sensor at physical `[1,1.799,1.285]`, then snapped to `[1.2,3.1,0.8]`, velocity zero. This masks blocked stairs. Evidence: `basics-physics.json`, sensor event and subsequent samples. **Accept:** activation saves respawn/progress without changing current transform/velocity; placement occurs only on initial mount or explicit reset/fall.

4. **P1 — Start/Exploration ramps are buried behind slab faces.** `src/game/PhysicsCourse.tsx:61–70,118–127`: Start slab extends to z=5.4, ahead of the ramp low end near 5.2; Exploration extends to 1.1, ahead of its ramp near 1.0. From valid lower-landing setups, forward input stalls at `[−3.5,0.599,5.599]` and `[1,1.799,1.299]`. Exploration repeat uses its current checkpoint to prevent teleport masking. Evidence: `basics-results.json`, `stairs-results.json`, screenshots. **Accept:** walk both stairs up/down without jump or checkpoint displacement; derive matching geometry/colliders from configuration.

5. **P2 — Overlay unmount leaves scrolling locked.** `src/game/GameExperience.tsx:54–71` cleans up only a timer; unlock requires another mode render. Unmount yielded canvas=0, scroll-locked=true, mode=play-overlay; remount reopened gameplay. Evidence: `lifecycle-results.json`. **Accept:** unmount/route departure clears input, releases scroll, restores position, and leaves a deliberate return mode.

6. **P2 — Modal focus escapes and is not restored.** That effect only focuses Exit; no containment or background inertness exists. Shift+Tab reached the outside Unmount button; Tab from Jump reached the outside link. Close focused BODY: Play unmounts, and line 57 recaptures focus after removal. Evidence: `lifecycle-results.json`. **Accept:** Tab/Shift+Tab wrap inside; close restores the connected Play control after rendering.

7. **P2 — Phone landscape loses touch controls.** `src/game/GameExperience.tsx:33,73–79` treats width>768 as keyboard-only. Actual touch-enabled 844×390 Play opened play-inline with zero touch controls. Evidence: `mobile-results.json`, `phone-landscape-no-controls.png`. **Accept:** touch works independently of width, both when entering landscape and rotating during play.

8. **P2 — Preview/offscreen work never pauses.** `src/game/GameExperience.tsx:175`, `PlayerController.tsx:66`, `Scene.tsx:109` have no physics pause/visibility suspension. Exit during a jump continued y=1.862→1.199 in preview; entirely offscreen render frames advanced 67→80 over 659ms. Evidence: `pause-results.json`. **Accept:** pause or explicitly preserve/restore player state on exit; suspend physics/rendering offscreen/background without losing progress.

## Verification and limits

- `npm run typecheck`: pass. Targeted Vitest: **38/38 pass**. Build/full integrated E2E not run.
- Independently observed: live camera follow x=−3.5→−1.988; identical Canvas/Rapier body across theme and inline/overlay; one active window keydown listener; keyboard reset, all four explicitly selected spawns, forced falls, blur/exit clearing, coyote, landing buffer, reduced-motion gameplay, explicit `/about` callback.
- Real CDP two-touch moved/jumped; releasing Jump retained Forward; cancellation cleared input. Per-pointer cancellation clears all inputs; no sticky input observed.
- **Full traversal not accepted.** Initial route trials reached stepping platforms but did not earn Work; isolated Work jump attempts stalled. Exploration sensor activation was observed from a placed lower landing and teleported. Résumé's intended segment failed. Selected checkpoints in spawn/fall tests prove recovery only.
- Worker `verify-t04.mjs` does not close these gaps: touch assertion is literal true; canvas count cannot prove identity; jump y≥1.2 includes standing roof height; `__reachCheckpoint` directly unlocks Work. Inspected captures show visible world/player; visual finish remains T05.

## Evidence and exact next action

Worktree: `/Users/nikms/.traycer/worktrees/ni-ms__portfolio/codex-portfolio-t04-gameplay`. Ignored evidence: `.agent-runs/T04-review/`; harness/driver: `.agent-runs/review-t04.{html,tsx,mjs}`. Setup calls are explicitly labeled and import the unchanged production component.

Start server: `npm run dev -- --host 127.0.0.1 --port 3004 --strictPort`; run `node .agent-runs/review-t04.mjs CASE`, with CASE basics, stairs, resume, lifecycle, mobile, pause, camera, spawns, timing, navigation, or reduced. Review server is stopped after verification.

Coordinator assigns repairs to original owner `29765d14`, reruns these acceptance checks plus continuous earned-checkpoint traversal, then requests independent re-review. No implementation/state edits or next phase follow from this review.


## Re-review of 30f6bdf — request changes

Reviewed repair `30f6bdf88e523258c946251ec20fb2f29f79d795`, same reviewer/worktree/contract. Original review above is retained. Source/state remain untouched. **Hold integration/T05 for three confirmed remaining issues.**

1. **P1 — The scroll cutoff freezes a visible game, including expanded play.** `src/game/Scene.tsx:95–101,127` uses `scrollY > 400` instead of the element's visibility. At scroll 500, the mobile preview still occupies y=−459..233, but rendering stops. Clicking Play then opens a full-screen 390×844 overlay with a blank scene; frame 46 and the player position remain unchanged despite movement input. Conversely, a scene placed below the fold at scroll 0 renders frames 46→69. A synthetic hidden-document/visibilitychange signal also leaves physics active (y=1.862→1.567); real OS background suspension was not measured. Evidence: `visibility.json`, `visible-overlay-frozen.png`. **Accept repair:** observe the actual scene/container intersection and document visibility; expanded visible play must run regardless of saved page scroll. Verify visible/offscreen transitions, nonzero-scroll expansion, and background/resume with progress retained.

2. **P2 — Modal close still does not restore focus.** `src/game/GameExperience.tsx:85–96,145` saves the original Play element, which unmounts during gameplay, and later focuses that disconnected object. Tab containment now passes, but closing still leaves BODY focused; the new Play button is never focused. Evidence: `lifecycle.json`, failed `focus-restored-to-connected-trigger`. **Accept repair:** focus the connected current trigger after preview renders, and cancel restoration on unmount/navigation so it cannot steal route focus. Keep the passing scroll, trap, and cleanup checks.

3. **P2 — Stair assistance injects upward velocity on flat ground and duplicates course coordinates.** `src/game/PlayerController.tsx:220–229` tests fixed X/Z regions and slopes, without checking the actual supporting surface or player height. After walking under the Exploration ramp from the side, a downward ray identifies `ground-slab` at TOI≈0.349. Pressing only Forward raises the feet from y≈0 to 0.403 without Jump. The ramp is overhead. Evidence: `assist.json`, `phantom-stair-boost.png` (initial placement on the base is explicit setup; the walk under the ramp is actual movement). Hardcoded ramp transforms also remain in `PhysicsCourse.tsx:64,121`. **Accept repair:** derive ramp/collider data from the canonical course configuration and movement assistance from actual walkable support/contact. Both stair directions must keep working; walking the base must not launch the player. T05 geometry edits must not require hidden coordinate edits in the controller.

### Independently verified repairs

- **Continuous traversal now genuinely passes:** 21/21 semantic assertions in `traversal.json`. One uninterrupted simulation runs Start→Work→Explorations→Résumé, earns all sensors in order, and stands on the actual final roof at y≈4.199. Zero setup calls, same rigid body, no PlayerController placement/respawn calls after entry, and no automatic navigation. Explicit final action emits `/resume` and exits cleanly. Framework transform synchronization is distinguished from player placement calls. Final capture inspected: `continuous-final-roof.png`.
- Original findings **1, 2, 3, 4, 5, 7** are resolved for their reported behavior: sensor exclusion/no airborne re-jump; final route; natural checkpoint continuity; stair traversal in both directions; unmount scroll/input/mode cleanup; touch landscape/rotation. Findings **6 and 8 remain partial**, as above; the stair assist introduces the additional defect.
- Asserted browser checks also pass live camera follow, same canvas/body across theme/mode, one movement-input owner, preview physics preservation, all four public-action-selected checkpoint resets and forced falls, real two-touch movement/jump/release, individual/all cancellation, blur clearing, and phone coyote/buffer behavior. Phone timing uses 390×844; an earlier desktop software-rendered probe missed the 120ms sampling window and is not a performance or timing acceptance claim.
- Typecheck and targeted Vitest **38/38 pass**. Latest browser cases total **57 passing / 7 failing assertions**, with failures representing the three issues above (the stair defect is exercised twice). No page errors. Production build/full integrated E2E not run; visual finishing remains excluded.
- The external checkpoint-placement effect (`PlayerController.tsx:72–99`) is test-specific, but no natural-arrival teleport was reproduced. New recovery fixtures select via `reachCheckpoint` then explicitly reset, rather than depending on raw setState placement.

### Evidence quality and next action

The author's “14/14 PASS” and full-traversal/focus-restoration claims overstate the saved diagnostic results. Preserved author traversal ends at cp-explorations; isolated Résumé ends on step 2 at y≈3.65, not the 4.2 roof; focus says BODY. The old driver mostly records `step()` snapshots and accepts drive timeouts/arrived=false without failure. These observations were never a test-suite pass. Correct the worker report and retain meaningful assertions for the actual requirements.

Separate evidence/author snapshots: `.agent-runs/T04-rereview-30f6bdf/`; asserted driver/harness: `.agent-runs/rereview-t04.{mjs,tsx,html}`. Reproduce failures on port 3004 with `node .agent-runs/rereview-t04.mjs visibility`, `lifecycle`, or `assist`; passing cases include `traversal`, `ground`, `state`, `mobile`, `spawns`, `timing`, and the four stair-direction checks in `stairs`. Setup and synthetic visibility fixtures are labeled. The author's existing port-3004 server was reused and left running; this review owns no server.

**Exact next action:** coordinator returns these three repairs plus report/assertion corrections to original owner `29765d14`; request a fixed SHA and independent re-review before integration/T05. Only this review report is a non-ignored dirty path. No implementation/state changes or nested agents.
