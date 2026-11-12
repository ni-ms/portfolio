# Projects mockup comparison

Local `master`, based on `665d31d`. The changes apply to the Projects index. The existing Home project previews, case-study artwork, and game implementation remain on the baseline.

- Extracted the six artwork regions from the approved Projects dark and light mockups. Each JPEG contains just the illustration. The FastCode crop is 562 × 450 and the two supporting crops are 460 × 235. The browser fetches the current theme's art, with the featured asset prioritized and lower images loaded lazily.
- Matched the desktop gutters, featured split, artwork proportions, headline scale, benchmark callout, section rules and supporting grid. At phone width the featured artwork precedes its copy and the remaining projects stack in a single column.
- The desktop evidence uses the 1036 px reference width and compares the approved raster to the implementation in each theme. There is no approved phone mockup, so the 390 × 844 evidence compares the old and new rendered pages. The content and controls are live HTML, so font rendering and exact line breaks can differ from the reference.

## Evidence and next action

Review the four labeled [side-by-sides](../../../design/verification/projects-fidelity/). Then confirm the Projects page visually before applying the treatment to another route or proceeding with game work.

Verification passed in Chrome for both themes at the 1036 px reference and 390 px phone widths, including artwork decode, no horizontal overflow, and no mounted canvas. All 18 existing route and motion browser checks passed at 1585 × 992 and 390 × 844. Type checking, 88 unit tests, and the production build passed. Vite still reports its existing large game-chunk warning. Changes are in the local `master` working tree for review.

## Navbar and GSAP polish

The shared navbar uses one inset divider, a consistent height across routes, and a desktop active indicator that GSAP moves between links. The indicator follows font and viewport changes. Reduced motion uses the active link's static CSS underline.

Projects has a short entrance timeline for the heading and featured artwork. Supporting cards reveal once as they enter view. GSAP media scopes revert their transforms and scroll triggers on route changes and when reduced motion changes. Shared page motion now has one owner, removing the duplicate Home timeline. The router retains landmark and fragment focus behavior, with the visible landmark outline reserved for the skip link.

The refreshed comparisons show the resting state. For motion review, open `http://localhost:3176/projects`, scroll to ScottyPi and Langmetric, and switch between Projects and About using the desktop navbar. The next action is owner review of this local master working tree.

Final polish verification passed type checking, all 88 unit tests, and the production build. Installed Chrome passed 31 desktop and mobile browser checks, with the desktop-only indicator check skipped on mobile. The new checks sampled intermediate underline positions, verified the static reduced-motion selection, and exercised scroll reveal and route return.

## Layered project reveal and click-to-play game

The two supporting cards start overlapped on desktop and unfold into their original grid as they enter view. At narrow widths, each card rises out of a folder tab as it enters view. Keyboard focus settles the card immediately. Reduced motion uses the settled layout. ScrollTrigger is a separate chunk requested by Projects.

Home starts with a 960 × 390 artwork crop from the approved theme mockup (approximately 116 KiB dark and 107 KiB light). The Play click checks WebGL support and requests the lazy GameStage bundle. It enters play when the scene and physics are ready, inline on desktop and expanded on touch layouts. Exiting removes the canvas and restores focus to Play. Navigating away during a pending import cannot open the game on the next page. The game geometry, physics, and asset files stayed as they were.

Production network capture in Chrome with the cache disabled confirmed zero game bundle and 3D asset requests before Play at 1585 × 992 and 390 × 844. After Play, the game JavaScript and four 3D assets transferred about 4.0 MB of response bodies combined. On this Mac, controls and canvas appeared in about 1.5 seconds after Play in both viewport runs. This is a localhost measurement with laptop hardware, not physical-phone or public-network performance. The main entry script is now 115.25 kB gzip, down from 137.96 kB in the prior build.

Type checking, 88 unit tests, the production build, and 35 focused desktop and mobile browser checks passed. The viewport-specific checks that do not apply were skipped. The tests cover real desktop card overlap, reduced motion, no eager game request, one-click entry, exit, navigation during load, context loss, and load rejection. [Folder sequence](../../../design/verification/projects-fidelity/folder-sequence.jpg) · [Home poster at phone width](../../../design/verification/projects-fidelity/home-before-play-mobile.jpg)

Next action: review `/projects` by scrolling past FastCode, then open Home and select Play. If reducing time to play is the next priority, measure on a physical phone and optimize the game bundle and HDR download separately from the initial page.
