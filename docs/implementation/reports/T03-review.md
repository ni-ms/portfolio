---
kind: review
title: "T03 independent review"
---

Status: **REQUEST CHANGES**. Reviewer: `43c541ce-dffe-45b7-90f6-3ea2e84e1fe4`, 2026-11-08.
Reviewed: `78c225d..7d4c7a2`, branch `codex/portfolio-T03-pages`, this worktree. Source/state remained unchanged. Applied `traycer-review`; no delegation.

## Confirmed findings, in priority order

1. **[P1/R1] Essential text fails contrast in both themes.** `src/styles/pages.css:146` leaves Home's role at concrete `#C8CAC7` on light page `#F2F1EA`: **1.46:1**. The same mistake affects project subtitles and résumé headline; employers, academic institutions, project categories and OpenCV label are **1.31:1** on light surfaces. `.benchmark-qualifier` at line 1118 uses dim text at **2.83:1** in dark mode; project dates also measure **2.60:1**. Thus essential facts and the required workload limitation become difficult to read. Repair: use semantic text/secondary colors for readable copy, retaining concrete for illustration materials. Acceptance: settled computed colors reach at least 4.5:1 for normal text in both themes, including every benchmark label/qualifier and employer/school. Preserve charcoal labels on lime buttons.

2. **[P1/R2] Home cannot compose into the approved desktop hero.** `HomePage.tsx:19–54` and `pages.css:104–225` make identity, oversized slogan, and bordered full-width game sequential rows. At 1585 px the name is **25.6 px**, slogan **67.2 px**, and game starts around y=589; selected projects fall below the initial viewport. The eyebrow repeats the name. `ProjectCard.tsx:59–77` adds subtitle, result box and every tag on Home, followed by another background panel (`HomePage.tsx:138`). Repair: dominant name beside the tiny placeholder, short role/introduction/degree and résumé/about actions on the left; reserve the game on the right without a boxed frame. Give Home compact image/name/one-sentence project previews; remove the extra background panel. Acceptance: compare both Home references at 1585×992 and 1440×900; preserve that hierarchy when stacking on phones. Game/world implementation remains deferred.

3. **[P2/R3] Page CSS changes the shared approved palette.** `pages.css:1969–1971` globally replaces `--color-accent` with forest green `#2e7d32`, affecting header navigation/emblem and all consumers. Other overrides substitute different greens for chart/highlight lime. Repair: remove the global token override; keep `#D6FF64` accents and use charcoal text with lime decoration in light mode. Acceptance: both themes retain the approved palette across shared navigation and pages; coordinate any shared-file changes with the coordinator.

4. **[P2/R4] New public copy bypasses factual authority.** `ProjectMetrics.tsx:103` asserts production trace provenance absent from JSON/DOCX and publishes “without fictional customer counts.” `scottypi-pipeline.svg:104` prints “No fabricated metric scores.” `fastcode-architecture.svg:51,87` adds unsupported alignment/FLOPs-per-cycle specifics; these are absent from both factual sources. `AboutPage.tsx:111` invents an always-open opportunities/collaboration statement. Repair: remove internal verification language and unsupported claims, render the supplied service/dashboard facts, and use neutral contact wording. Acceptance: every factual project/availability assertion traces to approved content; no implementation/provenance instructions appear as portfolio copy.

5. **[P2/R5] Inner-page composition does not implement the approved pairs.** Confirmed sequentially against each dark/light reference:
   - `ProjectsPage.tsx:18–35`, `pages.css:638`: three equal dense cards replace the featured FastCode image/copy row and two supporting projects. Restore that hierarchy and concise stack/outcome treatment.
   - `ProjectDetailTemplate.tsx:44–95`: stacked heading/tags and full-width schematic replace the split copy/illustration hero and small identity/photo. Restore the approved hero and nearby problem/approach/results composition; adapt the template to ScottyPi/Langmetric.
   - `ResumePage.tsx:59–165`: sequential boxed sections and **54 skill pills** replace experience beside education/grouped text skills. Restore the page heading/photo, compact two-column desktop structure, selected-project links, and readable grouped skills; keep full detail in the real download.
   - `AboutPage.tsx:11–145`: missing prominent About heading/architectural visual, separated academic cards and large contact-card grid replace the approved split introduction/focus and compact contact area. Restore that composition and résumé action.
   Acceptance: inspect each corrected page pair sequentially at desktop and narrow sizes; retain factual employer/client distinctions, expected degree and research status.

6. **[P2/R6] Standalone SVG gradients render black.** The three `public/images/projects/*.svg` files use JSX `stopColor` instead of SVG `stop-color` (e.g. FastCode lines 4–13). Chromium computes **every stop as rgb(0,0,0)**, including the optimized mini-bar; the light theme also reuses black diagram panels. Repair serialization and provide theme-appropriate conceptual illustrations with useful thumbnail-scale detail instead of dense miniature UI/text. Acceptance: rendered gradients show their intended colors and project imagery remains coherent/readable in both themes.

## Verification and handoff

PASS: `npm run typecheck`; `npm test` (63/63). Reviewer browser sweep: **96 route/theme/viewport states** at 1585×992, 1440×900, 390×844, 360×740, 768×1024, 844×390; no page errors or viewport/text overflow. Direct routes/404, card navigation, history/reload, main/contact focus, mobile menu, dark default, light persistence and genuine PDF download passed. DOM benchmark widths accurately represent 539/684; 21%, ~91%, qualifier, ScottyPi corpus/evaluation facts and absent repository are preserved.

Evidence: supplied `design/verification/T03/`; current ignored `.agent-runs/T03-review/{measurements.json,svg-rendering.json,*.png}`, `.agent-runs/T03-review.log`; reproducible diagnostic `.agent-runs/review-t03.mjs`. All five approved page pairs were inspected sequentially. Native Playwright supplied exact sizes because in-app viewport sizing was rejected at current zoom.

The worker capture script only waits for `#main-content` and conditionally toggles before saving images; it asserts neither fidelity nor contrast. SSR string tests also miss these failures. Repairs need browser assertions for settled contrast/geometry plus visual inspection, with refreshed report/evidence. Production build/e2e/root App wiring and gameplay were not reviewed as completed integration.

Dirty scope: only this new, untracked review report; browser harness/evidence are ignored. Reviewer tab closed and harness shell `05b8bd11` stopped. Exact next action: coordinator `328379e6` returns R1–R6 to original pages owner, then requests re-review of the repair commit and refreshed captures before acceptance/integration. Deliver this report through explicit REVIEW using responseId `93ef92cc-0718-4a87-8f0a-88faa7128218`.
