import React, { Suspense, useMemo, useState, useEffect } from 'react';
import '../styles/home-game.css';
import { useGameStore } from '../game/gameStore';

export interface HomeGameProps {
  theme?: 'dark' | 'light';
  onNavigate?: (href: string) => void;
  className?: string;
  style?: React.CSSProperties;
  forceDeterministic?: boolean;
}

// Lazy-load the heavy 3D GameExperience bundle to ensure content-first loading
const LazyGameExperience = React.lazy(() => import('../game/GameExperience'));

/**
 * Detect runtime WebGL support cleanly without side effects.
 * Interceptions (such as tests mocking getContext) are respected.
 */
function checkWebGLAvailable(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    return Boolean(gl);
  } catch {
    return false;
  }
}

/**
 * Robust Error Boundary catching any WebGL context loss or R3F render failures
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class GameErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { fallback: React.ReactNode; children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('[HomeGame] 3D canvas caught error; rendering resilient static fallback:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

/**
 * Static theme-matched fallback and loading UI
 * Provides accessible graphic representation and functional links to all checkpoint routes.
 */
export const StaticGameFallback: React.FC<{
  theme: 'dark' | 'light';
  onNavigate?: (href: string) => void;
  isUnsupported?: boolean;
}> = ({ theme, onNavigate, isUnsupported = false }) => {
  const isDark = theme === 'dark';

  const handleLink = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(href);
    }
  };

  return (
    <div
      className="home-game-fallback"
      role="region"
      aria-label="Rooftop Course Preview"
      data-testid="home-game-fallback"
    >
      {/* Themed isometric blueprint SVG */}
      <div className="home-game-fallback-graphic" aria-hidden="true">
        <svg
          viewBox="0 0 640 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="home-game-fallback-svg"
        >
          <defs>
            <linearGradient id="staticGrad" x1="0" y1="0" x2="640" y2="320" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={isDark ? '#171D1E' : '#E4E6DF'} />
              <stop offset="100%" stopColor={isDark ? '#101414' : '#F2F1EA'} />
            </linearGradient>
          </defs>
          <rect width="640" height="320" fill="url(#staticGrad)" />

          {/* Isometric grid */}
          <g stroke={isDark ? '#232C2D' : '#C8CDC4'} strokeWidth="0.5" strokeDasharray="4 4" opacity="0.6">
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
          <polygon
            points="100,200 220,140 320,190 200,250"
            fill={isDark ? '#1E2728' : '#D0D5CC'}
            stroke={isDark ? 'rgba(242, 241, 234, 0.15)' : 'rgba(16, 20, 20, 0.15)'}
            strokeWidth="1.5"
          />
          <polygon
            points="220,140 340,80 440,130 320,190"
            fill={isDark ? '#242F31' : '#D8DDD4'}
            stroke="#D6FF64"
            strokeWidth="1.5"
          />
          <polygon
            points="360,180 480,120 580,170 460,230"
            fill={isDark ? '#1B2324' : '#C8CDC4'}
            stroke={isDark ? 'rgba(242, 241, 234, 0.15)' : 'rgba(16, 20, 20, 0.15)'}
            strokeWidth="1.5"
          />

          {/* Trajectory */}
          <path
            d="M200,190 Q 320,100 440,130 T 520,170"
            stroke="#D6FF64"
            strokeWidth="2.5"
            strokeDasharray="6 4"
            fill="none"
          />
          <circle cx="200" cy="190" r="5" fill="#D6FF64" />
          <circle cx="440" cy="130" r="6" fill="#D6FF64" />
          <circle cx="520" cy="170" r="4" fill="#D6FF64" />
        </svg>
      </div>

      {/* Header status bar */}
      <div className="home-game-fallback-header">
        <div className="home-game-fallback-tag">
          <span className="fallback-tag-dot" />
          <span>ROOFTOP COURSE · {isUnsupported ? 'STATIC PREVIEW' : '3D SIMULATION'}</span>
        </div>
      </div>

      {/* Footer navigation links */}
      <div className="home-game-fallback-footer">
        <div className="home-game-fallback-links">
          <a
            href="/projects"
            onClick={(e) => handleLink(e, '/projects')}
            className="home-game-fallback-link"
          >
            01 / Projects ↗
          </a>
          <a
            href="/about"
            onClick={(e) => handleLink(e, '/about')}
            className="home-game-fallback-link"
          >
            02 / Explorations ↗
          </a>
          <a
            href="/resume"
            onClick={(e) => handleLink(e, '/resume')}
            className="home-game-fallback-link"
          >
            03 / Résumé ↗
          </a>
        </div>
        <div className="home-game-fallback-status">
          {isUnsupported ? 'WebGL unavailable · Fast navigation active' : 'Course ready'}
        </div>
      </div>
    </div>
  );
};

/**
 * HomeGame - Canonical Home 3D Game experience boundary conforming to T06.
 *
 * - Lazy-loads GameExperience with zero loading lag on page content.
 * - Detects WebGL availability and catches runtime context loss, falling back gracefully.
 * - Soft perimeter atmosphere (feather fade + peripheral blur) surrounding crisp center.
 * - Sized cleanly to fit hero slot wrapper without rectangular clipping.
 * - Clean lifecycle: unmounts on inner route navigation without lingering listeners or physics.
 */
export const HomeGame: React.FC<HomeGameProps> = ({
  theme = 'dark',
  onNavigate,
  className = '',
  style,
  forceDeterministic = false,
}) => {
  const mode = useGameStore((s) => s.mode);
  const [webGLAvailable, setWebGLAvailable] = useState(true);

  useEffect(() => {
    setWebGLAvailable(checkWebGLAvailable());
  }, []);

  const isOverlay = mode === 'play-overlay';
  const isPlaying = mode === 'play-inline' || isOverlay;

  const fallback = useMemo(
    () => (
      <StaticGameFallback
        theme={theme}
        onNavigate={onNavigate}
        isUnsupported={!webGLAvailable}
      />
    ),
    [theme, onNavigate, webGLAvailable]
  );

  return (
    <div
      className={`home-game-root theme-${theme} ${isOverlay ? 'is-overlay' : ''} ${
        isPlaying ? 'is-playing is-relaxed' : ''
      } ${className}`}
      data-testid="home-game-root"
      style={style}
    >
      {!webGLAvailable ? (
        fallback
      ) : (
        <GameErrorBoundary fallback={fallback}>
          <div className="home-game-canvas-wrap">
            <Suspense fallback={fallback}>
              <LazyGameExperience
                theme={theme}
                onNavigate={onNavigate}
                forceDeterministic={forceDeterministic}
              />
            </Suspense>

            {/* Soft perimeter atmosphere: feather gradients and peripheral blur around crisp center */}
            <div
              className="home-game-perimeter"
              aria-hidden="true"
              data-testid="home-game-perimeter"
            >
              <div className="perimeter-feather-top" />
              <div className="perimeter-feather-bottom" />
              <div className="perimeter-feather-left" />
              <div className="perimeter-feather-right" />
              <div className="perimeter-blur-ring" />
            </div>
          </div>
        </GameErrorBoundary>
      )}
    </div>
  );
};

export default HomeGame;
