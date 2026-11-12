import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

import { blogPosts } from '../content/blogPosts';

import { routePath, sitePath } from './sitePath';

const titles: Record<string, string> = { '/': 'Home', '/projects': 'Projects', '/projects/fastcode': 'FastCode', '/projects/scottypi': 'ScottyPi', '/projects/langmetric': 'Langmetric', '/blog': 'Blog', '/resume': 'Résumé', '/about': 'About' };
const RouterContext = createContext({ path: '/', navigate: (_href: string) => {} });
const pathname = () => routePath(window.location.pathname)?.replace(/\/$/, '') || '/';
const newKey = () => `portfolio-${Date.now()}-${Math.random().toString(36).slice(2)}`;

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(() => typeof window === 'undefined' ? '/' : pathname());
  const [revision, setRevision] = useState(0);
  const historyKey = useRef('');
  const positions = useRef(new Map<string, [number, number]>());
  const restorePosition = useRef<[number, number] | null>(null);
  const smoothFragment = useRef(false);
  const commitNavigation = () => {
    setPath(pathname());
    setRevision(value => value + 1);
    window.dispatchEvent(new Event('portfolio:navigate'));
  };
  const navigate = (href: string) => {
    positions.current.set(historyKey.current, [window.scrollX, window.scrollY]);
    historyKey.current = newKey();
    const url = new URL(sitePath(href), location.href);
    smoothFragment.current = url.pathname === location.pathname && Boolean(url.hash);
    history.pushState({ ...history.state, portfolioKey: historyKey.current }, '', url);
    restorePosition.current = null;
    commitNavigation();
  };

  useEffect(() => {
    historyKey.current = history.state?.portfolioKey || newKey();
    history.replaceState({ ...history.state, portfolioKey: historyKey.current }, '', location.href);
    const previousRestoration = history.scrollRestoration;
    history.scrollRestoration = 'manual';
    const recordScroll = () => positions.current.set(historyKey.current, [window.scrollX, window.scrollY]);
    const sync = () => {
      historyKey.current = history.state?.portfolioKey || newKey();
      restorePosition.current = positions.current.get(historyKey.current) || [0, 0];
      smoothFragment.current = false;
      commitNavigation();
    };
    const click = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const a = (event.target as Element)?.closest('a');
      if (!a || a.target || a.hasAttribute('download')) return;
      const url = new URL(a.href, location.href);
      const route = routePath(url.pathname);
      if (url.origin !== location.origin || route === null || a.getAttribute('href')?.startsWith('#')) return;
      event.preventDefault();
      navigate(route + url.search + url.hash);
    };
    window.addEventListener('popstate', sync);
    window.addEventListener('scroll', recordScroll, { passive: true });
    document.addEventListener('click', click);
    return () => {
      history.scrollRestoration = previousRestoration;
      window.removeEventListener('popstate', sync);
      window.removeEventListener('scroll', recordScroll);
      document.removeEventListener('click', click);
    };
  }, []);

  useEffect(() => {
    const post = blogPosts.find(({ slug }) => path === `/blog/${slug}`);
    document.title = `${titles[path] || post?.title || 'Page not found'} — Nikhil Sharma`;
    const frame = requestAnimationFrame(() => {
      let target: HTMLElement | null = null;
      if (location.hash) {
        let id = location.hash.slice(1);
        try { id = decodeURIComponent(id); } catch { /* Treat malformed fragments literally. */ }
        target = document.getElementById(id);
      }
      const saved = restorePosition.current;
      if (saved) window.scrollTo({ left: saved[0], top: saved[1], behavior: 'instant' });
      else if (target) {
        const smooth = smoothFragment.current && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        target.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant' });
      }
      else window.scrollTo({ left: 0, top: 0, behavior: 'instant' });
      restorePosition.current = null;
      smoothFragment.current = false;
      const focusTarget = target || document.querySelector<HTMLElement>('#main-content');
      if (focusTarget) {
        if (!focusTarget.hasAttribute('tabindex')) {
          focusTarget.setAttribute('tabindex', '-1');
          focusTarget.addEventListener('blur', () => focusTarget.removeAttribute('tabindex'), { once: true });
        }
        focusTarget.focus({ preventScroll: true });
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [path, revision]);

  return <RouterContext.Provider value={{ path, navigate }}>{children}</RouterContext.Provider>;
}
export const useNavigation = () => useContext(RouterContext);
export const navigation = [{ href: '/', label: 'Home' }, { href: '/projects', label: 'Projects' }, { href: '/blog', label: 'Blog' }, { href: '/resume', label: 'Résumé' }, { href: '/about', label: 'About' }];

export function isNavigationCurrent(path: string, href: string) {
  return path === href || (href !== '/' && path.startsWith(href + '/'));
}
