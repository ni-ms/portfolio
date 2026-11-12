import { useEffect, useRef } from 'react';
import { gsap } from 'gsap/dist/gsap';

function outlineBounds(target: Element, x: number, y: number) {
  const control = target.closest('a[href]:not(.card-media-link), button:not(:disabled), [role="button"]');
  if (control) return control.getBoundingClientRect();

  const text = target.closest('h1, h2, h3, h4, p, li, dt, dd');
  if (!text) return;
  const range = document.createRange();
  range.selectNodeContents(text);
  return Array.from(range.getClientRects()).find((rect) =>
    rect.width > 0 && x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom);
}

export function PortfolioCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const app = cursor?.parentElement;
    if (!cursor || !dot || !ring || !app) return;

    const motion = gsap.matchMedia();
    motion.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const ringX = gsap.quickTo(ring, 'x', { duration: 0.22, ease: 'power2.out' });
      const ringY = gsap.quickTo(ring, 'y', { duration: 0.22, ease: 'power2.out' });

      let position: { x: number; y: number } | undefined;
      let refreshFrame = 0;

      const hide = () => {
        position = undefined;
        delete app.dataset.customCursor;
        delete cursor.dataset.active;
        delete cursor.dataset.pressed;
      };

      const render = (target: Element | null, x: number, y: number) => {
        if (!target || !app.contains(target) ||
            target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"]), .home-game-root.is-playing')) {
          hide();
          return;
        }

        const bounds = outlineBounds(target, x, y);
        const centerX = bounds ? bounds.left + bounds.width / 2 : x;
        const centerY = bounds ? bounds.top + bounds.height / 2 : y;
        dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        if (bounds) {
          ring.style.setProperty('--cursor-width', `${bounds.width + 10}px`);
          ring.style.setProperty('--cursor-height', `${bounds.height + 8}px`);
          cursor.dataset.active = 'true';
        } else {
          delete cursor.dataset.active;
        }

        if (!app.dataset.customCursor) {
          ringX(centerX, centerX);
          ringY(centerY, centerY);
          app.dataset.customCursor = 'true';
        } else {
          ringX(centerX);
          ringY(centerY);
        }
      };

      const move = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse') {
          hide();
          return;
        }

        const { clientX: x, clientY: y } = event;
        position = { x, y };
        render(event.target instanceof Element ? event.target : null, x, y);
      };

      const refresh = () => {
        if (!position || refreshFrame) return;
        refreshFrame = requestAnimationFrame(() => {
          refreshFrame = 0;
          if (position) render(document.elementFromPoint(position.x, position.y), position.x, position.y);
        });
      };

      const press = () => { cursor.dataset.pressed = 'true'; };
      const release = () => { delete cursor.dataset.pressed; };
      document.addEventListener('pointermove', move);
      document.documentElement.addEventListener('pointerleave', hide);
      window.addEventListener('blur', hide);
      window.addEventListener('pointerdown', press);
      window.addEventListener('pointerup', release);
      window.addEventListener('pointercancel', hide);
      window.addEventListener('portfolio:navigate', hide);
      window.addEventListener('scroll', refresh, { passive: true, capture: true });
      window.addEventListener('resize', refresh);
      document.fonts.addEventListener('loadingdone', refresh);
      return () => {
        hide();
        document.removeEventListener('pointermove', move);
        document.documentElement.removeEventListener('pointerleave', hide);
        window.removeEventListener('blur', hide);
        window.removeEventListener('pointerdown', press);
        window.removeEventListener('pointerup', release);
        window.removeEventListener('pointercancel', hide);
        window.removeEventListener('portfolio:navigate', hide);
        window.removeEventListener('scroll', refresh, true);
        window.removeEventListener('resize', refresh);
        document.fonts.removeEventListener('loadingdone', refresh);
        cancelAnimationFrame(refreshFrame);
      };
    });
    return () => motion.revert();
  }, []);

  return (
    <div ref={cursorRef} className="portfolio-cursor" aria-hidden="true">
      <span ref={ringRef} className="portfolio-cursor-ring" />
      <span ref={dotRef} className="portfolio-cursor-dot" />
    </div>
  );
}
