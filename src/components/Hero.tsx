import React from 'react';
import { portfolioData } from '../content/portfolio';
import { FallbackHero } from './FallbackHero';

interface HeroProps {
  canvasSlot?: React.ReactNode;
  isFallback?: boolean;
  onDroneView?: () => void;
  onStartExploring?: () => void;
  onPlayMobile?: () => void;
  onNavigateSection?: (sectionId: string) => void;
  isPlaying?: boolean;
  onExitPlay?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  canvasSlot,
  isFallback = false,
  onDroneView,
  onStartExploring,
  onPlayMobile,
  onNavigateSection,
  isPlaying = false,
  onExitPlay,
}) => {
  const { hero } = portfolioData;

  const handleScrollToProjects = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (onNavigateSection) {
      onNavigateSection('work');
    } else {
      const el = document.getElementById('work');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section id="hero" className="hero-section" aria-label="Introduction and Interactive Rooftop Course">
      <div className="hero-container">
        {/* Left Column: Semantic Typography and Introduction */}
        <div className="hero-content">
          <div className="hero-eyebrow">
            <span className="eyebrow-dot" aria-hidden="true" />
            <span className="eyebrow-text">{hero.eyebrow}</span>
          </div>

          <h1 className="hero-headline">
            <span className="headline-line">{hero.headlineLine1}</span>
            <span className="headline-line headline-accent">{hero.headlineLine2}</span>
          </h1>

          <p className="hero-subhead">{hero.subhead}</p>

          <div className="hero-cta-wrapper">
            <a
              href="#work"
              className="hero-cta-link"
              onClick={handleScrollToProjects}
            >
              {hero.ctaWork}
            </a>
          </div>

          {/* Lower-left route graphic with checkpoint dots */}
          <div className="hero-route-indicator" aria-label="Exploration route progress indicator">
            <svg
              className="hero-route-svg"
              width="140"
              height="28"
              viewBox="0 0 140 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              {/* Stepped angular route line */}
              <path
                d="M10 20 H45 L65 8 H130"
                stroke="var(--color-accent, #D6FF64)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Checkpoint dots */}
              <circle cx="10" cy="20" r="3.5" fill="var(--color-accent, #D6FF64)" />
              <circle cx="45" cy="20" r="2.5" fill="var(--color-bg, #101414)" stroke="var(--color-accent, #D6FF64)" strokeWidth="1.5" />
              <circle cx="65" cy="8" r="2.5" fill="var(--color-bg, #101414)" stroke="var(--color-accent, #D6FF64)" strokeWidth="1.5" />
              <circle cx="130" cy="8" r="3.5" fill="var(--color-accent, #D6FF64)" />
            </svg>
            <span className="hero-route-caption">{hero.routeCaption}</span>
          </div>
        </div>

        {/* Right Column: 3D Rooftop Diorama Preview Container */}
        <div className="hero-diorama-wrapper">
          <div className={`diorama-viewport ${isPlaying ? 'is-playing' : ''}`}>
            {/* Diorama Canvas Slot or Fallback */}
            <div className="diorama-canvas-slot">
              {canvasSlot && !isFallback ? canvasSlot : <FallbackHero onNavigate={onNavigateSection} />}
            </div>

            {/* Overlaid Scene Checkpoint Labels (Desktop & Tablet) */}
            <div className="scene-labels-layer" aria-hidden="true">
              <a
                href="#work"
                className="scene-landmark scene-landmark-work"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateSection ? onNavigateSection('work') : document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span className="landmark-pin" />
                <span className="landmark-text">01 / WORK</span>
              </a>

              <a
                href="#explorations"
                className="scene-landmark scene-landmark-explorations"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateSection ? onNavigateSection('explorations') : document.getElementById('explorations')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span className="landmark-pin" />
                <span className="landmark-text">02 / EXPLORATIONS</span>
              </a>

              <a
                href="#resume"
                className="scene-landmark scene-landmark-resume"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateSection ? onNavigateSection('resume') : document.getElementById('resume')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span className="landmark-pin" />
                <span className="landmark-text">03 / RÉSUMÉ</span>
              </a>
            </div>

            {/* Top-Right: Drone View Control */}
            <div className="diorama-top-controls">
              <button
                type="button"
                className="drone-view-button"
                onClick={onDroneView}
                aria-label="Recenter drone camera view"
                title="Recenter drone camera view"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M3 12h3m12 0h3M12 3v3m0 12v3" />
                </svg>
                <span>{hero.droneControlLabel}</span>
              </button>

              {isPlaying && onExitPlay && (
                <button
                  type="button"
                  className="exit-play-button"
                  onClick={onExitPlay}
                  aria-label="Exit interactive play mode (Esc)"
                  title="Exit play mode"
                >
                  <span>EXIT (ESC)</span>
                </button>
              )}
            </div>

            {/* Bottom-Center: Keyboard Legend (Desktop) */}
            <div className="diorama-key-legend" aria-label="Desktop game control keys">
              <span>{hero.keyLegend}</span>
            </div>

            {/* Bottom-Right: Start Exploring Lime CTA (Desktop) */}
            {!isPlaying && (
              <div className="diorama-bottom-controls">
                <button
                  type="button"
                  className="start-exploring-button"
                  onClick={onStartExploring}
                  aria-label="Start exploring the interactive rooftop parkour course"
                >
                  <span>{hero.playButtonLabel}</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Play CTA Button: Full width lime button below inline preview container */}
          <div className="mobile-play-cta-wrapper">
            <button
              type="button"
              className="mobile-play-button"
              onClick={onPlayMobile || onStartExploring}
              aria-label="Play the parkour course in full screen"
            >
              <span>PLAY THE COURSE ↗</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
