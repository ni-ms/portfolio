# Portfolio slide motion

Implemented in the local master working tree based on `f0d4138`. The shared GSAP timeline now slides in the page's main content blocks over 1.05 seconds with a 48 px vertical offset and a sine ease. ScrollTrigger plays a 52 px upward reveal once for Projects panels as they enter the viewport. The panel borders and column positions stay fixed. The active navigation underline, theme switch, card hover position, and benchmark bar widths are static. Keyboard focus finishes an active slide, and reduced motion leaves the content in its settled position. Parkour Game continues to load on demand.

Changed `src/motion/usePageMotion.ts`, route and component animation targets, related styles, and the existing motion and Projects browser tests. Removed the folder and tab animation, moving navigation indicator, theme transition observer, and independent benchmark tweens.

The production build and 87 unit tests passed. Chrome desktop and mobile ran 27 passing browser checks, with one desktop-only check skipped on mobile. The tests sampled the position frame by frame, including after 600 ms, verified zero horizontal displacement or scaling, and checked one-time reveal, focus, reduced motion, route navigation, and click-to-play. The open in-app tab rendered Projects with two supporting panels and no development error overlay. Existing T08 screenshot changes stayed outside this work.

Next action is to review the page entry and scroll from FastCode to ScottyPi and Langmetric at `http://localhost:3176/projects`. Changes are uncommitted.

## Follow-up requested by the owner

The sustained page-entry and one-time Projects slides above were replaced. Home now uses a GSAP reveal for the five headline words (380 ms per word, 33 ms apart). The opening layout places the Selected projects heading at the bottom of the first screen. ScrollTrigger directly links the project grid's vertical position to scroll in both directions. The Projects index stays in its static grid. Pointer hover underlines the project title and gives the artwork a 200 ms zoom. Keyboard focus gets the underline and reduced motion gives the static layout.

The header shows Nikhil Sharma as the Home link. Left and Right follow the main navigation order. A case study goes back to Projects with Left or on to Résumé with Right. Up and Down keep normal scrolling. The shortcut defers to Parkour Game during play and to the mobile menu and editable controls.

Evidence includes [opening preview](../../../design/verification/home-reveal/preview-opening.jpg), [after scrolling](../../../design/verification/home-reveal/preview-scrolled.jpg), and [360 px phone](../../../design/verification/home-reveal/small-phone-opening.jpg). The build and 87 unit tests passed. Browser checks covered the opening panel, scroll reversal, word timing, hover, reduced motion, route focus, and the game at four viewport sizes. The in-app preview was left on Home.

Next action is owner review at `http://localhost:3176/`. Scroll down and back up, then use Left and Right to switch routes. Changes are uncommitted.

## Pinned reveal, theme, and pointer follow-up

The desktop Home scene is pinned from scroll position zero through 60% of a viewport. The hero and Selected projects heading move upward inside the frame while the three project panels rise into the space below the heading. The timeline follows native scroll in both directions and releases before Parkour Game. Keyboard focus reveals the relevant panel. Direct links to the game account for the extra scroll distance. Narrow and short viewports use the previous unpinned reveal, and reduced motion uses the normal layout.

The three Home previews fill equal-sized crops. The FastCode feature on the dedicated Projects route keeps its featured size. The header shows the name by itself and uses a centered, consistent theme button. The theme preference is saved before the 300 ms view transition so immediate navigation preserves the selection. Browsers with reduced motion or without the View Transition API switch instantly. The pointer is a lime dot with a following ring, larger on links and buttons and compressed on press. The system cursor remains available on touch, with reduced motion, in editable fields, and during Parkour play.

Evidence includes the [opening frame](../../../design/verification/home-stage/preview-initial.jpg), [mid-scroll](../../../design/verification/home-stage/preview-middle.jpg), [projects in frame](../../../design/verification/home-stage/preview-projects.jpg), and [cursor hover](../../../design/verification/home-stage/cursor-hover.jpg). Chrome reported 300 ms fade-in and fade-out animations. The in-app tab was reloaded and left on Home with the pinned frame active.

Next action is owner review at `http://localhost:3176/`. Scroll down slowly and back up on desktop, then use the theme switch and hover a link. Changes are uncommitted.

Final verification passed the production build, 87 unit tests, and 51 Chrome browser checks across desktop, tablet, and two phone sizes. Nine desktop or pointer checks were skipped on touch viewports. The browser suite covered focus during the pinned scene, reversible motion, matched artwork dimensions, theme persistence, and reloading the direct Parkour link.

## Résumé and Parkour follow-up

Education is below Core skills and sits at the bottom of the desktop sidebar. Removed inherited extra spacing from the résumé grid rows so the project dividers meet the Research row. The bottom edge of the frame now meets the footer with one aligned rule.

The Parkour shortcut uses native smooth scrolling for in-page navigation. Direct fragment loads, history restoration, and reduced motion still use instant positioning. The pinned scene now spans just over one viewport of scroll and is enabled at the desktop grid breakpoint for viewports at least 640 px tall. In the open 959 × 894 tab, a single full scroll step previously passed the 60%-viewport pin. After extending it, the frame stayed at 95 px from the top through the same 894 px step, while the hero moved out and the project artwork came into view. The in-app tab was left on Home, with the current name-only navbar and no error overlay.

Evidence: [résumé footer](../../../design/verification/resume-parkour/resume-footer.jpg), [full résumé](../../../design/verification/resume-parkour/resume-grid.jpg), [one scroll step](../../../design/verification/resume-parkour/home-one-scroll.jpg). The production build and 87 unit tests passed. The final four-viewport Chrome run passed 59 checks and skipped nine desktop-only checks on touch viewports. It sampled intermediate scroll positions, checked the game link and focus, and verified the résumé frame and row boundaries.

Next action is owner review from the open Home preview at `http://localhost:3176/`. Scroll down once to see the pinned frame and use the Parkour link from the top. Changes are uncommitted.
