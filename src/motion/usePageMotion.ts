import { useEffect, type RefObject } from 'react';
import { gsap } from 'gsap/dist/gsap';
import { triggerHomeCameraSettling, resetCameraTransition } from './cameraMotion';

interface PageMotionOptions {
  containerRef: RefObject<HTMLElement | null>;
  pageKey: string;
  isHome: boolean;
  skipAnimation?: boolean;
}

export function usePageMotion({ containerRef, pageKey, isHome, skipAnimation }: PageMotionOptions) {
  useEffect(() => {
    const page = containerRef.current;
    if (!page || skipAnimation) return;

    const motion = gsap.matchMedia(page);
    motion.add('(prefers-reduced-motion: no-preference)', () => {
      const enter = gsap.timeline({
        defaults: { duration: 0.42, ease: 'power2.out', clearProps: 'transform,opacity' },
      });

      if (isHome) {
        triggerHomeCameraSettling(false);
        enter.from(page.querySelectorAll('.home-title-line > span'), {
          yPercent: 90,
          duration: 0.64,
          ease: 'power3.out',
          stagger: 0.085,
        }, 0);
        enter.from(page.querySelectorAll('.home-hero-actions, .home-profile-copy'), {
          y: 12,
          opacity: 0.55,
          stagger: 0.08,
        }, 0.22);
        return resetCameraTransition;
      }

      const detail = page.querySelector('.detail-hero-left');
      if (detail) {
        enter.from(detail.children, { y: 8, opacity: 0.83, stagger: 0.035 }, 0);
        enter.from(page.querySelectorAll('.detail-illustration-figure'), {
          scale: 0.98,
          y: 8,
          opacity: 0.83,
          duration: 0.5,
        }, 0.06);
        return;
      }

      const header = page.querySelector('.resume-header, .about-page-container > h1');
      if (header) enter.from(header, { y: 8, opacity: 0.86 }, 0);
    });

    return () => motion.revert();
  }, [containerRef, pageKey, isHome, skipAnimation]);
}
