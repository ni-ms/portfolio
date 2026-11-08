import React, { useRef } from 'react';
import { navigation } from '../routing/Router';
import { RouteEmblem } from './RouteEmblem';
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
            <RouteEmblem size={20} />
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
            {navigation.map((item, index) => (
              <li key={item.href} className="mobile-menu-item">
                <a
                  href={item.href}
                  className="mobile-menu-link"
                  onClick={() => {
                    onClose();
                  }}
                  
                >
                  <span className="mobile-menu-index">0{index + 1}</span>
                  <span className="mobile-menu-label">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mobile-menu-footer">
          <div className="mobile-menu-meta">
            <p className="mobile-menu-headline">Software & Applied AI Engineer</p>
            <p className="mobile-menu-location">Carnegie Mellon · Expected 2027</p>
          </div>
          <div className="mobile-menu-pace">
            <RouteEmblem size={14} />
            <span>EXPLORE AT YOUR OWN PACE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
