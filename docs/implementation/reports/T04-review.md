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


## Bounded re-review of e9c4ee3 — production request changes

Reviewed frozen production source `e9c4ee38a7955721756b2069dc5ad593eb0293b9`; concurrent test-only commit `6673ffb` does not change that source. Before/after SHA-256 manifests match for every src file. No production, test, package or state edits by reviewer.

**Production verdict: one P2 controller defect remains.** The previous visibility and focus blockers are accepted; the base-under-ramp failure is fixed. Canonical assistance still applies the wrong direction on the Résumé ramp.

### Remaining P2 — Downhill movement on Résumé receives an uphill launch

`src/game/PlayerController.tsx:197–212` iterates every canonical ramp but applies positive vertical velocity whenever `targetVz < −0.1`. That direction ascends Start/Exploration; it descends the differently oriented Résumé ramp. The actual Résumé support ray returns normal approximately `[0, 0.850, −0.527]`, so negative-Z movement should descend, not add upward velocity.

In a valid isolated Résumé ramp fixture, Forward with no Jump raises feet **3.689→4.145** and changes vertical velocity to **+2.507**. A second probe selects/resets to the valid Résumé roof, then actually walks onto the ramp: Forward again reverses a downward velocity into +2.507 and raises the player. The walk uses no position setup or Jump after the explicitly labeled checkpoint-reset fixture. This is a controller/contact-direction defect, not a visual-finish judgment.

Evidence: `.agent-runs/T04-rereview2-e9c4ee3/resume_ramp_direction.json`, `resume_ramp_access.json`, and inspected `resume-ramp-actual-access.png`.

**Repair acceptance:** derive uphill direction/vertical assistance from canonical ramp orientation or the actual support normal and horizontal movement. Downhill movement must not receive positive climb assistance. Retain both stair-direction passes, the flat-base no-boost test, and the earned full-course traversal. Add a regression for the rotated Résumé ramp; rerun `resume_ramp_direction`, `resume_ramp_access`, `stairs`, and `traversal` before re-review.

### Accepted production behavior and verification

- **Original 64 semantic assertions now pass independently.** Continuous Start→Work→Explorations→Résumé traversal remains **21/21**, reaching the actual final roof with earned checkpoints, zero setup calls, one body, no mid-route PlayerController placement/respawn calls, and explicit navigation only.
- The formerly blank expanded mobile scene at page scroll 500 now renders and responds to movement. Partially visible preview renders; below-fold preview suspends. Document-hidden suspension preserves position/velocity once paused; document-visible and layout-only intersection changes resume the same simulation. These document signals are synthetic fixtures, not an OS background-performance measurement. The current overlay capture was inspected: `visible-overlay-active.png`.
- Connected Play focus restores; Tab trapping, scroll restoration, unmount cleanup and route focus cancellation pass. The destination-focus assertion runs after unmount commits, matching router focus timing, and verifies restoration cannot steal focus afterward.
- Actual ramp support fixes the old phantom boost from the flat base. Both Start and Exploration stairs work up/down without Jump. Measured two-touch move/jump/release/cancellation, landscape/rotation, live camera, same canvas/body through themes/modes, one movement owner, grounding/jump-edge/coyote/buffer, all four selected checkpoint resets and forced falls pass. Five additional ordinary R-key reset trials also pass.
- Additional focus/visibility/reset checks pass; the two new direction checks fail and describe the single defect above. Current totals across 15 asserted cases: **77 pass / 2 fail**, no page errors. Assertions were inspected, not inferred from case completion or recordings.
- Full `npm run typecheck` passes after the concurrent test-only repair; source-only TypeScript and **38/38 targeted units** pass. Build/full integrated E2E not run here.

Fixture timing corrections are retained transparently: immediate hidden-state capture initially included one in-flight physics step; final assertions first require actual paused/never state, then require stable transform/velocity and successful resume. Selected-checkpoint fixtures await the rendered selection before R; the airborne drop is placed before a physics step. Initial probes remain saved alongside the final results; no production assertion was weakened or production code altered for them.

### Tracked test defect is separate

At e9c4ee3, tracked fixture URL hardcoded port 3004 and an ignored .agent-runs HTML file, project-name early returns falsely counted unexecuted work as passes, and mobile did not measure motion. Those tests were not durable evidence. Coordinator reports test-only `6673ffb` replaces them with tracked fixtures, relative paths, explicit skips and measured input assertions; its integrated E2E rerun remains coordinator-owned. This review does not claim independent approval of that separate fixture changeset or 12 executed passes.

### Evidence and exact next action

Separate asserted driver/harness: `.agent-runs/rereview2-t04.{mjs,tsx,html}`; results, preserved initial probes and source manifests: `.agent-runs/T04-rereview2-e9c4ee3/summary.json` and sibling files. Existing worker-owned port-3004 server was reused and left running. Production source still matches e9c4ee3; HEAD's only intervening commit is the test repair. Reviewer report is the only non-ignored dirty file.

**Next:** original owner fixes the one uphill-direction defect; coordinator retains the successful visibility/focus/base/traversal results and completes separate durable-fixture validation. Request a fixed production SHA and bounded re-review before integration/T05. No nested agents or state edits.


## Single-finding re-review of 0cfb079 — request changes

Reviewed `0cfb079e0d524f89ac36d856ced0906617087f77` over test baseline `6673ffb`, correlation `T04-rampfix-0cfb079`. Scope was only ramp-assist direction and its Start/Exploration/base regressions. Prior accepted visibility, focus and continuous-route results remain accepted and were not rerun. Production source, tests and state were not edited; all src SHA-256 hashes match before/after.

**P2 remains: the new Résumé vector disagrees with the actual collider.** `src/game/courseConfig.ts:125–139` sets `uphillDirXZ=[0.7071,-0.7071]` from Y rotation alone. Applying the complete configured XYZ rotation to local top normal `[0,1,0]` gives `[0,0.84990044,-0.52694330]`; the live Rapier support ray independently returns the same normal. Consequently actual uphill is **+Z**, downhill is **−Z**, and X crosses the slope. The negative X tilt and Euler rotation order matter. `PlayerController.tsx:212–215` therefore still assists downhill and now also launches across the slope.

Confirmed in the actual component:

- From an explicitly selected/reset Résumé roof, walk to `[5.0,3.95]` without Jump or position setup after that fixture. Actual support is `resume-stairs-ramp`; Forward raises feet **3.742→3.967** while moving −Z. `resume_ramp_access.json` fails `actual-downhill-walk-no-upward-launch`; inspected capture: `resume-ramp-actual-access.png`.
- Additional isolated fixtures record the real controller's `setLinvel` calls without changing their arguments. While the same ramp supports the player, Forward changes requested Y from **−0.138 to +3.67692**; Right across the slope does the same. Backward along actual +Z uphill receives no controller assist (requested Y initially stays −0.138). Contact physics still raises the player while walking +Z; this review does not claim that segment is impassable. See `resume_vectors.json`.
- Start/Exploration up/down and their base regression pass **5/5**. Résumé flat-base support is `ground-slab`, with no boost under Forward+Right (**2/2**). The support/elevation guards remain effective.

`npm run typecheck` and targeted Vitest **45/45 pass**. The seven added unit tests assert the supplied direction and dot products, including that −Z should assist; they never compare against the transformed collider normal, so they encode the same error (`tests/course.test.ts:180–211`). Replace that expectation with an independent full-transform/support-normal regression. No build or integrated E2E rerun was in this scope.

Evidence: `.agent-runs/rampfix-t04.mjs` imports the preserved actual-component harness `rereview2-t04.{html,tsx}`; results/source manifests in `.agent-runs/T04-rampfix-0cfb079/summary.json` and siblings. Five cases record **15 pass / 5 fail**, with the five failures all exposing this one direction mismatch; no page errors. The old desktop wall-clock isolated probe passes after sliding out of the assist bounds before the input frame, so it is explicitly **not** acceptance evidence. The actual roof walk and controller-frame probes establish the failure independently. Existing worker-owned port 3004 was reused and left running; this review owns no server.

**Verdict: REQUEST_CHANGES for the same single P2.** Derive assistance from the complete canonical collider orientation or actual support normal: for an upward normal `n` and horizontal movement `v`, signed rise follows `−(n.x*v.x+n.z*v.z)/n.y`. Require no positive assist downhill or across the surface, and positive assistance uphill. Do not assume the checkpoint-facing diagonal is uphill on this collider. Rerun `node .agent-runs/rampfix-t04.mjs resume_ramp_access`, `resume_vectors`, `stairs`, and `resume_base` after the original owner repairs it, then request bounded re-review before integration/T05.


## Single-finding re-review of eed0ed3 — production approve

**APPROVE the bounded production ramp-direction fix** in `eed0ed38bb8fa4f710b1926f389e65f3e683ec43` (actual parent `0cfb079`, over test baseline `6673ffb`), correlation `T04-rampfix-eed0ed3`. No remaining production blocker in this assigned scope. Prior accepted visibility/focus/full-route results were preserved and not rerun. Source, tracked tests and state remain untouched; all src hashes match before/after.

`PlayerController.tsx` now obtains the actual non-sensor support normal with `castRayAndGetNormal` and derives signed rise from it. The original support/elevation/input guards remain, with a positive-normal-Y denominator guard. Live controller-frame captures confirm:

- Forward/downhill −Z, Right/across +X, and Forward+Right/+X−Z receive no positive assistance. For Forward, requested Y stays **−0.138** instead of becoming +3.677; the diagonal likewise preserves its existing downward velocity.
- Actual +Z uphill receives requested Y **+3.224** from a preceding −0.297, matching the live normal's rise at speed 5.2. The player moves from the isolated ramp fixture at feet y≈3.79 to y≈4.39 with no Jump.
- The actual roof→ramp walk uses no position setup or Jump after the explicitly labeled checkpoint-reset fixture. Forward now descends **3.781→3.513**, with downward final velocity −2.692. Its formerly failing assertion passes; current capture `resume-ramp-actual-access.png` was inspected.
- Both Start/Exploration stair directions and their base regression pass **5/5**. Résumé's actual `ground-slab` support underneath the ramp receives no boost under Forward+Right (**2/2**).

**Nonblocking P3 cleanup remains in obsolete configuration/test claims.** `courseConfig.ts:31–43,137–139` still describes `[+.7071,−.7071]` as Résumé uphill, and `tests/course.test.ts:180–211` still says −Z assistance is correct. That vector is unused by production after this repair. Its independent collider-consistency assertion deliberately remains failing; these unit tests cannot substantiate the new algorithm. Remove/correct the unused field and replace the obsolete expectations with meaningful normal-based coverage. Also correct the assignment's arithmetic: for this normal, +X/−Z gives negative rise, as observed; actual uphill is +Z.

Evidence: ignored `.agent-runs/ramp-normal-t04.mjs`, importing the preserved actual-component `rereview2-t04.{html,tsx}`; `.agent-runs/T04-rampnormal-eed0ed3/summary.json` and sibling results/manifests. **17/17 runtime assertions pass** across four cases. Including the separately retained configuration checks, totals are **19 pass / 1 fail**, with that sole failure the unused Résumé vector mismatch. No page errors. Full typecheck and **45/45 targeted units pass**; the unchanged obsolete vector tests are qualified above. Build/integrated E2E/full-route re-execution were outside this bounded scope.

Reproduce: `node .agent-runs/ramp-normal-t04.mjs resume_vectors`, `resume_ramp_access`, `stairs`, or `resume_base`. The first intentionally exits nonzero for the stale unused vector even while every runtime assertion passes. Existing worker-owned port 3004 remains running; reviewer owns no server. Only the review report is a non-ignored dirty path.

**Next:** coordinator may integrate the accepted production fix, complete its separate durable-fixture validation and release T05 under the normal ticket protocol. Assign the obsolete config/test cleanup to the owner; no further production repair is required for this finding. No nested agents, code/state edits or integration by reviewer.
