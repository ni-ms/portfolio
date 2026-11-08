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
      {/* 1. Identity & Hero Introduction */}
      <section className="home-hero-section" aria-labelledby="home-headline">
        <div className="home-hero-layout">
          {/* Identity Header */}
          <div className="home-identity-header">
            <PhotoPlaceholder className="home-photo" />
            <div className="home-identity-text">
              <span className="home-eyebrow">{home.eyebrow}</span>
              <h1 className="home-owner-name">{identity.name}</h1>
              <p className="home-role-title">{identity.title}</p>
              <div className="home-meta-chips">
                <span className="home-meta-chip">{home.education}</span>
                <span className="home-meta-chip-sep" aria-hidden="true">·</span>
                <span className="home-meta-chip">{home.experienceSignal}</span>
              </div>
            </div>
          </div>

          {/* Main Headline */}
          <div className="home-headline-group">
            <h2 id="home-headline" className="home-display-headline">
              <span className="headline-line-1">{home.headlineLine1}</span>
              <span className="headline-line-2">{home.headlineLine2}</span>
            </h2>
            <p className="home-intro-paragraph">{home.intro}</p>

            {/* Main Action CTAs */}
            <div className="home-cta-row">
              <a href="/projects" className="cta-btn cta-btn-primary">
                {home.ctaProjects}
              </a>
              <a href="/resume" className="cta-btn cta-btn-secondary">
                {home.ctaResume}
              </a>
            </div>
          </div>
        </div>

        {/* 2. Interactive 3D Rooftop Experience Slot (Home only) */}
        <div className="home-experience-slot" aria-label="3D Rooftop Simulation">
          {gameSlot ? (
            <div className="game-slot-wrapper">{gameSlot}</div>
          ) : (
            <div className="home-fallback-preview" role="region" aria-label="Course Preview">
              <div className="fallback-blueprint-graphic">
                <svg viewBox="0 0 800 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="fallback-blueprint-svg" aria-hidden="true">
                  <defs>
                    <linearGradient id="blueprintGrad" x1="0" y1="0" x2="800" y2="280" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#171d1e" />
                      <stop offset="100%" stopColor="#101414" />
                    </linearGradient>
                  </defs>
                  <rect width="800" height="280" fill="url(#blueprintGrad)" stroke="var(--color-border)" strokeWidth="1" />
                  {/* Grid Lines */}
                  <g stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.6">
                    <line x1="50" y1="0" x2="50" y2="280" />
                    <line x1="150" y1="0" x2="150" y2="280" />
                    <line x1="250" y1="0" x2="250" y2="280" />
                    <line x1="350" y1="0" x2="350" y2="280" />
                    <line x1="450" y1="0" x2="450" y2="280" />
                    <line x1="550" y1="0" x2="550" y2="280" />
                    <line x1="650" y1="0" x2="650" y2="280" />
                    <line x1="750" y1="0" x2="750" y2="280" />
                    <line x1="0" y1="70" x2="800" y2="70" />
                    <line x1="0" y1="140" x2="800" y2="140" />
                    <line x1="0" y1="210" x2="800" y2="210" />
                  </g>
                  {/* Isometric platforms representation */}
                  <polygon points="120,180 260,110 380,170 240,240" fill="#1e2728" stroke="var(--color-border-light)" strokeWidth="1.5" />
                  <polygon points="260,110 400,40 520,100 380,170" fill="#242f31" stroke="var(--color-border-accent)" strokeWidth="1.5" />
                  <polygon points="420,170 560,100 680,160 540,230" fill="#1b2324" stroke="var(--color-border-light)" strokeWidth="1.5" />
                  {/* Route trajectory */}
                  <path d="M240 170 Q 380 90, 520 100 T 600 180" stroke="var(--color-accent)" strokeWidth="2.5" strokeDasharray="6 4" fill="none" />
                  <circle cx="240" cy="170" r="5" fill="var(--color-accent)" />
                  <circle cx="520" cy="100" r="6" fill="var(--color-accent)" />
                  <circle cx="600" cy="180" r="4" fill="var(--color-accent)" />
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
      </section>

      {/* 3. Selected Projects Section */}
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
          {projects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              featured={index === 0}
            />
          ))}
        </div>

        <div className="home-projects-footer-action">
          <a href="/projects" className="home-all-projects-link">
            <span>Explore All Projects &amp; Technical Deep Dives</span>
            <span className="link-arrow">→</span>
          </a>
        </div>
      </section>

      {/* 4. Experience & Background Teaser */}
      <section className="home-experience-teaser" aria-labelledby="home-background-heading">
        <div className="section-divider-header">
          <div className="divider-line" />
          <div className="section-label-badge">
            <span className="section-badge-dot" />
            <h2 id="home-background-heading" className="section-badge-title">
              BACKGROUND &amp; SYSTEMS
            </h2>
          </div>
        </div>

        <div className="teaser-card">
          <div className="teaser-content">
            <p className="teaser-prose">
              Nearly 3 years building production software across healthcare platforms (Intuitive Surgical via Tech Mahindra), fraud analytics (Nationwide via Styrone), and enterprise systems (Exeevo). Currently pursuing an M.S. in Software Engineering at Carnegie Mellon (Silicon Valley campus).
            </p>
            <div className="teaser-actions">
              <a href="/resume" className="teaser-link">
                View Full Résumé &amp; Experience →
              </a>
              <a href="/about#contact" className="teaser-link">
                Get in Touch →
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
