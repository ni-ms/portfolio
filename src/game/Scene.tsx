import React, { useMemo, useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { GameMode } from '../types/game';
import { CourseGeometry } from './CourseGeometry';
import { CameraRig } from './CameraRig';
import { SceneMarkers } from './SceneMarkers';
import { getQualityPreset, isDeterministicReviewMode } from './quality';
import { CAMERA_PRESETS } from './courseConfig';

export interface SceneProps {
  mode?: GameMode;
  theme?: 'dark' | 'light';
  isMobile?: boolean;
  isDeterministicReview?: boolean;
  forceDeterministic?: boolean;
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
 * Procedural local reflection environment baked once per theme change via Drei Environment + Lightformer.
 * Reuses a single stable CubeRenderTarget across theme switches to eliminate PMREM allocation leaks.
 * Memoizes lightformers strictly by theme to prevent spurious recaptures on mode changes or idle renders.
 * Zero network requests, zero remote HDR dependencies; no idle cubemap recapture; PBR fragment sampling cost remains / hardware unmeasured.
 */
const StudioEnvironment: React.FC<{ theme: 'dark' | 'light' }> = ({ theme }) => {
  const isLight = theme === 'light';

  const lightformers = useMemo(
    () => (
      <>
        {/* Overhead Key Softbox */}
        <Lightformer
          form="rect"
          intensity={isLight ? 1.8 : 2.5}
          position={[0, 9, 0]}
          scale={[16, 16, 1]}
          rotation={[-Math.PI / 2, 0, 0]}
          color={isLight ? '#FFFFFF' : '#E4EFF2'}
        />

        {/* Left/West Fill Card: illuminates HVAC intake louvers, metal conduits & west balustrades */}
        <Lightformer
          form="rect"
          intensity={isLight ? 1.6 : 2.2}
          position={[-10, 4, 4]}
          scale={[10, 6, 1]}
          target={[0, 2, 0]}
          color={isLight ? '#F0F5F2' : '#B8D0D8'}
        />

        {/* Right/East Rim Card: sharp metallic edge response on rails, pergolas & balustrade glass */}
        <Lightformer
          form="rect"
          intensity={isLight ? 1.5 : 2.0}
          position={[10, 6, -4]}
          scale={[10, 6, 1]}
          target={[0, 2, 0]}
          color={isLight ? '#E8EFE8' : '#94B0BC'}
        />

        {/* Front Horizontal Glint Strip: creates crisp horizontal highlight streaks on coping & HVAC shrouds */}
        <Lightformer
          form="rect"
          intensity={isLight ? 2.2 : 2.8}
          position={[-2, 3, 10]}
          scale={[18, 1.2, 1]}
          target={[-2, 2, 0]}
          color="#FFFFFF"
        />

        {/* Low Ground Fill Card: soft upward bounce preventing pitch-black equipment undersides */}
        <Lightformer
          form="rect"
          intensity={isLight ? 0.6 : 0.8}
          position={[0, -6, 0]}
          scale={[18, 18, 1]}
          rotation={[Math.PI / 2, 0, 0]}
          color={isLight ? '#D0D8D4' : '#45565A'}
        />
      </>
    ),
    [isLight]
  );

  return (
    <Environment
      frames={1}
      resolution={128}
      environmentIntensity={isLight ? 0.75 : 0.95}
    >
      {lightformers}
    </Environment>
  );
};

/**
 * Lighting rig calibrated for both dark and light architectural themes:
 * - Strong directional key light preserving directional/contact depth on concrete
 * - Genuinely bright pale neutral fill/hemisphere/rim preventing dark shadow dropouts
 * - Softened shadow filtering (shadow-radius 2.5, tuned bias)
 * - Ground-bounce upward fill illuminating under-slab reveals and mechanical equipment
 * - Restrained warm architectural fixture lights at pergola and stair landings
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

      {/* Directional Key Light: Strong directional energy preserving crisp concrete contact depth */}
      <directionalLight
        position={[-14, 22, 12]}
        target={lightTarget}
        intensity={isLight ? 1.65 : 1.75}
        color={isLight ? '#FFFDF8' : '#F0F6F8'}
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
        shadow-radius={2.5}
      />

      {/* Soft Ambient Fill: Genuinely bright pale neutral gray-white, eliminating pitch-black shadow dropouts */}
      <ambientLight
        color={isLight ? '#F5F6F4' : '#C8D2D6'}
        intensity={isLight ? 0.65 : 0.55}
      />

      {/* Hemisphere Light: Atmospheric sky-to-ground graduation separating horizontal decks from vertical walls */}
      <hemisphereLight
        color={isLight ? '#F8FAF8' : '#B0C4CC'}
        groundColor={isLight ? '#D4DAD5' : '#48565C'}
        intensity={isLight ? 0.55 : 0.60}
      />

      {/* Opposite Rim Fill Light: Sharp silhouette delineation on reverse geometry */}
      <directionalLight
        position={[14, 10, -12]}
        intensity={isLight ? 0.40 : 0.50}
        color={isLight ? '#E0E6E2' : '#889EA6'}
      />

      {/* Ground-Bounce Upward Fill Light: Illuminates under-slab reveals and mechanical equipment undersides */}
      <directionalLight
        position={[6, -6, 8]}
        intensity={isLight ? 0.25 : 0.35}
        color={isLight ? '#D6DDD8' : '#6C8288'}
      />

      {/* Warm architectural fixture lights (pergola roof & start stair landing) */}
      <pointLight
        position={[6.9, 5.2, 1.5]}
        color="#FFE6B3"
        intensity={isLight ? 0.8 : 1.2}
        distance={5.0}
        decay={2}
      />
      <pointLight
        position={[-3.5, 1.5, 4.8]}
        color="#FFE6B3"
        intensity={isLight ? 0.5 : 0.8}
        distance={3.5}
        decay={2}
      />
    </>
  );
};

export const Scene: React.FC<SceneProps> = ({
  mode = 'preview',
  theme = 'dark',
  isMobile = false,
  isDeterministicReview: isDeterministicReviewProp = false,
  forceDeterministic = false,
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
  const markersPortalRef = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(true);
  const [isDocVisible, setIsDocVisible] = useState(
    typeof document !== 'undefined' ? !document.hidden : true
  );

  // Combined effective review state
  const effectiveReview = Boolean(
    forceDeterministic || isDeterministicReviewProp || isDeterministicReviewMode()
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
    () => getQualityPreset(isMobile, effectiveReview),
    [isMobile, effectiveReview]
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
        minWidth: 0,
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
          args={[
            theme === 'light' ? '#F2F1EA' : '#101414',
            theme === 'light' ? 28 : 28,
            theme === 'light' ? 72 : 72,
          ]}
        />

        {/* Procedural Local Reflection Environment (Bake-once per theme) */}
        {theme === 'dark' ? (
          <Environment files="/rooftop/sunset.hdr" environmentIntensity={0.8} />
        ) : <StudioEnvironment theme={theme} />}

        {/* Calibrated Lighting Rig */}
        <Lighting
          theme={theme}
          shadowResolution={quality.shadowResolution}
          shadowBias={quality.shadowBias}
          shadowNormalBias={quality.shadowNormalBias}
          enableShadows={quality.enableShadows}
        />

        {/* 3D Course Architecture, Balustrades, Greenery & Skyline */}
        <CourseGeometry
          isMobile={isMobile}
          theme={theme}
          isDeterministicReview={effectiveReview}
        />

        {/* Camera Rig (Handles presets, following, and damping) */}
        <CameraRig
          mode={mode}
          isMobile={isMobile}
          playerPosition={playerPosition}
          recenterSignal={recenterSignal}
          forceDeterministic={effectiveReview}
        />

        {/* Drei HTML Section Markers (portaled above the perimeter atmosphere layer) */}
        <SceneMarkers
          portal={markersPortalRef}
          onSelectCheckpoint={onSelectCheckpoint}
          visible={showMarkers && mode !== 'play-overlay'}
        />

        {children}
      </Canvas>

      {/* Soft perimeter atmosphere: feather gradients and peripheral blur strictly over 3D canvas */}
      <div
        className="home-game-perimeter"
        aria-hidden="true"
        data-testid="home-game-perimeter"
      >
        <div className="perimeter-feather-top" />
        <div className="perimeter-feather-bottom" />
        <div className="perimeter-feather-left" />
        <div className="perimeter-feather-right" />
        <div className="perimeter-blur-ring" />
      </div>

      {/* HTML Scene Markers Portal (rendered strictly above perimeter layer, keeping labels crisp) */}
      <div
        ref={markersPortalRef}
        className="scene-markers-portal"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 3,
          overflow: 'hidden',
        }}
      />
    </div>
  );
};
