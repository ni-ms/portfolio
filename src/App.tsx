import { useRef, useState } from 'react';
import { Header } from './components/Header';
import { MobileMenu } from './components/MobileMenu';
import { Footer } from './components/Footer';
import LegacyHome from './routing/LegacyHome';
import { useNavigation, routes } from './routing/Router';
export default function App() {
  const { path } = useNavigation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  return <div className="portfolio-app">
    <a href="#main-content" className="skip-link">Skip to main content</a>
    <Header isMenuOpen={menuOpen} onToggleMenu={() => setMenuOpen(!menuOpen)} menuButtonRef={menuButtonRef} />
    <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} triggerButtonRef={menuButtonRef} />
    {path === '/' ? <LegacyHome /> : <main id="main-content" tabIndex={-1} className="route-shell"><h1>{routes.includes(path) ? path.split('/').pop()!.replace('resume', 'Résumé') : 'Page not found'}</h1><p>{routes.includes(path) ? 'Portfolio content is being integrated.' : 'This address does not exist.'}</p><a href="/">Return home →</a></main>}
    <Footer />
  </div>;
}
