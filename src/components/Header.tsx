import React from 'react';
import { portfolioData } from '../content/portfolio';
import { RouteEmblem } from './RouteEmblem';

interface HeaderProps {
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  menuButtonRef?: React.RefObject<HTMLButtonElement | null>;
}

export const Header: React.FC<HeaderProps> = ({
  isMenuOpen,
  onToggleMenu,
  menuButtonRef,
}) => {
  return (
    <header className="site-header" role="banner">
      <div className="header-container">
        <a href="#hero" className="header-brand" aria-label={`${portfolioData.owner.name} - Home`}>
          <RouteEmblem size={24} />
          <span className="brand-name">{portfolioData.owner.name}</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="desktop-nav" aria-label="Primary navigation">
          <ul className="nav-list">
            {portfolioData.navigation.map((item) => (
              <li key={item.id} className="nav-item">
                <a
                  href={item.href}
                  className="nav-link"
                  {...(item.isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button
          ref={menuButtonRef}
          type="button"
          className={`mobile-menu-button ${isMenuOpen ? 'is-active' : ''}`}
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav-menu"
          onClick={onToggleMenu}
        >
          <span className="hamburger-box">
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </span>
        </button>
      </div>
    </header>
  );
};
