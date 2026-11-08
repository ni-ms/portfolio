import { describe, it, expect } from 'vitest';
import { CHECKPOINTS, COURSE_BOUNDS, CAMERA_PRESETS } from '../src/game/courseConfig';
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
  it('concrete materials have high roughness and low metalness', () => {
    expect(materials.concreteMain.roughness).toBeGreaterThanOrEqual(0.85);
    expect(materials.concreteMain.metalness).toBeLessThanOrEqual(0.05);

    expect(materials.concreteLight.roughness).toBeGreaterThanOrEqual(0.85);
    expect(materials.concreteLight.metalness).toBeLessThanOrEqual(0.05);

    expect(materials.concreteDark.roughness).toBeGreaterThanOrEqual(0.85);
    expect(materials.concreteDark.metalness).toBeLessThanOrEqual(0.05);
  });

  it('metals and mechanical materials have distinct physical responses', () => {
    expect(materials.metalRails.metalness).toBeGreaterThan(0.7);
    expect(materials.metalRails.roughness).toBeLessThan(0.6);

    expect(materials.hvacHousing.metalness).toBeGreaterThan(0.5);
    expect(materials.hvacLouvers.metalness).toBeGreaterThan(0.4);
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

  it('applyGameTheme toggles ground slab color between dark and light themes without recreating materials', () => {
    applyGameTheme('light');
    expect(materials.groundSlab.color.getHexString().toLowerCase()).toBe('dce0dd');

    applyGameTheme('dark');
    expect(materials.groundSlab.color.getHexString().toLowerCase()).toBe('121717');
  });
});

describe('Quality Presets', () => {
  it('desktop quality uses DPR 2 and 2048 shadow resolution', () => {
    expect(DESKTOP_QUALITY.dpr).toBe(2);
    expect(DESKTOP_QUALITY.shadowResolution).toBe(2048);
    expect(DESKTOP_QUALITY.foliageDensity).toBe('full');
  });

  it('mobile quality uses DPR 1.5 and 1024 shadow resolution', () => {
    expect(MOBILE_QUALITY.dpr).toBe(1.5);
    expect(MOBILE_QUALITY.shadowResolution).toBe(1024);
    expect(MOBILE_QUALITY.foliageDensity).toBe('sparse');
  });

  it('deterministic review quality enables deterministic review flag', () => {
    expect(DETERMINISTIC_REVIEW_QUALITY.isDeterministicReview).toBe(true);
    expect(DETERMINISTIC_REVIEW_QUALITY.shadowResolution).toBe(2048);
  });

  it('getQualityPreset switches based on viewport and review flags', () => {
    const desktop = getQualityPreset(false);
    expect(desktop.dpr).toBe(2);

    const mobile = getQualityPreset(true);
    expect(mobile.dpr).toBe(1.5);

    const review = getQualityPreset(false, true);
    expect(review.isDeterministicReview).toBe(true);
  });
});
