import React from 'react';

interface PhotoPlaceholderProps {
  className?: string;
}

/**
 * Small accessible passport-shaped photo placeholder.
 * Sized ~44x58px on desktop, neutral geometric silhouette.
 * No AI portrait/likeness is generated, complying with privacy and portfolio brief.
 */
export const PhotoPlaceholder: React.FC<PhotoPlaceholderProps> = ({ className = '' }) => {
  return (
    <div
      className={`photo-placeholder ${className}`}
      role="img"
      aria-label="Photo placeholder (no portrait supplied)"
      title="Photo placeholder (no portrait supplied)"
    >
      <svg
        viewBox="0 0 44 58"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="photo-placeholder-svg"
        aria-hidden="true"
      >
        <rect
          x="1"
          y="1"
          width="42"
          height="56"
          rx="3"
          className="photo-frame"
          stroke="var(--color-border)"
          strokeWidth="1.5"
          fill="var(--color-surface)"
        />
        {/* Subtle geometric portrait silhouette */}
        <circle
          cx="22"
          cy="22"
          r="9"
          className="photo-head"
          fill="var(--color-text-dim)"
        />
        <path
          d="M9 48 C9 38 15 35 22 35 C29 35 35 38 35 48"
          className="photo-body"
          fill="var(--color-text-dim)"
        />
        {/* Corner registration crosshairs for passport/schematic theme */}
        <path d="M4 8 H7 M4 8 V11" stroke="var(--color-accent)" strokeWidth="1" opacity="0.6" />
        <path d="M40 8 H37 M40 8 V11" stroke="var(--color-accent)" strokeWidth="1" opacity="0.6" />
        <path d="M4 50 H7 M4 50 V47" stroke="var(--color-accent)" strokeWidth="1" opacity="0.6" />
        <path d="M40 50 H37 M40 50 V47" stroke="var(--color-accent)" strokeWidth="1" opacity="0.6" />
      </svg>
    </div>
  );
};
