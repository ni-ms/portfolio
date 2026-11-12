import { flushSync } from 'react-dom';
import { createContext, useContext, useState, useLayoutEffect, type ReactNode } from 'react';
export type Theme = 'dark' | 'light';
export const THEME_KEY = 'nikhil-portfolio-theme';
export function readTheme(): Theme {
  try { return localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark'; } catch { return 'dark'; }
}
function persistTheme(theme: Theme) {
  try { localStorage.setItem(THEME_KEY, theme); } catch { /* storage is optional */ }
}

const ThemeContext = createContext({ theme: 'dark' as Theme, setTheme: (_theme: Theme) => {}, toggleTheme: () => {} });
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, updateTheme] = useState<Theme>(readTheme);
  const setTheme = (next: Theme) => {
    persistTheme(next);
    updateTheme(next);
  };
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#101414' : '#F2F1EA');
  }, [theme]);
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    if (!document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        document.querySelector('.home-game-root.is-playing')) {
      setTheme(next);
      return;
    }
    persistTheme(next);
    document.startViewTransition(() => flushSync(() => updateTheme(next)));
  };

  return <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>{children}</ThemeContext.Provider>;
}
export const useTheme = () => useContext(ThemeContext);
