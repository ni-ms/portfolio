# Implementation task index

Read this index once; load individual ticket files on demand. Status is authoritative in state.json. Coordinator updates it after integration/review.

| Ticket | Work | Dependencies | Typical owner | Relevant mockups |
| --- | --- | --- | --- | --- |
| T01 | Baseline, shared contracts, router and theme foundation | none | coordinator | home pair |
| T02 | Real content, links and résumé download | T01 | content worker | resume pair |
| T03 | All portfolio pages and project-detail template | T01, T02 | pages worker | projects/fastcode/resume/about pairs, one pair at a time |
| T04 | Gameplay/camera/checkpoint correctness | T01 | game worker | home pair |
| T05 | Finished 3D world, materials, lighting and quality tiers | T04 | game/world worker | home pair |
| T06 | Integrated Home, soft blur, theme and play lifecycle | T03, T05 | coordinator | home pair |
| T07 | Purposeful GSAP and reduced-motion behavior | T06 | motion worker | active page pair only |
| T08 | Integrated browser, content, game and performance verification | T07 | reviewer + coordinator | all pairs, inspected separately |

Ready parallel work: T02 with T04; then T03 with T05 once their own dependencies are integrated. T06/T07 are integration-sensitive and serial. Review may run alongside unrelated work with no shared writes.

Initial audit findings to verify, not blindly patch:
- App is implemented but still uses one page, generic content, section links and project modals.
- Checkpoint coordinates differ in gameStore.ts and courseConfig.ts.
- CameraRig accepts player data but the current integration does not provide a live player transform.
- Expanded mobile play can mount alongside the preview, and keyboard listeners appear at multiple levels.
- Quality presets are largely viewport-based; postprocessing flags do not establish finished effects.
- Existing browser assertions require old placeholder copy and no portrait; migrate them with the design.
- Baseline observed before execution: 43 unit tests pass and TypeScript check passes. These are not browser/gameplay evidence.
