import { sitePath } from '../routing/sitePath';
import React, { useRef } from 'react';
import { isNavigationCurrent, navigation, useNavigation } from '../routing/Router';
import { portfolioContent } from '../content/realPortfolio';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  triggerButtonRef?: React.RefObject<HTMLButtonElement | null>;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  triggerButtonRef,
}) => {
  const { path } = useNavigation();
  const menuRef = useRef<HTMLDivElement>(null);

  useFocusTrap(menuRef, {
    isActive: isOpen,
    onClose,
    returnFocusRef: triggerButtonRef,
  });

  if (!isOpen) return null;

  return (
    <div
      className="mobile-menu-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={menuRef}
        id="mobile-nav-menu"
        className="mobile-menu-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
        tabIndex={-1}
      >
        <div className="mobile-menu-header">
          <div className="mobile-menu-brand">
            <span className="brand-name">Navigation</span>
          </div>
          <button
            type="button"
            className="mobile-menu-close"
            onClick={onClose}
            aria-label="Close navigation menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <nav className="mobile-menu-nav" aria-label="Mobile primary navigation">
          <ul className="mobile-menu-list">
            {navigation.map((item) => (
              <li key={item.href} className="mobile-menu-item">
                <a
                  href={sitePath(item.href)}
                  className="mobile-menu-link"
                  aria-current={isNavigationCurrent(path, item.href) ? 'page' : undefined}
                  onClick={() => {
                    onClose();
                  }}
                >
                  <span className="mobile-menu-label">{item.href === '/' ? portfolioContent.identity.name : item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

      </div>
    </div>
  );
};
