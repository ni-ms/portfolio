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

export const CameraRig: React.FC<CameraRigProps> = ({
  mode = 'preview',
  isMobile = false,
  playerRef,
  playerPosition,
  recenterSignal = 0,
  forceDeterministic = false,
}) => {
  const { camera } = useThree();
  const currentTarget = useRef(new THREE.Vector3().fromArray(CAMERA_PRESETS.desktopOverview.target));
  const isReview = forceDeterministic || isDeterministicReviewMode();

  // Detect system reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Determine current preset based on mode and device
  const targetPreset = useMemo(() => {
    if (mode === 'play-overlay' || mode === 'play-inline') {
      return CAMERA_PRESETS.mobilePlay;
    }
    return isMobile ? CAMERA_PRESETS.mobilePreview : CAMERA_PRESETS.desktopOverview;
  }, [mode, isMobile]);

  // Recenter immediately when signal updates
  useEffect(() => {
    const preset = isMobile ? CAMERA_PRESETS.mobilePreview : CAMERA_PRESETS.desktopOverview;
    currentTarget.current.set(...preset.target);
    if (prefersReducedMotion || isReview) {
      camera.position.set(...preset.position);
      camera.lookAt(currentTarget.current);
    }
  }, [recenterSignal, isMobile, camera, prefersReducedMotion, isReview]);

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
