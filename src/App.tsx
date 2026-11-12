import { useRef, useState, useEffect, useCallback } from 'react';
import { PortfolioCursor } from './components/PortfolioCursor';
import { Header } from './components/Header';
import { MobileMenu } from './components/MobileMenu';
import { Footer } from './components/Footer';
import PortfolioPages from './pages/PortfolioPages';
import { HomeGame } from './components/HomeGame';
import { isNavigationCurrent, navigation, useNavigation } from './routing/Router';
import { useTheme } from './theme/ThemeProvider';
export default function App() {
  const { path, navigate } = useNavigation();
  const { theme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  useEffect(() => {
    window.addEventListener('portfolio:navigate', closeMenu);
    window.addEventListener('popstate', closeMenu);
    return () => { window.removeEventListener('portfolio:navigate', closeMenu); window.removeEventListener('popstate', closeMenu); };
  }, [closeMenu]);
  useEffect(() => {
    if (menuOpen) return;

    const handleArrowNavigation = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      if (event.defaultPrevented || event.repeat || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.target instanceof HTMLElement && (
        event.target.isContentEditable || event.target.closest('input, textarea, select, [role="slider"], [role="combobox"], [role="dialog"]')
      )) return;
      if (document.querySelector('.home-game-root.is-playing')) return;

      const index = navigation.findIndex(({ href }) => isNavigationCurrent(path, href));
      let nextIndex = 0;
      if (index >= 0) {
        if (event.key === 'ArrowRight') nextIndex = index + 1;
        else nextIndex = path === navigation[index].href ? index - 1 : index;
      }
      const nextPage = navigation[nextIndex];
      if (!nextPage) return;

      event.preventDefault();
      navigate(nextPage.href);
    };

    window.addEventListener('keydown', handleArrowNavigation);
    return () => window.removeEventListener('keydown', handleArrowNavigation);
  }, [menuOpen, navigate, path]);

  const menuButtonRef = useRef<HTMLButtonElement>(null);
  return <div className="portfolio-app">
    <a href="#main-content" className="skip-link">Skip to main content</a>
    <Header isMenuOpen={menuOpen} onToggleMenu={() => setMenuOpen(!menuOpen)} menuButtonRef={menuButtonRef} />
    <MobileMenu isOpen={menuOpen} onClose={closeMenu} triggerButtonRef={menuButtonRef} />
    <PortfolioPages path={path} gameSlot={path === '/' ? <HomeGame theme={theme} onNavigate={navigate} /> : undefined} />
    <Footer />
    <PortfolioCursor />
  </div>;
}
