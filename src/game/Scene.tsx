import React, { useMemo, useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { GameMode } from '../types/game';
import { CourseGeometry } from './CourseGeometry';
import { CameraRig } from './CameraRig';
import { SceneMarkers } from './SceneMarkers';
import { getQualityPreset } from './quality';
import { CAMERA_PRESETS } from './courseConfig';

export interface SceneProps {
  mode?: GameMode;
  isMobile?: boolean;
  isDeterministicReview?: boolean;
  recenterSignal?: number;
  showMarkers?: boolean;
  onSelectCheckpoint?: (sectionId: string) => void;
  playerPosition?: [number, number, number];
  isVisible?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Lighting rig calibrated to match the art-directed diorama:
 * - Directional key light from upper-left casting crisp directional contact shadows
 * - Soft ambient fill light preventing harsh black shadows
 * - Hemisphere light providing sky/ground color gradation
 * - Low-intensity rim/fill light for silhouette separation
 */
const Lighting: React.FC<{
  shadowResolution: number;
  shadowBias: number;
  shadowNormalBias: number;
  enableShadows: boolean;
}> = ({ shadowResolution, shadowBias, shadowNormalBias, enableShadows }) => {
  // Target dummy object for directional key light
  const lightTarget = useMemo(() => {
    const target = new THREE.Object3D();
    target.position.set(1.5, 1.5, 0);
    return target;
  }, []);

  return (
    <>
      <primitive object={lightTarget} />

      {/* Directional Key Light */}
      <directionalLight
        position={[-14, 22, 12]}
        target={lightTarget}
        intensity={1.85}
        color="#F8FAFA"
        castShadow={enableShadows}
        shadow-mapSize-width={shadowResolution}
        shadow-mapSize-height={shadowResolution}
        shadow-camera-near={1}
        shadow-camera-far={45}
        shadow-camera-left={-14}
        shadow-camera-right={15}
        shadow-camera-top={12}
        shadow-camera-bottom={-10}
        shadow-bias={shadowBias}
        shadow-normalBias={shadowNormalBias}
      />

      {/* Soft Ambient Fill */}
      <ambientLight color="#2A3538" intensity={0.65} />

      {/* Hemisphere Light (Sky tone to Dark ground tone) */}
      <hemisphereLight color="#526366" groundColor="#101414" intensity={0.5} />

      {/* Subtle opposite rim fill light */}
      <directionalLight position={[12, 8, -10]} intensity={0.3} color="#2E3B3E" />
    </>
  );
};

export const Scene: React.FC<SceneProps> = ({
  mode = 'preview',
  isMobile = false,
  isDeterministicReview = false,
  recenterSignal = 0,
  showMarkers = true,
  onSelectCheckpoint,
  playerPosition,
  isVisible: isVisibleProp,
  children,
  className = '',
  style,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(true);
  const [isDocVisible, setIsDocVisible] = useState(
    typeof document !== 'undefined' ? !document.hidden : true
  );

  // Document visibility tracking
  useEffect(() => {
    const handleVisChange = () => {
      setIsDocVisible(typeof document !== 'undefined' ? !document.hidden : true);
    };
    document.addEventListener('visibilitychange', handleVisChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisChange);
    };
  }, []);

  // Viewport intersection observer: suspend frameloop when container is scrolled offscreen
  useEffect(() => {
    const el = containerRef.current;
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

  const isInternalVisible = isDocVisible && (mode === 'play-overlay' || isIntersecting);
  const isEffectiveVisible = isVisibleProp !== undefined ? isVisibleProp : isInternalVisible;

  const quality = useMemo(
    () => getQualityPreset(isMobile, isDeterministicReview),
    [isMobile, isDeterministicReview]
  );

  const initialCam = isMobile ? CAMERA_PRESETS.mobilePreview : CAMERA_PRESETS.desktopOverview;

  return (
    <div
      ref={containerRef}
      className={`scene-canvas-container ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: 'transparent',
        ...style,
      }}
    >
      <Canvas
        frameloop={isEffectiveVisible ? 'always' : 'never'}
        shadows={quality.enableShadows}
        dpr={[1, quality.dpr]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        camera={{
          fov: 29,
          near: 0.1,
          far: 100,
          position: initialCam.position,
        }}
        style={{
          background: 'transparent',
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      >
        {/* Art-directed Lighting Rig */}
        <Lighting
          shadowResolution={quality.shadowResolution}
          shadowBias={quality.shadowBias}
          shadowNormalBias={quality.shadowNormalBias}
          enableShadows={quality.enableShadows}
        />

        {/* 3D Course Architecture & Beacons */}
        <CourseGeometry />

        {/* Camera Rig (Handles presets, following, and damping) */}
        <CameraRig
          mode={mode}
          isMobile={isMobile}
          playerPosition={playerPosition}
          recenterSignal={recenterSignal}
          forceDeterministic={isDeterministicReview}
        />

        {/* Drei HTML Section Markers */}
        <SceneMarkers
          onSelectCheckpoint={onSelectCheckpoint}
          visible={showMarkers && mode !== 'play-overlay'}
        />

        {/* Slot for PlayerController / Avatar */}
        {children}
      </Canvas>
    </div>
  );
};
