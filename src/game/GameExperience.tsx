import { useState, useEffect, useRef, useCallback } from 'react';
import { Physics } from '@react-three/rapier';
import { Scene } from './Scene';
import { PhysicsCourse } from './PhysicsCourse';
import { PlayerController } from './PlayerController';
import { KeyboardControls } from './KeyboardControls';
import { TouchControls } from './TouchControls';
import { gameStore, useGameStore, registerGlobalNavigateHandler } from './gameStore';
import { applyGameTheme } from './materials';
import type { GameExperienceProps, Checkpoint } from '../types/game';

function detectTouch() {
  return typeof window !== 'undefined' && (
    navigator.maxTouchPoints > 0 ||
    window.matchMedia('(pointer: coarse)').matches ||
    window.innerWidth <= 768 ||
    (window.innerHeight <= 500 && window.innerWidth <= 1024)
  );
}

function GameReady({ onReady }: { onReady: () => void }) {
  useEffect(onReady, [onReady]);
  return null;
}

export function GameExperience({
  theme = 'dark',
  onNavigate,
  className = '',
  style,
  forceDeterministic = false,
  startPlaying = false,
  onStop,
}: GameExperienceProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const mode = useGameStore((s) => s.mode);
  const checkpoints = useGameStore((s) => s.checkpoints);
  const currentCheckpointId = useGameStore((s) => s.currentCheckpointId);
  const isDeterministicReview = useGameStore((s) => s.isDeterministicReview) || forceDeterministic;

  const [isTouchDevice, setIsTouchDevice] = useState(detectTouch);
  const [ready, setReady] = useState(false);
  const markReady = useCallback(() => setReady(true), []);
  const started = useRef(false);
  const played = useRef(false);
  const exitButtonRef = useRef<HTMLButtonElement>(null);
  const enterButtonRef = useRef<HTMLButtonElement>(null);
  const pendingFocusRestoreRef = useRef(false);
  const cancelFocusRestoreRef = useRef(false);
  const savedScrollYRef = useRef(0);

  const isLight = theme === 'light';

  // Visibility and intersection tracking for physics suspension and frameloop control
  const [isIntersecting, setIsIntersecting] = useState(true);
  const [isDocVisible, setIsDocVisible] = useState(
    typeof document !== 'undefined' ? !document.hidden : true
  );

  useEffect(() => {
    const handleVis = () => {
      setIsDocVisible(typeof document !== 'undefined' ? !document.hidden : true);
    };
    document.addEventListener('visibilitychange', handleVis);
    return () => {
      document.removeEventListener('visibilitychange', handleVis);
    };
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const checkInView = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const vw = window.innerWidth || document.documentElement.clientWidth;
      const inView = rect.bottom > 0 && rect.top < vh && rect.right > 0 && rect.left < vw;
      setIsIntersecting(inView);
    };

    checkInView();

    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            setIsIntersecting(entry.isIntersecting);
          }
        },
        { threshold: 0 }
      );
      observer.observe(el);
    }

    window.addEventListener('scroll', checkInView, { passive: true });
    window.addEventListener('resize', checkInView, { passive: true });

    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener('scroll', checkInView);
      window.removeEventListener('resize', checkInView);
    };
  }, []);

  // Responsive and touch device detection (including phone landscape e.g. 844x390)
  useEffect(() => {
    const updateInputMode = () => setIsTouchDevice(detectTouch());
    window.addEventListener('resize', updateInputMode);
    return () => window.removeEventListener('resize', updateInputMode);
  }, []);

  // Cleanup on unmount: cancel focus restoration, remove scroll lock, reset mode/input
  useEffect(() => {
    return () => {
      cancelFocusRestoreRef.current = true;
      pendingFocusRestoreRef.current = false;
      document.body.classList.remove('scroll-locked');
      gameStore.getState().actions.clearInput();
      gameStore.getState().actions.setMode('preview');
    };
  }, []);

  // Register onNavigate callback into gameStore
  useEffect(() => {
    if (onNavigate) {
      registerGlobalNavigateHandler(onNavigate);
      return () => registerGlobalNavigateHandler(null);
    }
  }, [onNavigate]);

  // Synchronize theme with materials/lighting without restarting physics
  useEffect(() => {
    applyGameTheme(theme);
  }, [theme]);

  // Handle overlay open/close: focus trapping, body scroll lock, scroll restoration
  useEffect(() => {
    if (mode === 'play-overlay') {
      savedScrollYRef.current = window.scrollY;
      document.body.classList.add('scroll-locked');
      pendingFocusRestoreRef.current = true;
      cancelFocusRestoreRef.current = false;

      // Accessibility: focus exit button when entering overlay
      const timer = setTimeout(() => {
        exitButtonRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    } else {
      document.body.classList.remove('scroll-locked');
      // Restore scroll position
      if (savedScrollYRef.current > 0) {
        window.scrollTo(0, savedScrollYRef.current);
      }
    }
  }, [mode]);

  // Restore focus to connected Play trigger button AFTER preview renders into DOM
  useEffect(() => {
    if (mode === 'preview' && pendingFocusRestoreRef.current) {
      pendingFocusRestoreRef.current = false;
      if (cancelFocusRestoreRef.current) return;

      const frameId = requestAnimationFrame(() => {
        if (cancelFocusRestoreRef.current) return;
        const btn =
          enterButtonRef.current ||
          rootRef.current?.querySelector<HTMLElement>('[data-testid=\"enter-play-btn\"]');
        if (btn && typeof btn.focus === 'function') {
          btn.focus();
        }
      });
      return () => cancelAnimationFrame(frameId);
    }
  }, [mode]);

  // Modal focus trap for expanded play overlay
  useEffect(() => {
    if (mode !== 'play-overlay') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        gameStore.getState().actions.setMode('preview');
        return;
      }

      if (e.key === 'Tab') {
        const root = rootRef.current;
        if (!root) return;

        const focusableSelectors =
          'button:not([disabled]), [href]:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex=\"-1\"])';
        const focusableElements = Array.from(
          root.querySelectorAll<HTMLElement>(focusableSelectors)
        ).filter((el) => el.offsetParent !== null);

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement || !root.contains(document.activeElement)) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement || !root.contains(document.activeElement)) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [mode]);

  const handleEnterPlay = useCallback(() => {
    pendingFocusRestoreRef.current = true;
    cancelFocusRestoreRef.current = false;
    if (isTouchDevice) {
      gameStore.getState().actions.setMode('play-overlay');
    } else {
      gameStore.getState().actions.setMode('play-inline');
    }
  }, [isTouchDevice]);

  useEffect(() => {
    if (!startPlaying || !ready || started.current) return;
    const frame = requestAnimationFrame(() => {
      started.current = true;
      handleEnterPlay();
    });
    return () => cancelAnimationFrame(frame);
  }, [startPlaying, ready, handleEnterPlay]);

  useEffect(() => {
    if (mode !== 'preview') {
      played.current = true;
      if (startPlaying && mode === 'play-inline') rootRef.current?.focus({ preventScroll: true });
    } else if (played.current && onStop) {
      onStop();
    }
  }, [mode, startPlaying, onStop]);

  const handleExitPlay = useCallback(() => {
    gameStore.getState().actions.setMode('preview');
  }, []);

  const handleCheckpointNavigation = useCallback(
    (checkpoint: Checkpoint) => {
      cancelFocusRestoreRef.current = true;
      pendingFocusRestoreRef.current = false;
      const destination = checkpoint.targetRoute || checkpoint.targetSectionId;
      if (onNavigate) {
        gameStore.getState().actions.setMode('preview');
        gameStore.getState().actions.clearInput();
        onNavigate(destination);
      } else {
        gameStore.getState().actions.navigateToRoute(destination);
      }
    },
    [onNavigate]
  );

  const currentCheckpoint = checkpoints.find((cp) => cp.id === currentCheckpointId);
  const unlockedCheckpointsCount = checkpoints.filter(
    (cp) => cp.id !== 'cp-start' && cp.unlocked
  ).length;

  const isPlayActive = mode === 'play-inline' || mode === 'play-overlay';
  const isOverlay = mode === 'play-overlay';
  const isVisible = isDocVisible && (isOverlay || isIntersecting);
  const isSimulating = isPlayActive && isVisible;

  // Checkpoint route action prompt when player reaches an unlocked checkpoint
  const showCheckpointAction =
    isPlayActive &&
    currentCheckpoint &&
    currentCheckpoint.id !== 'cp-start' &&
    (currentCheckpoint.targetRoute || currentCheckpoint.targetSectionId);

  return (
    <div
      ref={rootRef}
      className={`game-experience-root ${isOverlay ? 'game-experience-overlay-active' : ''} ${className}`}
      style={
        isOverlay
          ? {
              position: 'fixed',
              inset: 0,
              zIndex: 99999,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              backgroundColor: isLight ? 'var(--color-bg, #F2F1EA)' : 'var(--color-bg, #101414)',
              paddingTop: 'max(16px, env(safe-area-inset-top))',
              paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
              paddingLeft: 'max(16px, env(safe-area-inset-left))',
              paddingRight: 'max(16px, env(safe-area-inset-right))',
              overflow: 'hidden',
              boxSizing: 'border-box',
            }
          : {
              position: 'relative',
              width: '100%',
              height: '100%',
              minWidth: 0,
              ...style,
            }
      }
      tabIndex={startPlaying && mode === 'play-inline' ? -1 : undefined}
      role={isOverlay ? 'dialog' : 'region'}
      aria-modal={isOverlay ? 'true' : undefined}
      aria-label={isOverlay ? 'Play course expanded overlay' : 'Interactive 3D Rooftop Course'}
    >
      {/* SINGLE PERSISTENT KEYBOARD CONTROLS (active whenever playing) */}
      <KeyboardControls forceActive={isPlayActive} />

      {/* SINGLE PERSISTENT CANVAS & PHYSICS SIMULATION */}
      <div
        className="game-experience-canvas-container"
        style={{
          position: isOverlay ? 'absolute' : 'relative',
          inset: isOverlay ? 0 : undefined,
          width: '100%',
          height: '100%',
          minWidth: 0,
          zIndex: 1,
        }}
      >
        <Scene
          mode={mode}
          theme={theme}
          isMobile={isTouchDevice}
          isDeterministicReview={isDeterministicReview}
          isVisible={isVisible}
          showMarkers={mode === 'preview'}
          onSelectCheckpoint={(dest) => {
            if (onNavigate) {
              onNavigate(dest);
            } else {
              gameStore.getState().actions.navigateToRoute(dest);
            }
          }}
          style={{ width: '100%', height: '100%' }}
        >
          <Physics gravity={[0, -18, 0]} paused={!isSimulating}>
            <PhysicsCourse showVisuals={false} />
            <PlayerController />
            {startPlaying && <GameReady onReady={markReady} />}
          </Physics>
        </Scene>
      </div>

      {/* PREVIEW MODE UI: Click-to-Play CTA and Exploration Guidance */}
      {mode === 'preview' && !startPlaying && (
        <div
          className="game-preview-controls-overlay"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 5,
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '16px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              pointerEvents: 'auto',
            }}
          >
            {/* Enter Play Button */}
            <button
              ref={enterButtonRef}
              type="button"
              data-testid="enter-play-btn"
              onClick={handleEnterPlay}
              aria-label="Enter Play Mode"
              style={{
                fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: '#101414',
                backgroundColor: 'var(--color-accent, #D6FF64)',
                border: 'none',
                borderRadius: '4px',
                padding: '8px 16px',
                minWidth: '44px',
                minHeight: '44px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(214, 255, 100, 0.3)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span>▶</span> PLAY ROOFTOPS
            </button>

            {/* Hint Badge */}
            <span
              style={{
                fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                fontSize: '10.5px',
                color: isLight ? '#101414' : 'rgba(242, 241, 234, 0.7)',
                background: isLight ? 'rgba(242, 241, 234, 0.92)' : 'rgba(16, 20, 20, 0.7)',
                padding: '4px 8px',
                borderRadius: '3px',
                border: isLight ? '1px solid rgba(16, 20, 20, 0.15)' : '1px solid rgba(242, 241, 234, 0.1)',
                backdropFilter: 'blur(4px)',
              }}
            >
              {isTouchDevice ? 'TAP TO PLAY' : 'WASD / SPACE TO RUN'}
            </span>
          </div>
        </div>
      )}

      {/* DESKTOP PLAY-INLINE HUD (Theme-aware with contrast >= 4.5:1) */}
      {mode === 'play-inline' && (
        <div
          className="game-inline-hud"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 10,
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '12px 16px',
            boxSizing: 'border-box',
          }}
        >
          {/* Top Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              pointerEvents: 'auto',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                color: isLight ? '#101414' : '#F2F1EA',
                background: isLight ? 'rgba(242, 241, 234, 0.94)' : 'rgba(16, 20, 20, 0.85)',
                padding: '4px 10px',
                borderRadius: '4px',
                border: isLight ? '1px solid rgba(16, 20, 20, 0.2)' : '1px solid rgba(242, 241, 234, 0.12)',
                backdropFilter: 'blur(6px)',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-accent, #D6FF64)',
                  boxShadow: '0 0 6px var(--color-accent, #D6FF64)',
                }}
              />
              <span>EXPLORATION / {String(currentCheckpoint?.index ?? 1).padStart(2, '0')}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                  fontSize: '11px',
                  color: isLight ? '#565F60' : '#8E9596',
                }}
              >
                {String(unlockedCheckpointsCount).padStart(2, '0')} / 03
              </span>

              {/* Expand Button: Theme-aware contrast >= 4.5:1 in both light and dark themes */}
              <button
                type="button"
                data-testid="inline-expand-btn"
                aria-label="Expand to full screen"
                onClick={() => gameStore.getState().actions.setMode('play-overlay')}
                style={{
                  minWidth: '44px',
                  minHeight: '44px',
                  padding: '4px 10px',
                  background: isLight ? 'rgba(242, 241, 234, 0.95)' : 'rgba(23, 29, 30, 0.85)',
                  border: isLight ? '1px solid rgba(16, 20, 20, 0.25)' : '1px solid rgba(242, 241, 234, 0.2)',
                  borderRadius: '4px',
                  fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                  fontSize: '11px',
                  fontWeight: 600,
                  color: isLight ? '#101414' : '#F2F1EA',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                EXPAND ↗
              </button>
              <button
                type="button"
                data-testid="inline-exit-btn"
                aria-label="Exit play mode"
                onClick={handleExitPlay}
                style={{
                  minWidth: '44px',
                  minHeight: '44px',
                  padding: '4px 12px',
                  background: isLight ? 'rgba(242, 241, 234, 0.95)' : 'rgba(23, 29, 30, 0.85)',
                  border: isLight ? '1px solid rgba(16, 20, 20, 0.25)' : '1px solid rgba(242, 241, 234, 0.2)',
                  borderRadius: '4px',
                  fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                  fontSize: '11px',
                  fontWeight: 600,
                  color: isLight ? '#101414' : '#F2F1EA',
                  cursor: 'pointer',
                }}
              >
                ESC / EXIT
              </button>
            </div>
          </div>

          {/* Center Checkpoint Action Banner */}
          {showCheckpointAction && currentCheckpoint && (
            <div
              role="region"
              aria-label="Checkpoint reached"
              data-testid="checkpoint-action-banner"
              className="checkpoint-acknowledge-active"
              style={{
                alignSelf: 'center',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: isLight ? 'rgba(242, 241, 234, 0.96)' : 'rgba(23, 29, 30, 0.92)',
                border: isLight
                  ? '1px solid rgba(16, 20, 20, 0.35)'
                  : '1px solid var(--color-border-accent, rgba(214, 255, 100, 0.45))',
                borderRadius: '6px',
                padding: '8px 16px',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
                pointerEvents: 'auto',
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                  fontSize: '11px',
                  color: isLight ? '#101414' : 'var(--color-accent, #D6FF64)',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                }}
              >
                CHECKPOINT {currentCheckpoint.label}:
              </div>
              <button
                type="button"
                data-testid="checkpoint-action-btn"
                onClick={() => handleCheckpointNavigation(currentCheckpoint)}
                style={{
                  fontFamily: 'var(--font-display, sans-serif)',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  color: '#101414',
                  backgroundColor: 'var(--color-accent, #D6FF64)',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                VIEW {currentCheckpoint.shortTitle} ↗
              </button>
            </div>
          )}

          {/* Bottom Hint */}
          <div
            style={{
              fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
              fontSize: '10.5px',
              color: isLight ? '#565F60' : 'var(--color-text-dim, #565F60)',
              textAlign: 'center',
              letterSpacing: '0.1em',
            }}
          >
            WASD / ARROWS TO RUN · SPACE TO JUMP · R TO RESET
          </div>
        </div>
      )}

      {/* FULLSCREEN PLAY-OVERLAY HUD (Mobile or expanded play) */}
      {isOverlay && (
        <>
          {/* Top Status Bar */}
          <header
            className="game-overlay-header"
            style={{
              position: 'relative',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              minHeight: '44px',
              padding: '4px 8px',
              pointerEvents: 'none',
            }}
          >
            {/* Left: Checkpoint / Exploration Label */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.12em',
                color: isLight ? '#101414' : 'var(--color-text, #F2F1EA)',
                background: isLight ? 'rgba(242, 241, 234, 0.92)' : 'rgba(16, 20, 20, 0.75)',
                padding: '5px 10px',
                border: isLight ? '1px solid rgba(16, 20, 20, 0.15)' : '1px solid rgba(242, 241, 234, 0.1)',
                borderRadius: '4px',
                backdropFilter: 'blur(8px)',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-accent, #D6FF64)',
                  boxShadow: '0 0 6px var(--color-accent, #D6FF64)',
                }}
              />
              <span>Checkpoints {unlockedCheckpointsCount} / {checkpoints.length - 1}</span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                pointerEvents: 'auto',
              }}
            >
              <button
                ref={exitButtonRef}
                type="button"
                aria-label="Exit play mode"
                data-testid="overlay-exit-btn"
                onClick={handleExitPlay}
                style={{
                  width: '44px',
                  height: '44px',
                  minWidth: '44px',
                  minHeight: '44px',
                  background: isLight ? 'rgba(242, 241, 234, 0.95)' : 'rgba(23, 29, 30, 0.85)',
                  border: isLight ? '1px solid rgba(16, 20, 20, 0.25)' : '1px solid rgba(242, 241, 234, 0.2)',
                  borderRadius: '50%',
                  color: isLight ? '#101414' : 'var(--color-text, #F2F1EA)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background var(--transition-fast)',
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </header>

          {/* Checkpoint Route Navigation Prompt */}
          {showCheckpointAction && currentCheckpoint && (
            <div
              role="region"
              aria-label="Checkpoint reached"
              data-testid="checkpoint-action-banner"
              className="checkpoint-acknowledge-active"
              style={{
                position: 'relative',
                zIndex: 10,
                alignSelf: 'center',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: isLight ? 'rgba(242, 241, 234, 0.96)' : 'rgba(23, 29, 30, 0.92)',
                border: isLight
                  ? '1px solid rgba(16, 20, 20, 0.35)'
                  : '1px solid var(--color-border-accent, rgba(214, 255, 100, 0.35))',
                borderRadius: '6px',
                padding: '8px 16px',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
                pointerEvents: 'auto',
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                  fontSize: '11px',
                  color: isLight ? '#101414' : 'var(--color-accent, #D6FF64)',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                }}
              >
                CHECKPOINT {currentCheckpoint.label}:
              </div>
              <button
                type="button"
                data-testid="checkpoint-action-btn"
                onClick={() => handleCheckpointNavigation(currentCheckpoint)}
                style={{
                  fontFamily: 'var(--font-display, sans-serif)',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  color: '#101414',
                  backgroundColor: 'var(--color-accent, #D6FF64)',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                VIEW {currentCheckpoint.shortTitle} ↗
              </button>
            </div>
          )}

          {/* Bottom Touch Controls */}
          <footer
            style={{
              position: 'relative',
              zIndex: 10,
              width: '100%',
              pointerEvents: 'none',
            }}
          >
            <TouchControls />
          </footer>
        </>
      )}
    </div>
  );
}
export default GameExperience;
