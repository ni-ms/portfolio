export type GameMode = 'preview' | 'play-inline' | 'play-overlay';

export type CheckpointId = 'cp-start' | 'cp-work' | 'cp-explorations' | 'cp-resume';

export interface Checkpoint {
  id: CheckpointId;
  index: number;
  label: string; // e.g. "01 / WORK"
  shortTitle: string; // e.g. "WORK"
  targetSectionId: string; // e.g. "work"
  position: [number, number, number]; // [x, y, z]
  spawnPosition: [number, number, number];
  unlocked: boolean;
}

export interface InputState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
}

export interface CameraPreset {
  position: [number, number, number];
  target: [number, number, number];
  zoom: number;
}

export interface QualityPreset {
  dpr: number;
  shadowResolution: number;
  enableShadows: boolean;
  enablePostprocessing: boolean;
  foliageDensity: 'sparse' | 'full';
}

export interface GameStoreState {
  mode: GameMode;
  currentCheckpointId: CheckpointId;
  checkpoints: Checkpoint[];
  input: InputState;
  isGrounded: boolean;
  isRespawning: boolean;
  isDeterministicReview: boolean;
  quality: QualityPreset;
  actions: {
    setMode: (mode: GameMode) => void;
    setInput: (updater: Partial<InputState> | ((prev: InputState) => Partial<InputState>)) => void;
    clearInput: () => void;
    reachCheckpoint: (id: CheckpointId) => void;
    resetToCheckpoint: () => void;
    respawnPlayer: () => void;
    recenterDroneView: () => void;
    setDeterministicReview: (enabled: boolean) => void;
    navigateToSection: (sectionId: string) => void;
  };
}
