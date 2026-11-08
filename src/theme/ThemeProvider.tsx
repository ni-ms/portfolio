import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
export type Theme = 'dark' | 'light';
export const THEME_KEY = 'nikhil-portfolio-theme';
export function readTheme(): Theme {
  try { return localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark'; } catch { return 'dark'; }
}
const ThemeContext = createContext({ theme: 'dark' as Theme, setTheme: (_theme: Theme) => {}, toggleTheme: () => {} });
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, updateTheme] = useState<Theme>(readTheme);
  const setTheme = (next: Theme) => { updateTheme(next); try { localStorage.setItem(THEME_KEY, next); } catch { /* storage is optional */ } };
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#101414' : '#F2F1EA');
  }, [theme]);
  return <ThemeContext.Provider value={{ theme, setTheme, toggleTheme: () => setTheme(theme === 'dark' ? 'light' : 'dark') }}>{children}</ThemeContext.Provider>;
}
export const useTheme = () => useContext(ThemeContext);
