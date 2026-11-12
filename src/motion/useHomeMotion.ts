import { useLayoutEffect, type RefObject } from 'react';
import { gsap } from 'gsap/dist/gsap';

export function useHomeMotion(pageRef: RefObject<HTMLDivElement | null>) {
  useLayoutEffect(() => {
    const page = pageRef.current;
    const scene = page?.querySelector<HTMLElement>('.home-scene');
    const opening = scene?.querySelector<HTMLElement>('.home-opening');
    const intro = opening?.querySelector<HTMLElement>('.home-intro');
    const heading = opening?.querySelector<HTMLElement>('.home-projects-heading');
    const projects = scene?.querySelector<HTMLElement>('.home-projects-reveal');
    const grid = projects?.querySelector<HTMLElement>('.home-projects-grid');
    if (!page || !scene || !opening || !intro || !heading || !projects || !grid) return;

    // In the unpinned layout, let the intro pass behind the navbar before the heading sticks.
    let introHeight = 0;
    let refreshIntroCover: (() => void) | undefined;
    const measureIntro = () => {
      const height = intro.offsetHeight;
      if (height === introHeight) return;
      introHeight = height;
      scene.style.setProperty('--home-intro-height', `${height}px`);
      refreshIntroCover?.();
    };
    const introSize = new ResizeObserver(measureIntro);
    measureIntro();
    introSize.observe(intro);

    const motion = gsap.matchMedia(page);
    motion.add('(prefers-reduced-motion: no-preference)', () => {
      if (!window.location.hash) {
        gsap.from('.home-title-word', {
          yPercent: 105,
          duration: 0.38,
          stagger: 0.033,
          ease: 'power3.out',
          clearProps: 'transform',
        });
      }
    });

    let disposed = false;
    void import('gsap/dist/ScrollTrigger').then(({ ScrollTrigger }) => {
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);
      motion.add({
        animate: '(prefers-reduced-motion: no-preference)',
        pin: '(min-width: 791px) and (min-height: 640px)',
      }, ({ conditions }) => {
        if (!conditions?.animate) return;
        if (!conditions.pin) {
          // Counter the page's travel until the stacked project list has covered the intro.
          const cover = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: scene,
              start: 0,
              end: () => intro.offsetHeight,
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
          cover
            .fromTo(intro, { y: 0, clipPath: 'inset(0px 0px 0px 0px)' }, {
              y: () => intro.offsetHeight,
              clipPath: () => `inset(0px 0px ${intro.offsetHeight}px 0px)`,
              duration: 1,
            }, 0)
            .fromTo(scene, { '--home-fold-opacity': 0 }, { '--home-fold-opacity': 1, duration: 0.22 }, 0)
            .to(scene, { '--home-fold-opacity': 0, duration: 0.18 }, 0.82);

          refreshIntroCover = () => cover.scrollTrigger?.refresh();

          const revealFocusedIntro = (event: FocusEvent) => {
            const target = event.target as HTMLElement;
            if (target.getBoundingClientRect().bottom > heading.getBoundingClientRect().top) {
              window.scrollTo({ top: 0, behavior: 'instant' });
              cover.scrollTrigger?.update();
            }
          };
          intro.addEventListener('focusin', revealFocusedIntro);
          gsap.fromTo(grid, { y: 64 }, {
            y: 0,
            ease: 'none',
            scrollTrigger: { trigger: projects, start: 'top bottom', end: 'top 72%', scrub: true },
          });
          return () => {
            refreshIntroCover = undefined;
            intro.removeEventListener('focusin', revealFocusedIntro);
          };
        }

        // Pin spacing changes the location of the game anchor below this scene.
        const gameAnchor = window.location.hash === '#parkour-game' ? page.querySelector('#parkour-game') : null;
        const gameBounds = gameAnchor?.getBoundingClientRect();
        const gameWasVisible = gameBounds && gameBounds.top >= 0 && gameBounds.top < innerHeight;
        const compactHeadingHeight = 68;
        const openingHeadingHeight = () => Math.max(
          compactHeadingHeight,
          Math.max(82, Math.min(innerHeight * 0.12, 132)),
          parseFloat(getComputedStyle(opening).minHeight) - intro.offsetHeight,
        );
        const projectRoom = () => intro.offsetHeight;
        const sizeProjects = () => {
          scene.style.setProperty('--project-heading-start', `${openingHeadingHeight()}px`);
          scene.style.setProperty('--project-room', `${projectRoom()}px`);
        };
        scene.dataset.pinned = 'true';
        sizeProjects();
        const timeline = gsap.timeline({
          defaults: { ease: 'none', duration: 1 },
          scrollTrigger: {
            trigger: scene,
            start: 0,
            end: () => `+=${Math.round(innerHeight * 1.06)}`,
            pin: true,
            scrub: 0.12,
            invalidateOnRefresh: true,
            onRefreshInit: sizeProjects,
          },
        });
        const dockAt = 0.70;
        const dockMotion = { duration: dockAt, ease: 'power1.inOut' };
        // Keep the intro in the pinned scene and move the project panel in front of it.
        timeline
          .fromTo(heading, { y: 0 }, { y: () => -projectRoom(), ...dockMotion }, 0)
          .fromTo(projects, { y: projectRoom }, { y: 0, ...dockMotion }, 0)
          .fromTo(scene, { '--home-fold-opacity': 0 }, { '--home-fold-opacity': 1, duration: 0.16 }, 0)
          .to(scene, { '--home-fold-opacity': 0, duration: 0.18 }, 0.50)
          .fromTo(grid, { y: 36 }, { y: 0, duration: 0.36, ease: 'power2.out' }, 0.10)
          .fromTo(scene, {
            '--project-heading-height': () => `${openingHeadingHeight()}px`,
            '--project-title-scale': 1,
          }, {
            '--project-heading-height': `${compactHeadingHeight}px`,
            '--project-title-scale': 0.6,
            duration: 0.22,
            ease: 'power2.out',
          }, 0.105)
          .fromTo(grid, { '--home-art-shift': '5%', '--home-art-scale': 1.12 }, {
            '--home-art-shift': '0%',
            '--home-art-scale': 1,
            duration: 0.9,
            ease: 'sine.out',
          }, 0.1);
        if (gameAnchor && (gameWasVisible || document.activeElement === gameAnchor)) {
          gameAnchor.scrollIntoView({ behavior: gameWasVisible ? 'instant' : 'smooth' });
        }

        // Tabbing into a clipped panel brings that panel into the viewport.
        const revealFocusedPanel = (event: FocusEvent) => {
          const trigger = timeline.scrollTrigger;
          if (!trigger || !scene.contains(event.target as Node)) return;
          const target = event.target as HTMLElement;
          const bounds = target.getBoundingClientRect();
          const sceneBounds = scene.getBoundingClientRect();
          const panelTop = heading.getBoundingClientRect().top;
          const covered = intro.contains(target) && bounds.bottom > panelTop;
          if (!covered && bounds.top >= Math.max(sceneBounds.top, 0) && bounds.bottom <= Math.min(sceneBounds.bottom, innerHeight)) return;
          window.scrollTo({
            top: projects.contains(target) ? trigger.end : trigger.start,
            behavior: 'instant',
          });
          trigger.update();
          trigger.getTween()?.progress(1);
        };
        scene.addEventListener('focusin', revealFocusedPanel);
        return () => {
          scene.removeEventListener('focusin', revealFocusedPanel);
          delete scene.dataset.pinned;
          scene.style.removeProperty('--project-heading-start');
          scene.style.removeProperty('--project-room');
        };
      });
    }).catch(() => {
      // The page keeps its normal layout if the optional scroll effect cannot load.
    });

    return () => {
      disposed = true;
      motion.revert();
      introSize.disconnect();
      scene.style.removeProperty('--home-intro-height');
    };
  }, [pageRef]);
}
