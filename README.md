# Nikhil Sharma portfolio

Existing personal portfolio built with Vite, React, TypeScript, React Three Fiber, Drei, Rapier, and GSAP. The current app is a single-page parkour portfolio; the approved redesign adds dedicated pages, real résumé content, a more detailed playable world, and dark/light themes.

## Start the redesign in Traycer

1. Open this repository as a workspace.
2. Select a coding agent with image inspection, terminal, and browser capabilities. Suggested model: GPT-6.1 Sol with High reasoning if available; use a stronger model for difficult game/rendering work when needed.
3. Paste [TRAYCER_PROMPT.txt](TRAYCER_PROMPT.txt) into a Traycer Chat agent.
4. The agent reads [TRAYCER_HANDOFF.md](TRAYCER_HANDOFF.md), the coordination protocol, and the active ticket. A separate speculative planning cycle is unnecessary.

The handoff supports native A2A delegation, scoped tickets, worktree isolation, incremental integration, independent review, compact reports, and session recovery. Availability depends on the installed agent and Traycer configuration.

## Necessary references

- [Approved dark and light mockups](design/mockups/current-theme/): five matched page pairs, green accents only.
- [Factual portfolio content](docs/portfolio-content.json).
- [Original résumé source](design/source/Resume_Nikhil_Sharma_2026-11.docx), retained for detailed content and PDF export.
- [Task index](docs/implementation/TASKS.md), [execution state](docs/implementation/state.json), and [current progress](docs/implementation/PROGRESS.md).
- [Agent coordination and context protocol](docs/implementation/AGENT_PROTOCOL.md).

No portrait has been supplied. Keep a small neutral photo placeholder beside the name.

## Local commands

~~~sh
npm ci
npm run dev
npm run typecheck
npm test
npm run build
npm run test:e2e
~~~

The development server uses port 3000. Install dependencies only when missing or changed.

## Handoff helper

~~~sh
node scripts/traycer-handoff.mjs check
node scripts/traycer-handoff.mjs status
node scripts/traycer-handoff.mjs packet T01
node scripts/traycer-handoff.mjs prompt
~~~

The helper validates the handoff and prints bounded context packets. It does not start agents, call an API, change provider settings, or control context windows.

## Current state

Only the handoff, references, and repository cleanup have been prepared. Application source is unchanged. Before the redesign, the baseline has 43 passing unit tests and a passing TypeScript check; rerun checks on the execution checkout. Existing browser assertions still describe the old placeholder UI and must be migrated alongside the redesign.

Superseded mockups and old reference screenshots were removed. Keep fresh verification images under design/verification/; they are generated evidence rather than approved design inputs.
