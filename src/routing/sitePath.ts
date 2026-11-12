/// <reference types="vite/client" />

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function sitePath(path: string) {
  return base + path;
}

export function routePath(pathname: string) {
  if (pathname === base) return '/';
  return pathname.startsWith(base + '/') ? pathname.slice(base.length) : null;
}
