import React from 'react';

interface ProjectThumbnailProps {
  type: 'rooftop' | 'staircase' | 'schematic';
  className?: string;
}

export const ProjectThumbnail: React.FC<ProjectThumbnailProps> = ({ type, className = '' }) => {
  return (
    <div className={`project-thumbnail-wrapper ${className}`} aria-hidden="true">
      {type === 'rooftop' && (
        <svg viewBox="0 0 240 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="thumbnail-svg">
          <defs>
            <linearGradient id="thumbRoof1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#252f30" />
              <stop offset="100%" stopColor="#181e1f" />
            </linearGradient>
            <linearGradient id="thumbWall1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#192021" />
              <stop offset="100%" stopColor="#0e1313" />
            </linearGradient>
          </defs>
          {/* Main isometric rooftop block */}
          <polygon points="40,65 120,25 120,115 40,135" fill="url(#thumbWall1)" stroke="var(--color-border)" />
          <polygon points="120,25 200,65 200,135 120,115" fill="#121718" stroke="var(--color-border)" />
          <polygon points="40,65 120,25 200,65 120,95" fill="url(#thumbRoof1)" stroke="var(--color-border-light)" strokeWidth="1.5" />

          {/* Rooftop Parapet / HVAC unit */}
          <polygon points="90,55 115,42 140,55 115,67" fill="#2e3a3b" stroke="#3d4c4e" />
          <polygon points="90,55 115,67 115,82 90,70" fill="#1f2829" />
          <polygon points="115,67 140,55 140,70 115,82" fill="#151b1c" />

          {/* Lime route accent line and beacon */}
          <line x1="60" y1="75" x2="105" y2="58" stroke="var(--color-accent, #D6FF64)" strokeWidth="2" strokeDasharray="3 2" />
          <line x1="160" y1="55" x2="160" y2="25" stroke="var(--color-accent, #D6FF64)" strokeWidth="2" opacity="0.6" />
          <circle cx="160" cy="55" r="4" fill="var(--color-accent, #D6FF64)" />
        </svg>
      )}

      {type === 'staircase' && (
        <svg viewBox="0 0 240 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="thumbnail-svg">
          <defs>
            <linearGradient id="stairGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#222b2d" />
              <stop offset="100%" stopColor="#151b1c" />
            </linearGradient>
          </defs>
          {/* Base foundation platform */}
          <polygon points="50,90 120,55 190,90 120,125" fill="#131819" stroke="var(--color-border)" />

          {/* Stepped modular concrete stairs */}
          <g stroke="var(--color-border-light)" strokeWidth="1">
            {/* Step 1 */}
            <polygon points="70,95 100,80 115,88 85,103" fill="url(#stairGrad)" />
            {/* Step 2 */}
            <polygon points="85,82 115,67 130,75 100,90" fill="url(#stairGrad)" />
            {/* Step 3 */}
            <polygon points="100,69 130,54 145,62 115,77" fill="url(#stairGrad)" />
            {/* Top Landing */}
            <polygon points="115,56 155,36 185,51 145,71" fill="#2a3537" stroke="var(--color-border-accent)" strokeWidth="1.5" />
          </g>

          {/* Handrail line */}
          <path
            d="M85 85 L145 45 L175 60"
            stroke="var(--color-accent, #D6FF64)"
            strokeWidth="2"
            fill="none"
          />
          <circle cx="85" cy="85" r="2.5" fill="var(--color-accent, #D6FF64)" />
          <circle cx="175" cy="60" r="3" fill="var(--color-accent, #D6FF64)" />
        </svg>
      )}

      {type === 'schematic' && (
        <svg viewBox="0 0 240 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="thumbnail-svg">
          {/* Schematic grid background */}
          <g opacity="0.2" stroke="var(--color-concrete, #C8CAC7)" strokeWidth="0.75" strokeDasharray="3 3">
            <line x1="30" y1="30" x2="210" y2="30" />
            <line x1="30" y1="70" x2="210" y2="70" />
            <line x1="30" y1="110" x2="210" y2="110" />
            <line x1="60" y1="20" x2="60" y2="120" />
            <line x1="120" y1="20" x2="120" y2="120" />
            <line x1="180" y1="20" x2="180" y2="120" />
          </g>

          {/* Branching parkour route vector lines */}
          <path
            d="M40 90 H90 L130 50 H170 L200 80"
            stroke="var(--color-accent, #D6FF64)"
            strokeWidth="2.5"
            fill="none"
          />
          <path
            d="M90 90 V110 H150 L180 80"
            stroke="var(--color-border-accent)"
            strokeWidth="1.5"
            strokeDasharray="4 2"
            fill="none"
          />

          {/* Checkpoint nodes */}
          <circle cx="40" cy="90" r="4" fill="var(--color-accent, #D6FF64)" />
          <circle cx="90" cy="90" r="3" fill="var(--color-bg, #101414)" stroke="var(--color-accent, #D6FF64)" strokeWidth="1.5" />
          <circle cx="130" cy="50" r="3.5" fill="var(--color-accent, #D6FF64)" />
          <circle cx="170" cy="50" r="3" fill="var(--color-bg, #101414)" stroke="var(--color-accent, #D6FF64)" strokeWidth="1.5" />
          <circle cx="200" cy="80" r="5" fill="var(--color-accent, #D6FF64)" />

          {/* Node pulse ring */}
          <circle cx="200" cy="80" r="9" stroke="var(--color-accent, #D6FF64)" strokeWidth="1" strokeDasharray="2 2" fill="none" />
        </svg>
      )}
    </div>
  );
};
