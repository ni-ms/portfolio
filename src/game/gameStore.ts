import { useSyncExternalStore } from 'react';
import type {
  GameMode,
  CheckpointId,
  Checkpoint,
  InputState,
  QualityPreset,
  GameStoreState,
} from '../types/game';
import { CHECKPOINTS } from './courseConfig';

// Single source of truth: import directly from courseConfig
export const DEFAULT_CHECKPOINTS: Checkpoint[] = CHECKPOINTS;

export const INITIAL_INPUT: InputState = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  jump: false,
};

export const DEFAULT_QUALITY: QualityPreset = {
  dpr: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1,
  shadowResolution: 2048,
  enableShadows: true,
  enablePostprocessing: true,
  foliageDensity: 'full',
};

type Listener = () => void;

let savedScrollY = 0;
let initiatingElement: HTMLElement | null = null;
let globalNavigateHandler: ((href: string) => void) | null = null;

export function registerGlobalNavigateHandler(handler: ((href: string) => void) | null) {
  globalNavigateHandler = handler;
}

const createInitialState = (): GameStoreState => ({
  mode: 'preview',
  currentCheckpointId: 'cp-start',
  checkpoints: DEFAULT_CHECKPOINTS.map((cp) => ({ ...cp })),
  input: { ...INITIAL_INPUT },
  isGrounded: true,
  isRespawning: false,
  isDeterministicReview: false,
  quality: { ...DEFAULT_QUALITY },
  lastCheckpointReachedId: undefined,
  actions: {
    setMode: (mode: GameMode) => {
      const prevMode = storeState.mode;
      if (prevMode === mode) return;

      if (mode === 'play-overlay' && typeof window !== 'undefined') {
        savedScrollY = window.scrollY;
        initiatingElement = document.activeElement as HTMLElement | null;
        document.body.classList.add('scroll-locked');
      } else if (prevMode === 'play-overlay' && mode !== 'play-overlay' && typeof window !== 'undefined') {
        document.body.classList.remove('scroll-locked');
        window.scrollTo({ top: savedScrollY, behavior: 'instant' });
        if (initiatingElement && typeof initiatingElement.focus === 'function') {
          initiatingElement.focus();
        }
      }

      gameStore.setState({ mode });
      if (mode === 'preview') {
        gameStore.getState().actions.clearInput();
      }
    },

    setInput: (updater) => {
      const prev = storeState.input;
      const partial = typeof updater === 'function' ? updater(prev) : updater;
      gameStore.setState({
        input: { ...prev, ...partial },
      });
    },

    clearInput: () => {
      gameStore.setState({
        input: { ...INITIAL_INPUT },
      });
    },

    reachCheckpoint: (id: CheckpointId) => {
      const updatedCheckpoints = storeState.checkpoints.map((cp) =>
        cp.id === id ? { ...cp, unlocked: true } : cp
      );
      gameStore.setState({
        currentCheckpointId: id,
        checkpoints: updatedCheckpoints,
        lastCheckpointReachedId: id,
      });
    },

    resetToCheckpoint: () => {
      gameStore.setState({
        isRespawning: true,
        input: { ...INITIAL_INPUT },
      });
    },

    respawnPlayer: () => {
      gameStore.setState({
        isRespawning: true,
        input: { ...INITIAL_INPUT },
      });
    },

    recenterDroneView: () => {
      // Signals camera recenter; resets camera drift or triggers recenter transition
      gameStore.setState((s) => ({ ...s }));
    },

    setDeterministicReview: (enabled: boolean) => {
      gameStore.setState({ isDeterministicReview: enabled });
    },

    navigateToSection: (sectionId: string) => {
      // Exit overlay / play mode and restore scroll
      gameStore.getState().actions.setMode('preview');
      gameStore.getState().actions.clearInput();

      if (typeof document !== 'undefined') {
        document.body.classList.remove('scroll-locked');
        // Let React unmount / settle before scrolling
        setTimeout(() => {
          const target = document.getElementById(sectionId);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }, 50);
      }
    },

    navigateToRoute: (route: string) => {
      // Exit overlay / play mode and restore scroll
      gameStore.getState().actions.setMode('preview');
      gameStore.getState().actions.clearInput();

      if (typeof document !== 'undefined') {
        document.body.classList.remove('scroll-locked');
      }

      if (globalNavigateHandler) {
        globalNavigateHandler(route);
      } else if (typeof window !== 'undefined') {
        // Fallback History API navigation
        window.history.pushState(null, '', route);
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    },
  },
});

let storeState: GameStoreState = createInitialState();
const listeners = new Set<Listener>();

export const gameStore = {
  getState: (): GameStoreState => storeState,

  setState: (
    updater:
      | Partial<GameStoreState>
      | ((prev: GameStoreState) => Partial<GameStoreState>)
  ) => {
    const partial = typeof updater === 'function' ? updater(storeState) : updater;
    storeState = {
      ...storeState,
      ...partial,
      // Preserve actions reference
      actions: storeState.actions,
    };
    listeners.forEach((listener) => listener());
  },

  subscribe: (listener: Listener) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  reset: () => {
    storeState = createInitialState();
    listeners.forEach((listener) => listener());
  },
};

export function useGameStore<T>(selector: (state: GameStoreState) => T): T {
  return useSyncExternalStore(
    gameStore.subscribe,
    () => selector(gameStore.getState()),
    () => selector(gameStore.getState())
  );
}
