import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
export const routes = ['/', '/projects', '/projects/fastcode', '/projects/scottypi', '/projects/langmetric', '/resume', '/about'];
const RouterContext = createContext({ path: '/', navigate: (_href: string) => {} });
export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(() => typeof window === 'undefined' ? '/' : window.location.pathname.replace(/\/$/, '') || '/');
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const sync = () => { setPath(window.location.pathname.replace(/\/$/, '') || '/'); setRevision(value => value + 1); };
    const click = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const a = (event.target as Element)?.closest('a');
      if (!a || a.target || a.hasAttribute('download')) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || a.getAttribute('href')?.startsWith('#')) return;
      event.preventDefault(); navigate(url.pathname + url.search + url.hash);
    };
    window.addEventListener('popstate', sync); document.addEventListener('click', click);
    return () => { window.removeEventListener('popstate', sync); document.removeEventListener('click', click); };
  }, []);
  const navigate = (href: string) => { history.pushState({}, '', href); setPath(location.pathname.replace(/\/$/, '') || '/'); setRevision(value => value + 1); window.dispatchEvent(new Event('portfolio:navigate')); };
  useEffect(() => {
    const name = !routes.includes(path) ? 'Page not found' : path === '/' ? 'Home' : path.split('/').pop()!;
    document.title = `${name === 'resume' ? 'Résumé' : name.charAt(0).toUpperCase() + name.slice(1)} — Nikhil Sharma`;
    const frame = requestAnimationFrame(() => {
      if (location.hash) document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();
      else window.scrollTo(0, 0);
      document.querySelector<HTMLElement>('#main-content')?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [path, revision]);
  return <RouterContext.Provider value={{ path, navigate }}>{children}</RouterContext.Provider>;
}
export const useNavigation = () => useContext(RouterContext);
export const navigation = [{ href: '/', label: 'Home' }, { href: '/projects', label: 'Projects' }, { href: '/resume', label: 'Résumé' }, { href: '/about', label: 'About' }];
