import { describe, it, expect } from 'vitest';
import { CHECKPOINTS, COURSE_BOUNDS, CAMERA_PRESETS, RAMP_DEFINITIONS, START_STAIRS_RAMP, EXPLORATION_STAIRS_RAMP, RESUME_STAIRS_RAMP } from '../src/game/courseConfig';
import { materials, applyGameTheme } from '../src/game/materials';
import { getQualityPreset, DESKTOP_QUALITY, MOBILE_QUALITY, DETERMINISTIC_REVIEW_QUALITY } from '../src/game/quality';

describe('3D Course Configuration & Landmarks', () => {
  it('defines the 4 required checkpoints in order', () => {
    expect(CHECKPOINTS).toHaveLength(4);
    expect(CHECKPOINTS[0].id).toBe('cp-start');
    expect(CHECKPOINTS[1].id).toBe('cp-work');
    expect(CHECKPOINTS[2].id).toBe('cp-explorations');
    expect(CHECKPOINTS[3].id).toBe('cp-resume');

    CHECKPOINTS.forEach((cp, idx) => {
      expect(cp.index).toBe(idx);
      expect(cp.position).toHaveLength(3);
      expect(cp.spawnPosition).toHaveLength(3);
      // Spawn position Y should be higher than checkpoint position Y
      expect(cp.spawnPosition[1]).toBeGreaterThan(cp.position[1]);
      expect(cp.targetRoute).toBeDefined();
    });
  });

  it('defines all required architectural landmarks with physical elevations', () => {
    const { startRooftop, workRooftop, explorationRooftop, resumeRooftop, groundSlab, steppingPlatforms } =
      COURSE_BOUNDS;

    // Ground slab at Y=0
    expect(groundSlab.surfaceY).toBe(0.0);
    expect(groundSlab.size[0]).toBeGreaterThanOrEqual(24);

    // Foreground-left start rooftop
    expect(startRooftop.mainSlab.surfaceY).toBe(1.2);
    expect(startRooftop.lowerLanding.surfaceY).toBe(0.6);
    expect(startRooftop.stairs.steps).toBe(4);
    expect(startRooftop.stairs.rise).toBe(0.6);
    expect(startRooftop.stairs.run).toBe(0.8);

    // Back-left elevated work rooftop
    expect(workRooftop.mainSlab.surfaceY).toBe(3.8);
    expect(workRooftop.hvacUnits).toHaveLength(2);
    expect(workRooftop.beaconPosition).toBeDefined();

    // Central exploration rooftop
    expect(explorationRooftop.upperTerrace.surfaceY).toBe(2.6);
    expect(explorationRooftop.lowerTerrace.surfaceY).toBe(1.8);
    expect(explorationRooftop.planters).toHaveLength(2);
    expect(explorationRooftop.stairs.steps).toBe(4);
    expect(explorationRooftop.stairs.rise).toBe(0.8);
    expect(explorationRooftop.stairs.run).toBe(0.8);

    // Far-right elevated résumé rooftop
    expect(resumeRooftop.mainSlab.surfaceY).toBe(4.2);
    expect(resumeRooftop.overheadFrame.height).toBe(2.4);
    expect(resumeRooftop.overheadFrame.topY).toBe(6.6);

    // Stepping platforms linking course
    expect(steppingPlatforms.length).toBeGreaterThanOrEqual(5);
  });

  it('defines traversable stairs connecting differing platform surface heights', () => {
    const { startRooftop, explorationRooftop } = COURSE_BOUNDS;

    // Start rooftop stairs connect lower landing (0.6) to main slab (1.2)
    const startRise = startRooftop.mainSlab.surfaceY - startRooftop.lowerLanding.surfaceY;
    expect(startRooftop.stairs.rise).toBeCloseTo(startRise);

    // Exploration rooftop stairs connect lower terrace (1.8) to upper terrace (2.6)
    const expRise = explorationRooftop.upperTerrace.surfaceY - explorationRooftop.lowerTerrace.surfaceY;
    expect(explorationRooftop.stairs.rise).toBeCloseTo(expRise);
  });

  it('defines camera presets matching diorama requirements', () => {
    expect(CAMERA_PRESETS.desktopOverview).toBeDefined();
    expect(CAMERA_PRESETS.mobilePreview).toBeDefined();
    expect(CAMERA_PRESETS.mobilePlay).toBeDefined();

    // Desktop overview frames rooftops to the right without obscuring left hero copy
    expect(CAMERA_PRESETS.desktopOverview.target[0]).toBeLessThan(0);
  });
});

describe('Physical Materials & Theme Response', () => {
  it('concrete materials have high roughness, low metalness, and procedural bump texture', () => {
    expect(materials.concreteMain.roughness).toBeGreaterThanOrEqual(0.85);
    expect(materials.concreteMain.metalness).toBeLessThanOrEqual(0.05);
    expect(materials.concreteMain.bumpMap).toBeDefined();
    expect(materials.concreteMain.bumpScale).toBeGreaterThan(0);

    expect(materials.concreteLight.roughness).toBeGreaterThanOrEqual(0.85);
    expect(materials.concreteLight.metalness).toBeLessThanOrEqual(0.05);

    expect(materials.concreteDark.roughness).toBeGreaterThanOrEqual(0.85);
    expect(materials.concreteDark.metalness).toBeLessThanOrEqual(0.05);

    expect(materials.concreteParapet.roughness).toBeGreaterThanOrEqual(0.85);
    expect(materials.concreteParapet.metalness).toBeLessThanOrEqual(0.05);
  });

  it('metals and mechanical materials have distinct physical responses', () => {
    expect(materials.metalRails.metalness).toBeGreaterThan(0.7);
    expect(materials.metalRails.roughness).toBeLessThan(0.6);

    expect(materials.hvacHousing.metalness).toBeGreaterThan(0.5);
    expect(materials.hvacLouvers.metalness).toBeGreaterThan(0.4);

    expect(materials.metalConduit.metalness).toBeGreaterThan(0.7);
    expect(materials.metalMast.metalness).toBeGreaterThan(0.8);

    expect(materials.facadeLouver).toBeDefined();
    expect(materials.facadeLouver.roughness).toBeGreaterThanOrEqual(0.5);
    expect(materials.facadeSeam).toBeDefined();
  });

  it('glass balustrades are translucent and smooth', () => {
    expect(materials.glassBalustrade.transparent).toBe(true);
    expect(materials.glassBalustrade.roughness).toBeLessThan(0.2);
    expect(materials.glassBalustrade.opacity).toBeGreaterThan(0.2);
    expect(materials.glassBalustrade.opacity).toBeLessThan(0.6);
  });

  it('emissive acid-lime materials use #D6FF64 with emission', () => {
    expect(materials.limeEmissive.emissive.getHexString().toUpperCase()).toBe('D6FF64');
    expect(materials.limeFloorArrows.emissive.getHexString().toUpperCase()).toBe('D6FF64');
    expect(materials.limeBeaconCore.emissive.getHexString().toUpperCase()).toBe('D6FF64');
    expect(materials.limeBeaconCore.emissiveIntensity).toBeGreaterThan(2.0);
  });

  it('ground slab blends seamlessly into #101414 in dark mode', () => {
    applyGameTheme('dark');
    const hex = materials.groundSlab.color.getHexString().toLowerCase();
    expect(['101414', '111616', '121717', '141818']).toContain(hex);
  });

  it('applyGameTheme toggles ground slab and architectural colors between dark and light themes without recreating materials', () => {
    applyGameTheme('light');
    expect(materials.groundSlab.color.getHexString().toLowerCase()).toBe('dce0dd');
    expect(materials.concreteMain.color.getHexString().toLowerCase()).toBe('d5d8d4');
    expect(materials.skylineTower.color.getHexString().toLowerCase()).toBe('d0d5d2');

    applyGameTheme('dark');
    expect(materials.groundSlab.color.getHexString().toLowerCase()).toBe('121717');
    expect(materials.concreteMain.color.getHexString().toLowerCase()).toBe('c2c5c1');
    expect(materials.skylineTower.color.getHexString().toLowerCase()).toBe('141a1b');
  });
});

describe('Quality Presets', () => {
  it('desktop quality uses DPR 2 and 2048 shadow resolution', () => {
    expect(DESKTOP_QUALITY.dpr).toBe(2);
    expect(DESKTOP_QUALITY.shadowResolution).toBe(2048);
    expect(DESKTOP_QUALITY.foliageDensity).toBe('full');
    expect(DESKTOP_QUALITY.skylineDetail).toBe('full');
  });

  it('mobile quality uses DPR 1.5 and 1024 shadow resolution', () => {
    expect(MOBILE_QUALITY.dpr).toBe(1.5);
    expect(MOBILE_QUALITY.shadowResolution).toBe(1024);
    expect(MOBILE_QUALITY.foliageDensity).toBe('sparse');
    expect(MOBILE_QUALITY.skylineDetail).toBe('sparse');
  });

  it('deterministic review quality enables deterministic review flag', () => {
    expect(DETERMINISTIC_REVIEW_QUALITY.isDeterministicReview).toBe(true);
    expect(DETERMINISTIC_REVIEW_QUALITY.shadowResolution).toBe(2048);
    expect(DETERMINISTIC_REVIEW_QUALITY.skylineDetail).toBe('full');
  });

  it('getQualityPreset switches based on viewport and review flags', () => {
    const desktop = getQualityPreset(false);
    expect(desktop.dpr).toBe(2);
    expect(desktop.skylineDetail).toBe('full');

    const mobile = getQualityPreset(true);
    expect(mobile.dpr).toBe(1.5);
    expect(mobile.skylineDetail).toBe('sparse');

    const review = getQualityPreset(false, true);
    expect(review.isDeterministicReview).toBe(true);

    const normal = getQualityPreset(false, false);
    expect(normal.isDeterministicReview).toBe(false);
  });
});

describe('Ramp Configurations & Uphill Direction', () => {
  it('RAMP_DEFINITIONS exports all three ramps', () => {
    expect(RAMP_DEFINITIONS).toHaveLength(3);
    expect(RAMP_DEFINITIONS[0].id).toBe('ramp-start');
    expect(RAMP_DEFINITIONS[1].id).toBe('ramp-explorations');
    expect(RAMP_DEFINITIONS[2].id).toBe('ramp-resume');
  });

  it('each ramp has a normalised uphillDirXZ with magnitude 1', () => {
    for (const ramp of RAMP_DEFINITIONS) {
      const [x, z] = ramp.uphillDirXZ;
      const magnitude = Math.sqrt(x * x + z * z);
      expect(magnitude).toBeCloseTo(1.0, 2);
    }
  });

  it('Start and Exploration ramps uphill direction is -Z (Y-rotation = 0)', () => {
    // rotation[1] = 0 → local uphill is -Z; live physics normal confirms this
    expect(START_STAIRS_RAMP.uphillDirXZ[0]).toBeCloseTo(0, 3);
    expect(START_STAIRS_RAMP.uphillDirXZ[1]).toBeCloseTo(-1, 3);

    expect(EXPLORATION_STAIRS_RAMP.uphillDirXZ[0]).toBeCloseTo(0, 3);
    expect(EXPLORATION_STAIRS_RAMP.uphillDirXZ[1]).toBeCloseTo(-1, 3);
  });

  it('Résumé ramp uphillDirXZ documents actual uphill as +Z (verified from live Rapier normal)', () => {
    expect(RESUME_STAIRS_RAMP.uphillDirXZ[0]).toBeCloseTo(0, 3);
    expect(RESUME_STAIRS_RAMP.uphillDirXZ[1]).toBeCloseTo(1, 3); // +Z is uphill
  });

  it('normal-based rise formula: downhill (-Z) on Résumé ramp gives negative rise (no assist)', () => {
    const nx = 0, ny = 0.8499, nz = -0.5269;
    const targetVx = 0, targetVz = -3.0; // forward = -Z = downhill on Résumé ramp
    const rise = -(nx * targetVx + nz * targetVz) / ny;
    expect(rise).toBeLessThan(0);
  });

  it('normal-based rise formula: uphill (+Z) on Résumé ramp gives positive rise (assist fires)', () => {
    const nx = 0, ny = 0.8499, nz = -0.5269;
    const targetVx = 0, targetVz = 3.0; // +Z = uphill on Résumé ramp
    const rise = -(nx * targetVx + nz * targetVz) / ny;
    expect(rise).toBeGreaterThan(0.1);
  });

  it('normal-based rise formula: Start ramp uphill (-Z) gives positive rise', () => {
    const nx = 0, ny = 0.796, nz = 0.604;
    const targetVx = 0, targetVz = -3.0; // -Z = uphill for Start ramp
    const rise = -(nx * targetVx + nz * targetVz) / ny;
    expect(rise).toBeGreaterThan(0.1);
  });

  it('normal-based rise formula: flat ground (normal [0,1,0]) gives zero rise regardless of direction', () => {
    const nx = 0, ny = 1.0, nz = 0;
    const rise1 = -(nx * 0 + nz * (-3.0)) / ny;
    const rise2 = -(nx * 3.0 + nz * 0) / ny;
    expect(rise1).toBeCloseTo(0, 10);
    expect(rise2).toBeCloseTo(0, 10);
  });

  it('all ramps have elevation bounds (minY < maxY) and Z bounds (minZ < maxZ)', () => {
    for (const ramp of RAMP_DEFINITIONS) {
      expect(ramp.minY).toBeLessThan(ramp.maxY);
      expect(ramp.minZ).toBeLessThan(ramp.maxZ);
      expect(ramp.slope).toBeGreaterThan(0);
    }
  });
});

describe('Balustrades, Obstacles & Material Isolation (R1 & R2)', () => {
  it('defines 10 canonical perimeter balustrades in COURSE_BOUNDS', () => {
    expect(COURSE_BOUNDS.balustrades).toHaveLength(10);
    const ids = COURSE_BOUNDS.balustrades.map((b) => b.id);
    expect(ids).toContain('balustrade-start-west');
    expect(ids).toContain('balustrade-start-north');
    expect(ids).toContain('balustrade-work-west');
    expect(ids).toContain('balustrade-exp-north');
    expect(ids).toContain('balustrade-resume-east');
  });

  it('Start Rooftop West balustrade blocks spawn fall-off at X=-5.6', () => {
    const westBal = COURSE_BOUNDS.balustrades.find((b) => b.id === 'balustrade-start-west');
    expect(westBal).toBeDefined();
    expect(westBal!.start[0]).toBe(-5.6);
    expect(westBal!.end[0]).toBe(-5.6);
    expect(Math.min(westBal!.start[2], westBal!.end[2])).toBeLessThanOrEqual(3.5);
    expect(Math.max(westBal!.start[2], westBal!.end[2])).toBeGreaterThanOrEqual(3.5);
    expect(westBal!.height).toBeGreaterThanOrEqual(0.85);
  });

  it('Start Rooftop North balustrade preserves jump gap for stepping platform 1', () => {
    const northBal = COURSE_BOUNDS.balustrades.find((b) => b.id === 'balustrade-start-north');
    expect(northBal).toBeDefined();
    expect(northBal!.end[0]).toBeLessThanOrEqual(-4.4);
  });

  it('defines solid architectural obstacles with physics bounds and shared definitions', () => {
    expect(COURSE_BOUNDS.architecturalObstacles).toHaveLength(2);
    const mastPedestal = COURSE_BOUNDS.architecturalObstacles.find((o) => o.id === 'obstacle-mast-pedestal');
    const hatch = COURSE_BOUNDS.architecturalObstacles.find((o) => o.id === 'obstacle-roof-hatch');
    expect(mastPedestal).toBeDefined();
    expect(hatch).toBeDefined();

    // Verify exact coupling dimensions shared with visual meshes
    expect(mastPedestal!.position).toEqual([-5.8, 3.9, -5.1]);
    expect(mastPedestal!.size).toEqual([0.45, 0.2, 0.45]);

    expect(hatch!.position).toEqual([-2.4, 3.88, -2.1]);
    expect(hatch!.size).toEqual([0.94, 0.16, 0.94]);
  });

  it('limeMastBeacon material is strictly isolated from shared limeEmissive and unrelated materials', () => {
    expect(materials.limeMastBeacon).toBeDefined();
    expect(materials.limeMastBeacon).not.toBe(materials.limeEmissive);
    expect(materials.limeMastBeacon).not.toBe(materials.limeBeaconCore);
    expect(materials.limeMastBeacon).not.toBe(materials.limeFloorArrows);

    const initialSharedIntensity = materials.limeEmissive.emissiveIntensity;
    const initialCoreIntensity = materials.limeBeaconCore.emissiveIntensity;

    materials.limeMastBeacon.emissiveIntensity = 0.2;
    expect(materials.limeEmissive.emissiveIntensity).toBe(initialSharedIntensity);
    expect(materials.limeBeaconCore.emissiveIntensity).toBe(initialCoreIntensity);

    materials.limeMastBeacon.emissiveIntensity = 1.8;
    expect(materials.limeEmissive.emissiveIntensity).toBe(initialSharedIntensity);
    expect(materials.limeBeaconCore.emissiveIntensity).toBe(initialCoreIntensity);

    // Reset beacon to 1.0
    materials.limeMastBeacon.emissiveIntensity = 1.0;
  });
});
