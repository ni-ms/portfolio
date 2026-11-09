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
      // Multi-frequency noise for subtle architectural concrete grit
      const n1 = Math.random() * 24;
      const n2 = Math.sin((i / 4) * 0.05) * 8;
      const val = Math.floor(128 + n1 + n2);
      data[i] = val; // R
      data[i + 1] = val; // G
      data[i + 2] = val; // B
      data[i + 3] = 255; // A
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
 * Creates a subtle architectural paver seam texture for rooftop walking surfaces.
 */
function createPaverTileTexture(): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;

  try {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 128, 128);

    // Subtle dark expansion joint seams
    ctx.strokeStyle = '#606060';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, 126, 126);

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

    // Draw vertical window grid bands
    ctx.fillStyle = '#1E2829';
    const cols = 6;
    const rows = 24;
    const colW = 128 / cols;
    const rowH = 256 / rows;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Subtle lit windows pattern (faint amber/lime/cyan lit rooms)
        const lit = (r * 7 + c * 13) % 9 === 0;
        if (lit) {
          ctx.fillStyle = (r + c) % 2 === 0 ? 'rgba(214, 255, 100, 0.45)' : 'rgba(180, 220, 240, 0.35)';
        } else {
          ctx.fillStyle = 'rgba(24, 32, 34, 0.8)';
        }
        ctx.fillRect(c * colW + 4, r * rowH + 3, colW - 8, rowH - 6);
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
const paverTileMap = createPaverTileTexture();
const skylineWindowMap = createSkylineWindowTexture();

// 1. Concrete Materials
const concreteMainMat = new THREE.MeshStandardMaterial({
  color: '#C2C5C1',
  roughness: 0.90,
  metalness: 0.02,
});
if (concreteNoise) concreteMainMat.roughnessMap = concreteNoise;

const concreteLightMat = new THREE.MeshStandardMaterial({
  color: '#D5D8D4',
  roughness: 0.88,
  metalness: 0.02,
});
if (concreteNoise) concreteLightMat.roughnessMap = concreteNoise;

const concreteDarkMat = new THREE.MeshStandardMaterial({
  color: '#9E9E9B',
  roughness: 0.92,
  metalness: 0.03,
});
if (concreteNoise) concreteDarkMat.roughnessMap = concreteNoise;

const concretePillarMat = new THREE.MeshStandardMaterial({
  color: '#B0B4B0',
  roughness: 0.91,
  metalness: 0.02,
});
if (concreteNoise) concretePillarMat.roughnessMap = concreteNoise;

const concreteTrimMat = new THREE.MeshStandardMaterial({
  color: '#A8ABA7',
  roughness: 0.86,
  metalness: 0.03,
});

const concreteParapetMat = new THREE.MeshStandardMaterial({
  color: '#7D827F',
  roughness: 0.88,
  metalness: 0.02,
});

const concretePaverMat = new THREE.MeshStandardMaterial({
  color: '#B2B5B1',
  roughness: 0.86,
  metalness: 0.02,
});
if (paverTileMap) concretePaverMat.roughnessMap = paverTileMap;

// 2. Glass & Balustrades
const glassBalustradeMat = new THREE.MeshStandardMaterial({
  color: '#223338',
  roughness: 0.12,
  metalness: 0.15,
  transparent: true,
  opacity: 0.38,
  side: THREE.DoubleSide,
  depthWrite: false,
});

// 3. Metals & Mechanical Equipment
const metalRailsMat = new THREE.MeshStandardMaterial({
  color: '#262E30',
  roughness: 0.42,
  metalness: 0.85,
});

const metalFrameMat = new THREE.MeshStandardMaterial({
  color: '#343E40',
  roughness: 0.48,
  metalness: 0.78,
});

const hvacHousingMat = new THREE.MeshStandardMaterial({
  color: '#434D50',
  roughness: 0.52,
  metalness: 0.65,
});

const hvacLouversMat = new THREE.MeshStandardMaterial({
  color: '#1A1F21',
  roughness: 0.72,
  metalness: 0.50,
});

const hvacFanMat = new THREE.MeshStandardMaterial({
  color: '#151819',
  roughness: 0.58,
  metalness: 0.82,
});

const metalConduitMat = new THREE.MeshStandardMaterial({
  color: '#384345',
  roughness: 0.40,
  metalness: 0.85,
});

const metalHatchMat = new THREE.MeshStandardMaterial({
  color: '#2D3538',
  roughness: 0.46,
  metalness: 0.75,
});

const metalMastMat = new THREE.MeshStandardMaterial({
  color: '#2B3335',
  roughness: 0.40,
  metalness: 0.88,
});

// 4. Acid-Lime (#D6FF64) Emissive Materials
const limeEmissiveMat = new THREE.MeshStandardMaterial({
  color: '#D6FF64',
  emissive: '#D6FF64',
  emissiveIntensity: 1.8,
  roughness: 0.20,
  metalness: 0.05,
});

const limeFloorArrowsMat = new THREE.MeshStandardMaterial({
  color: '#D6FF64',
  emissive: '#D6FF64',
  emissiveIntensity: 1.4,
  roughness: 0.30,
  metalness: 0.05,
  polygonOffset: true,
  polygonOffsetFactor: -2,
  polygonOffsetUnits: -2,
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
  opacity: 0.65,
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

// 7. Distant Futuristic Skyline
const skylineTowerMat = new THREE.MeshStandardMaterial({
  color: '#141A1B',
  roughness: 0.95,
  metalness: 0.10,
});

const skylineTowerGlassMat = new THREE.MeshStandardMaterial({
  color: '#1C2527',
  roughness: 0.25,
  metalness: 0.65,
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

  // Acid-Lime (#D6FF64) Emissives
  limeEmissive: limeEmissiveMat,
  limeFloorArrows: limeFloorArrowsMat,
  limeBeaconCore: limeBeaconCoreMat,
  limeBeaconRing: limeBeaconRingMat,
  limeBeaconAura: limeBeaconAuraMat,

  // Ground Slab & Shadow Reveals
  groundSlab: groundSlabMat,
  groundGridLine: groundGridLineMat,
  underSlabShadow: underSlabShadowMat,

  // Planter & Foliage
  planterSoil: planterSoilMat,
  foliageMain: foliageMainMat,
  foliageLight: foliageLightMat,
  foliageAccent: foliageAccentMat,

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
    materials.underSlabShadow.opacity = 0.35;

    // Concrete architecture
    materials.concreteMain.color.set('#D5D8D4');
    materials.concreteLight.color.set('#E2E5E1');
    materials.concreteDark.color.set('#B8BCB7');
    materials.concretePillar.color.set('#C4C8C3');
    materials.concreteTrim.color.set('#B4B8B3');
    materials.concreteParapet.color.set('#CCD0CB');
    materials.concretePaver.color.set('#DCE0DC');

    // Metals
    materials.metalRails.color.set('#586466');
    materials.metalFrame.color.set('#505A5D');
    materials.hvacHousing.color.set('#687476');
    materials.hvacLouvers.color.set('#3E484A');
    materials.hvacFan.color.set('#30383A');
    materials.metalConduit.color.set('#6A7678');
    materials.metalHatch.color.set('#4E585B');
    materials.metalMast.color.set('#4A5659');

    // Glass balustrades
    materials.glassBalustrade.color.set('#9AB8C0');
    materials.glassBalustrade.opacity = 0.32;

    // Foliage
    materials.foliageMain.color.set('#3D5438');
    materials.foliageLight.color.set('#526F4C');
    materials.foliageAccent.color.set('#6C8A65');

    // Distant skyline
    materials.skylineTower.color.set('#D0D5D2');
    materials.skylineTowerGlass.color.set('#B8C2BF');
  } else {
    // Ground & base
    materials.groundSlab.color.set('#121717');
    materials.groundGridLine.color.set('#1A2222');
    materials.underSlabShadow.color.set('#080B0B');
    materials.underSlabShadow.opacity = 0.65;

    // Concrete architecture
    materials.concreteMain.color.set('#C2C5C1');
    materials.concreteLight.color.set('#D5D8D4');
    materials.concreteDark.color.set('#9E9E9B');
    materials.concretePillar.color.set('#B0B4B0');
    materials.concreteTrim.color.set('#A8ABA7');
    materials.concreteParapet.color.set('#7D827F');
    materials.concretePaver.color.set('#B2B5B1');

    // Metals
    materials.metalRails.color.set('#262E30');
    materials.metalFrame.color.set('#343E40');
    materials.hvacHousing.color.set('#434D50');
    materials.hvacLouvers.color.set('#1A1F21');
    materials.hvacFan.color.set('#151819');
    materials.metalConduit.color.set('#384345');
    materials.metalHatch.color.set('#2D3538');
    materials.metalMast.color.set('#2B3335');

    // Glass balustrades
    materials.glassBalustrade.color.set('#223338');
    materials.glassBalustrade.opacity = 0.38;

    // Foliage
    materials.foliageMain.color.set('#2B3B28');
    materials.foliageLight.color.set('#3E543A');
    materials.foliageAccent.color.set('#526E4D');

    // Distant skyline
    materials.skylineTower.color.set('#141A1B');
    materials.skylineTowerGlass.color.set('#1C2527');
  }
}
