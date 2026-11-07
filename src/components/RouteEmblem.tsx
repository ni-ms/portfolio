import React from 'react';

interface RouteEmblemProps {
  className?: string;
  size?: number;
  color?: string;
}

export const RouteEmblem: React.FC<RouteEmblemProps> = ({
  className = '',
  size = 22,
  color = 'var(--color-accent, #D6FF64)',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`route-emblem ${className}`}
      aria-hidden="true"
    >
      {/* Outer angular path representing parkour rooftop route */}
      <path
        d="M3 4H10V9H15V14H21V20H14V15H9V10H3V4Z"
        fill={color}
        fillRule="evenodd"
      />
      {/* Small internal waypoint marker cutout */}
      <circle cx="6.5" cy="7" r="1.5" fill="var(--color-bg, #101414)" />
      <circle cx="17.5" cy="17" r="1.5" fill="var(--color-bg, #101414)" />
    </svg>
  );
};
