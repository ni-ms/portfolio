import { useEffect, useCallback } from 'react';
import { gameStore, useGameStore } from './gameStore';

export interface KeyboardControlsProps {
  /**
   * If true, forces input capture regardless of mode (e.g. within an isolated game container).
   * Defaults to active when mode is 'play-inline' or 'play-overlay'.
   */
  forceActive?: boolean;
}

export function KeyboardControls({ forceActive = false }: KeyboardControlsProps) {
  const mode = useGameStore((s) => s.mode);
  const isPlaying = forceActive || mode === 'play-inline' || mode === 'play-overlay';

  const clearAllInput = useCallback(() => {
    gameStore.getState().actions.clearInput();
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      clearAllInput();
      return;
    }

    const isEditableElement = (el: EventTarget | null): boolean => {
      if (!el || !(el instanceof HTMLElement)) return false;
      const tag = el.tagName.toLowerCase();
      return (
        tag === 'input' ||
        tag === 'textarea' ||
        tag === 'select' ||
        el.isContentEditable
      );
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not hijack typing inside form inputs
      if (isEditableElement(e.target)) return;

      const code = e.code;
      const key = e.key;
      let handled = false;

      switch (code) {
        case 'KeyW':
        case 'ArrowUp':
          gameStore.getState().actions.setInput({ forward: true });
          handled = true;
          break;

        case 'KeyS':
        case 'ArrowDown':
          gameStore.getState().actions.setInput({ backward: true });
          handled = true;
          break;

        case 'KeyA':
        case 'ArrowLeft':
          gameStore.getState().actions.setInput({ left: true });
          handled = true;
          break;

        case 'KeyD':
        case 'ArrowRight':
          gameStore.getState().actions.setInput({ right: true });
          handled = true;
          break;

        case 'Space':
          gameStore.getState().actions.setInput({ jump: true });
          handled = true;
          break;

        case 'KeyR':
          gameStore.getState().actions.resetToCheckpoint();
          handled = true;
          break;

        case 'Escape':
          // Exit play mode to preview
          gameStore.getState().actions.setMode('preview');
          handled = true;
          break;

        default:
          // Fallback by key
          if (key === ' ' || key === 'Spacebar') {
            gameStore.getState().actions.setInput({ jump: true });
            handled = true;
          } else if (key === 'r' || key === 'R') {
            gameStore.getState().actions.resetToCheckpoint();
            handled = true;
          } else if (key === 'Escape') {
            gameStore.getState().actions.setMode('preview');
            handled = true;
          }
          break;
      }

      // Prevent page scrolling on Space and Arrow keys only while playing
      if (handled && (code === 'Space' || code.startsWith('Arrow'))) {
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (isEditableElement(e.target)) return;

      const code = e.code;
      const key = e.key;

      switch (code) {
        case 'KeyW':
        case 'ArrowUp':
          gameStore.getState().actions.setInput({ forward: false });
          break;

        case 'KeyS':
        case 'ArrowDown':
          gameStore.getState().actions.setInput({ backward: false });
          break;

        case 'KeyA':
        case 'ArrowLeft':
          gameStore.getState().actions.setInput({ left: false });
          break;

        case 'KeyD':
        case 'ArrowRight':
          gameStore.getState().actions.setInput({ right: false });
          break;

        case 'Space':
          gameStore.getState().actions.setInput({ jump: false });
          break;

        default:
          if (key === ' ' || key === 'Spacebar') {
            gameStore.getState().actions.setInput({ jump: false });
          }
          break;
      }
    };

    const handleBlur = () => {
      clearAllInput();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearAllInput();
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('keyup', handleKeyUp, { passive: true });
    window.addEventListener('blur', handleBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearAllInput();
    };
  }, [isPlaying, clearAllInput]);

  return null;
}
