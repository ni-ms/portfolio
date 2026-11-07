import React, { useEffect, useRef } from 'react';
import { gameStore, useGameStore } from './gameStore';
import { TouchControls } from './TouchControls';
import { KeyboardControls } from './KeyboardControls';

export interface GameOverlayProps {
  children?: React.ReactNode;
  onExit?: () => void;
}

export function GameOverlay({ children, onExit }: GameOverlayProps) {
  const mode = useGameStore((s) => s.mode);
  const checkpoints = useGameStore((s) => s.checkpoints);
  const currentCheckpointId = useGameStore((s) => s.currentCheckpointId);
  const exitButtonRef = useRef<HTMLButtonElement>(null);

  const isOverlayOpen = mode === 'play-overlay';

  const currentCheckpoint = checkpoints.find((cp) => cp.id === currentCheckpointId);
  const unlockedCheckpointsCount = checkpoints.filter(
    (cp) => cp.id !== 'cp-start' && cp.unlocked
  ).length;

  const handleExit = () => {
    if (onExit) {
      onExit();
    } else {
      gameStore.getState().actions.setMode('preview');
    }
  };

  const handleNavigate = (sectionId: string) => {
    gameStore.getState().actions.navigateToSection(sectionId);
  };

  // Lock and restore body scroll on mount/unmount when active
  useEffect(() => {
    if (!isOverlayOpen) return;

    const initialScrollY = window.scrollY;
    document.body.classList.add('scroll-locked');

    // Auto-focus the exit button for accessible keyboard trapping
    if (exitButtonRef.current) {
      exitButtonRef.current.focus();
    }

    return () => {
      document.body.classList.remove('scroll-locked');
      window.scrollTo({ top: initialScrollY, behavior: 'instant' });
    };
  }, [isOverlayOpen]);

  if (!isOverlayOpen) {
    return null;
  }

  // Determine section navigation prompt if player is at an unlocked checkpoint
  const showPrompt =
    currentCheckpoint &&
    currentCheckpoint.id !== 'cp-start' &&
    currentCheckpoint.targetSectionId;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Play course expanded overlay"
      className="game-overlay-container"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: 'var(--color-bg, #101414)',
        paddingTop: 'max(16px, env(safe-area-inset-top))',
        paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
        paddingLeft: 'max(16px, env(safe-area-inset-left))',
        paddingRight: 'max(16px, env(safe-area-inset-right))',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* 3D Scene Viewport / Children Container */}
      <div
        className="game-canvas-wrapper"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          width: '100%',
          height: '100%',
        }}
      >
        {children}
      </div>

      {/* TOP STATUS BAR (Overlaid above canvas) */}
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
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.12em',
            color: 'var(--color-text, #F2F1EA)',
            background: 'rgba(16, 20, 20, 0.75)',
            padding: '5px 10px',
            border: '1px solid rgba(242, 241, 234, 0.1)',
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
          <span>EXPLORATION / {String(currentCheckpoint?.index ?? 1).padStart(2, '0')}</span>
        </div>

        {/* Center: ROOFTOPS badge */}
        <div
          style={{
            fontFamily: 'var(--font-display, sans-serif)',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.15em',
            color: 'var(--color-text-muted, #8E9596)',
            textTransform: 'uppercase',
          }}
        >
          ROOFTOPS
        </div>

        {/* Right: Progress "01 / 03" and EXIT button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            pointerEvents: 'auto',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.08em',
              color: 'var(--color-text-muted, #8E9596)',
            }}
          >
            {String(unlockedCheckpointsCount).padStart(2, '0')} / 03
          </div>

          <button
            ref={exitButtonRef}
            type="button"
            aria-label="Exit play mode"
            data-testid="overlay-exit-btn"
            onClick={handleExit}
            style={{
              width: '38px',
              height: '38px',
              minWidth: '44px',
              minHeight: '44px',
              background: 'rgba(23, 29, 30, 0.85)',
              border: '1px solid rgba(242, 241, 234, 0.2)',
              borderRadius: '50%',
              color: 'var(--color-text, #F2F1EA)',
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

      {/* NON-BLOCKING CHECKPOINT PROMPT */}
      {showPrompt && (
        <div
          role="region"
          aria-label="Checkpoint reached"
          style={{
            position: 'relative',
            zIndex: 10,
            alignSelf: 'center',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(23, 29, 30, 0.92)',
            border: '1px solid var(--color-border-accent, rgba(214, 255, 100, 0.35))',
            borderRadius: '6px',
            padding: '8px 16px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
            pointerEvents: 'auto',
            animation: 'fadeIn 0.25s ease-out',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '11px',
              color: 'var(--color-accent, #D6FF64)',
              fontWeight: 600,
              letterSpacing: '0.06em',
            }}
          >
            CHECKPOINT {currentCheckpoint.label}:
          </div>
          <button
            type="button"
            data-testid="checkpoint-action-btn"
            onClick={() => handleNavigate(currentCheckpoint.targetSectionId)}
            style={{
              fontFamily: 'var(--font-display, sans-serif)',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.06em',
              color: '#101414',
              backgroundColor: 'var(--color-accent, #D6FF64)',
              padding: '6px 12px',
              borderRadius: '4px',
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

      {/* BOTTOM TOUCH CONTROLS (Overlaid above canvas) */}
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

      {/* Keyboard listener active during overlay */}
      <KeyboardControls forceActive={true} />
    </div>
  );
}
