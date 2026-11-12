# Portfolio-wide grid

Implemented in the local master working tree based on `665d31d`. All eight routes use the landing page's outer frame, shared gutters and cell padding, square edges, and charcoal/concrete/lime palette. Split sections align to a common column boundary on desktop and stack with horizontal rules at narrow widths. Projects uses a full-width FastCode feature and a pair of supporting panels. Case studies share a layout for technical artwork, narrative, and results. Résumé aligns experience with education and skills and gives the three project links equal columns. About aligns profile with its illustration and education with areas of focus. The 404 uses the same split with a large error code.

Changed shared styles in `src/styles/portfolio-grid.css`, `home-grid.css`, and `projects-index.css`; updated route markup in `src/pages/` and the shared case-study template. Existing project folder motion, benchmark animation, résumé downloads, and click-to-play Parkour Game passed browser checks.

## Evidence

- [Desktop dark](../../../design/verification/site-grid/desktop-dark.jpg) and [desktop light](../../../design/verification/site-grid/desktop-light.jpg), captured at 1440 × 900.
- [Mobile dark](../../../design/verification/site-grid/mobile-dark.jpg) and [mobile light](../../../design/verification/site-grid/mobile-light.jpg), captured at 390 × 844.
- Production build and 88 unit tests passed. The desktop/mobile browser suite had 33 passes and one desktop-only check skipped on mobile. The extended route test had eight passes across 1585, 768, 390, and 360 px viewports. It checked all frame widths and horizontal positions against Home in both themes. The existing integrated tests regenerated their T08 screenshots. The production build reports the existing deferred game-chunk size warning.

Next action is owner visual review at `http://localhost:3176/`. Open Projects, Résumé, and About from the navigation and compare the panels and mobile reading order using the preview sheets.

## Preview recovery

The open in-app tab retained a partial layout after Vite reported failed hot reloads for HomePage and PortfolioPages. A full reload at the existing preview URL restored the shared stylesheet. Verified the one-pixel frame, the two-column grid at the tab's 959 px viewport, and navigation through Projects, Résumé, About, and back to Home. The tab was left on Home. Next action if this recurs is to reload the tab and, if the layout remains broken, capture the URL and the current console error before editing source.
