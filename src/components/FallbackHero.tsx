import React from 'react';
import { RouteEmblem } from './RouteEmblem';

interface FallbackHeroProps {
  onNavigate?: (sectionId: string) => void;
  message?: string;
}

export const FallbackHero: React.FC<FallbackHeroProps> = ({
  onNavigate,
  message = 'WebGL acceleration is unavailable or disabled. Rendering high-contrast 2D architectural schematic.',
}) => {
  return (
    <div className="fallback-hero" role="region" aria-label="Rooftop Parkour Schematic Fallback">
      <div className="fallback-hero-content">
        <div className="fallback-badge">
          <RouteEmblem size={14} />
          <span>SCHEMATIC PREVIEW / 2D FALLBACK</span>
        </div>

        {/* Architectural SVG Schematic */}
        <div className="fallback-schematic-container">
          <svg
            className="fallback-svg"
            viewBox="0 0 600 380"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="roofGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1e2627" />
                <stop offset="100%" stopColor="#151b1c" />
              </linearGradient>
              <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#171d1e" />
                <stop offset="100%" stopColor="#0d1112" />
              </linearGradient>
              <linearGradient id="limeBeam" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D6FF64" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#D6FF64" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Ground grid gridlines */}
            <g opacity="0.15" stroke="var(--color-concrete, #C8CAC7)" strokeWidth="0.75" strokeDasharray="3 3">
              <line x1="60" y1="320" x2="540" y2="320" />
              <line x1="120" y1="350" x2="480" y2="350" />
              <line x1="150" y1="280" x2="520" y2="280" />
            </g>

            {/* Rooftop 1: Start Platform (Foreground Left) */}
            <g id="schematic-start">
              {/* Pillar/Walls */}
              <polygon points="90,260 170,220 170,300 90,340" fill="url(#wallGrad)" stroke="var(--color-border)" />
              <polygon points="170,220 250,260 250,340 170,300" fill="#121718" stroke="var(--color-border)" />
              {/* Roof Top */}
              <polygon points="90,260 170,220 250,260 170,300" fill="url(#roofGrad)" stroke="var(--color-border-light)" strokeWidth="1.5" />
              {/* Start marking */}
              <circle cx="170" cy="260" r="8" fill="#D6FF64" fillOpacity="0.2" stroke="#D6FF64" strokeWidth="1.5" />
              <text x="170" y="263" textAnchor="middle" fill="#D6FF64" fontSize="8" fontFamily="var(--font-mono)">START</text>
            </g>

            {/* Rooftop 2: Work Rooftop (Back Left) */}
            <g id="schematic-work">
              {/* Tall tower */}
              <polygon points="60,140 140,100 140,240 60,280" fill="url(#wallGrad)" stroke="var(--color-border)" />
              <polygon points="140,100 220,140 220,280 140,240" fill="#121718" stroke="var(--color-border)" />
              <polygon points="60,140 140,100 220,140 140,180" fill="url(#roofGrad)" stroke="var(--color-border-light)" strokeWidth="1.5" />
              {/* HVAC box */}
              <polygon points="90,140 115,127 140,140 115,153" fill="#242e30" stroke="#374547" />
              {/* Beacon 01 */}
              <line x1="175" y1="130" x2="175" y2="80" stroke="url(#limeBeam)" strokeWidth="2" />
              <circle cx="175" cy="130" r="5" fill="#D6FF64" />
            </g>

            {/* Stepping Platforms / Stairs */}
            <g id="schematic-stairs" stroke="var(--color-border-light)" strokeWidth="1">
              <polygon points="210,195 235,182 250,190 225,203" fill="#1a2223" />
              <polygon points="230,210 255,197 270,205 245,218" fill="#1a2223" />
              <polygon points="250,225 275,212 290,220 265,233" fill="#1a2223" />
            </g>

            {/* Rooftop 3: Central Explorations Rooftop */}
            <g id="schematic-explorations">
              <polygon points="260,170 340,130 340,260 260,300" fill="url(#wallGrad)" stroke="var(--color-border)" />
              <polygon points="340,130 420,170 420,300 340,260" fill="#121718" stroke="var(--color-border)" />
              <polygon points="260,170 340,130 420,170 340,210" fill="url(#roofGrad)" stroke="var(--color-border-light)" strokeWidth="1.5" />
              {/* Beacon 02 */}
              <line x1="340" y1="165" x2="340" y2="105" stroke="url(#limeBeam)" strokeWidth="2" />
              <circle cx="340" cy="165" r="5" fill="#D6FF64" />
            </g>

            {/* Beam bridge */}
            <line x1="395" y1="185" x2="455" y2="155" stroke="#D6FF64" strokeWidth="2" strokeDasharray="4 2" />

            {/* Rooftop 4: Resume Rooftop (Right) */}
            <g id="schematic-resume">
              <polygon points="430,130 510,90 510,210 430,250" fill="url(#wallGrad)" stroke="var(--color-border)" />
              <polygon points="510,90 580,125 580,245 510,210" fill="#121718" stroke="var(--color-border)" />
              <polygon points="430,130 510,90 580,125 500,165" fill="url(#roofGrad)" stroke="var(--color-border-light)" strokeWidth="1.5" />
              {/* Beacon 03 */}
              <line x1="500" y1="125" x2="500" y2="65" stroke="url(#limeBeam)" strokeWidth="2" />
              <circle cx="500" cy="125" r="5" fill="#D6FF64" />
            </g>

            {/* Parkour Route Trajectory Lines */}
            <path
              d="M170 260 L175 130 L265 233 L340 165 L455 155 L500 125"
              stroke="#D6FF64"
              strokeWidth="2.5"
              strokeDasharray="6 4"
              fill="none"
              opacity="0.9"
            />

            {/* Checkpoint labels overlay in SVG */}
            <g fontFamily="var(--font-mono)" fontSize="11" fontWeight="600">
              {/* CP 01 */}
              <rect x="125" y="55" width="85" height="22" rx="3" fill="#101414" stroke="#D6FF64" strokeWidth="1" />
              <text x="167" y="70" textAnchor="middle" fill="#D6FF64">01 / WORK</text>

              {/* CP 02 */}
              <rect x="290" y="80" width="135" height="22" rx="3" fill="#101414" stroke="#D6FF64" strokeWidth="1" />
              <text x="357" y="95" textAnchor="middle" fill="#D6FF64">02 / EXPLORATIONS</text>

              {/* CP 03 */}
              <rect x="465" y="40" width="95" height="22" rx="3" fill="#101414" stroke="#D6FF64" strokeWidth="1" />
              <text x="512" y="55" textAnchor="middle" fill="#D6FF64">03 / RÉSUMÉ</text>
            </g>
          </svg>
        </div>

        <p className="fallback-note">{message}</p>

        {/* Direct checkpoint jump links */}
        <div className="fallback-actions">
          <span className="fallback-action-label">JUMP TO SECTION:</span>
          <div className="fallback-chips">
            <a
              href="#work"
              className="fallback-chip"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate('work');
                }
              }}
            >
              01 / WORK ↗
            </a>
            <a
              href="#explorations"
              className="fallback-chip"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate('explorations');
                }
              }}
            >
              02 / EXPLORATIONS ↗
            </a>
            <a
              href="#resume"
              className="fallback-chip"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate('resume');
                }
              }}
            >
              03 / RÉSUMÉ ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
