import * as THREE from 'three';

/**
 * Creates a subtle procedural micro-noise texture for realistic concrete roughness.
 * Returns null if executed outside browser (SSR/Node testing).
 */
function createConcreteNoiseTexture(): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;

  try {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const imgData = ctx.createImageData(256, 256);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
      const n1 = Math.random() * 26;
      const n2 = Math.sin((i / 4) * 0.05) * 6;
      const val = Math.floor(126 + n1 + n2);
      data[i] = val;
      data[i + 1] = val;
      data[i + 2] = val;
      data[i + 3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    return texture;
  } catch {
    return null;
  }
}

/**
 * Creates a procedural height/bump texture for tactile concrete surface pores and grain.
 * Calibrated with visible pore contrast at hero camera distance.
 */
function createConcreteBumpTexture(): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;

  try {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const imgData = ctx.createImageData(256, 256);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
      const px = (i / 4) % 256;
      const py = Math.floor((i / 4) / 256);
      // Multi-scale aggregate and pore noise
      const n1 = (Math.sin(px * 0.35) * Math.cos(py * 0.35)) * 35;
      const n2 = (Math.sin(px * 0.8) + Math.cos(py * 0.8)) * 18;
      const n3 = (Math.random() - 0.5) * 40;
      const val = Math.max(0, Math.min(255, Math.floor(128 + n1 + n2 + n3)));
      data[i] = val;
      data[i + 1] = val;
      data[i + 2] = val;
      data[i + 3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    return texture;
  } catch {
    return null;
  }
}

/**
 * Creates an architectural precast concrete diffuse map with subtle tone variations and formwork grain.
 */
function createConcreteDiffuseTexture(): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;

  try {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = '#C8CAC7';
    ctx.fillRect(0, 0, 256, 256);

    const imgData = ctx.getImageData(0, 0, 256, 256);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
      const px = (i / 4) % 256;
      const py = Math.floor((i / 4) / 256);
      const grain = (Math.random() - 0.5) * 16;
      const broadWave = Math.sin(px * 0.04) * Math.cos(py * 0.04) * 8;
      data[i] = Math.max(0, Math.min(255, data[i] + grain + broadWave));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + grain + broadWave));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + grain + broadWave));
    }
    ctx.putImageData(imgData, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    return texture;
  } catch {
    return null;
  }
}

/**
 * Creates a distinct architectural paver tile texture with visible mortar joints,
 * beveled paver edges, subtle stone speckling, and varied tile tones.
 */
function createPaverTileTexture(): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;

  try {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Paver block field
    ctx.fillStyle = '#C0C4BF';
    ctx.fillRect(0, 0, 256, 256);

    // Subtle stone aggregate noise
    const imgData = ctx.getImageData(0, 0, 256, 256);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const grain = (Math.random() - 0.5) * 16;
      data[i] = Math.max(0, Math.min(255, data[i] + grain));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + grain));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + grain));
    }
    ctx.putImageData(imgData, 0, 0);

    // Modular 4x4 paver tile grid with varied tones and dark recessed joints
    const tiles = 4;
    const tileSize = 256 / tiles;
    for (let r = 0; r < tiles; r++) {
      for (let c = 0; c < tiles; c++) {
        // Subtle tonal shift per tile
        const toneShift = ((r * 3 + c * 5) % 7 - 3) * 3;
        ctx.fillStyle = toneShift < 0 ? 'rgba(0, 0, 0, 0.04)' : (toneShift > 0 ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0,0,0,0)');
        ctx.fillRect(c * tileSize + 2, r * tileSize + 2, tileSize - 4, tileSize - 4);
      }
    }

    // Dark architectural expansion joint grid
    ctx.strokeStyle = '#484F4C';
    ctx.lineWidth = 3;
    for (let i = 0; i <= tiles; i++) {
      const p = Math.min(254, Math.max(1, i * tileSize));
      ctx.beginPath();
      ctx.moveTo(p, 0);
      ctx.lineTo(p, 256);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, p);
      ctx.lineTo(256, p);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(3, 3);
    return texture;
  } catch {
    return null;
  }
}

/**
 * Creates a subtle brushed metal roughness map for realistic metallic sheen on HVAC and railings.
 */
function createBrushedMetalTexture(): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;

  try {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 128, 128);

    const imgData = ctx.getImageData(0, 0, 128, 128);
    const data = imgData.data;

    // Linear horizontal micro-streaks
    for (let y = 0; y < 128; y++) {
      const streakVal = (Math.random() - 0.5) * 45;
      for (let x = 0; x < 128; x++) {
        const idx = (y * 128 + x) * 4;
        const microNoise = (Math.random() - 0.5) * 15;
        const val = Math.max(0, Math.min(255, Math.floor(128 + streakVal + microNoise)));
        data[idx] = val;
        data[idx + 1] = val;
        data[idx + 2] = val;
      }
    }
    ctx.putImageData(imgData, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 4);
    return texture;
  } catch {
    return null;
  }
}

/**
 * Creates a procedural distant skyscraper window texture for skyline depth.
 */
function createSkylineWindowTexture(): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;

  try {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = '#080A0A';
    ctx.fillRect(0, 0, 128, 256);

    // Draw vertical window grid bands with varied floor bands
    const cols = 6;
    const rows = 28;
    const colW = 128 / cols;
    const rowH = 256 / rows;

    for (let r = 0; r < rows; r++) {
      // Mechanical service floor every 9 floors
      if (r % 9 === 0) {
        ctx.fillStyle = '#060808';
        ctx.fillRect(0, r * rowH, 128, rowH);
        ctx.fillStyle = '#182022';
        for (let l = 0; l < 4; l++) {
          ctx.fillRect(4, r * rowH + l * (rowH / 4) + 1, 120, 1);
        }
        continue;
      }

      for (let c = 0; c < cols; c++) {
        const lit = (r * 7 + c * 13) % 7 === 0;
        const accent = (r * 11 + c * 3) % 23 === 0;
        if (accent) {
          ctx.fillStyle = 'rgba(214, 255, 100, 0.65)'; // Acid lime office interior
        } else if (lit) {
          ctx.fillStyle = (r + c) % 2 === 0 ? 'rgba(220, 240, 255, 0.45)' : 'rgba(255, 235, 190, 0.40)';
        } else {
          ctx.fillStyle = 'rgba(18, 24, 26, 0.85)';
        }
        ctx.fillRect(c * colW + 3, r * rowH + 2, colW - 6, rowH - 4);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 2);
    return texture;
  } catch {
    return null;
  }
}

const concreteNoise = createConcreteNoiseTexture();
const concreteBump = createConcreteBumpTexture();
const concreteDiffuse = createConcreteDiffuseTexture();
const paverTileMap = createPaverTileTexture();
const brushedMetalMap = createBrushedMetalTexture();
const skylineWindowMap = createSkylineWindowTexture();

// 1. Concrete Materials
const concreteMainMat = new THREE.MeshStandardMaterial({
  color: '#C2C5C1',
  roughness: 0.86,
  metalness: 0.04,
});
if (concreteNoise) concreteMainMat.roughnessMap = concreteNoise;
if (concreteBump) {
  concreteMainMat.bumpMap = concreteBump;
  concreteMainMat.bumpScale = 0.022;
}
if (concreteDiffuse) concreteMainMat.map = concreteDiffuse;

const concreteLightMat = new THREE.MeshStandardMaterial({
  color: '#D8DCD7',
  roughness: 0.86,
  metalness: 0.04,
});
if (concreteNoise) concreteLightMat.roughnessMap = concreteNoise;
if (concreteBump) {
  concreteLightMat.bumpMap = concreteBump;
  concreteLightMat.bumpScale = 0.020;
}
if (concreteDiffuse) concreteLightMat.map = concreteDiffuse;

const concreteDarkMat = new THREE.MeshStandardMaterial({
  color: '#A4A8A2',
  roughness: 0.88,
  metalness: 0.05,
});
if (concreteNoise) concreteDarkMat.roughnessMap = concreteNoise;
if (concreteBump) {
  concreteDarkMat.bumpMap = concreteBump;
  concreteDarkMat.bumpScale = 0.024;
}

const concretePillarMat = new THREE.MeshStandardMaterial({
  color: '#B6BAB5',
  roughness: 0.88,
  metalness: 0.04,
});
if (concreteNoise) concretePillarMat.roughnessMap = concreteNoise;

const concreteTrimMat = new THREE.MeshStandardMaterial({
  color: '#AFB3AE',
  roughness: 0.78,
  metalness: 0.06,
});
if (concreteNoise) concreteTrimMat.roughnessMap = concreteNoise;

const concreteParapetMat = new THREE.MeshStandardMaterial({
  color: '#848986',
  roughness: 0.86,
  metalness: 0.04,
});
if (concreteBump) {
  concreteParapetMat.bumpMap = concreteBump;
  concreteParapetMat.bumpScale = 0.018;
}

const concretePaverMat = new THREE.MeshStandardMaterial({
  color: '#B8BCB7',
  roughness: 0.80,
  metalness: 0.04,
});
if (paverTileMap) {
  concretePaverMat.map = paverTileMap;
  concretePaverMat.roughnessMap = paverTileMap;
}
if (concreteBump) {
  concretePaverMat.bumpMap = concreteBump;
  concretePaverMat.bumpScale = 0.022;
}

// 2. Glass & Balustrades
const glassBalustradeMat = new THREE.MeshStandardMaterial({
  color: '#3A525C',
  roughness: 0.06,
  metalness: 0.20,
  transparent: true,
  opacity: 0.44,
  side: THREE.DoubleSide,
  depthWrite: false,
});

// 3. Metals & Mechanical Equipment (Illuminated neutral tones preventing pitch-black shadows)
const metalRailsMat = new THREE.MeshStandardMaterial({
  color: '#46565A',
  roughness: 0.32,
  metalness: 0.86,
});
if (brushedMetalMap) metalRailsMat.roughnessMap = brushedMetalMap;

const metalFrameMat = new THREE.MeshStandardMaterial({
  color: '#4E5F64',
  roughness: 0.36,
  metalness: 0.82,
});
if (brushedMetalMap) metalFrameMat.roughnessMap = brushedMetalMap;

const hvacHousingMat = new THREE.MeshStandardMaterial({
  color: '#68787C',
  roughness: 0.38,
  metalness: 0.65,
});
if (brushedMetalMap) hvacHousingMat.roughnessMap = brushedMetalMap;

const hvacLouversMat = new THREE.MeshStandardMaterial({
  color: '#3A484C',
  roughness: 0.48,
  metalness: 0.52,
});

const hvacFanMat = new THREE.MeshStandardMaterial({
  color: '#2C383C',
  roughness: 0.46,
  metalness: 0.82,
});

const metalConduitMat = new THREE.MeshStandardMaterial({
  color: '#5E7075',
  roughness: 0.32,
  metalness: 0.86,
});

const metalHatchMat = new THREE.MeshStandardMaterial({
  color: '#546468',
  roughness: 0.38,
  metalness: 0.74,
});

const metalMastMat = new THREE.MeshStandardMaterial({
  color: '#4A5B60',
  roughness: 0.32,
  metalness: 0.88,
});

// Hardware & Bolt detail material
const metalBoltMat = new THREE.MeshStandardMaterial({
  color: '#7A8C92',
  roughness: 0.25,
  metalness: 0.90,
});

// Architectural Facade Details (Panel seams, service louvers)
const facadeLouverMat = new THREE.MeshStandardMaterial({
  color: '#364448',
  roughness: 0.50,
  metalness: 0.58,
});

const facadeSeamMat = new THREE.MeshBasicMaterial({
  color: '#222B2E',
});

// 4. Acid-Lime (#D6FF64) Emissive Materials
const limeEmissiveMat = new THREE.MeshStandardMaterial({
  color: '#D6FF64',
  emissive: '#D6FF64',
  emissiveIntensity: 1.8,
  roughness: 0.20,
  metalness: 0.05,
});

/**
 * Isolated material for Communications Mast obstruction beacon.
 * Animating this material does NOT bleed into shared limeEmissive meshes (HVAC LEDs, pavilion).
 */
const limeMastBeaconMat = new THREE.MeshStandardMaterial({
  color: '#D6FF64',
  emissive: '#D6FF64',
  emissiveIntensity: 1.0,
  roughness: 0.20,
  metalness: 0.05,
});

const limeFloorArrowsMat = new THREE.MeshStandardMaterial({
  color: '#D6FF64',
  emissive: '#D6FF64',
  emissiveIntensity: 0.85,
  roughness: 0.35,
  metalness: 0.0,
  polygonOffset: true,
  polygonOffsetFactor: -2,
  polygonOffsetUnits: -2,
});

const wayfindingCharcoalMat = new THREE.MeshBasicMaterial({
  color: '#141A1C',
  polygonOffset: true,
  polygonOffsetFactor: -1,
  polygonOffsetUnits: -1,
});

const limeBeaconCoreMat = new THREE.MeshStandardMaterial({
  color: '#F0FFA5',
  emissive: '#D6FF64',
  emissiveIntensity: 2.6,
  roughness: 0.15,
  metalness: 0.0,
});

const limeBeaconRingMat = new THREE.MeshStandardMaterial({
  color: '#D6FF64',
  emissive: '#D6FF64',
  emissiveIntensity: 2.0,
  roughness: 0.25,
  metalness: 0.1,
});

const limeBeaconAuraMat = new THREE.MeshStandardMaterial({
  color: '#D6FF64',
  emissive: '#D6FF64',
  emissiveIntensity: 1.0,
  transparent: true,
  opacity: 0.22,
  roughness: 0.5,
  side: THREE.DoubleSide,
  depthWrite: false,
});

// Warm architectural fixture light material
const warmFixtureMat = new THREE.MeshStandardMaterial({
  color: '#FFE8C2',
  emissive: '#FFE8C2',
  emissiveIntensity: 2.0,
  roughness: 0.20,
  metalness: 0.1,
});

// 5. Ground Slab & Base Diorama
const groundSlabMat = new THREE.MeshStandardMaterial({
  color: '#121717',
  roughness: 0.96,
  metalness: 0.02,
});

const groundGridLineMat = new THREE.MeshBasicMaterial({
  color: '#1A2222',
});

const underSlabShadowMat = new THREE.MeshBasicMaterial({
  color: '#080B0B',
  transparent: true,
  opacity: 0.48,
});

// 6. Planter & Landscaping Foliage
const planterSoilMat = new THREE.MeshStandardMaterial({
  color: '#1A1817',
  roughness: 0.96,
  metalness: 0.0,
});

const foliageMainMat = new THREE.MeshStandardMaterial({
  color: '#2B3B28',
  roughness: 0.84,
  metalness: 0.0,
});

const foliageLightMat = new THREE.MeshStandardMaterial({
  color: '#3E543A',
  roughness: 0.82,
  metalness: 0.0,
});

const foliageAccentMat = new THREE.MeshStandardMaterial({
  color: '#526E4D',
  roughness: 0.80,
  metalness: 0.0,
});

// Dark botanical stem material
const foliageStemMat = new THREE.MeshStandardMaterial({
  color: '#1E281C',
  roughness: 0.90,
  metalness: 0.0,
});

// 7. Distant Futuristic Skyline
const skylineTowerMat = new THREE.MeshStandardMaterial({
  color: '#141A1B',
  roughness: 0.92,
  metalness: 0.15,
});

const skylineTowerGlassMat = new THREE.MeshStandardMaterial({
  color: '#1D272A',
  roughness: 0.22,
  metalness: 0.68,
});
if (skylineWindowMap) {
  skylineTowerGlassMat.map = skylineWindowMap;
}

const skylineWindowsMat = new THREE.MeshStandardMaterial({
  color: '#D6FF64',
  emissive: '#D6FF64',
  emissiveIntensity: 0.6,
  roughness: 0.3,
});

/**
 * Shared PBR material collection for the Parkour diorama.
 */
export const materials = {
  // Concrete Variations
  concreteMain: concreteMainMat,
  concreteLight: concreteLightMat,
  concreteDark: concreteDarkMat,
  concretePillar: concretePillarMat,
  concreteTrim: concreteTrimMat,
  concreteParapet: concreteParapetMat,
  concretePaver: concretePaverMat,

  // Glass & Balustrades
  glassBalustrade: glassBalustradeMat,

  // Metals & MEP Equipment
  metalRails: metalRailsMat,
  metalFrame: metalFrameMat,
  hvacHousing: hvacHousingMat,
  hvacLouvers: hvacLouversMat,
  hvacFan: hvacFanMat,
  metalConduit: metalConduitMat,
  metalHatch: metalHatchMat,
  metalMast: metalMastMat,
  metalBolt: metalBoltMat,

  // Facade Details
  facadeLouver: facadeLouverMat,
  facadeSeam: facadeSeamMat,

  // Acid-Lime (#D6FF64) Emissives
  limeEmissive: limeEmissiveMat,
  limeMastBeacon: limeMastBeaconMat,
  limeFloorArrows: limeFloorArrowsMat,
  wayfindingCharcoal: wayfindingCharcoalMat,
  limeBeaconCore: limeBeaconCoreMat,
  limeBeaconRing: limeBeaconRingMat,
  limeBeaconAura: limeBeaconAuraMat,

  // Warm Architectural Fixtures
  warmFixture: warmFixtureMat,

  // Ground Slab & Shadow Reveals
  groundSlab: groundSlabMat,
  groundGridLine: groundGridLineMat,
  underSlabShadow: underSlabShadowMat,

  // Planter & Foliage
  planterSoil: planterSoilMat,
  foliageMain: foliageMainMat,
  foliageLight: foliageLightMat,
  foliageAccent: foliageAccentMat,
  foliageStem: foliageStemMat,

  // Distant Futuristic Skyline
  skylineTower: skylineTowerMat,
  skylineTowerGlass: skylineTowerGlassMat,
  skylineWindows: skylineWindowsMat,
};

/**
 * Updates theme-dependent scene materials without recreating Three.js objects or interrupting physics.
 */
export function applyGameTheme(theme: 'dark' | 'light'): void {
  if (theme === 'light') {
    // Ground & base
    materials.groundSlab.color.set('#DCE0DD');
    materials.groundGridLine.color.set('#C8CCC8');
    materials.underSlabShadow.color.set('#A4AAA5');
    materials.underSlabShadow.opacity = 0.28;

    // Concrete architecture
    materials.concreteMain.color.set('#D5D8D4');
    materials.concreteLight.color.set('#E4E8E3');
    materials.concreteDark.color.set('#BDC2BD');
    materials.concretePillar.color.set('#C8CCC7');
    materials.concreteTrim.color.set('#B8BCB7');
    materials.concreteParapet.color.set('#D0D4CF');
    materials.concretePaver.color.set('#DFE2DE');

    // Metals
    materials.metalRails.color.set('#627276');
    materials.metalFrame.color.set('#5A6A6E');
    materials.hvacHousing.color.set('#7E8E92');
    materials.hvacLouvers.color.set('#505E62');
    materials.hvacFan.color.set('#3E4C50');
    materials.metalConduit.color.set('#76878B');
    materials.metalHatch.color.set('#6B7C80');
    materials.metalMast.color.set('#647478');
    materials.metalBolt.color.set('#9AA8AC');

    // Facade details
    materials.facadeLouver.color.set('#607074');
    materials.facadeSeam.color.set('#B4B9B3');

    // Glass balustrades
    materials.glassBalustrade.color.set('#A2C0C8');
    materials.glassBalustrade.opacity = 0.38;

    // Mast beacon & Wayfinding
    materials.limeMastBeacon.color.set('#D6FF64');
    materials.limeMastBeacon.emissive.set('#D6FF64');
    materials.limeFloorArrows.emissive.set('#D6FF64');
    materials.limeFloorArrows.emissiveIntensity = 0.75;
    materials.wayfindingCharcoal.color.set('#1E2628');

    // Foliage
    materials.foliageMain.color.set('#3D5438');
    materials.foliageLight.color.set('#526F4C');
    materials.foliageAccent.color.set('#6C8A65');
    materials.foliageStem.color.set('#2E3E2A');

    // Distant skyline
    materials.skylineTower.color.set('#D0D5D2');
    materials.skylineTowerGlass.color.set('#B8C2BF');
  } else {
    // Ground & base
    materials.groundSlab.color.set('#121717');
    materials.groundGridLine.color.set('#1A2222');
    materials.underSlabShadow.color.set('#080B0B');
    materials.underSlabShadow.opacity = 0.48;

    // Concrete architecture
    materials.concreteMain.color.set('#C2C5C1');
    materials.concreteLight.color.set('#D8DCD7');
    materials.concreteDark.color.set('#A4A8A2');
    materials.concretePillar.color.set('#B6BAB5');
    materials.concreteTrim.color.set('#AFB3AE');
    materials.concreteParapet.color.set('#848986');
    materials.concretePaver.color.set('#B8BCB7');

    // Metals
    materials.metalRails.color.set('#46565A');
    materials.metalFrame.color.set('#4E5F64');
    materials.hvacHousing.color.set('#68787C');
    materials.hvacLouvers.color.set('#3A484C');
    materials.hvacFan.color.set('#2C383C');
    materials.metalConduit.color.set('#5E7075');
    materials.metalHatch.color.set('#546468');
    materials.metalMast.color.set('#4A5B60');
    materials.metalBolt.color.set('#7A8C92');

    // Facade details
    materials.facadeLouver.color.set('#364448');
    materials.facadeSeam.color.set('#222B2E');

    // Glass balustrades
    materials.glassBalustrade.color.set('#3A525C');
    materials.glassBalustrade.opacity = 0.44;

    // Mast beacon & Wayfinding
    materials.limeMastBeacon.color.set('#D6FF64');
    materials.limeMastBeacon.emissive.set('#D6FF64');
    materials.limeFloorArrows.emissive.set('#D6FF64');
    materials.limeFloorArrows.emissiveIntensity = 0.85;
    materials.wayfindingCharcoal.color.set('#101618');

    // Foliage
    materials.foliageMain.color.set('#2B3B28');
    materials.foliageLight.color.set('#3E543A');
    materials.foliageAccent.color.set('#526E4D');
    materials.foliageStem.color.set('#1E281C');

    // Distant skyline
    materials.skylineTower.color.set('#141A1B');
    materials.skylineTowerGlass.color.set('#1D272A');
  }
}
