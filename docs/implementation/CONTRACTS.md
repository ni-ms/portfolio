# Shared integration contracts

These are agreed target boundaries, not claims that the existing code already implements them. T01 coordinator confirms exact types/paths before parallel work; changes afterward require a short A2A contract message.

## Routing and content

Routes: /, /projects, /projects/fastcode, /projects/scottypi, /projects/langmetric, /resume, /about, and a real 404. Contact is /about#contact. Project slugs are stable and links resolve directly. Game navigation emits a route destination, replacing old DOM section IDs. Ordinary navigation never depends on checkpoint unlock state.

Content is centralized in src/content/. docs/portfolio-content.json provides factual fields and stable slugs; the retained DOCX supplies detail. Missing optional URLs stay absent; do not link to # or generic social homepages as though they were real project destinations. No unavailable ScottyPi repo link.

## Theme

One theme owner exposes theme ('dark' or 'light'), setTheme, and toggleTheme. Its pre-paint initialization uses saved explicit choice or dark; storage failures fall back to dark. CSS tokens and scene parameters consume that state. Theme changes must not remount player physics, clear progress, or duplicate canvases.

## Page/game boundary

Coordinator establishes one public game-experience wrapper with theme, preview/play state, ready/error, explicit request-navigation, and exit callbacks. Internal adapters may preserve existing GameMode names. Home owns the preview placement; expanded play reuses the same simulation, or explicitly unmounts preview before mounting a restored play instance. Only one active physics world/canvas/input owner.

Game agent owns a stable live player transform/ref readable by CameraRig without React state rerenders per frame. Physics owns player movement. Frame loop owns camera interpolation. GSAP changes camera transition targets only.

One course configuration owns visible course bounds, simplified collision geometry, checkpoint sensors, and spawns. Theme/light rigs/materials consume the theme without copying the entire course. GameOverlays/markers emit explicit navigation requests to the router.

## Styles and shared files

Coordinator: src/App.tsx, src/main.tsx, index.html, router/context entry points, global tokens, package files, dependency installs, final integration.
Content worker: src/content/**, actual résumé download asset and source conversion.
Page worker: page components, shared UI components, page-specific CSS, ordinary project thumbnail assets.
Gameplay/world worker: src/game/**, src/types/game.ts, game-specific tests and assets, within its active ticket.
Motion worker: src/motion/** and agreed data attributes/hooks; request shared-file edits through coordinator.
Reviewer: reports and final verification assets; requested repairs return to the owner unless coordinator explicitly reassigns.

Coordinator may revise this allocation before dispatch. Do not concurrently edit one shared CSS/package/type file without ownership transfer.

## Revision 1 — T01 published

- Router: src/routing/Router.tsx exports useNavigation() => {path, navigate(href)}. Ordinary local anchors use delegated History API navigation; target/download/external/modifier clicks retain native behavior. Host must rewrite unknown document paths to index.html.
- Theme: src/theme/ThemeProvider.tsx exports useTheme() => {theme, setTheme, toggleTheme}, type Theme. Storage key nikhil-portfolio-theme; index.html initializes before CSS/app paint.
- T02: publish factual `portfolioContent` from src/content/realPortfolio.ts; keep legacy portfolio.ts temporarily for old components, or preserve its exported compatibility shape. T03 consumes the factual export. Coordinator replaces footer links after T02.
- T03: export default PortfolioPages({path, gameSlot?: ReactNode}) from src/pages/PortfolioPages.tsx. It owns route page markup, including main#main-content tabIndex=-1, and imports src/styles/pages.css. Coordinator connects it to App. Home places gameSlot; pages must stay usable without it. Relevant old components may be replaced by T03; Header/MobileMenu/Footer/tokens/App remain coordinator owned.
- T04: publish GameExperience({theme, onNavigate}) from src/game/GameExperience.tsx, where theme is dark|light and onNavigate receives a route href. This owns exactly one Canvas, overlay, input lifecycle and preview/play controls; no root App edit. Coordinator plugs it into Home at T06. T04 owns src/types/game.ts after this publication.
- T05: extends the T04 experience without changing this wrapper contract.
- No new package dependency is currently needed for routing; maintain existing R3F/React/GSAP stack.

## Revision 2 — T06 Home integration

- Coordinator connects App useTheme/useNavigation to a Home-only HomeGame({theme,onNavigate}) export in src/components/HomeGame.tsx. Inner routes unmount the game; ordinary links remain available.
- T06 child owns HomeGame, its scoped src/styles/home-game.css, game-specific responsive canvas/error/lifecycle refinements, and relevant browser checks. Root App, page layout CSS, package files and execution state stay coordinator owned.
- HomeGame lazy-loads GameExperience and provides an accessible theme-matched static loading/error/WebGL fallback without delaying page content. One persistent Canvas/physics world survives theme/preview/expanded transitions; inner route navigation cleans up.
- Responsive dimensions must describe the actual canvas, not a cropped minimum-height wrapper. Perimeter effects apply to canvas/atmosphere only; controls and HTML remain sharp. Expanded play relaxes edge treatment.
- Preserve T05 canonical physics/course/spawns, reachable launch cue, correct arrow heading, open upright fan collars, deterministic/live reduced-motion gating and stable procedural environment allocation. Request ownership changes before touching these.
