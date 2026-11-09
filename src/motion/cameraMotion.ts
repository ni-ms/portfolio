import { gsap } from 'gsap/dist/gsap';
import { isReducedMotion } from './reducedMotion';

export interface CameraOffset {
  x: number;
  y: number;
  z: number;
}

export interface LiveCameraTransition {
  posOffset: CameraOffset;
  targetOffset: CameraOffset;
  isSettling: boolean;
}

/**
 * Global live transition target readable by CameraRig's frame loop.
 * GSAP updates these numerical values; only CameraRig's frame loop writes camera transforms.
 */
export const liveCameraTransition: LiveCameraTransition = {
  posOffset: { x: 0, y: 0, z: 0 },
  targetOffset: { x: 0, y: 0, z: 0 },
  isSettling: false,
};

let activeSettlingTween: gsap.core.Timeline | gsap.core.Tween | null = null;

/**
 * Triggers a short, purposeful camera settling animation when Home mounts.
 * If reduced motion is preferred, resets all offsets to zero immediately without delay.
 */
export function triggerHomeCameraSettling(forceInstant: boolean = false): void {
  resetCameraTransition();

  if (forceInstant || isReducedMotion()) {
    return;
  }

  // Subtle elevated entrance offset: camera starts slightly higher and back, settling smoothly
  liveCameraTransition.posOffset.x = 0.25;
  liveCameraTransition.posOffset.y = 0.75;
  liveCameraTransition.posOffset.z = 1.2;
  liveCameraTransition.targetOffset.x = 0.1;
  liveCameraTransition.targetOffset.y = 0.2;
  liveCameraTransition.targetOffset.z = 0;
  liveCameraTransition.isSettling = true;

  const tl = gsap.timeline({
    onComplete: () => {
      liveCameraTransition.isSettling = false;
      activeSettlingTween = null;
    },
  });

  tl.to(liveCameraTransition.posOffset, {
    x: 0,
    y: 0,
    z: 0,
    duration: 0.8,
    ease: 'power2.out',
  }, 0);

  tl.to(liveCameraTransition.targetOffset, {
    x: 0,
    y: 0,
    z: 0,
    duration: 0.8,
    ease: 'power2.out',
  }, 0);

  activeSettlingTween = tl;
}

/**
 * Cleanly reset camera transition offsets and kill any active tweens.
 */
export function resetCameraTransition(): void {
  if (activeSettlingTween) {
    activeSettlingTween.kill();
    activeSettlingTween = null;
  }
  liveCameraTransition.posOffset.x = 0;
  liveCameraTransition.posOffset.y = 0;
  liveCameraTransition.posOffset.z = 0;
  liveCameraTransition.targetOffset.x = 0;
  liveCameraTransition.targetOffset.y = 0;
  liveCameraTransition.targetOffset.z = 0;
  liveCameraTransition.isSettling = false;
}
