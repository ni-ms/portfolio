import { useEffect, type RefObject } from 'react';
import { gsap } from 'gsap/dist/gsap';

export function useProjectsMotion(pageRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const page = pageRef.current;
    const grid = page?.querySelector<HTMLElement>('.projects-supporting-grid');
    const cards = grid?.querySelectorAll<HTMLElement>('.projects-folder-item');
    if (!page || !grid || !cards?.length) return;

    const motion = gsap.matchMedia(page);
    let disposed = false;
    void import('gsap/dist/ScrollTrigger').then(({ ScrollTrigger }) => {
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);
      motion.add({
        animate: '(prefers-reduced-motion: no-preference)',
        desktop: '(min-width: 901px)',
      }, ({ conditions }) => {
        if (!conditions?.animate) return;

        const enter = gsap.timeline({ defaults: { duration: 0.48, ease: 'power3.out', clearProps: 'transform,opacity' } });
        enter
          .from('[data-projects-intro] > *', { y: 9, opacity: 0.8, stagger: 0.07 }, 0)
          .from('[data-projects-feature] .card-content-body', { y: 12, opacity: 0.84 }, 0.1)
          .from('[data-projects-feature] .card-media-link', {
            y: 10,
            opacity: 0.88,
            clipPath: 'inset(1% 1% 8% 1%)',
            duration: 0.64,
            clearProps: 'transform,opacity,clipPath',
          }, 0.06);

        const finishOnFocus = new Map<HTMLElement, gsap.core.Timeline>();
        const settled = { x: 0, y: 0, rotation: 0, scale: 1, clearProps: 'transform' };

        if (conditions.desktop && cards.length === 2) {
          const [front, back] = cards;
          const spread = () => (back.offsetLeft - front.offsetLeft) * 0.44;
          const unfold = gsap.timeline({
            defaults: { duration: 0.78, ease: 'power3.inOut' },
            scrollTrigger: { trigger: grid, start: 'top 74%', once: true, invalidateOnRefresh: true },
            onComplete: () => { delete grid.dataset.folderStack; },
          });
          grid.dataset.folderStack = 'true';
          const frontStack = { x: spread, y: 30, rotation: -3, scale: 0.94 };
          const backStack = { x: () => -spread(), y: 53, rotation: 4, scale: 0.91 };
          gsap.set(front, { ...frontStack });
          gsap.set(back, { ...backStack });
          unfold
            .fromTo(front, frontStack, { ...settled }, 0)
            .fromTo(back, backStack, { ...settled }, 0.12);
          finishOnFocus.set(front, unfold);
          finishOnFocus.set(back, unfold);
        } else {
          cards.forEach((card, index) => {
            const tab = card.querySelector('.projects-folder-tab');
            const unfold = gsap.timeline({
              scrollTrigger: { trigger: card, start: 'top 85%', once: true },
              defaults: { ease: 'power3.out' },
            });
            unfold.fromTo(card, { y: 25, rotation: index % 2 ? 2 : -2, scale: 0.96 }, {
              ...settled,
              duration: 0.57,
            });
            if (tab) {
              unfold.fromTo(tab, { y: 0, opacity: 1 }, {
                y: -18, opacity: 0, duration: 0.36, clearProps: 'transform,opacity',
              }, 0.03);
            }
            finishOnFocus.set(card, unfold);
          });
        }

        const settleFocusedCard = (event: FocusEvent) => {
          if (!(event.target instanceof Element)) return;
          const card = event.target.closest<HTMLElement>('.projects-folder-item');
          if (card) finishOnFocus.get(card)?.progress(1);
        };
        grid.addEventListener('focusin', settleFocusedCard);

        return () => {
          grid.removeEventListener('focusin', settleFocusedCard);
          delete grid.dataset.folderStack;
        };
      });
    }).catch(() => motion.revert());

    return () => {
      disposed = true;
      motion.revert();
    };
  }, [pageRef]);
}
