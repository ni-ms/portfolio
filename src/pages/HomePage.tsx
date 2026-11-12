import { HeadingWords } from '../components/HeadingWords';
import { sitePath } from '../routing/sitePath';
import { Fragment, useRef, type ReactNode } from 'react';
import { useHomeMotion } from '../motion/useHomeMotion';
import { portfolioContent } from '../content/realPortfolio';
import { PhotoPlaceholder } from '../components/PhotoPlaceholder';
import { ProjectCard } from '../components/ProjectCard';
import '../styles/home-grid.css';

interface HomePageProps {
  gameSlot?: ReactNode;
}

export function HomePage({ gameSlot }: HomePageProps) {
  const pageRef = useRef<HTMLDivElement>(null);
  useHomeMotion(pageRef);
  const { identity, home, projects, about } = portfolioContent;
  const roleLines = identity.title.match(/^(.+? &) (.+) (\S+)$/)?.slice(1) ?? [identity.title];

  return (
    <div className="portfolio-page home-page-container" ref={pageRef}>
      <div className="portfolio-frame">
        <div className="home-scene">
          <div className="home-opening">
            <div className="home-intro">
              <section className="portfolio-split home-hero-grid" aria-labelledby="home-owner-heading">
                <div className="portfolio-cell home-role-panel">
                  <p className="home-role-title">
                    {roleLines.map((line, index) => (
                      <span key={line} className={index === 1 ? 'home-title-line home-title-accent' : 'home-title-line'}>
                        {line.split(' ').map((word, wordIndex) => (
                          <Fragment key={wordIndex}>
                            {wordIndex > 0 && ' '}
                            <span className="home-title-word">{word}</span>
                          </Fragment>
                        ))}
                        {index < roleLines.length - 1 && ' '}
                      </span>
                    ))}
                  </p>
                  <div className="home-hero-actions">
                    <a href={sitePath('/projects')} className="home-primary-link">
                      View projects <span aria-hidden="true">↗</span>
                    </a>
                    <a href={sitePath('/#parkour-game')} className="home-game-link">
                      Parkour Game <span aria-hidden="true">↓</span>
                    </a>
                  </div>
                </div>

                <div className="portfolio-cell home-profile-panel">
                  <div className="home-profile-grid" aria-hidden="true">
                    <span /><span /><span /><span />
                  </div>
                  <div className="home-profile-copy">
                    <div className="home-identity-row">
                      <PhotoPlaceholder className="home-photo" />
                      <div>
                        <h1 id="home-owner-heading"><HeadingWords>{identity.name}</HeadingWords></h1>
                        <p className="home-location">{identity.location}</p>
                      </div>
                    </div>
                    <p className="home-intro-paragraph">{home.intro}</p>
                    <p className="home-education-line">{home.education}</p>
                    <div className="home-cta-row">
                      <a href={sitePath('/resume')}>{home.ctaResume}</a>
                      <a href={sitePath('/about')}>About me →</a>
                    </div>
                  </div>
                </div>
              </section>

              <ul className="home-focus-grid" aria-label="Areas of focus">
                {about.focus.map((area) => <li key={area}>{area}</li>)}
              </ul>
            </div>

            <div className="home-section-heading home-projects-heading">
              <h2 id="home-projects-heading"><HeadingWords>Selected projects</HeadingWords></h2>
              <a href={sitePath('/projects')}>All projects <span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <section className="home-projects-reveal" aria-labelledby="home-projects-heading">
            <div className="home-projects-grid">
              {projects.map((project) => (
                <ProjectCard key={project.slug} project={project} variant="landing" />
              ))}
            </div>
          </section>
        </div>

        <section className="home-rooftops" id="parkour-game" aria-labelledby="home-rooftops-heading">
          <div className="home-section-heading">
            <h2 id="home-rooftops-heading"><HeadingWords>Parkour Game</HeadingWords></h2>
          </div>
          <div className="home-game-slot-container">
            {gameSlot ? (
              <div className="game-slot-wrapper">{gameSlot}</div>
            ) : (
              <div className="home-fallback-preview" role="region" aria-label="Course Preview">
                <div className="fallback-blueprint-graphic">
                  <svg viewBox="0 0 640 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="fallback-blueprint-svg" aria-hidden="true">
                    <defs>
                      <linearGradient id="blueprintGrad" x1="0" y1="0" x2="640" y2="320" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="var(--color-surface)" />
                        <stop offset="100%" stopColor="var(--color-bg)" />
                      </linearGradient>
                    </defs>
                    <rect width="640" height="320" fill="url(#blueprintGrad)" />
                    {/* Grid Lines */}
                    <g stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.6">
                      <line x1="40" y1="0" x2="40" y2="320" />
                      <line x1="120" y1="0" x2="120" y2="320" />
                      <line x1="200" y1="0" x2="200" y2="320" />
                      <line x1="280" y1="0" x2="280" y2="320" />
                      <line x1="360" y1="0" x2="360" y2="320" />
                      <line x1="440" y1="0" x2="440" y2="320" />
                      <line x1="520" y1="0" x2="520" y2="320" />
                      <line x1="600" y1="0" x2="600" y2="320" />
                      <line x1="0" y1="60" x2="640" y2="60" />
                      <line x1="0" y1="130" x2="640" y2="130" />
                      <line x1="0" y1="200" x2="640" y2="200" />
                      <line x1="0" y1="260" x2="640" y2="260" />
                    </g>
                    {/* Themed isometric platforms */}
                    <polygon points="100,200 220,140 320,190 200,250" className="fallback-plat fallback-plat-1" stroke="var(--color-border-light)" strokeWidth="1.5" />
                    <polygon points="220,140 340,80 440,130 320,190" className="fallback-plat fallback-plat-2" stroke="var(--color-accent)" strokeWidth="1.5" />
                    <polygon points="360,180 480,120 580,170 460,230" className="fallback-plat fallback-plat-3" stroke="var(--color-border-light)" strokeWidth="1.5" />
                    {/* Trajectory */}
                    <path d="M200,190 Q 320,100 440,130 T 520,170" stroke="var(--color-accent)" strokeWidth="2.5" strokeDasharray="6 4" fill="none" />
                    <circle cx="200" cy="190" r="5" fill="var(--color-accent)" />
                    <circle cx="440" cy="130" r="6" fill="var(--color-accent)" />
                    <circle cx="520" cy="170" r="4" fill="var(--color-accent)" />
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
      </div>
    </div>
  );
}
