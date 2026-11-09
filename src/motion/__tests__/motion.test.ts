import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  isReducedMotion,
  subscribeReducedMotion,
} from '../reducedMotion';
import {
  liveCameraTransition,
  triggerHomeCameraSettling,
  resetCameraTransition,
} from '../cameraMotion';
import { initThemeMotion } from '../themeMotion';

describe('Motion Subsystem Units', () => {
  beforeEach(() => {
    resetCameraTransition();
  });

  afterEach(() => {
    resetCameraTransition();
    vi.restoreAllMocks();
  });

  describe('reducedMotion', () => {
    it('returns a boolean for isReducedMotion()', () => {
      const reduced = isReducedMotion();
      expect(typeof reduced).toBe('boolean');
    });

    it('allows subscription and unsubscription without memory leaks', () => {
      const listener = vi.fn();
      const unsubscribe = subscribeReducedMotion(listener);
      expect(typeof unsubscribe).toBe('function');
      unsubscribe();
    });
  });

  describe('cameraMotion', () => {
    it('initializes with zero offsets', () => {
      resetCameraTransition();
      expect(liveCameraTransition.posOffset).toEqual({ x: 0, y: 0, z: 0 });
      expect(liveCameraTransition.targetOffset).toEqual({ x: 0, y: 0, z: 0 });
      expect(liveCameraTransition.isSettling).toBe(false);
    });

    it('triggerHomeCameraSettling(true) keeps offsets at zero for instant/reduced motion', () => {
      triggerHomeCameraSettling(true);
      expect(liveCameraTransition.posOffset).toEqual({ x: 0, y: 0, z: 0 });
      expect(liveCameraTransition.targetOffset).toEqual({ x: 0, y: 0, z: 0 });
      expect(liveCameraTransition.isSettling).toBe(false);
    });

    it('resetCameraTransition() kills active tweens and resets offsets', () => {
      liveCameraTransition.posOffset.x = 5;
      liveCameraTransition.targetOffset.y = 3;
      liveCameraTransition.isSettling = true;

      resetCameraTransition();

      expect(liveCameraTransition.posOffset).toEqual({ x: 0, y: 0, z: 0 });
      expect(liveCameraTransition.targetOffset).toEqual({ x: 0, y: 0, z: 0 });
      expect(liveCameraTransition.isSettling).toBe(false);
    });
  });

  describe('themeMotion', () => {
    it('initializes and returns a cleanup function', () => {
      const cleanup = initThemeMotion();
      expect(typeof cleanup).toBe('function');
      cleanup();
    });
  });
});
