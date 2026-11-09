import { isReducedMotion } from './reducedMotion';

let initialized = false;
let timeoutId: ReturnType<typeof setTimeout> | null = null;
let lastTheme: string | null = null;

/**
 * Initializes brief, restrained CSS transition when switching themes.
 * Does not affect canvas, physics or 3D overlay.
 * Instantly skipped when reduced motion is preferred.
 */
export function initThemeMotion(): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => {};
  }

  if (initialized) {
    return () => {};
  }
  initialized = true;

  lastTheme = document.documentElement.getAttribute('data-theme') || 'dark';

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme && currentTheme !== lastTheme) {
          lastTheme = currentTheme;
          if (!isReducedMotion()) {
            applyThemeTransition();
          }
        }
      }
    }
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  return () => {
    observer.disconnect();
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    document.documentElement.classList.remove('theme-transitioning');
    initialized = false;
  };
}

function applyThemeTransition() {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  document.documentElement.classList.add('theme-transitioning');
  timeoutId = setTimeout(() => {
    document.documentElement.classList.remove('theme-transitioning');
    timeoutId = null;
  }, 220);
}
