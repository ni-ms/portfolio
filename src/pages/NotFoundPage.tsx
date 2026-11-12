import { sitePath } from '../routing/sitePath';
import React from 'react';

interface NotFoundPageProps {
  path?: string;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ path }) => {
  return (
    <div className="portfolio-page not-found-page-container">
      <div className="portfolio-frame portfolio-split not-found-card">
        <div className="portfolio-cell not-found-code" aria-hidden="true">404</div>
        <div className="portfolio-cell not-found-copy">
          <h1 className="not-found-title">Page Not Found</h1>

          <p className="not-found-prose">
            The requested address{path ? ` "${path}"` : ''} does not correspond to an existing portfolio page or project deep dive.
          </p>

          <div className="not-found-actions">
            <a href={sitePath('/')} className="cta-btn cta-btn-primary">
              Return to Home →
            </a>
            <a href={sitePath('/projects')} className="cta-btn cta-btn-secondary">
              Explore Selected Projects →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
