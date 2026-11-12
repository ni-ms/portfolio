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
          gsap.fromTo(grid, { y: 64 }, {
            y: 0,
            ease: 'none',
            scrollTrigger: { trigger: projects, start: 'top bottom', end: 'top 72%', scrub: true },
          });
          return;
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
        // Counter part of the opening's travel so the project box sweeps over the hero.
        timeline
          .fromTo(opening, { y: 0 }, { y: () => -projectRoom() }, 0)
          .fromTo(intro, { y: 0 }, { y: () => projectRoom() * 0.72 }, 0)
          .fromTo(projects, { y: projectRoom }, { y: 0 }, 0)
          .fromTo(grid, { y: 84 }, { y: 0, duration: 0.44, ease: 'power2.out' }, 0.14)
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
    };
  }, [pageRef]);
}
