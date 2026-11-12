# Portfolio QA

Play the individual WebM files below. T01–T08 show the previous QA pass in the local master worktree at base commit `f0d4138`. The latest feature recording is in the follow-up section below. They were freshly recorded in Chrome on this Mac. The mobile clips use browser emulation. Captions describe the actions and are added only during recording.

## Ticket recordings

| Ticket | Recording | What to look for |
| --- | --- | --- |
| [T01](../docs/implementation/tickets/T01.md) | [Routing and theme](recordings/T01-routing-and-theme.webm) | Arrow-key routing, theme crossfade, reload persistence, and browser Back |
| [T02](../docs/implementation/tickets/T02.md) | [Résumé and download](recordings/T02-resume-and-download.webm) | Real PDF download, Education directly after Core skills, and the grid meeting the footer |
| [T03](../docs/implementation/tickets/T03.md) | [Grid and case studies](recordings/T03-grid-and-case-studies.webm) | Projects index, FastCode artwork and benchmark, then ScottyPi and Langmetric |
| [T04](../docs/implementation/tickets/T04.md) | [Parkour move, jump, and reset](recordings/T04-parkour-move-jump-reset.webm) | Real keyboard input in expanded play, follow camera, reset, and Esc exit |
| [T05](../docs/implementation/tickets/T05.md) | [Rooftop dark and light](recordings/T05-rooftop-dark-and-light.webm) | Live rooftop geometry, materials, and both lighting themes |
| [T06](../docs/implementation/tickets/T06.md) | [Mobile click-to-play](recordings/T06-mobile-click-to-play.webm) | Smooth shortcut, static poster before Play, emulated touch controls, and exit |
| [T07](../docs/implementation/tickets/T07.md) | [Home scroll and cursor](recordings/T07-home-scroll-and-cursor.webm) | Headline reveal, pinned project panel in both directions, artwork hover, lime cursor, and smooth Parkour shortcut |
| [T08](../docs/implementation/tickets/T08.md) | [Responsive routes and 404](recordings/T08-responsive-route-check.webm) | Mobile menu, About and Contact, browser Back, and a direct unknown route |

## Chat request audit

| Request | Current status |
| --- | --- |
| Square grid across the portfolio, accurate page copy, and FastCode artwork | Present across all eight routes. Home previews use matching frames. The Projects index keeps a larger FastCode feature. See T02 and T03 and the [site-wide captures](../design/verification/site-grid/). |
| Education directly below Core skills and the bottom border aligned | Fixed in this pass. Education follows the last skill group immediately. The résumé grid ends at the footer. See T02. |
| Name-only Home link, aligned theme toggle, smooth transition, and arrow keys | Present. Left/Right navigate the portfolio, Up/Down scroll, and Parkour keeps the game keys while playing. Theme crossfade uses the browser View Transition API where supported. See T01. |
| Fast word reveal, on-hover artwork, and neon dot with a ring | Present. Pointer animation applies to mouse input with normal motion settings. The system cursor stays available for text fields, Parkour play, and reduced motion. See T07. |
| Selected projects fills the bottom of the opening screen, then the hero slides up in a fixed frame and reverses when scrolling up | Verified in the 959 × 894 in-app preview and desktop Chrome. Pinning applies at 791 px wide and 640 px tall or larger with normal motion. Phone layouts keep the unpinned reveal. Reduced motion uses the static grid. See T07. |
| Parkour shortcut scrolls smoothly and only Play loads the game | Verified with native smooth scroll and no game canvas before Play. Reduced motion jumps directly to the preview. See T06 and T07. |
| A playable rooftop using free assets, including terrace, stairs, and jump | The build uses CC0 assets from ambientCG and Poly Haven on the existing rooftop course. See the [asset inventory](../design/scene/rooftop-assets.md) and T04–T06. |
| High-fidelity game and mobile performance | The game is playable and the live scene is recorded. Visual fidelity to the mockup still needs the owner's review. Physical-phone frame rate, thermal performance, and public-network startup remain unmeasured. Emulation checks cover layout and input. |
| Merge and clean up branches | The integrated checkout is local `master` at `.agent-runs/master-integration`. Two older draft branches/worktrees still exist, and each has commits outside master's ancestry. The main workspace folder is one of those older checkouts. Running from that folder can show the older design. This audit did not modify Git refs. |
| Projects folder/unfold animation | Superseded by the user's later request to remove it. The Projects route uses the fixed editorial grid, and the scroll-driven reveal is on Home. |

The clips are representative demos. They do not prove every physics edge case or performance target. The previous implementation reports include historical layouts and should be read against the current clips and audit.

## Repeat the recordings

With the current Vite preview running and Chrome installed:

```sh
npx playwright install ffmpeg
node qa/record.mjs
node qa/record.mjs T02 T07
```

Set `QA_BASE_URL` if the preview uses a different port. Add a short demo with each feature change and link it in the handoff. When a request cannot be reproduced, record the environment and the gap here.

## Latest verification

- Production build and 87 unit tests passed.
- Current Chrome desktop and emulated 390 px mobile ran 59 passing browser checks with 15 viewport-specific skips. The suites included gameplay input, game loading and exit, WebGL fallback and context loss, the pinned reveal, theme persistence, navigation, résumé downloads, and footer alignment.
- A follow-up geometry check confirmed the Core skills and Education panels meet at the same divider at all four viewport sizes.
- Chrome loaded the metadata for all eight clips. The in-app browser played the Home demo to completion.
- Approved mockups are under [design/mockups/current-theme](../design/mockups/current-theme/). The current pinned Home layout follows the later reference and user direction recorded in the chat.

Next action is to review T07 and T02 directly from the recording files, then open the local Home preview. The live animation follows scroll only on the desktop layout. Keep any further mismatch in this audit with the URL, viewport, and a clip.

## Blog and cursor follow-up

[Watch the Blog and cursor demo](recordings/blog-and-cursor.webm). The clip shows the outline changing from a circle to match a navigation link, a theme button, and an article link. It then opens the FastCode note and shows the simplified footer. The initial Blog posts use the existing FastCode and ScottyPi case studies as their source. The site tab icon is a lime N.

The HTML gallery was removed at the owner's request. This index and the recordings are project files. To record this follow-up again, run `node qa/record.mjs blog-and-cursor`.

The build, 87 unit tests, and 27 final browser checks across four viewports passed. Nine desktop-only checks were skipped on touch layouts. The browser checks covered article URLs and case-study links, favicon response, absence of the QA gallery, and the cursor position, size, and reduced-motion fallback.

Next action is to open `http://localhost:3176/blog` and review the article list and cursor behavior. The in-app preview was left on Blog.

## Two-stage Home reveal

[Watch the corrected Home reveal](recordings/home-projects-two-stage.webm). The first half of the pinned desktop scroll expands the empty Selected projects box to fill the frame. Only the second half raises the three previews inside it. Scrolling up reverses the order. Phone and reduced-motion layouts retain their existing behavior.

The browser test stops at the midpoint and checks that the heading has reached the top of the pinned frame while the preview grid is still outside the viewport. It then checks the fully revealed grid, the reverse sequence, and keyboard focus.

Next action is to review the new clip, then reproduce it from the top of Home in a desktop-sized window. The in-app preview was left there.

## Smoother project rise

[Watch the updated eight-second demo](recordings/home-projects-smooth.webm). The three previews rise as one row after the Selected projects box fills the pinned desktop frame. Scroll-linked motion now interpolates short wheel steps over 240 ms, and the previews ease in and out in both directions. Keyboard focus still reveals a clipped project immediately.

The build and 87 unit tests passed. The focused desktop and mobile browser checks passed, including a frame-by-frame check for intermediate positions during the desktop rise. Next action is owner review of the updated clip, which is open in the in-app browser.

## Faster easing

[Watch the latest reveal](recordings/home-projects-easing.webm). The pinned desktop sequence still expands the empty box first. The previews now use a quicker ease-out and half the previous scroll interpolation time, so they respond sooner and slow as they settle. Next action is owner review of the new clip, which is open in the in-app browser.

## Continuous Home reveal

[Watch the continuous-scroll demo](recordings/home-projects-continuous.webm). This replaces the pause between the box expansion and the previews. The box gets a short lead, then the three previews move up with it while it is still expanding. The reveal reverses with scroll. Chrome checks verified the short initial delay, visible previews before the box reaches the top, and a gap below five pixels by one quarter of a viewport of scroll.

The build and 21 desktop/mobile browser checks passed, with three desktop-only checks skipped on mobile. Next action is owner review of the new clip, which is open in the in-app browser.

## Layered Home transition

[Watch the layered GSAP demo](recordings/home-projects-layered.webm). The pinned project panel moves upward over the hero, which travels 28% as far. The previews still follow after a short lead and the artwork drifts inside the clipped image frames. All tracks reverse together with scroll. Keyboard focus returns to the opening if the panel covers a hero link.

The build, 87 unit tests, and 21 desktop/mobile browser checks passed. Three desktop-only checks were skipped on mobile. The browser check measured separate hero and panel positions and confirmed the artwork settles at its normal scale. Next action is owner review of the new clip, open in the in-app browser.

## Delayed cards and compact heading

[Watch the updated reveal](recordings/home-projects-compact-heading.webm). The desktop panel gets a longer lead before the project row follows. The heading shrinks as the cards arrive, and the grid grows into the freed space. In the 959 × 894 preview, the heading drops from about 269 px to 82 px. Scroll back to restore the opening layout.

The build, 87 unit tests, and 21 desktop/mobile browser checks passed. The two focused reveal checks also passed after the artwork sizing adjustment. Next action is owner review of the new clip, which is open in the in-app browser.

## Earlier, more visible heading collapse

[Compare the live screenshots](evidence/selected-projects-heading.jpg) and [watch the before-and-after recording](recordings/home-projects-heading-before-after.webm). The Selected projects heading begins shrinking before the cards enter. Both the box and its lettering shrink. The measured height goes from 269 px to 68 px at 959 × 894. The grid takes the space directly beneath it. Reverse scrolling restores the opening heading.

The build and unit tests passed. The final focused desktop and mobile browser checks passed, including the initial card delay and the desktop heading's height, type size, and restored state. Next action is owner review of the comparison or the new clip, which is open in the in-app browser.

## Button-only cursor outline

[Watch the cursor demo](recordings/cursor-buttons-only.webm). The outline fits buttons and links styled as buttons, including the résumé download. The cursor stays circular over body text, headings, and ordinary links. The reduced-motion preference still uses the native pointer.

The production build, 87 unit tests, and the desktop cursor check passed. Next action is owner review of the demo or hovering the heading and download button on the local Résumé page.
