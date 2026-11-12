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

export interface BarrierDefinition {
  id: string;
  name: string;
  start: [number, number, number];
  end: [number, number, number];
  height: number;
  thickness: number;
}

export interface ArchitecturalObstacle {
  id: string;
  name: string;
  position: [number, number, number];
  size: [number, number, number];
}

export interface RampConfig {
  id: string;
  name: string;
  position: [number, number, number];
  rotation: [number, number, number];
  colliderArgs: [number, number, number]; // [halfWidth, halfThickness, halfLength]
  slope: number;
  halfWidth: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
  /**
   * Normalised (x, z) world-space direction that goes *uphill* on this ramp.
   * The assist fires when the dot product of the player's horizontal move vector
   * against this direction is positive (player is heading uphill).
   *
   * Derived from the ramp's Y-rotation: a rotation of 0 means uphill is -Z;
   * a rotation of -0.7854 (-45°) rotates that by +45°, giving +X/-Z direction.
   *
   * Formula: uphillDirXZ = rotate([0, -1], yRotation)
   *   x = -sin(yRotation)  (since base uphill is -Z in local space → world +X when yRot<0)
   *   z = -cos(yRotation)
   */
  uphillDirXZ: [number, number];
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

export const START_STAIRS_RAMP: RampConfig = {
  id: 'ramp-start',
  name: 'start-stairs-ramp',
  position: [-3.5, 0.9, 4.8],
  rotation: [0.6435, 0, 0],
  colliderArgs: [1.1, 0.05, 0.5],
  slope: 0.75,
  halfWidth: 1.1,
  minY: 0.6,
  maxY: 1.2,
  minZ: 4.4,
  maxZ: 5.2,
  // Y-rotation = 0 → uphill is -Z: x=-sin(0)=0, z=-cos(0)=-1
  uphillDirXZ: [0, -1],
};

export const EXPLORATION_STAIRS_RAMP: RampConfig = {
  id: 'ramp-explorations',
  name: 'explorations-stairs-ramp',
  position: [1.0, 2.2, 0.6],
  rotation: [0.7854, 0, 0],
  colliderArgs: [1.2, 0.05, 0.5657],
  slope: 1.0,
  halfWidth: 1.2,
  minY: 1.8,
  maxY: 2.6,
  minZ: 0.2,
  maxZ: 1.0,
  // Y-rotation = 0 → uphill is -Z: x=-sin(0)=0, z=-cos(0)=-1
  uphillDirXZ: [0, -1],
};

export const RESUME_STAIRS_RAMP: RampConfig = {
  id: 'ramp-resume',
  name: 'resume-stairs-ramp',
  position: [5.2, 3.6, 3.8],
  rotation: [-0.555, -0.7854, 0],
  colliderArgs: [0.7, 0.05, 0.85],
  slope: 1.0,
  halfWidth: 0.7,
  minY: 3.0,
  maxY: 4.2,
  minZ: 3.2,
  maxZ: 4.4,
  // Y-rotation = -0.7854 but full XYZ Euler gives world normal ≈ [0, 0.850, -0.527].
  // Actual uphill direction (from physics): +Z (walking toward higher Z goes up the ramp).
  uphillDirXZ: [0, 1],
};

export const RAMP_DEFINITIONS: RampConfig[] = [
  START_STAIRS_RAMP,
  EXPLORATION_STAIRS_RAMP,
  RESUME_STAIRS_RAMP,
];

/**
 * Canonical perimeter balustrades with real collision bounds.
 * Traversal route gaps are deliberately kept open:
 * - Start roof northwest corner open for first jump toward stepping platform 1 ([-4.2, 1.8, 1.125])
 * - Start roof north-center open for stairs descent/ascent
 * - Work roof east edge open for beam jump ([-1.8, 3.1, -3.2])
 * - Explorations east terrace open for stepping stones jump ([3.6, 2.95, 0.0])
 * - Résumé north edge open for landing
 */
export const BALUSTRADE_DEFINITIONS: BarrierDefinition[] = [
  // 1. Start Rooftop West Balustrade (guards drop-off to the west, preventing fall on hold A)
  {
    id: 'balustrade-start-west',
    name: 'start-rooftop-west-balustrade',
    start: [-5.6, 1.2, 4.4],
    end: [-5.6, 1.2, 1.6],
    height: 0.88,
    thickness: 0.08,
  },
  // 2. Start Rooftop North Corner (stops west-bound drift, leaves jump gap [-3.5.. -1.4] open)
  {
    id: 'balustrade-start-north',
    name: 'start-rooftop-north-balustrade',
    start: [-5.6, 1.2, 1.6],
    end: [-4.4, 1.2, 1.6],
    height: 0.88,
    thickness: 0.08,
  },
  // 3. Start Lower Landing South Balustrade
  {
    id: 'balustrade-start-landing-south',
    name: 'start-landing-south-balustrade',
    start: [-4.7, 0.6, 6.4],
    end: [-2.3, 0.6, 6.4],
    height: 0.88,
    thickness: 0.08,
  },
  // 4. Work Rooftop West Balustrade
  {
    id: 'balustrade-work-west',
    name: 'work-rooftop-west-balustrade',
    start: [-6.3, 3.8, -5.6],
    end: [-6.3, 3.8, -1.4],
    height: 0.88,
    thickness: 0.08,
  },
  // 5. Work Rooftop North Balustrade
  {
    id: 'balustrade-work-north',
    name: 'work-rooftop-north-balustrade',
    start: [-6.3, 3.8, -5.6],
    end: [-1.7, 3.8, -5.6],
    height: 0.88,
    thickness: 0.08,
  },
  // 6. Work Rooftop East Return (leaves jump gap open at z=-3.2)
  {
    id: 'balustrade-work-east',
    name: 'work-rooftop-east-balustrade',
    start: [-1.7, 3.8, -5.6],
    end: [-1.7, 3.8, -3.8],
    height: 0.88,
    thickness: 0.08,
  },
  // 7. Exploration Upper Terrace North Balustrade
  {
    id: 'balustrade-exp-north',
    name: 'explorations-north-balustrade',
    start: [0.2, 2.6, -2.3],
    end: [3.6, 2.6, -2.3],
    height: 0.88,
    thickness: 0.08,
  },
  // 8. Exploration Lower Terrace South Balustrade
  {
    id: 'balustrade-exp-south',
    name: 'explorations-south-balustrade',
    start: [-1.3, 1.8, 2.4],
    end: [3.3, 1.8, 2.4],
    height: 0.88,
    thickness: 0.08,
  },
  // 9. Résumé Rooftop East Balustrade
  {
    id: 'balustrade-resume-east',
    name: 'resume-rooftop-east-balustrade',
    start: [8.5, 4.2, -0.7],
    end: [8.5, 4.2, 3.7],
    height: 0.88,
    thickness: 0.08,
  },
  // 10. Résumé Rooftop North Return
  {
    id: 'balustrade-resume-north',
    name: 'resume-rooftop-north-balustrade',
    start: [5.3, 4.2, -0.7],
    end: [8.5, 4.2, -0.7],
    height: 0.88,
    thickness: 0.08,
  },
];

/**
 * Solid architectural obstacles with matching Rapier collision colliders.
 */
export const ARCHITECTURAL_OBSTACLES: ArchitecturalObstacle[] = [
  // Communications mast pedestal base on Work rooftop
  {
    id: 'obstacle-mast-pedestal',
    name: 'mast-pedestal',
    position: [-5.8, 3.9, -5.1],
    size: [0.45, 0.2, 0.45],
  },
  // Roof access hatch on Work rooftop
  {
    id: 'obstacle-roof-hatch',
    name: 'roof-access-hatch',
    position: [-2.4, 3.88, -2.1],
    size: [0.94, 0.16, 0.94],
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
    ramp: START_STAIRS_RAMP,
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
    ramp: EXPLORATION_STAIRS_RAMP,
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
    ramp: RESUME_STAIRS_RAMP,
  },

  // Stepping platforms and narrow beams
  steppingPlatforms: [
    // Start to Work route
    {
      id: 'step-start-work-1',
      position: [-4.2, 1.8, 1.125] as [number, number, number],
      size: [1.4, 0.3, 1.05] as [number, number, number],
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

  // Canonical balustrades
  balustrades: BALUSTRADE_DEFINITIONS,

  // Canonical architectural obstacles
  architecturalObstacles: ARCHITECTURAL_OBSTACLES,
};

/**
 * Calibrated camera presets:
 * - desktopOverview: Architectural hero perspective framing the entire rooftop diorama
 *   from Start (X=-5.6) through Résumé (X=8.5) and Résumé pergola roof (Y=6.6) without clipping.
 * - mobilePreview: Centered over Start/Work exploration corridor with prominent player scale.
 * - mobilePlay: Third-person chase cam angled behind runner.
 */
/**
 * Two clearly labeled actual-scene architectural camera options at lower oblique angles:
 * - Option A (Courtyard Hero): Lower oblique human-scale courtyard framing Start rooftop,
 *   ascending stairs, glazed terrace facade, and lime wayfinding with dramatic vertical depth.
 * - Option B (Dynamic Vista): Low oblique vista framing Start through Work elevation,
 *   stepping stone flight, and skyline backdrop.
 */

/**
 * Calibrated camera presets:
 * - desktopOverview: Option B: Dynamic Vista - Low oblique architectural hero perspective
 *   framing Start rooftop through elevated Work terrace, stepping platform flight, and skyline backdrop.
 * - mobilePreview: Option B Mobile: Low oblique framing with Start and next landing clearly in frame.
 * - mobilePlay: Third-person chase cam angled behind runner.
 */
export const CAMERA_PRESETS: Record<'desktopOverview' | 'mobilePreview' | 'mobilePlay', CameraPreset> = {
  desktopOverview: {
    position: [-0.6, 8.5, 17.5],
    target: [-1.8, 2.5, 0.8],
    zoom: 1.0,
  },
  mobilePreview: {
    position: [-3.2, 11.0, 18.5],
    target: [-3.5, 2.2, 1.2],
    zoom: 1.0,
  },
  mobilePlay: {
    position: [-3.5, 11.5, 13.5],
    target: [-3.5, 1.7, 3.5],
    zoom: 1.0,
  },
};
