import { useSyncExternalStore } from 'react';

type Listener = (reduced: boolean) => void;
const listeners = new Set<Listener>();

function readPrefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

let currentReducedMotion = readPrefersReducedMotion();

if (typeof window !== 'undefined') {
  try {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = (e: MediaQueryListEvent | MediaQueryList) => {
      const next = 'matches' in e ? e.matches : readPrefersReducedMotion();
      if (next !== currentReducedMotion) {
        currentReducedMotion = next;
        listeners.forEach((listener) => listener(currentReducedMotion));
      }
    };

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', update);
    } else if (typeof mediaQuery.addListener === 'function') {
      mediaQuery.addListener(update);
    }
  } catch {
    // Media query listeners unsupported in environment
  }
}

/**
 * Synchronously get current reduced motion preference.
 */
export function isReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return currentReducedMotion;
}

/**
 * Subscribe to live reduced motion changes.
 */
export function subscribeReducedMotion(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * React hook that returns live reduced motion preference with zero tearing.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => currentReducedMotion,
    () => false
  );
}
