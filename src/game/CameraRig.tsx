import React, { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { GameMode } from '../types/game';
import { CAMERA_PRESETS } from './courseConfig';
import { isDeterministicReviewMode } from './quality';
import { livePlayerTransform } from './playerTransform';

export interface CameraRigProps {
  mode?: GameMode;
  isMobile?: boolean;
  playerRef?: React.RefObject<THREE.Object3D | null>;
  playerPosition?: [number, number, number];
  recenterSignal?: number;
  forceDeterministic?: boolean;
}

// Responsive desktop overview preset: low-oblique architectural hero perspective
// calibrated so elevated Work terrace and next-landing badge remain fully within canvas bounds.
const RESPONSIVE_DESKTOP_OVERVIEW = {
  position: [-0.6, 9.0, 17.5] as [number, number, number],
  target: [-1.8, 3.0, 0.8] as [number, number, number],
  zoom: 1.0,
};

// Responsive mobile/tablet preview preset: centers player/start and next landing (Work platform)
// so that start launch cue, player, next landing, and 01/WORK label remain readable without clipping.
const RESPONSIVE_MOBILE_PREVIEW = {
  position: [-3.0, 11.2, 17.6] as [number, number, number],
  target: [-3.2, 3.3, 0.5] as [number, number, number],
  zoom: 1.0,
};

export const CameraRig: React.FC<CameraRigProps> = ({
  mode = 'preview',
  isMobile = false,
  playerRef,
  playerPosition,
  recenterSignal = 0,
  forceDeterministic = false,
}) => {
  const { camera, size } = useThree();
  const currentTarget = useRef(new THREE.Vector3().fromArray(RESPONSIVE_DESKTOP_OVERVIEW.target));
  const isReview = forceDeterministic || isDeterministicReviewMode();

  // Detect system reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Determine current preset based on mode, device, and measured canvas dimensions
  const targetPreset = useMemo(() => {
    if (mode === 'play-overlay' || mode === 'play-inline') {
      return CAMERA_PRESETS.mobilePlay;
    }
    const aspect = size.width / Math.max(1, size.height);
    const isNarrow = isMobile || size.width < 640 || aspect < 1.55;
    return isNarrow ? RESPONSIVE_MOBILE_PREVIEW : RESPONSIVE_DESKTOP_OVERVIEW;
  }, [mode, isMobile, size.width, size.height]);

  // Recenter immediately when signal or targetPreset updates
  useEffect(() => {
    currentTarget.current.set(...targetPreset.target);
    if (prefersReducedMotion || isReview) {
      camera.position.set(...targetPreset.position);
      camera.lookAt(currentTarget.current);
    }
  }, [recenterSignal, targetPreset, camera, prefersReducedMotion, isReview]);

  // Temp vectors for frame loop calculations
  const tempTarget = useMemo(() => new THREE.Vector3(), []);
  const tempCamPos = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }, delta) => {
    const isPlaying = mode === 'play-inline' || mode === 'play-overlay';
    const t = isReview ? 0 : clock.getElapsedTime();

    // 1. Calculate desired camera target
    if (isPlaying) {
      let px = targetPreset.target[0];
      let py = targetPreset.target[1];
      let pz = targetPreset.target[2];

      if (playerPosition) {
        [px, py, pz] = playerPosition;
      } else if (playerRef?.current) {
        px = playerRef.current.position.x;
        py = playerRef.current.position.y;
        pz = playerRef.current.position.z;
      } else if (livePlayerTransform.position) {
        px = livePlayerTransform.position.x;
        py = livePlayerTransform.position.y;
        pz = livePlayerTransform.position.z;
      }

      // Look slightly ahead of player on course
      tempTarget.set(px, py + 0.6, pz - 1.2);
    } else {
      tempTarget.set(...targetPreset.target);
    }

    // 2. Calculate desired camera position
    if (isPlaying) {
      // Follow offset behind & above player (45 deg oblique drone angle)
      const followOffsetX = 0;
      const followOffsetY = 9.5;
      const followOffsetZ = 10.5;

      tempCamPos.set(
        tempTarget.x + followOffsetX,
        tempTarget.y + followOffsetY,
        tempTarget.z + followOffsetZ
      );
    } else {
      // Overview diorama with subtle idle drone hover drift
      let driftX = 0;
      let driftY = 0;
      let driftZ = 0;

      if (!isReview && !prefersReducedMotion) {
        driftX = Math.sin(t * 0.45) * 0.22;
        driftY = Math.sin(t * 0.6) * 0.15;
        driftZ = Math.cos(t * 0.35) * 0.2;
      }

      tempCamPos.set(
        targetPreset.position[0] + driftX,
        targetPreset.position[1] + driftY,
        targetPreset.position[2] + driftZ
      );
    }

    // 3. Interpolate camera position & lookAt
    if (prefersReducedMotion || isReview) {
      // Snap instantly without drift
      currentTarget.current.copy(tempTarget);
      camera.position.copy(tempCamPos);
      camera.lookAt(currentTarget.current);
    } else {
      // Smooth cinematic damping
      const posLerp = Math.min(1, delta * (isPlaying ? 4.5 : 2.5));
      const targetLerp = Math.min(1, delta * (isPlaying ? 6.0 : 3.0));

      currentTarget.current.lerp(tempTarget, targetLerp);
      camera.position.lerp(tempCamPos, posLerp);
      camera.lookAt(currentTarget.current);
    }
  });

  return null;
};
