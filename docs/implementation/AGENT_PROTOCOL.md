# Agent coordination and context protocol

## Capability discovery

At kickoff discover the installed agent, model, A2A tools, readable images, shell, browser tools, worktree permissions, and native compaction/session controls. Record availability in PROGRESS.md. Use the actual discovered tool schemas. Never invent an A2A endpoint, agent-card server, slash command, or compaction API for this repository.

This workflow uses Traycer's native agent-to-agent coordination. It does not require installing an A2A network service in the portfolio. Use existing MCP connections for necessary browser/docs/filesystem tools if available; do not create servers or request credentials merely to implement a local website. Native provider tools are sufficient.

Prefer Traycer Chat agents for inbox-capable request/reply. Traycer documents that Codex Terminal agents can send but cannot receive A2A messages; do not select that interface for delegated inbox work. If A2A is unavailable, execute the same tickets sequentially in bounded sessions and record that fallback.

## Roles, ownership, and dependency order

One coordinator owns the task graph, contracts, integration, package.json/package-lock.json, root layout/routing, global theme tokens, state.json, and PROGRESS.md. Only this role updates task states or merges/cherry-picks implementation work.

Workers own one ticket, its agreed file allowlist, and docs/implementation/reports/Txx.md. Maximum two coding workers concurrently; maximum four agents total including coordinator and reviewer. No nested delegation by workers without the coordinator's explicit grant. Stop duplicate or idle workers when their work is integrated.

An independent reviewer receives the ticket criteria, exact diff or commit, and relevant evidence; it does not need the entire original transcript. Reviewers do not compete for implementation ownership. The coordinator assigns repairs to the original owner.

Execution waves:
1. T01 establishes shared interfaces and theme/router foundations.
2. T02 content/download and T04 gameplay corrections may run in parallel.
3. T03 pages starts after T02; T05 world fidelity starts after T04. These may run in parallel once their dependencies are integrated.
4. T06 integrates theme, page, and game boundaries plus soft blur.
5. T07 adds coordinated motion after those boundaries stabilize.
6. T08 performs final integrated verification and fixes remaining observed problems.

Do not start a dependent ticket merely because a worker says it is nearly done. Consume its report, review the diff, integrate it, and verify the necessary contract first.

## Worktree and change protocol

Use isolated worktrees when tools and permissions support them. First ensure all new handoff files, factual content, and approved images exist in the worker's checkout: commit the prepared handoff with a scoped local commit or copy the exact inputs explicitly. Never branch an agent from an old commit and assume it sees untracked references.

Use a codex/ branch prefix unless the owner chooses otherwise. Keep a record of branch, base SHA, worktree path, and file allowlist per worker. Preserve unrelated local edits. No blanket git add, reset --hard, git clean, force-push, or deletion of dirty worktrees.

If worktrees are unavailable, use strictly non-overlapping files and explicit ownership messages; run sequentially if overlap cannot be avoided. Workers request shared-file or dependency changes through the coordinator. New component-specific styles avoid concurrent edits to one giant CSS file. Only the coordinator edits dependency inputs and runs dependency installation.

Workers return a scoped commit SHA when supported, otherwise a patch file plus exact changed paths. Integration is serial; rerun checks relevant to the combined result. Resolve conflicts in favor of the approved contracts and intended behavior, not by silently dropping either implementation.

## A2A message protocol

Native messages should be short (normally below 200 words) and use this envelope:

~~~text
kind: ASSIGN | ACK | REQUEST | ANSWER | BLOCKED | READY_FOR_REVIEW | REVIEW | HANDOFF | INTEGRATED
ticket: Txx
correlation: Txx-short-unique-id
owner: role/agent identifier
base: commit SHA and worktree
scope: allowed paths
depends: integrated ticket IDs / contract revision
result: concise facts or requested decision
evidence: paths, commands, exit codes, screenshots, commit/patch
next: exact action and recipient
~~~

Assignments identify objective, allowed files, relevant mockup pair, acceptance criteria, budget boundary, and report location. The worker ACKs scope before editing; if it cannot receive native replies use the documented sequential fallback rather than silently waiting.

A worker sends BLOCKED for a real dependency/capability issue with one concrete remedy, then continues independent authorized work where possible. Do not exchange full file dumps, screenshots as base64, chain-of-thought, or repeated status chatter. Send paths and evidence summaries instead.

A queued send is not proof of receipt, execution, or completion. Check explicit ACK/report/results. Prefer bounded native waits to rapid polling. If an owner fails or becomes unreachable, check its git/worktree/report before reassigning so unfinished changes are not overwritten. Other agents remain accountable for their claimed files until the coordinator releases ownership.

## Context budgets and retrieval

The durable files, git changes, and evidence are the source of execution continuity. Chat history is supplemental.

- Every agent first loads AGENTS.md, this protocol, state.json, and its own ticket; the coordinator also loads the handoff and task index. Do not cat the whole repo or all tickets.
- Use node scripts/traycer-handoff.mjs packet Txx for a bounded packet; it lists needed source/images rather than embedding them.
- Inspect at most the relevant dark/light mockup pair for the active visual task. Generation prompts are provenance and are not execution input.
- Search paths and symbols first, read bounded file ranges, and cap tool output. Save verbose logs to ignored .agent-runs/ files; return the failure excerpt and the log path.
- Do not print package locks, dependencies, generated bundles, image encodings, or repeated complete source files into chat.
- Dispatch workers with the brief, contracts, and scoped facts, not a full inherited mega-transcript when the tool supports a fresh context.
- Work on one substantial ticket per worker session by default. If a ticket grows, split its remaining work into a smaller follow-up with explicit dependency/ownership.
- Checkpoint after meaningful changes, at ticket completion, before image-heavy review, and before every compaction/model/session transition.
- If a reliable context meter is exposed, use 60% as a checkpoint signal and 70% as a fresh-session/handoff signal. These are operational policies, not API settings or guaranteed token limits.
- If no meter is exposed, finish/review one bounded ticket and use a fresh worker for the next; after approximately ten sizable tool calls save a recovery note.
- Use native compaction if actually supported and configured by the host. A prompt cannot enable hidden provider settings. Do not implement Responses API compaction inside the website or build a custom LLM runner.
- Distinguish context exhaustion from account usage/credit/rate limits; preserve state and report the actual issue rather than silently choosing a more expensive model.

## Durable report and session recovery

The coordinator alone updates state.json (pending/in_progress/review/done/blocked), integration SHAs, and concise PROGRESS.md. A worker writes only its own report. Do not mark a ticket done on a claim alone: review and integrate evidence first.

Each ticket report must stay concise (target under 1,000 words) and include:
- Status, owner, branch/worktree, base and result commits or patch path.
- Implemented behavior and exact changed paths.
- Commands run with outcomes; distinguish passed, failed, and not run.
- Screenshot and performance evidence paths where applicable.
- Known issues, unresolved decisions, dirty paths, and remaining work.
- Exact next command/action and prerequisites for another session.

Before a session ends, save this record even if the ticket is incomplete. The coordinator copies the relevant recovery pointer into PROGRESS.md. Keep that file as current state, not an ever-growing transcript; keep it below roughly 150 lines and state.json compact.

Restart procedure: read AGENTS.md, state.json, PROGRESS.md, active ticket/report, and CONTRACTS.md; inspect git status and recorded commits; confirm finished work exists; resume the exact remaining action. Do not rerun the entire discovery/planning loop or redo completed tickets.

## Review, evidence, and completion

Use plan -> implement -> test -> inspect -> repair -> integrate for each ticket. Tests must check actual behavior and supported facts. Existing legacy UI expectations should be migrated, not deleted wholesale or replaced by assertions that only mirror implementation.

Use browser screenshots plus direct interaction for visual and gameplay work. Never claim gameplay works from a canvas-presence assertion alone. Keep one active simulation/input owner, verify live camera follow, and exercise jumps, checkpoint respawn, exit, and simultaneous mobile input.

After applicable checks pass, broaden only for changed risk or unresolved evidence. If browser/WebGL tooling is unavailable, continue code/unit/build work, preserve the exact verification gap, and do not label visual/gameplay acceptance complete.

Do not halt at routine ticket boundaries to ask for approval already covered by the implementation prompt. Respect actual tool permission controls and ask for genuinely blocking scope decisions. Never claim context exhaustion is impossible.

## Official workflow references

These establish tool capabilities, not additional website requirements:
- Traycer A2A: https://docs.traycer.ai/concepts/agent-to-agent
- Worktree isolation: https://docs.traycer.ai/guides/parallel-agents-on-worktrees
- Ticket execution: https://docs.traycer.ai/guides/plan-a-feature
- Official OpenAI documentation on host/API compaction: https://developers.openai.com/api/docs/guides/compaction
