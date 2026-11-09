import React, { Suspense, useState, useEffect, useRef } from 'react';
import '../styles/home-game.css';
import { useGameStore, gameStore } from '../game/gameStore';

export interface HomeGameProps {
  theme?: 'dark' | 'light';
  onNavigate?: (href: string) => void;
  className?: string;
  style?: React.CSSProperties;
  forceDeterministic?: boolean;
}

export type FallbackStatus = 'loading' | 'unsupported' | 'error';

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
  {
    theme: 'dark' | 'light';
    onNavigate?: (href: string) => void;
    children: React.ReactNode;
  },
  ErrorBoundaryState
> {
  constructor(props: {
    theme: 'dark' | 'light';
    onNavigate?: (href: string) => void;
    children: React.ReactNode;
  }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('[HomeGame] 3D canvas caught error; rendering resilient static fallback:', error, errorInfo);
    try {
      gameStore.getState().actions.clearInput();
      gameStore.getState().actions.setMode('preview');
      document.body.classList.remove('scroll-locked');
    } catch {
      // ignore state store errors in unmount
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <StaticGameFallback
          theme={this.props.theme}
          onNavigate={this.props.onNavigate}
          status="error"
        />
      );
    }
    return this.props.children;
  }
}

/**
 * Static theme-matched fallback and loading UI
 * Provides accessible graphic representation and functional links to all checkpoint routes.
 */
export const StaticGameFallback = React.forwardRef<
  HTMLDivElement,
  {
    theme: 'dark' | 'light';
    onNavigate?: (href: string) => void;
    status?: FallbackStatus;
    isUnsupported?: boolean; // legacy compatibility prop
  }
>(({ theme, onNavigate, status, isUnsupported }, ref) => {
  const isDark = theme === 'dark';

  // Determine effective status
  const effectiveStatus: FallbackStatus = status || (isUnsupported ? 'unsupported' : 'error');

  const handleLink = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Retain native browser actions for modified clicks, non-primary buttons, or special link targets
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    ) {
      return;
    }
    const target = e.currentTarget.getAttribute('target');
    const download = e.currentTarget.hasAttribute('download');
    if (target || download) {
      return;
    }

    if (onNavigate) {
      e.preventDefault();
      onNavigate(href);
    }
  };

  const getTagText = () => {
    switch (effectiveStatus) {
      case 'loading':
        return 'ROOFTOP COURSE · LOADING 3D SIMULATION';
      case 'unsupported':
      case 'error':
      default:
        return 'ROOFTOP COURSE · STATIC PREVIEW';
    }
  };

  const getStatusText = () => {
    switch (effectiveStatus) {
      case 'loading':
        return 'Loading 3D assets · Fast navigation active';
      case 'unsupported':
        return 'WebGL unavailable · Fast navigation active';
      case 'error':
      default:
        return 'WebGL error · Fast navigation active';
    }
  };

  return (
    <div
      ref={ref}
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
        <div className={`home-game-fallback-tag status-${effectiveStatus}`}>
          <span
            className={`fallback-tag-dot ${effectiveStatus === 'loading' ? 'is-pulsing' : ''}`}
          />
          <span>{getTagText()}</span>
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
          {getStatusText()}
        </div>
      </div>
    </div>
  );
});

StaticGameFallback.displayName = 'StaticGameFallback';

/**
 * HomeGame - Canonical Home 3D Game experience boundary conforming to T06.
 *
 * - Lazy-loads GameExperience with zero loading lag on page content.
 * - Detects WebGL availability and catches runtime context loss, falling back gracefully.
 * - Captures actual `webglcontextlost` events on window, cleanly tearing down simulation, input, and scroll lock.
 * - Soft perimeter atmosphere (feather fade + peripheral blur) surrounding crisp center inside Scene visual layer.
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
  const [hasContextLoss, setHasContextLoss] = useState(false);
  const fallbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setWebGLAvailable(checkWebGLAvailable());
  }, []);

  // Listen for actual WebGL context loss events (using capture to intercept non-bubbling canvas events)
  useEffect(() => {
    let unmountTimer: ReturnType<typeof setTimeout> | null = null;

    const handleContextLost = (e: Event) => {
      // Prevent browser default behavior and cleanly unmount 3D simulation
      e.preventDefault();
      console.warn('[HomeGame] WebGL context lost; safely unmounting simulation and restoring navigation');

      // Reset store mode, input, and remove body scroll lock immediately
      gameStore.getState().actions.clearInput();
      gameStore.getState().actions.setMode('preview');
      document.body.classList.remove('scroll-locked');

      // Allow probe assertions to observe isContextLost() on the canvas element before unmounting
      unmountTimer = setTimeout(() => {
        setHasContextLoss(true);
      }, 80);
    };

    window.addEventListener('webglcontextlost', handleContextLost, true);
    return () => {
      window.removeEventListener('webglcontextlost', handleContextLost, true);
      if (unmountTimer) clearTimeout(unmountTimer);
    };
  }, []);

  // Connect focus to fallback link when context loss or error occurs
  useEffect(() => {
    if (hasContextLoss && fallbackRef.current) {
      const link = fallbackRef.current.querySelector<HTMLElement>('a');
      link?.focus();
    }
  }, [hasContextLoss]);

  const isOverlay = mode === 'play-overlay';
  const isPlaying = mode === 'play-inline' || isOverlay;

  return (
    <div
      className={`home-game-root theme-${theme} ${isOverlay ? 'is-overlay' : ''} ${
        isPlaying ? 'is-playing is-relaxed' : ''
      } ${className}`}
      data-testid="home-game-root"
      style={style}
    >
      {!webGLAvailable ? (
        <StaticGameFallback
          ref={fallbackRef}
          theme={theme}
          onNavigate={onNavigate}
          status="unsupported"
        />
      ) : hasContextLoss ? (
        <StaticGameFallback
          ref={fallbackRef}
          theme={theme}
          onNavigate={onNavigate}
          status="error"
        />
      ) : (
        <GameErrorBoundary theme={theme} onNavigate={onNavigate}>
          <div className="home-game-canvas-wrap">
            <Suspense
              fallback={
                <StaticGameFallback
                  theme={theme}
                  onNavigate={onNavigate}
                  status="loading"
                />
              }
            >
              <LazyGameExperience
                theme={theme}
                onNavigate={onNavigate}
                forceDeterministic={forceDeterministic}
              />
            </Suspense>
          </div>
        </GameErrorBoundary>
      )}
    </div>
  );
};

export default HomeGame;
