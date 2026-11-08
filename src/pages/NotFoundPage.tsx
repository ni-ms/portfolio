import React from 'react';

interface NotFoundPageProps {
  path?: string;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ path }) => {
  return (
    <div className="not-found-page-container">
      <div className="not-found-card">
        <div className="not-found-badge">
          <span className="not-found-dot" aria-hidden="true" />
          <span>404 ERROR / ROUTE UNKNOWN</span>
        </div>

        <h1 className="not-found-title">Page Not Found</h1>

        <p className="not-found-prose">
          The requested address{path ? ` "${path}"` : ''} does not correspond to an existing portfolio page or project deep dive.
        </p>

        <div className="not-found-actions">
          <a href="/" className="cta-btn cta-btn-primary">
            Return to Home →
          </a>
          <a href="/projects" className="cta-btn cta-btn-secondary">
            Explore Selected Projects →
          </a>
        </div>
      </div>
    </div>
  );
};
