# Home grid and Parkour Game

Implemented in the local master working tree based on `665d31d`. The owner's reference informed the landing page's square-edged sections, oversized type, and project grid. The portfolio uses its charcoal, concrete, and acid-lime palette and its factual profile and project content. Dark mode remains the default, with a persistent light setting. The small neutral portrait placeholder remains in the profile panel.

The Parkour Game link in the hero goes to the rooftop preview below Selected projects. The section and Play button use the new name. Play requests the game and scene assets, then enters inline play on desktop or the touch overlay at narrow widths. The course and physics are the existing implementation. The hero title uses a short GSAP line reveal with a static layout under reduced motion.

## Verification

- [Desktop dark](../../../design/verification/home-grid/desktop-dark.png) and [desktop light](../../../design/verification/home-grid/desktop-light.png) at 1440 × 900.
- [Mobile dark](../../../design/verification/home-grid/mobile-dark.png) and [mobile light](../../../design/verification/home-grid/mobile-light.png) at 390 × 844. Also checked headline fit and page width at 360 px.
- Production build, 88 unit tests, and 44 Chrome route and motion checks passed. Eight on-demand game tests passed across desktop, tablet, and two phone viewports, including no game requests when following the hero link or hovering Play. Ten applicable desktop and mobile game regression tests passed, including the desktop rerun with scrolling relative to the relocated game. The production build still warns about the deferred game bundle size. Phone layouts and controls were tested in Chrome emulation.

Next action is owner review at `http://localhost:3176/`. Follow Parkour Game from the hero and press Play to review the placement and flow.
