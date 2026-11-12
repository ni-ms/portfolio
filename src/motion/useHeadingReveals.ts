import { useLayoutEffect, type RefObject } from 'react';
import { gsap } from 'gsap/dist/gsap';
import { useReducedMotion } from './reducedMotion';

export function useHeadingReveals(mainRef: RefObject<HTMLElement | null>, path: string) {
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const main = mainRef.current;
    if (!main || reducedMotion) return;

    const active = new Map<HTMLElement, gsap.core.Tween>();
    const reveal = (heading: HTMLElement) => {
      const words = heading.querySelectorAll('.heading-word');
      heading.dataset.revealing = 'true';
      active.set(heading, gsap.fromTo(words, { yPercent: 120 }, {
        yPercent: 0,
        duration: 0.38,
        stagger: { amount: Math.min(0.16, (words.length - 1) * 0.033) },
        ease: 'power3.out',
        clearProps: 'transform',
        onComplete: () => {
          delete heading.dataset.revealing;
          active.delete(heading);
        },
      }));
    };

    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        reveal(entry.target as HTMLElement);
      }
    }, { rootMargin: '0px 0px 40px 0px' });

    main.querySelectorAll<HTMLElement>('.heading-words').forEach(heading => observer.observe(heading));

    return () => {
      observer.disconnect();
      for (const [heading, tween] of active) {
        tween.revert();
        delete heading.dataset.revealing;
      }
    };
  }, [mainRef, path, reducedMotion]);
}
