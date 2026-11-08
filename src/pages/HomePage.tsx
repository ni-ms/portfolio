import React, { ReactNode } from 'react';
import { portfolioContent } from '../content/realPortfolio';
import { PhotoPlaceholder } from '../components/PhotoPlaceholder';
import { ProjectCard } from '../components/ProjectCard';

interface HomePageProps {
  gameSlot?: ReactNode;
}

export const HomePage: React.FC<HomePageProps> = ({ gameSlot }) => {
  const { identity, home, projects } = portfolioContent;

  return (
    <div className="home-page-container">
      {/* 1. Desktop Side-by-Side Hero (Identity & Actions Left, Game Slot Right) */}
      <section className="home-hero-section" aria-labelledby="home-owner-heading">
        <div className="home-hero-grid">
          {/* Left Column: Dominant Name, Photo, Role, Intro, Degree, Action Links */}
          <div className="home-hero-left">
            <div className="home-identity-row">
              <PhotoPlaceholder className="home-photo" />
              <div className="home-name-wrap">
                <h1 id="home-owner-heading" className="home-owner-name">
                  {identity.name}
                </h1>
                <p className="home-role-title">{identity.title}</p>
              </div>
            </div>

            <p className="home-intro-paragraph">{home.intro}</p>

            <div className="home-education-line">
              <span className="education-bullet" aria-hidden="true">■</span>
              <span>{home.education}</span>
            </div>

            {/* Actions: View Résumé & Contact / Get in Touch */}
            <div className="home-cta-row">
              <a href="/resume" className="cta-btn cta-btn-primary">
                {home.ctaResume}
              </a>
              <a href="/about#contact" className="cta-btn cta-btn-secondary">
                Get in Touch →
              </a>
            </div>
          </div>

          {/* Right Column: Interactive 3D Rooftop Simulation (Borderless, soft feathered boundary) */}
          <div className="home-hero-right">
            <div className="home-game-slot-container" aria-label="3D Rooftop Simulation">
              {gameSlot ? (
                <div className="game-slot-wrapper">{gameSlot}</div>
              ) : (
                <div className="home-fallback-preview" role="region" aria-label="Course Preview">
                  <div className="fallback-blueprint-graphic">
                    <svg viewBox="0 0 640 380" fill="none" xmlns="http://www.w3.org/2000/svg" className="fallback-blueprint-svg" aria-hidden="true">
                      <defs>
                        <linearGradient id="blueprintGrad" x1="0" y1="0" x2="640" y2="380" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#171d1e" />
                          <stop offset="100%" stopColor="#101414" />
                        </linearGradient>
                      </defs>
                      <rect width="640" height="380" fill="url(#blueprintGrad)" />
                      {/* Grid Lines */}
                      <g stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.6">
                        <line x1="40" y1="0" x2="40" y2="380" />
                        <line x1="120" y1="0" x2="120" y2="380" />
                        <line x1="200" y1="0" x2="200" y2="380" />
                        <line x1="280" y1="0" x2="280" y2="380" />
                        <line x1="360" y1="0" x2="360" y2="380" />
                        <line x1="440" y1="0" x2="440" y2="380" />
                        <line x1="520" y1="0" x2="520" y2="380" />
                        <line x1="600" y1="0" x2="600" y2="380" />
                        <line x1="0" y1="70" x2="640" y2="70" />
                        <line x1="0" y1="140" x2="640" y2="140" />
                        <line x1="0" y1="210" x2="640" y2="210" />
                        <line x1="0" y1="280" x2="640" y2="280" />
                      </g>
                      {/* Isometric course platforms */}
                      <polygon points="100,240 220,170 320,230 200,300" fill="#1e2728" stroke="var(--color-border-light)" strokeWidth="1.5" />
                      <polygon points="220,170 340,100 440,160 320,230" fill="#242f31" stroke="var(--color-accent)" strokeWidth="1.5" />
                      <polygon points="360,220 480,150 580,210 460,280" fill="#1b2324" stroke="var(--color-border-light)" strokeWidth="1.5" />
                      {/* Trajectory */}
                      <path d="M200,230 Q 320,130 440,160 T 520,210" stroke="var(--color-accent)" strokeWidth="2.5" strokeDasharray="6 4" fill="none" />
                      <circle cx="200" cy="230" r="5" fill="var(--color-accent)" />
                      <circle cx="440" cy="160" r="6" fill="var(--color-accent)" />
                      <circle cx="520" cy="210" r="4" fill="var(--color-accent)" />
                    </svg>
                  </div>

                  <div className="fallback-controls-overlay">
                    <div className="fallback-status-line">
                      <span className="fallback-indicator-dot" />
                      <span className="fallback-status-text">ROOFTOP COURSE · {home.routeCaption}</span>
                    </div>
                    <div className="fallback-legend">
                      <span className="legend-key">{home.keyLegend}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Selected Projects Section (Compact Image + Name + One Sentence Previews) */}
      <section className="home-projects-section" aria-labelledby="home-projects-heading">
        <div className="section-divider-header">
          <div className="divider-line" />
          <div className="section-label-badge">
            <span className="section-badge-dot" />
            <h2 id="home-projects-heading" className="section-badge-title">
              SELECTED PROJECTS
            </h2>
          </div>
        </div>

        <div className="home-projects-grid">
          {projects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              variant="compact"
            />
          ))}
        </div>

        <div className="home-projects-footer-action">
          <a href="/projects" className="home-all-projects-link">
            <span>View All Projects &amp; Technical Deep Dives</span>
            <span className="link-arrow">→</span>
          </a>
        </div>
      </section>
    </div>
  );
};
