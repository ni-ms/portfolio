import { useRef, useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { MobileMenu } from './components/MobileMenu';
import { Footer } from './components/Footer';
import PortfolioPages from './pages/PortfolioPages';
import { HomeGame } from './components/HomeGame';
import { useNavigation } from './routing/Router';
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
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  return <div className="portfolio-app">
    <a href="#main-content" className="skip-link">Skip to main content</a>
    <Header isMenuOpen={menuOpen} onToggleMenu={() => setMenuOpen(!menuOpen)} menuButtonRef={menuButtonRef} />
    <MobileMenu isOpen={menuOpen} onClose={closeMenu} triggerButtonRef={menuButtonRef} />
    <PortfolioPages path={path} gameSlot={path === '/' ? <HomeGame theme={theme} onNavigate={navigate} /> : undefined} />
    <Footer />
  </div>;
}
