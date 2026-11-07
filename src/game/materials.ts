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
      // Multi-frequency noise for subtle grit
      const n1 = Math.random() * 25;
      const n2 = Math.sin((i / 4) * 0.05) * 10;
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

const concreteNoise = createConcreteNoiseTexture();

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

/**
 * Shared PBR material collection for the Parkour diorama.
 * Conforms to the visual specification:
 * - High-roughness concrete with subtle albedo shifts
 * - Low metalness on architecture, high on railings and HVAC
 * - Acid-lime #D6FF64 emissive accents
 * - Dark ground slab blending into #101414
 */
export const materials = {
  // 1. Concrete Variations
  concreteMain: concreteMainMat,
  concreteLight: concreteLightMat,
  concreteDark: concreteDarkMat,
  concretePillar: concretePillarMat,

  concreteTrim: new THREE.MeshStandardMaterial({
    color: '#A8ABA7',
    roughness: 0.86,
    metalness: 0.03,
  }),

  // 2. Metals & Equipment
  metalRails: new THREE.MeshStandardMaterial({
    color: '#262E30',
    roughness: 0.42,
    metalness: 0.85,
  }),

  metalFrame: new THREE.MeshStandardMaterial({
    color: '#343E40',
    roughness: 0.48,
    metalness: 0.78,
  }),

  hvacHousing: new THREE.MeshStandardMaterial({
    color: '#434D50',
    roughness: 0.52,
    metalness: 0.65,
  }),

  hvacLouvers: new THREE.MeshStandardMaterial({
    color: '#1A1F21',
    roughness: 0.72,
    metalness: 0.50,
  }),

  hvacFan: new THREE.MeshStandardMaterial({
    color: '#151819',
    roughness: 0.58,
    metalness: 0.82,
  }),

  // 3. Acid-Lime (#D6FF64) Emissive Materials
  limeEmissive: new THREE.MeshStandardMaterial({
    color: '#D6FF64',
    emissive: '#D6FF64',
    emissiveIntensity: 1.8,
    roughness: 0.20,
    metalness: 0.05,
  }),

  limeFloorArrows: new THREE.MeshStandardMaterial({
    color: '#D6FF64',
    emissive: '#D6FF64',
    emissiveIntensity: 1.4,
    roughness: 0.30,
    metalness: 0.05,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2,
  }),

  limeBeaconCore: new THREE.MeshStandardMaterial({
    color: '#F0FFA5',
    emissive: '#D6FF64',
    emissiveIntensity: 2.6,
    roughness: 0.15,
    metalness: 0.0,
  }),

  limeBeaconRing: new THREE.MeshStandardMaterial({
    color: '#D6FF64',
    emissive: '#D6FF64',
    emissiveIntensity: 2.0,
    roughness: 0.25,
    metalness: 0.1,
  }),

  limeBeaconAura: new THREE.MeshStandardMaterial({
    color: '#D6FF64',
    emissive: '#D6FF64',
    emissiveIntensity: 1.0,
    transparent: true,
    opacity: 0.25,
    roughness: 0.5,
    side: THREE.DoubleSide,
    depthWrite: false,
  }),

  // 4. Ground Slab & Blending
  groundSlab: new THREE.MeshStandardMaterial({
    color: '#121717',
    roughness: 0.96,
    metalness: 0.02,
  }),

  groundGridLine: new THREE.MeshBasicMaterial({
    color: '#1A2222',
  }),

  // 5. Planter & Foliage
  planterSoil: new THREE.MeshStandardMaterial({
    color: '#1A1817',
    roughness: 0.96,
    metalness: 0.0,
  }),

  foliageMain: new THREE.MeshStandardMaterial({
    color: '#3B4E38',
    roughness: 0.84,
    metalness: 0.0,
  }),

  foliageLight: new THREE.MeshStandardMaterial({
    color: '#4F684C',
    roughness: 0.82,
    metalness: 0.0,
  }),
};
