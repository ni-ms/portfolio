import { RefObject, useEffect } from 'react';
import { gsap } from 'gsap/dist/gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { isReducedMotion, subscribeReducedMotion } from './reducedMotion';
import { triggerHomeCameraSettling, resetCameraTransition } from './cameraMotion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface PageMotionOptions {
  containerRef: RefObject<HTMLElement | null>;
  pageKey?: string;
  isHome?: boolean;
  skipAnimation?: boolean;
}

/**
 * usePageMotion - Coordinates restrained, purposeful entrance and section reveals.
 *
 * Guarantees:
 * - Content is immediately readable; no long staggers or stuck hidden states.
 * - Reverts all active timelines and ScrollTriggers on route change / unmount.
 * - Live reduced-motion changes instantly clear animated properties.
 * - Coordinates Home identity entry with CameraRig settling.
 */
export function usePageMotion({
  containerRef,
  pageKey,
  isHome = false,
  skipAnimation = false,
}: PageMotionOptions): void {
  useEffect(() => {
    const root = containerRef.current;
    if (!root || skipAnimation) return;

    // If reduced motion is active, clear all props and ensure full visibility
    if (isReducedMotion()) {
      const allAnimated = root.querySelectorAll(
        '.home-identity-row, .home-intro-paragraph, .home-education-line, .home-cta-row, .portfolio-project-card, .detail-hero-left, .detail-illustration-figure, .detail-grid-layout, .about-section, .resume-section'
      );
      if (allAnimated.length > 0) {
        gsap.set(allAnimated, { clearProps: 'all', opacity: 1 });
      }
      resetCameraTransition();
      return;
    }

    // Create a scoped GSAP context for automatic cleanup on unmount
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // 1. Home Identity & Copy Entry + Camera Settling
        if (isHome) {
          triggerHomeCameraSettling(false);

          const heroElements = root.querySelectorAll(
            '.home-identity-row, .home-intro-paragraph, .home-education-line, .home-cta-row'
          );

          if (heroElements.length > 0) {
            gsap.fromTo(
              heroElements,
              { y: 12, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.45,
                stagger: 0.06,
                ease: 'power2.out',
                clearProps: 'transform',
              }
            );
          }
        }

        // 2. Project Cards Staggered Reveal
        const projectCards = root.querySelectorAll('.portfolio-project-card');
        if (projectCards.length > 0) {
          gsap.fromTo(
            projectCards,
            { y: 14, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.4,
              stagger: 0.07,
              ease: 'power2.out',
              clearProps: 'transform',
            }
          );
        }

        // 3. Project Detail Page Continuity & Diagram Settling
        const detailFigure = root.querySelector('.detail-illustration-figure');
        if (detailFigure) {
          gsap.fromTo(
            detailFigure,
            { scale: 0.98, opacity: 0.2, y: 8 },
            {
              scale: 1,
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: 'power2.out',
              clearProps: 'transform,scale',
            }
          );
        }

        const detailHeroLeft = root.querySelector('.detail-hero-left');
        if (detailHeroLeft) {
          gsap.fromTo(
            detailHeroLeft.children,
            { y: 8, opacity: 0.2 },
            {
              y: 0,
              opacity: 1,
              duration: 0.4,
              stagger: 0.04,
              ease: 'power2.out',
              clearProps: 'transform',
            }
          );
        }

        // 4. Content Sections / Narrative Blocks (About, Resume, Detail grids)
        const contentSections = root.querySelectorAll(
          '.about-block, .resume-card, .detail-block, .detail-metrics-col'
        );
        if (contentSections.length > 0 && !isHome) {
          gsap.fromTo(
            contentSections,
            { y: 10, opacity: 0.2 },
            {
              y: 0,
              opacity: 1,
              duration: 0.35,
              stagger: 0.05,
              ease: 'power2.out',
              clearProps: 'transform',
            }
          );
        }
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        resetCameraTransition();
        const all = root.querySelectorAll('*');
        gsap.set(all, { clearProps: 'all', opacity: 1 });
      });
    }, root);

    // Subscribe to live reduced motion toggles
    const unsubscribeReduced = subscribeReducedMotion((reduced) => {
      if (reduced) {
        ctx.revert();
        resetCameraTransition();
        const allAnimated = root.querySelectorAll('*');
        gsap.set(allAnimated, { clearProps: 'all', opacity: 1 });
      }
    });

    return () => {
      unsubscribeReduced();
      ctx.revert();
      if (isHome) {
        resetCameraTransition();
      }
    };
  }, [containerRef, pageKey, isHome, skipAnimation]);
}
