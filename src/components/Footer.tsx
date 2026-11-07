import React from 'react';
import { portfolioData } from '../content/portfolio';
import { RouteEmblem } from './RouteEmblem';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="footer-container">
        <div className="footer-left">
          <RouteEmblem size={18} />
          <span className="footer-copy">
            © {currentYear} {portfolioData.owner.name}. ALL RIGHTS RESERVED.
          </span>
        </div>

        <div className="footer-middle">
          <span className="footer-status-pill">
            <span className="status-indicator-light" aria-hidden="true" />
            <span>COURSE RUNTIME: STABLE</span>
          </span>
        </div>

        <div className="footer-right">
          <a href="#hero" className="footer-back-to-top" onClick={scrollToTop}>
            <span>BACK TO TOP ↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
