import { sitePath } from '../routing/sitePath';
import React from 'react';
import { isNavigationCurrent, navigation, useNavigation } from '../routing/Router';
import { portfolioContent } from '../content/realPortfolio';
import { useTheme } from '../theme/ThemeProvider';

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
  const { path } = useNavigation();
  const { theme, toggleTheme } = useTheme();
  const { name } = portfolioContent.identity;
  return (
    <header className="site-header" role="banner">
      <div className="header-container">
        <a href={sitePath('/')} className="header-brand" aria-label={`${name} — Home`} aria-current={path === '/' ? 'page' : undefined}>
          <span>{name}</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="desktop-nav" aria-label="Primary navigation">
          <ul className="nav-list">
            {navigation.slice(1).map((item) => (
              <li key={item.href} className="nav-item">
                <a
                  href={sitePath(item.href)}
                  className="nav-link"
                  aria-current={isNavigationCurrent(path, item.href) ? 'page' : undefined}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          className="theme-toggle"
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            {theme === 'dark' ? (
              <path d="M20.7 14.7A8.8 8.8 0 0 1 9.3 3.3 9 9 0 1 0 20.7 14.7Z" />
            ) : (
              <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4m0-14.2-1.4 1.4M6.3 17.7l-1.4 1.4" /></>
            )}
          </svg>
        </button>
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
