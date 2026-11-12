# Mockup content and main branch integration

## Scope

Integrate the routed portfolio from `traycer/portfolio-noble-walrus` at `b89ebc3`, the tested rooftop asset prototype, and this content revision into local `master`. The older open checkout and alternate worker draft contain separate work and remain in their worktrees. The T02–T07 implementation patches are already represented in the integrated branch.

## Visible content

- Home uses the approved introduction, “About me” link, and one sentence per project. The project cards link directly through their titles.
- Projects uses the mockup title, introduction, feature order, descriptions, result callouts, and project links. Removed the added employment callout and duplicated technical labels.
- Project detail follows the FastCode mockup's title, short explanation, problem, approach, and measured result. Each other project follows the shared structure with its own content. ScottyPi describes the actual evaluation setup without invented scores.
- Résumé shows the role and location once, keeps both downloads and employer/client distinctions, and puts selected projects and research after experience, education, and skills.
- About uses the approved two paragraphs, current and previous education, three areas of focus, and direct contact links.

See [browser captures](../../../design/verification/mockup-copy/) and [rooftop notes](rooftop-asset-prototype.md). The captures are implementation evidence, not mockups. The conceptual SVGs and stylized playable rooftop still differ from the architectural illustrations in the approved designs.

## Verification

Type checking, 88 unit tests, and the production build passed. The game bundle still triggers Vite's large-chunk warning. All 18 targeted browser checks passed in installed Chrome at 1585 × 992 and 390 × 844. Coverage included both themes across the seven routes, résumé download, FastCode benchmark, link behavior, and reduced motion.

## Next action

Run the site from the local `master` checkout. Review the desktop and mobile captures against the approved mockups before taking on any further game or artwork changes.
