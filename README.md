# Parkour portfolio rebuild

This branch is a clean starting point for a new personal portfolio. The previous application has intentionally been removed. The original website remains on `master` at commit `21e537c`.

- Branch: `codex/parkour-portfolio-rebuild`
- Build brief and complete Traycer prompt: [TRAYCER_HANDOFF.md](TRAYCER_HANDOFF.md)
- Desktop visual reference: [design/parkour-portfolio-reference.png](design/parkour-portfolio-reference.png)
- Mobile landing and play-mode reference: [design/parkour-portfolio-mobile-reference.png](design/parkour-portfolio-mobile-reference.png)

Open this branch in Traycer, attach or reference the build brief and both reference images above, and ask it to plan and implement the brief. If the selected agent cannot inspect repository images, attach both PNGs directly as task context. The references are generated design concepts; the parkour environment must be built as an actual playable 3D scene.

On mobile, stack the headline, course preview, play button, and project list. Playing opens an expanded viewport-filling game overlay with a directional pad, jump and reset buttons, and a clear exit. The handoff specifies multi-touch input, safe-area spacing, scroll/focus restoration, and mobile verification.

The implementation stack is Vite, React, TypeScript, Three.js/React Three Fiber, Drei, Rapier, and GSAP with its React integration and ScrollTrigger. The brief also defines camera calibration, finished geometry, PBR materials, lighting/shadows, optional postprocessing, quality presets, and repeatable screenshot comparisons. These are build requirements; application code and dependencies have not been installed in this handoff branch.

The handoff intentionally contains no application scaffold or installed dependencies. The brief specifies the replacement stack, appearance, interactions, content placeholders, and acceptance checks. Personal information from LinkedIn has not been supplied. There is no portrait on the landing page.
