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
  theme?: 'dark' | 'light';
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
 * Lighting rig calibrated for both dark and light architectural themes:
 * - Directional key light with balanced shadow camera frustum
 * - Soft ambient fill light preventing harsh black shadows
 * - Hemisphere light providing sky/ground color gradation
 * - Subtle opposite rim light for crisp architectural silhouette separation
 */
const Lighting: React.FC<{
  theme: 'dark' | 'light';
  shadowResolution: number;
  shadowBias: number;
  shadowNormalBias: number;
  enableShadows: boolean;
}> = ({ theme, shadowResolution, shadowBias, shadowNormalBias, enableShadows }) => {
  // Target dummy object for directional key light
  const lightTarget = useMemo(() => {
    const target = new THREE.Object3D();
    target.position.set(1.5, 1.5, 0);
    return target;
  }, []);

  const isLight = theme === 'light';

  return (
    <>
      <primitive object={lightTarget} />

      {/* Directional Key Light */}
      <directionalLight
        position={[-14, 22, 12]}
        target={lightTarget}
        intensity={isLight ? 1.65 : 1.85}
        color={isLight ? '#FFFDF8' : '#EEF4F6'}
        castShadow={enableShadows}
        shadow-mapSize-width={shadowResolution}
        shadow-mapSize-height={shadowResolution}
        shadow-camera-near={1}
        shadow-camera-far={48}
        shadow-camera-left={-15}
        shadow-camera-right={16}
        shadow-camera-top={13}
        shadow-camera-bottom={-11}
        shadow-bias={shadowBias}
        shadow-normalBias={shadowNormalBias}
      />

      {/* Soft Ambient Fill */}
      <ambientLight
        color={isLight ? '#E6EAE7' : '#263133'}
        intensity={isLight ? 0.75 : 0.55}
      />

      {/* Hemisphere Light (Sky tone to Ground tone) */}
      <hemisphereLight
        color={isLight ? '#F4F8F5' : '#46585B'}
        groundColor={isLight ? '#D0D6D1' : '#0E1212'}
        intensity={isLight ? 0.55 : 0.45}
      />

      {/* Subtle opposite rim fill light */}
      <directionalLight
        position={[14, 10, -12]}
        intensity={isLight ? 0.25 : 0.35}
        color={isLight ? '#C2C9C5' : '#29373A'}
      />
    </>
  );
};

export const Scene: React.FC<SceneProps> = ({
  mode = 'preview',
  theme = 'dark',
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
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: theme === 'light' ? 1.05 : 1.15,
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
        {/* Soft atmospheric depth fog dissolving into portfolio theme background */}
        <fog
          attach="fog"
          args={[theme === 'light' ? '#F2F1EA' : '#101414', 16, 48]}
        />

        {/* Calibrated Lighting Rig */}
        <Lighting
          theme={theme}
          shadowResolution={quality.shadowResolution}
          shadowBias={quality.shadowBias}
          shadowNormalBias={quality.shadowNormalBias}
          enableShadows={quality.enableShadows}
        />

        {/* 3D Course Architecture, Balustrades, Greenery & Skyline */}
        <CourseGeometry isMobile={isMobile} theme={theme} />

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
