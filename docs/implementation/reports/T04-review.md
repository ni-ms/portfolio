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
