import React, { useState, useRef } from 'react';
import { Header } from './components/Header';
import { MobileMenu } from './components/MobileMenu';
import { Hero } from './components/Hero';
import { Projects } from './components/Projects';
import { Explorations } from './components/Explorations';
import { Resume } from './components/Resume';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

export interface AppProps {
  canvasSlot?: React.ReactNode;
  onDroneView?: () => void;
  onStartExploring?: () => void;
  onPlayMobile?: () => void;
  is3dActive?: boolean;
}

export default function App({
  canvasSlot,
  onDroneView,
  onStartExploring,
  onPlayMobile,
  is3dActive = false,
}: AppProps = {}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);

  const handleToggleMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleCloseMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="portfolio-app">
      {/* Keyboard Accessibility Skip Link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Primary Header */}
      <Header
        isMenuOpen={isMobileMenuOpen}
        onToggleMenu={handleToggleMenu}
        menuButtonRef={menuButtonRef}
      />

      {/* Accessible Mobile Slide-out Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={handleCloseMenu}
        triggerButtonRef={menuButtonRef}
      />

      {/* Main Semantic Landmark */}
      <main id="main-content">
        <Hero
          canvasSlot={canvasSlot}
          isPlaying={is3dActive}
          onDroneView={onDroneView}
          onStartExploring={onStartExploring}
          onPlayMobile={onPlayMobile}
          onNavigateSection={handleNavigateSection}
        />

        <Projects />

        <Explorations />

        <Resume />

        <Contact />
      </main>

      {/* Site Footer */}
      <Footer />
    </div>
  );
}
