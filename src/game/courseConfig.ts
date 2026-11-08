import { Checkpoint, CameraPreset } from '../types/game';

export interface RooftopBounds {
  id: string;
  name: string;
  center: [number, number, number];
  size: [number, number, number];
  surfaceY: number;
}

export interface SteppingPlatform {
  id: string;
  position: [number, number, number];
  size: [number, number, number];
  surfaceY: number;
  hasPillar?: boolean;
}

export const CHECKPOINTS: Checkpoint[] = [
  {
    id: 'cp-start',
    index: 0,
    label: '00 / START',
    shortTitle: 'START',
    targetRoute: '/',
    targetSectionId: 'hero',
    position: [-3.5, 1.2, 3.5],
    spawnPosition: [-3.5, 1.7, 3.5],
    unlocked: true,
  },
  {
    id: 'cp-work',
    index: 1,
    label: '01 / WORK',
    shortTitle: 'WORK',
    targetRoute: '/projects',
    targetSectionId: 'work',
    position: [-3.2, 3.8, -3.0],
    spawnPosition: [-3.2, 4.3, -2.5],
    unlocked: false,
  },
  {
    id: 'cp-explorations',
    index: 2,
    label: '02 / EXPLORATIONS',
    shortTitle: 'EXPLORATIONS',
    targetRoute: '/about',
    targetSectionId: 'explorations',
    position: [1.2, 2.6, 0.2],
    spawnPosition: [1.2, 3.1, 0.0],
    unlocked: false,
  },
  {
    id: 'cp-resume',
    index: 3,
    label: '03 / RÉSUMÉ',
    shortTitle: 'RÉSUMÉ',
    targetRoute: '/resume',
    targetSectionId: 'resume',
    position: [6.0, 4.2, 1.0],
    spawnPosition: [6.0, 4.7, 1.4],
    unlocked: false,
  },
];

export const COURSE_BOUNDS = {
  // Ground slab base
  groundSlab: {
    position: [1.0, -0.25, 0.5] as [number, number, number],
    size: [28, 0.5, 24] as [number, number, number],
    surfaceY: 0.0,
  },

  // 1. Foreground-left starting rooftop
  startRooftop: {
    id: 'start-rooftop',
    name: 'Start Rooftop',
    mainSlab: {
      position: [-3.5, 0.6, 3.0] as [number, number, number],
      size: [4.2, 1.2, 2.8] as [number, number, number],
      surfaceY: 1.2,
    },
    lowerLanding: {
      position: [-3.5, 0.3, 5.8] as [number, number, number],
      size: [2.4, 0.6, 1.2] as [number, number, number],
      surfaceY: 0.6,
    },
    stairs: {
      position: [-3.5, 0.6, 4.8] as [number, number, number],
      steps: 4,
      width: 2.2,
      run: 0.8,
      rise: 0.6,
    },
    spawnPosition: [-3.5, 1.7, 3.5] as [number, number, number],
    floorArrowsPosition: [-3.5, 1.205, 3.2] as [number, number, number],
    startMarkingPosition: [-3.5, 1.205, 4.0] as [number, number, number],
  },

  // 2. Back-left elevated work rooftop
  workRooftop: {
    id: 'work-rooftop',
    name: 'Work Rooftop (Checkpoint 01)',
    mainSlab: {
      position: [-4.0, 1.9, -3.5] as [number, number, number],
      size: [4.6, 3.8, 4.2] as [number, number, number],
      surfaceY: 3.8,
    },
    beaconPosition: [-3.2, 3.8, -3.0] as [number, number, number],
    spawnPosition: [-3.2, 4.3, -2.5] as [number, number, number],
    hvacUnits: [
      { position: [-5.0, 3.8, -4.2] as [number, number, number], size: [1.4, 0.9, 1.3] as [number, number, number] },
      { position: [-5.0, 3.8, -2.6] as [number, number, number], size: [1.4, 0.9, 1.3] as [number, number, number] },
    ],
  },

  // 3. Central exploration rooftop
  explorationRooftop: {
    id: 'explorations-rooftop',
    name: 'Exploration Rooftop (Checkpoint 02)',
    upperTerrace: {
      position: [1.0, 1.3, -1.05] as [number, number, number],
      size: [5.2, 2.6, 2.5] as [number, number, number],
      surfaceY: 2.6,
    },
    lowerTerrace: {
      position: [1.0, 0.9, 1.7] as [number, number, number],
      size: [4.6, 1.8, 1.4] as [number, number, number],
      surfaceY: 1.8,
    },
    stairs: {
      position: [1.0, 1.8, 0.6] as [number, number, number],
      steps: 4,
      width: 2.4,
      run: 0.8,
      rise: 0.8,
    },
    beaconPosition: [1.2, 2.6, 0.2] as [number, number, number],
    spawnPosition: [1.2, 3.1, 0.0] as [number, number, number],
    planters: [
      { position: [-1.2, 2.6, -1.9] as [number, number, number], size: [0.6, 0.45, 1.8] as [number, number, number] },
      { position: [3.2, 2.6, -1.9] as [number, number, number], size: [0.6, 0.45, 1.8] as [number, number, number] },
    ],
  },

  // 4. Far-right elevated résumé rooftop
  resumeRooftop: {
    id: 'resume-rooftop',
    name: 'Résumé Rooftop (Checkpoint 03)',
    mainSlab: {
      position: [6.9, 2.1, 1.5] as [number, number, number],
      size: [3.2, 4.2, 4.4] as [number, number, number],
      surfaceY: 4.2,
    },
    beaconPosition: [6.0, 4.2, 1.0] as [number, number, number],
    spawnPosition: [6.0, 4.7, 1.4] as [number, number, number],
    overheadFrame: {
      center: [6.9, 5.4, 1.5] as [number, number, number],
      width: 2.8,
      height: 2.4,
      depth: 3.6,
      topY: 6.6,
    },
    stairs: {
      position: [5.2, 2.1, 3.8] as [number, number, number],
      steps: 5,
      width: 1.4,
      run: 1.2,
      rise: 1.2,
    },
  },

  // Stepping platforms and narrow beams
  steppingPlatforms: [
    // Start to Work route
    {
      id: 'step-start-work-1',
      position: [-4.2, 1.8, 1.35] as [number, number, number],
      size: [1.4, 0.3, 1.5] as [number, number, number],
      surfaceY: 1.95,
      hasPillar: true,
    },
    {
      id: 'step-start-work-2',
      position: [-4.5, 2.65, -0.55] as [number, number, number],
      size: [1.5, 0.3, 1.7] as [number, number, number],
      surfaceY: 2.80,
      hasPillar: true,
    },
    // Work to Explorations route
    {
      id: 'beam-work-exp',
      position: [-1.8, 3.1, -3.2] as [number, number, number],
      size: [1.8, 0.25, 0.55] as [number, number, number],
      surfaceY: 3.225,
      hasPillar: true,
    },
    {
      id: 'step-work-exp',
      position: [-0.7, 2.8, -2.0] as [number, number, number],
      size: [1.3, 0.3, 1.3] as [number, number, number],
      surfaceY: 2.95,
      hasPillar: true,
    },
    // Explorations to Resume route (unburied, single-jump heights ~0.55m)
    {
      id: 'step-exp-resume-1',
      position: [3.6, 2.95, 0.0] as [number, number, number],
      size: [1.3, 0.3, 1.3] as [number, number, number],
      surfaceY: 3.10,
      hasPillar: true,
    },
    {
      id: 'step-exp-resume-2',
      position: [4.65, 3.5, 0.45] as [number, number, number],
      size: [1.2, 0.3, 1.2] as [number, number, number],
      surfaceY: 3.65,
      hasPillar: true,
    },
  ] as SteppingPlatform[],
};

export const CAMERA_PRESETS: Record<'desktopOverview' | 'mobilePreview' | 'mobilePlay', CameraPreset> = {
  desktopOverview: {
    position: [-3.0, 19.5, 20.0],
    target: [-2.5, 2.2, 0.0],
    zoom: 1.0,
  },
  mobilePreview: {
    position: [0.5, 17.0, 17.5],
    target: [0.5, 2.0, 0.0],
    zoom: 0.85,
  },
  mobilePlay: {
    position: [-3.5, 11.5, 13.5],
    target: [-3.5, 1.7, 3.5],
    zoom: 1.0,
  },
};
