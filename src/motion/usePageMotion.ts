import { RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface PageMotionOptions {
  containerRef: RefObject<HTMLElement | null>;
  skipAnimation?: boolean;
}

export function usePageMotion({ containerRef, skipAnimation = false }: PageMotionOptions) {
  useGSAP(
    () => {
      if (!containerRef.current || skipAnimation) return;

      const mm = gsap.matchMedia();

      // Standard animation for users who DO NOT prefer reduced motion
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // 1. Hero text stagger reveal
        const heroTl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } });

        const eyebrow = containerRef.current?.querySelector('.hero-eyebrow');
        const headline1 = containerRef.current?.querySelector('.hero-headline-1');
        const headline2 = containerRef.current?.querySelector('.hero-headline-2');
        const subhead = containerRef.current?.querySelector('.hero-subhead');
        const heroCta = containerRef.current?.querySelector('.hero-cta');
        const routeGraphic = containerRef.current?.querySelector('.hero-route-svg');

        if (eyebrow) {
          heroTl.fromTo(eyebrow, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 });
        }
        if (headline1) {
          heroTl.fromTo(headline1, { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.4');
        }
        if (headline2) {
          heroTl.fromTo(headline2, { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.5');
        }
        if (subhead) {
          heroTl.fromTo(subhead, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.4');
        }
        if (heroCta) {
          heroTl.fromTo(heroCta, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.4');
        }

        // 2. Route SVG line drawing animation
        if (routeGraphic) {
          const path = routeGraphic.querySelector('path.route-path') as SVGPathElement | null;
          const dots = routeGraphic.querySelectorAll('.route-dot');

          if (path) {
            const length = path.getTotalLength ? path.getTotalLength() : 200;
            gsap.set(path, {
              strokeDasharray: length,
              strokeDashoffset: length
            });
            heroTl.to(path, {
              strokeDashoffset: 0,
              duration: 1.2,
              ease: 'power2.inOut'
            }, '-=0.3');
          }

          if (dots.length > 0) {
            heroTl.fromTo(dots, { scale: 0, opacity: 0 }, {
              scale: 1,
              opacity: 1,
              stagger: 0.15,
              duration: 0.4,
              ease: 'back.out(2)'
            }, '-=0.8');
          }
        }

        // 3. ScrollTrigger reveals for content sections
        const sections = containerRef.current?.querySelectorAll('.scroll-reveal-section');
        sections?.forEach((section) => {
          gsap.fromTo(
            section,
            { y: 35, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 85%',
                toggleActions: 'play none none none',
                once: true
              }
            }
          );
        });

        // 4. Staggered reveal for project cards
        const projectCards = containerRef.current?.querySelectorAll('.project-card');
        if (projectCards && projectCards.length > 0) {
          gsap.fromTo(
            projectCards,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              stagger: 0.15,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: '.projects-grid',
                start: 'top 82%',
                toggleActions: 'play none none none',
                once: true
              }
            }
          );
        }
      });

      // Reduced motion overrides: show elements immediately
      mm.add('(prefers-reduced-motion: reduce)', () => {
        const animatedElements = containerRef.current?.querySelectorAll(
          '.hero-eyebrow, .hero-headline-1, .hero-headline-2, .hero-subhead, .hero-cta, .scroll-reveal-section, .project-card'
        );
        if (animatedElements) {
          gsap.set(animatedElements, { opacity: 1, y: 0, clearProps: 'all' });
        }
      });

      return () => {
        mm.revert();
      };
    },
    { scope: containerRef, dependencies: [skipAnimation] }
  );
}
