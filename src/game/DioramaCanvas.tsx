import React from 'react';
import { Physics } from '@react-three/rapier';
import { Scene } from './Scene';
import { PhysicsCourse } from './PhysicsCourse';
import { PlayerController } from './PlayerController';
import { KeyboardControls } from './KeyboardControls';
import { useGameStore } from './gameStore';
import type { GameMode } from '../types/game';

export interface DioramaCanvasProps {
  mode?: GameMode;
  isMobile?: boolean;
  isDeterministicReview?: boolean;
  recenterSignal?: number;
  showMarkers?: boolean;
  onSelectCheckpoint?: (sectionId: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const DioramaCanvas: React.FC<DioramaCanvasProps> = ({
  mode,
  isMobile = false,
  isDeterministicReview = false,
  recenterSignal = 0,
  showMarkers = true,
  onSelectCheckpoint,
  className,
  style,
}) => {
  const storeMode = useGameStore((s) => s.mode);
  const effectiveMode = mode ?? storeMode;
  const isPlayActive = effectiveMode === 'play-inline' || effectiveMode === 'play-overlay';

  return (
    <>
      {/* Keyboard Controls Listener (active only when in play mode) */}
      <KeyboardControls forceActive={isPlayActive} />

      <Scene
        mode={effectiveMode}
        isMobile={isMobile}
        isDeterministicReview={isDeterministicReview}
        recenterSignal={recenterSignal}
        showMarkers={showMarkers}
        onSelectCheckpoint={onSelectCheckpoint}
        className={className}
        style={style}
      >
        <Physics gravity={[0, -18, 0]}>
          <PhysicsCourse showVisuals={false} />
          <PlayerController />
        </Physics>
      </Scene>
    </>
  );
};
