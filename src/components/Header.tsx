import React from 'react';
import { navigation, useNavigation } from '../routing/Router';
import { useTheme } from '../theme/ThemeProvider';
import { useNavIndicator } from '../motion/useNavIndicator';

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
  const { navRef, indicatorRef } = useNavIndicator(path);
  return (
    <header className="site-header" role="banner">
      <div className="header-container">
        <a href="/" className="header-brand" aria-label="Nikhil Sharma — Home">
          <span className="route-emblem header-emblem" aria-hidden="true" />
        </a>

        {/* Desktop Navigation */}
        <nav ref={navRef} className="desktop-nav" aria-label="Primary navigation">
          <ul className="nav-list">
            {navigation.map((item) => (
              <li key={item.href} className="nav-item">
                <a
                  href={item.href}
                  className="nav-link"
                  aria-current={(path === item.href || (item.href !== '/' && path.startsWith(item.href + '/'))) ? 'page' : undefined}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <span ref={indicatorRef} className="nav-active-indicator" aria-hidden="true" />
        </nav>

        <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>{theme === 'dark' ? '☾' : '☼'}</button>
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
