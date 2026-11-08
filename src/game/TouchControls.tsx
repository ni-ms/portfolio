import React, { useRef, useEffect, useCallback } from 'react';
import { gameStore } from './gameStore';
import type { InputState } from '../types/game';

export interface TouchControlsProps {
  className?: string;
  style?: React.CSSProperties;
}

type InputActionKey = keyof InputState;

export function TouchControls({ className = '', style }: TouchControlsProps) {
  // Map of pointerId -> InputActionKey
  const activePointers = useRef<Map<number, InputActionKey>>(new Map());

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>, action: InputActionKey) => {
      e.preventDefault();
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // Ignored if browser does not support setPointerCapture on this target
      }
      activePointers.current.set(e.pointerId, action);
      gameStore.getState().actions.setInput({ [action]: true });
    },
    []
  );

  const handlePointerRelease = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>, action?: InputActionKey) => {
      const recordedAction = activePointers.current.get(e.pointerId) || action;
      if (recordedAction) {
        activePointers.current.delete(e.pointerId);
        gameStore.getState().actions.setInput({ [recordedAction]: false });
      }
      try {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      } catch {
        // Ignored
      }
    },
    []
  );

  const clearAllTouchInputs = useCallback(() => {
    activePointers.current.clear();
    gameStore.getState().actions.clearInput();
  }, []);

  const handleResetPress = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    gameStore.getState().actions.resetToCheckpoint();
  }, []);

  // Global blur, visibilitychange, and individual pointer cancel listeners
  useEffect(() => {
    const handleWindowBlur = () => {
      clearAllTouchInputs();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearAllTouchInputs();
      }
    };

    const handleWindowPointerCancel = (e: PointerEvent) => {
      if (e.pointerId && activePointers.current.has(e.pointerId)) {
        const action = activePointers.current.get(e.pointerId);
        activePointers.current.delete(e.pointerId);
        if (action) {
          gameStore.getState().actions.setInput({ [action]: false });
        }
      } else if (!e.pointerId) {
        clearAllTouchInputs();
      }
    };

    const handleWindowTouchCancel = (e: TouchEvent) => {
      if (!e.touches || e.touches.length === 0) {
        clearAllTouchInputs();
      }
    };

    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pointercancel', handleWindowPointerCancel);
    window.addEventListener('touchcancel', handleWindowTouchCancel);

    return () => {
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pointercancel', handleWindowPointerCancel);
      window.removeEventListener('touchcancel', handleWindowTouchCancel);
      clearAllTouchInputs();
    };
  }, [clearAllTouchInputs]);

  return (
    <div
      className={`touch-controls-container ${className}`}
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        pointerEvents: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        ...style,
      }}
    >
      {/* Active control surface bar: D-pad on left, Reset + Jump on right */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          padding: '0 12px 10px 12px',
        }}
      >
        {/* BOTTOM-LEFT: 4-Way D-Pad */}
        <div
          className="dpad-cluster"
          aria-label="Directional Controls"
          style={{
            position: 'relative',
            width: '144px',
            height: '144px',
            pointerEvents: 'auto',
          }}
        >
          {/* UP BUTTON */}
          <button
            type="button"
            aria-label="Move Forward"
            data-testid="dpad-up"
            style={{
              position: 'absolute',
              top: 0,
              left: '48px',
              width: '48px',
              height: '48px',
              minWidth: '44px',
              minHeight: '44px',
              touchAction: 'none',
              background: 'rgba(23, 29, 30, 0.88)',
              border: '1px solid rgba(242, 241, 234, 0.18)',
              borderTopLeftRadius: '6px',
              borderTopRightRadius: '6px',
              color: 'var(--color-text, #F2F1EA)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            onPointerDown={(e) => handlePointerDown(e, 'forward')}
            onPointerUp={(e) => handlePointerRelease(e, 'forward')}
            onPointerCancel={(e) => handlePointerRelease(e, 'forward')}
            onLostPointerCapture={(e) => handlePointerRelease(e, 'forward')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </button>

          {/* LEFT BUTTON */}
          <button
            type="button"
            aria-label="Move Left"
            data-testid="dpad-left"
            style={{
              position: 'absolute',
              top: '48px',
              left: 0,
              width: '48px',
              height: '48px',
              minWidth: '44px',
              minHeight: '44px',
              touchAction: 'none',
              background: 'rgba(23, 29, 30, 0.88)',
              border: '1px solid rgba(242, 241, 234, 0.18)',
              borderTopLeftRadius: '6px',
              borderBottomLeftRadius: '6px',
              color: 'var(--color-text, #F2F1EA)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            onPointerDown={(e) => handlePointerDown(e, 'left')}
            onPointerUp={(e) => handlePointerRelease(e, 'left')}
            onPointerCancel={(e) => handlePointerRelease(e, 'left')}
            onLostPointerCapture={(e) => handlePointerRelease(e, 'left')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* CENTER EMBLEM HUB (Visual anchor) */}
          <div
            style={{
              position: 'absolute',
              top: '48px',
              left: '48px',
              width: '48px',
              height: '48px',
              background: 'rgba(16, 20, 20, 0.95)',
              border: '1px solid rgba(242, 241, 234, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent, #D6FF64)" strokeWidth="2.5">
              <circle cx="12" cy="12" r="3" fill="var(--color-accent, #D6FF64)" />
              <line x1="12" y1="3" x2="12" y2="7" />
              <line x1="12" y1="17" x2="12" y2="21" />
              <line x1="3" y1="12" x2="7" y2="12" />
              <line x1="17" y1="12" x2="21" y2="12" />
            </svg>
          </div>

          {/* RIGHT BUTTON */}
          <button
            type="button"
            aria-label="Move Right"
            data-testid="dpad-right"
            style={{
              position: 'absolute',
              top: '48px',
              right: 0,
              width: '48px',
              height: '48px',
              minWidth: '44px',
              minHeight: '44px',
              touchAction: 'none',
              background: 'rgba(23, 29, 30, 0.88)',
              border: '1px solid rgba(242, 241, 234, 0.18)',
              borderTopRightRadius: '6px',
              borderBottomRightRadius: '6px',
              color: 'var(--color-text, #F2F1EA)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            onPointerDown={(e) => handlePointerDown(e, 'right')}
            onPointerUp={(e) => handlePointerRelease(e, 'right')}
            onPointerCancel={(e) => handlePointerRelease(e, 'right')}
            onLostPointerCapture={(e) => handlePointerRelease(e, 'right')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* DOWN BUTTON */}
          <button
            type="button"
            aria-label="Move Backward"
            data-testid="dpad-down"
            style={{
              position: 'absolute',
              bottom: 0,
              left: '48px',
              width: '48px',
              height: '48px',
              minWidth: '44px',
              minHeight: '44px',
              touchAction: 'none',
              background: 'rgba(23, 29, 30, 0.88)',
              border: '1px solid rgba(242, 241, 234, 0.18)',
              borderBottomLeftRadius: '6px',
              borderBottomRightRadius: '6px',
              color: 'var(--color-text, #F2F1EA)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            onPointerDown={(e) => handlePointerDown(e, 'backward')}
            onPointerUp={(e) => handlePointerRelease(e, 'backward')}
            onPointerCancel={(e) => handlePointerRelease(e, 'backward')}
            onLostPointerCapture={(e) => handlePointerRelease(e, 'backward')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>

        {/* BOTTOM-RIGHT: Small RESET button above large lime JUMP button */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '12px',
            pointerEvents: 'auto',
          }}
        >
          {/* SMALL RESET BUTTON */}
          <button
            type="button"
            aria-label="Reset to checkpoint"
            data-testid="touch-reset-btn"
            style={{
              touchAction: 'none',
              minWidth: '64px',
              minHeight: '44px',
              padding: '6px 14px',
              background: 'rgba(23, 29, 30, 0.85)',
              border: '1px solid rgba(242, 241, 234, 0.2)',
              borderRadius: '4px',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              color: 'var(--color-text-muted, #8E9596)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
            onPointerDown={handleResetPress}
          >
            <span style={{ fontSize: '13px' }}>↺</span> RESET
          </button>

          {/* LARGE LIME JUMP BUTTON */}
          <button
            type="button"
            aria-label="Jump"
            data-testid="touch-jump-btn"
            style={{
              touchAction: 'none',
              width: '92px',
              height: '84px',
              minWidth: '44px',
              minHeight: '44px',
              background: 'var(--color-accent, #D6FF64)',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 4px 18px rgba(214, 255, 100, 0.25)',
              fontFamily: 'var(--font-display, sans-serif)',
              fontSize: '15px',
              fontWeight: 700,
              letterSpacing: '0.06em',
              color: '#101414',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            onPointerDown={(e) => handlePointerDown(e, 'jump')}
            onPointerUp={(e) => handlePointerRelease(e, 'jump')}
            onPointerCancel={(e) => handlePointerRelease(e, 'jump')}
            onLostPointerCapture={(e) => handlePointerRelease(e, 'jump')}
          >
            JUMP
          </button>
        </div>
      </div>

      {/* CENTER-BOTTOM HINT: "MOVE + JUMP TO EXPLORE" */}
      <div
        style={{
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: '10.5px',
          fontWeight: 500,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--color-text-dim, #565F60)',
          paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
          pointerEvents: 'none',
        }}
      >
        MOVE + JUMP TO EXPLORE
      </div>
    </div>
  );
}
