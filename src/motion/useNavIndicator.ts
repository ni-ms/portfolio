import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap/dist/gsap';
import { useReducedMotion } from './reducedMotion';

export function useNavIndicator(path: string) {
  const navRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const nav = navRef.current;
    const indicator = indicatorRef.current;
    const active = nav?.querySelector<HTMLAnchorElement>('a[aria-current="page"]');
    if (!nav || !indicator) return;

    if (!active || reducedMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      delete nav.dataset.indicatorReady;
      gsap.set(indicator, { clearProps: 'transform,width' });
      return;
    }

    const measure = () => {
      const bounds = active.getBoundingClientRect();
      return { x: bounds.left - nav.getBoundingClientRect().left, width: bounds.width };
    };
    const position = measure();
    if (!position.width) {
      delete nav.dataset.indicatorReady;
    } else if (nav.dataset.indicatorReady) {
      gsap.to(indicator, { ...position, duration: 0.38, ease: 'power3.out', overwrite: 'auto' });
    } else {
      gsap.set(indicator, position);
      nav.dataset.indicatorReady = 'true';
    }

    // Reposition after layout changes, including breakpoint and font changes.
    const resize = new ResizeObserver(() => {
      const next = measure();
      if (!next.width) {
        delete nav.dataset.indicatorReady;
        return;
      }
      if (next.x === position.x && next.width === position.width && nav.dataset.indicatorReady) return;
      Object.assign(position, next);
      gsap.killTweensOf(indicator);
      gsap.set(indicator, next);
      nav.dataset.indicatorReady = 'true';
    });
    resize.observe(nav);
    nav.querySelectorAll('a').forEach((link) => resize.observe(link));

    return () => {
      resize.disconnect();
      gsap.killTweensOf(indicator);
    };
  }, [path, reducedMotion]);

  return { navRef, indicatorRef };
}
