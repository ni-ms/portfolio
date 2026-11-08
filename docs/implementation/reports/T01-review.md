---
kind: review
title: "T01 independent foundation review"
---

# T01 review

Status: **REQUEST_CHANGES** for reviewed commit `c2c37fff9c009cb7f9e775a86bb3affbcab3d539`, diff from `36ecdb2`. Reviewer: `5c9b23f7-27b7-45ce-920c-550b401aaf66`. Branch: `traycer/portfolio-noble-walrus`; worktree: `/Users/nikms/.traycer/worktrees/ni-ms__portfolio/traycer-portfolio-noble-walrus-273de57204f9`. CONTRACTS.md revision 1. Code/state read-only; this report is the reviewer's only written file.

## Findings

Locations refer to the reviewed commit, before coordinator repairs.

1. **P2 — Close the mobile modal when history changes the route.** `src/App.tsx:9` retains `menuOpen` independently of route/history changes; `src/App.tsx:14` only closes through the menu callback. At 390×844: `/projects` → open menu → About → reopen menu → browser Back. The URL/content becomes `/projects`, but the dialog remains visible, `body.scroll-locked` remains set, and `src/routing/Router.tsx:27` focuses the main behind `aria-modal="true"`. Close the modal for committed navigation/popstate, release its trap/scroll lock, and ensure cleanup does not steal the new route's focus. Add this exact mobile regression.

2. **P2 — Focus the fragment destination instead of always focusing main.** `src/routing/Router.tsx:27` overrides the destination after the hash scroll at line 25. Direct `/#contact` scrolls to the real Contact section, but focus is `main-content`; the next Tab selects the Home “VIEW PROJECTS” CTA and jumps back to the top. The same router behavior will affect the required `/about#contact`. Focus a resolved fragment target, making a section programmatically focusable if necessary, with main as fallback. Verify the next keyboard step remains at the intended destination.

3. **P2 — Preserve scroll position on Back/Forward.** `src/routing/Router.tsx:26` scrolls to zero for every navigation, including `popstate`. At 1440×900 with reduced motion: Home Contact position `scrollY=2956` → footer Résumé → Back returns Home at `scrollY=0` (document height 3856). Track navigation intent and restore history positions after route content mounts; keep top reset for fresh page navigation and fragment positioning for explicit hashes. Add a long-page Back/Forward check.

4. **P2 — Guard malformed fragment decoding.** `src/routing/Router.tsx:25` calls `decodeURIComponent` without handling invalid escapes. Direct `/about#%E0%A4%A` reproduces an uncaught `URI malformed` page error and leaves focus on BODY. Decode defensively and always complete route focus, including when the fragment is invalid or missing. Add an assertion for no page errors and fallback focus.

## Verification and limits

- Independently passed `npm run typecheck` and `npm test`: 43/43 units. Those committed tests cover static markup/game logic; the reviewed commit contains no permanent theme/router browser test.
- Local Playwright/Chromium probes passed mobile menu-link navigation, modal closure/scroll unlock for ordinary clicks, Back/Forward route/title/main-focus changes, light toggle/reload persistence, direct detail routes, trailing-slash About, and a direct 404.
- With light OS preference and all external app scripts blocked, the inline prepaint initializer sets dark/color-scheme dark even when Storage getters throw. With the app enabled and getItem/setItem throwing, rendering and in-memory light toggle work; reload returns dark.
- The four findings above were reproduced against real rendered pages. The original mobile test timeout was a locator mismatch: numbered menu links had accessible names such as “02 Projects”; it was not a failed menu open.
- Production build evidence was inspected in `.agent-runs/T01-build.log`; build was not independently rerun. Host rewrite requirement is documented in CONTRACTS.md. No deployed-host refresh or visual/game redesign acceptance is claimed.

## Recovery and exact next action

Coordinator was notified as each finding was validated and is preparing repairs. At report time its dirty paths include `src/App.tsx`, `src/components/MobileMenu.tsx`, `src/routing/Router.tsx`, and untracked `tests/e2e/foundation.spec.ts`; these are not part of the reviewed SHA and this verdict does not accept them.

Next: coordinator resolves findings 1–4, commits focused regressions (including fragment keyboard focus and long-page history scroll), runs `npm run test:e2e -- tests/e2e/foundation.spec.ts`, `npm run typecheck`, `npm test`, and `npm run build`, then requests review of the repair commit before marking T01 integrated. No code or state repair belongs to this reviewer without a new assignment.

## Repair re-review — e5b4940

Current verdict: **APPROVE** for `e5b494004e0711ff20374cad079786d32b8747ab`. All four original blockers are resolved. This bounded pass reviewed the repair diff and permanent regressions; it did not reopen the deferred page/game audit.

- Finding 1 resolved: App closes the modal on committed navigation/popstate with a stable close callback. The original 390×844 Back sequence now removes the dialog, releases scroll lock, and leaves focus on the new main.
- Finding 2 resolved: the router focuses the resolved fragment target, adding a temporary tabindex when necessary. Direct `/#contact` focuses Contact and the next Tab remains in Contact.
- Finding 3 resolved: per-history-entry positions restore the reading position. Independently repeated the original unfragmented Home → footer Résumé → Back sequence: `scrollY=2956` before and `2956` after. Forward restores Résumé to zero with main focus.
- Finding 4 resolved: malformed fragment decoding is guarded. `/about#%E0%A4%A` reaches main focus without page errors.

Independent validation: `npx playwright test tests/e2e/foundation.spec.ts` **PASS 20/20** across 1585×992, 390×844, 360×740, and 768×1024 (19.4 seconds). Additional inline Playwright probes repeated all four original sequences and Forward restoration; all passed with no page errors. Coordinator reports passing typecheck, 43 units, and production build; those commands were not repeated during this bounded re-review.

Working tree was clean at review start. Only this report was appended by the reviewer. Exact next action: coordinator records T01 as integrated at the approved repair SHA and releases dependency-ready T02/T04 using CONTRACTS.md revision 1. No unresolved blocker remains within this review scope.
