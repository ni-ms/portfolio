import React, { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useTexture } from '@react-three/drei';
import { materials } from './materials';
import { COURSE_BOUNDS, CHECKPOINTS, ArchitecturalObstacle } from './courseConfig';

export interface CourseGeometryProps {
  isMobile?: boolean;
  theme?: 'dark' | 'light';
  isDeterministicReview?: boolean;
}

/**
 * Procedural beveled architectural platform.
 * Features:
 * - True 3D monolithic concrete structural core with 45° specular highlights
 * - 45° vertical corner chamfer pilasters eliminating sharp 90° CGI corners
 * - Recessed bottom plinth / water-table band grounding the platform
 * - Surface paver deck with multi-tone modular stone pavers and expansion joint texturing
 * - Perimeter beveled coping stone with physical overhang and drip edge
 * - Underside reveal strip creating crisp contact shadow separation
 * - Vertical structural support pylons extending toward the ground
 * - Modular precast facade panel relief seams and recessed ventilation louvers
 */
interface PlatformProps {
  position: [number, number, number];
  size: [number, number, number];
  hasPillars?: boolean;
  material?: THREE.Material;
  topTrim?: boolean;
  surfacePavers?: boolean;
  paverMaterial?: THREE.Material;
  facadeDetails?: boolean;
  wayfindingEdge?: boolean;
  wayfindingCenterLine?: boolean;
}

const BeveledPlatform: React.FC<PlatformProps> = ({
  position,
  size,
  hasPillars = false,
  material = materials.concreteMain,
  topTrim = true,
  surfacePavers = true,
  paverMaterial = materials.concretePaver,
  facadeDetails = true,
  wayfindingEdge = false,
  wayfindingCenterLine = false,
}) => {
  const [w, h, d] = size;
  const halfH = h / 2;
  const trimThickness = 0.08;
  const trimOverhang = 0.04;
  const chamfer = 0.035;

  // Support pillars beneath corners
  const pillarRadius = 0.16;
  const pillarHeight = position[1] - halfH;

  return (
    <group position={position}>
      {/* 1. Main concrete slab core */}
      <mesh castShadow receiveShadow material={material}>
        <boxGeometry args={[w, h, d]} />
      </mesh>

      {/* Vertical 45° corner chamfer pilasters catching crisp edge highlights */}
      <group>
        {[
          [-w / 2, -d / 2],
          [w / 2, -d / 2],
          [-w / 2, d / 2],
          [w / 2, d / 2],
        ].map(([cx, cz], i) => (
          <mesh
            key={`corner-chamfer-${i}`}
            position={[cx, 0, cz]}
            rotation={[0, Math.PI / 4, 0]}
            material={materials.concreteTrim}
            castShadow
          >
            <boxGeometry args={[chamfer * 1.6, h * 0.99, chamfer * 1.6]} />
          </mesh>
        ))}
      </group>

      {/* Recessed architectural base plinth band grounding the slab */}
      <mesh
        position={[0, -halfH + 0.04, 0]}
        material={materials.concreteDark}
        receiveShadow
      >
        <boxGeometry args={[w + 0.02, 0.08, d + 0.02]} />
      </mesh>

      {/* 2. Surface paver deck with subtle expansion joint texture */}
      {surfacePavers && (
        <mesh
          position={[0, halfH + 0.002, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
          material={paverMaterial}
        >
          <planeGeometry args={[w - 0.06, d - 0.06]} />
        </mesh>
      )}

      {/* Restrained structural lime wayfinding along route */}
      {wayfindingEdge && (
        <mesh
          position={[0, halfH + 0.003, -d / 2 + 0.06]}
          rotation={[-Math.PI / 2, 0, 0]}
          material={materials.limeFloorArrows}
        >
          <planeGeometry args={[Math.min(w * 0.75, 1.0), 0.05]} />
        </mesh>
      )}

      {wayfindingCenterLine && (
        <mesh
          position={[0, halfH + 0.003, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          material={materials.limeFloorArrows}
        >
          <planeGeometry args={[w * 0.85, 0.04]} />
        </mesh>
      )}

      {/* 3. Perimeter beveled coping stone with drip edge overhang */}
      {topTrim && (
        <group position={[0, halfH, 0]}>
          {/* North coping */}
          <mesh
            position={[0, trimThickness / 2, -d / 2 - trimOverhang / 2]}
            material={materials.concreteTrim}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[w + trimOverhang * 2, trimThickness, trimThickness + trimOverhang]} />
          </mesh>

          {/* South coping */}
          <mesh
            position={[0, trimThickness / 2, d / 2 + trimOverhang / 2]}
            material={materials.concreteTrim}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[w + trimOverhang * 2, trimThickness, trimThickness + trimOverhang]} />
          </mesh>

          {/* West coping */}
          <mesh
            position={[-w / 2 - trimOverhang / 2, trimThickness / 2, 0]}
            material={materials.concreteTrim}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[trimThickness + trimOverhang, trimThickness, d - trimThickness * 2]} />
          </mesh>

          {/* East coping */}
          <mesh
            position={[w / 2 + trimOverhang / 2, trimThickness / 2, 0]}
            material={materials.concreteTrim}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[trimThickness + trimOverhang, trimThickness, d - trimThickness * 2]} />
          </mesh>

          {/* Underside reveal strip for crisp contact darkening */}
          <mesh
            position={[0, -trimThickness / 2 - 0.01, 0]}
            material={materials.underSlabShadow}
          >
            <boxGeometry args={[w + trimOverhang * 2.05, 0.02, d + trimOverhang * 2.05]} />
          </mesh>
        </group>
      )}

      {/* 4. Facade panel reveal seams and service details */}
      {facadeDetails && h >= 1.0 && (
        <group>
          {/* Horizontal precast joints */}
          <mesh position={[0, 0, d / 2 + 0.002]} material={materials.facadeSeam}>
            <planeGeometry args={[w * 0.94, 0.012]} />
          </mesh>
          <mesh position={[0, 0, -d / 2 - 0.002]} rotation={[0, Math.PI, 0]} material={materials.facadeSeam}>
            <planeGeometry args={[w * 0.94, 0.012]} />
          </mesh>
          <mesh position={[-w / 2 - 0.002, 0, 0]} rotation={[0, -Math.PI / 2, 0]} material={materials.facadeSeam}>
            <planeGeometry args={[d * 0.94, 0.012]} />
          </mesh>
          <mesh position={[w / 2 + 0.002, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={materials.facadeSeam}>
            <planeGeometry args={[d * 0.94, 0.012]} />
          </mesh>

          {/* Vertical joints and recessed intake louvers on tall slabs (h >= 2.4) */}
          {h >= 2.4 && (
            <>
              {/* Secondary horizontal joints for multi-story precast look */}
              <mesh position={[0, -halfH * 0.5, d / 2 + 0.002]} material={materials.facadeSeam}>
                <planeGeometry args={[w * 0.94, 0.012]} />
              </mesh>
              <mesh position={[0, halfH * 0.5, d / 2 + 0.002]} material={materials.facadeSeam}>
                <planeGeometry args={[w * 0.94, 0.012]} />
              </mesh>

              {/* Recessed ventilation / intake louvers in lower facade with 3D blades */}
              <group position={[0, -halfH * 0.5, d / 2 + 0.004]}>
                <mesh material={materials.facadeLouver}>
                  <planeGeometry args={[Math.min(w * 0.55, 1.8), 0.42]} />
                </mesh>
                {/* Horizontal metal louver blades */}
                {[-0.15, -0.075, 0, 0.075, 0.15].map((ly, lIdx) => (
                  <mesh
                    key={`louver-blade-${lIdx}`}
                    position={[0, ly, 0.01]}
                    rotation={[-Math.PI / 6, 0, 0]}
                    material={materials.metalRails}
                  >
                    <boxGeometry args={[Math.min(w * 0.55, 1.8) - 0.02, 0.015, 0.025]} />
                  </mesh>
                ))}
                {/* Louver perimeter trim */}
                <mesh position={[0, 0.22, 0]} material={materials.metalRails}>
                  <boxGeometry args={[Math.min(w * 0.55, 1.8) + 0.04, 0.02, 0.01]} />
                </mesh>
                <mesh position={[0, -0.22, 0]} material={materials.metalRails}>
                  <boxGeometry args={[Math.min(w * 0.55, 1.8) + 0.04, 0.02, 0.01]} />
                </mesh>
              </group>

              {/* External MEP conduit riser running down side facade */}
              <group position={[-w / 2 - 0.03, 0, -d * 0.2]}>
                <mesh material={materials.metalConduit} castShadow>
                  <cylinderGeometry args={[0.02, 0.02, h * 0.88, 10]} />
                </mesh>
                {/* Wall mounting brackets */}
                {[-halfH * 0.6, 0, halfH * 0.6].map((by, i) => (
                  <mesh key={`bracket-${i}`} position={[0.015, by, 0]} material={materials.metalRails}>
                    <boxGeometry args={[0.03, 0.025, 0.05]} />
                  </mesh>
                ))}
              </group>
            </>
          )}
        </group>
      )}

      {/* 5. Vertical architectural support pylons */}
      {hasPillars && pillarHeight > 0.2 && (
        <group position={[0, -halfH - pillarHeight / 2, 0]}>
          <mesh position={[-w * 0.38, 0, -d * 0.38]} material={materials.concretePillar} castShadow receiveShadow>
            <cylinderGeometry args={[pillarRadius, pillarRadius * 1.08, pillarHeight, 16]} />
          </mesh>
          <mesh position={[w * 0.38, 0, -d * 0.38]} material={materials.concretePillar} castShadow receiveShadow>
            <cylinderGeometry args={[pillarRadius, pillarRadius * 1.08, pillarHeight, 16]} />
          </mesh>
          <mesh position={[-w * 0.38, 0, d * 0.38]} material={materials.concretePillar} castShadow receiveShadow>
            <cylinderGeometry args={[pillarRadius, pillarRadius * 1.08, pillarHeight, 16]} />
          </mesh>
          <mesh position={[w * 0.38, 0, d * 0.38]} material={materials.concretePillar} castShadow receiveShadow>
            <cylinderGeometry args={[pillarRadius, pillarRadius * 1.08, pillarHeight, 16]} />
          </mesh>
        </group>
      )}
    </group>
  );
};

/**
 * Architectural Glass & Steel Balustrade along perimeter edges.
 * Features:
 * - Tempered translucent safety glass panels
 * - Brushed stainless steel stanchions and top cap handrail
 * - Structural base mounting shoes
 */
interface BalustradeProps {
  start: [number, number, number];
  end: [number, number, number];
  height?: number;
  postSpacing?: number;
}

const GlassBalustrade: React.FC<BalustradeProps> = ({
  start,
  end,
  height = 0.88,
  postSpacing = 1.15,
}) => {
  const dx = end[0] - start[0];
  const dz = end[2] - start[2];
  const length = Math.sqrt(dx * dx + dz * dz);
  if (length < 0.2) return null;

  const angle = Math.atan2(dx, dz);
  const midX = (start[0] + end[0]) / 2;
  const midZ = (start[2] + end[2]) / 2;
  const baseY = start[1];

  const postCount = Math.max(2, Math.floor(length / postSpacing) + 1);
  const posts: number[] = [];
  for (let i = 0; i < postCount; i++) {
    posts.push(-length / 2 + (i / (postCount - 1)) * length);
  }

  const postThickness = 0.038;
  const railThickness = 0.034;
  const glassMargin = 0.04;
  const glassHeight = height - 0.12;

  return (
    <group position={[midX, baseY, midZ]} rotation={[0, angle, 0]}>
      {/* Metal Posts with Base Mounting Shoes */}
      {posts.map((offset, idx) => (
        <group key={`post-${idx}`} position={[0, 0, offset]}>
          {/* Base mounting shoe */}
          <mesh position={[0, 0.03, 0]} material={materials.metalRails} castShadow>
            <boxGeometry args={[postThickness * 1.8, 0.06, postThickness * 1.8]} />
          </mesh>
          {/* Vertical Stanchion */}
          <mesh position={[0, height / 2, 0]} material={materials.metalRails} castShadow>
            <boxGeometry args={[postThickness, height, postThickness]} />
          </mesh>
        </group>
      ))}

      {/* Top Brushed Handrail with subtle chamfer highlight */}
      <mesh position={[0, height, 0]} material={materials.metalRails} castShadow>
        <boxGeometry args={[railThickness, railThickness, length]} />
      </mesh>

      {/* Mid safety stabilization bar */}
      <mesh position={[0, 0.08, 0]} material={materials.metalRails} castShadow>
        <boxGeometry args={[railThickness * 0.7, 0.025, length]} />
      </mesh>

      {/* Translucent Tempered Safety Glass Panels */}
      <mesh position={[0, 0.08 + glassHeight / 2, 0]} material={materials.glassBalustrade}>
        <boxGeometry args={[0.015, glassHeight, length - glassMargin * 2]} />
      </mesh>
    </group>
  );
};

/**
 * Architectural concrete staircase with tread bevels, side stringers,
 * and warm linear toe-kick reveal lighting under each tread bullnose.
 * Stringer beams are oriented with negative-X angle so they ascend in exact lockstep
 * from the lowest step (z = -run/2, y = 0) to the highest step (z = +run/2, y = rise).
 */
interface StairsProps {
  position: [number, number, number];
  width: number;
  run: number;
  rise: number;
  steps: number;
  rotationY?: number;
  treadMaterial?: THREE.Material;
}

const Stairs: React.FC<StairsProps> = ({
  position,
  width,
  run,
  rise,
  steps,
  rotationY = 0,
  treadMaterial = materials.concreteTrim,
}) => {
  const stepRun = run / steps;
  const stepRise = rise / steps;
  const bullnose = 0.03;
  const beamLength = Math.sqrt(run * run + rise * rise);
  // Negative angle around X so y rises as z increases from -run/2 to +run/2
  const stringerAngle = -Math.atan2(rise, run);

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Solid Steps */}
      {Array.from({ length: steps }).map((_, i) => {
        const stepH = (i + 1) * stepRise;
        const stepZ = -run / 2 + (i + 0.5) * stepRun;
        return (
          <group key={`stair-step-${i}`}>
            {/* Main step mass */}
            <mesh
              position={[0, stepH / 2, stepZ]}
              material={materials.concreteMain}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[width, stepH, stepRun]} />
            </mesh>
            {/* Tread coping bullnose overhang */}
            <mesh
              position={[0, stepH + 0.015, stepZ - bullnose / 2]}
              material={treadMaterial}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[width, 0.03, stepRun + bullnose]} />
            </mesh>
            {/* Recessed warm linear toe-kick accent light under each tread bullnose */}
            <mesh
              position={[0, stepH - 0.005, stepZ - stepRun / 2 - 0.01]}
              material={materials.warmFixture}
            >
              <boxGeometry args={[width * 0.88, 0.01, 0.015]} />
            </mesh>
          </group>
        );
      })}

      {/* Left Stringer Beam: ascends correctly with step coordinates */}
      <mesh
        position={[-width / 2 - 0.04, rise / 2, 0]}
        rotation={[stringerAngle, 0, 0]}
        material={materials.concreteTrim}
        castShadow
      >
        <boxGeometry args={[0.08, 0.22, beamLength]} />
      </mesh>

      {/* Right Stringer Beam: ascends correctly with step coordinates */}
      <mesh
        position={[width / 2 + 0.04, rise / 2, 0]}
        rotation={[stringerAngle, 0, 0]}
        material={materials.concreteTrim}
        castShadow
      >
        <boxGeometry args={[0.08, 0.22, beamLength]} />
      </mesh>
    </group>
  );
};

// Fit the visual asset inside the existing HVAC collider, preserving the clear path.
function HVACUnit({ position, size }: { position: [number, number, number]; size: [number, number, number] }) {
  const { scene } = useGLTF('/rooftop/aircon.glb');
  const { model, offset, dimensions } = useMemo(() => {
    const model = scene.clone();
    model.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });
    const bounds = new THREE.Box3().setFromObject(model);
    const center = bounds.getCenter(new THREE.Vector3());
    return {
      model,
      offset: new THREE.Vector3(-center.x, -bounds.min.y, -center.z),
      dimensions: bounds.getSize(new THREE.Vector3()),
    };
  }, [scene]);
  return (
    <group position={position} scale={[size[0] / dimensions.x, size[1] / dimensions.y, size[2] / dimensions.z]}>
      <primitive object={model} position={offset} />
    </group>
  );
}

/**
 * Communications & Sensor Mast on Work Rooftop.
 * - Position and pedestal bounds derived directly from canonical COURSE_BOUNDS.architecturalObstacles
 * - Uses isolated limeMastBeacon material (never bleeds into shared limeEmissive)
 * - Subscribes to live matchMedia('(prefers-reduced-motion: reduce)') with cleanup
 * - Freezes pulse cleanly under both forceDeterministic and reduced motion without triggering React rerenders
 */
const CommunicationsMast: React.FC<{
  obstacle?: ArchitecturalObstacle;
  isReview?: boolean;
}> = ({ obstacle, isReview = false }) => {
  const beaconRef = useRef<THREE.Mesh>(null);
  const reducedMotionRef = useRef(false);

  // Subscribe to live prefers-reduced-motion media query changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionRef.current = mq.matches;

    const handleChange = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches;
      if (e.matches && beaconRef.current) {
        (beaconRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.0;
      }
    };

    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', handleChange);
      return () => mq.removeEventListener('change', handleChange);
    } else if (typeof (mq as any).addListener === 'function') {
      (mq as any).addListener(handleChange);
      return () => (mq as any).removeListener(handleChange);
    }
  }, []);

  useFrame(({ clock }) => {
    if (beaconRef.current) {
      if (isReview || reducedMotionRef.current) {
        (beaconRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.0;
        return;
      }
      const t = clock.getElapsedTime();
      const pulse = Math.sin(t * 3.5) > 0.4 ? 1.8 : 0.2;
      (beaconRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse;
    }
  });

  // Base dimensions and position derived directly from canonical obstacle definition
  const [ox, oy, oz] = obstacle?.position ?? [-5.8, 3.9, -5.1];
  const [sw, sh, sd] = obstacle?.size ?? [0.45, 0.2, 0.45];
  const baseY = oy - sh / 2;

  return (
    <group position={[ox, baseY, oz]}>
      {/* Base mounting pedestal matching physics obstacle bounds exactly */}
      <mesh position={[0, sh / 2, 0]} material={materials.concreteTrim} castShadow>
        <boxGeometry args={[sw, sh, sd]} />
      </mesh>

      {/* Pedestal steel anchor plate */}
      <mesh position={[0, sh + 0.01, 0]} material={materials.metalRails} castShadow>
        <boxGeometry args={[sw * 0.75, 0.02, sd * 0.75]} />
      </mesh>

      {/* Vertical Mast Column */}
      <mesh position={[0, sh + 1.3, 0]} material={materials.metalMast} castShadow>
        <cylinderGeometry args={[0.035, 0.06, 2.6, 12]} />
      </mesh>

      {/* Cross Arms */}
      <mesh position={[0, sh + 1.7, 0]} material={materials.metalMast}>
        <boxGeometry args={[0.7, 0.03, 0.03]} />
      </mesh>
      <mesh position={[0, sh + 2.2, 0]} material={materials.metalMast}>
        <boxGeometry args={[0.45, 0.025, 0.025]} />
      </mesh>

      {/* Microwave Dish Antenna */}
      <mesh position={[0.2, sh + 1.7, 0]} rotation={[0, 0, Math.PI / 6]} material={materials.metalRails} castShadow>
        <cylinderGeometry args={[0.22, 0.05, 0.08, 16]} />
      </mesh>

      {/* Top Obstruction Beacon using isolated limeMastBeacon material */}
      <mesh ref={beaconRef} position={[0, sh + 2.65, 0]} material={materials.limeMastBeacon}>
        <sphereGeometry args={[0.05, 12, 12]} />
      </mesh>
    </group>
  );
};

/**
 * Roof Access Hatch with diamond-plate lid, grab handle, and curb chamfer.
 * Derived directly from canonical COURSE_BOUNDS.architecturalObstacles.
 */
const RoofAccessHatch: React.FC<{
  obstacle?: ArchitecturalObstacle;
}> = ({ obstacle }) => {
  const [ox, oy, oz] = obstacle?.position ?? [-2.4, 3.88, -2.1];
  const [sw, sh, sd] = obstacle?.size ?? [0.94, 0.16, 0.94];
  const baseY = oy - sh / 2;

  return (
    <group position={[ox, baseY, oz]}>
      {/* Raised curb matching physics obstacle bounds */}
      <mesh position={[0, sh / 2, 0]} material={materials.concreteTrim} castShadow receiveShadow>
        <boxGeometry args={[sw, sh, sd]} />
      </mesh>
      {/* Slanted metal lid with perimeter overhang */}
      <mesh position={[0, sh + 0.02, 0]} rotation={[0.06, 0, 0]} material={materials.metalHatch} castShadow>
        <boxGeometry args={[sw + 0.04, 0.04, sd + 0.04]} />
      </mesh>
      {/* Grab handle */}
      <mesh position={[0, sh + 0.05, sd * 0.35]} material={materials.metalRails}>
        <boxGeometry args={[0.22, 0.03, 0.03]} />
      </mesh>
      {/* Heavy-duty padlock latch assembly */}
      <mesh position={[0, sh + 0.04, -sd * 0.42]} material={materials.metalBolt}>
        <boxGeometry args={[0.06, 0.03, 0.04]} />
      </mesh>
    </group>
  );
};

/**
 * Refined Architectural Foliage for Planter Boxes:
 * Clean, elegant leaf & grass silhouettes with open air gaps and authentic depth
 * rather than dense lumpy mass clusters.
 */
interface ArchitecturalLandscapingProps {
  position: [number, number, number];
  size: [number, number, number];
  sparseFoliage?: boolean;
}

const PlanterBox: React.FC<ArchitecturalLandscapingProps> = ({
  position,
  size,
  sparseFoliage = false,
}) => {
  const [w, h, d] = size;
  const wallThickness = 0.06;
  const rimOverhang = 0.025;

  return (
    <group position={position}>
      {/* Concrete Planter Body with Chamfer Rim */}
      <mesh position={[0, h / 2, 0]} material={materials.concreteTrim} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
      </mesh>

      {/* Top perimeter coping rim lip */}
      <mesh position={[0, h, 0]} material={materials.concreteMain} castShadow receiveShadow>
        <boxGeometry args={[w + rimOverhang * 2, 0.035, d + rimOverhang * 2]} />
      </mesh>

      {/* Dark potting soil */}
      <mesh position={[0, h - 0.02, 0]} material={materials.planterSoil} receiveShadow>
        <boxGeometry args={[w - wallThickness * 2, 0.02, d - wallThickness * 2]} />
      </mesh>

      {/* Refined Architectural Landscaping: Slender Stems with Fan Leaf Silhouettes */}
      <group position={[0, h, 0]}>
        {/* Central Architectural Ficus / Bamboo Stalks */}
        {[-w * 0.18, w * 0.18].map((sx, idx) => {
          const stemH = 0.46 + idx * 0.06;
          return (
            <group key={`stem-${idx}`} position={[sx, 0, (idx === 0 ? -1 : 1) * 0.06]}>
              {/* Slender vertical stem */}
              <mesh position={[0, stemH / 2, 0]} material={materials.foliageStem} castShadow>
                <cylinderGeometry args={[0.012, 0.016, stemH, 8]} />
              </mesh>
              {/* Delicate horizontal fan leaves at distinct nodes */}
              {[0.55, 0.9].map((nodeFrac, lIdx) => (
                <group key={`fan-${lIdx}`} position={[0, stemH * nodeFrac, 0]} rotation={[0, (idx + lIdx) * 1.3, 0]}>
                  {/* Left leaf blade */}
                  <mesh
                    position={[0.08, 0, 0]}
                    rotation={[0.15, 0, -0.2]}
                    material={materials.foliageMain}
                    castShadow
                  >
                    <boxGeometry args={[0.12, 0.005, 0.05]} />
                  </mesh>
                  {/* Right leaf blade */}
                  <mesh
                    position={[-0.08, 0.01, 0.02]}
                    rotation={[-0.15, 0, 0.2]}
                    material={materials.foliageLight}
                    castShadow
                  >
                    <boxGeometry args={[0.12, 0.005, 0.05]} />
                  </mesh>
                </group>
              ))}
            </group>
          );
        })}

        {!sparseFoliage && (
          <>
            {/* Tapered architectural fountain grass blades with graceful curve */}
            <group position={[0, 0, 0.12]}>
              {[-0.2, 0, 0.2].map((rotZ, ri) => (
                <mesh
                  key={`blade-${ri}`}
                  position={[rotZ * 0.08, 0.18, 0]}
                  rotation={[0, ri * 0.8, rotZ]}
                  material={materials.foliageAccent}
                  castShadow
                >
                  <coneGeometry args={[0.035, 0.34, 4]} />
                </mesh>
              ))}
            </group>

            {/* Overhanging trailing ivy leaf tendril over the planter rim */}
            <mesh position={[w / 2 + 0.015, -0.06, 0]} material={materials.foliageLight} castShadow>
              <boxGeometry args={[0.02, 0.14, 0.10]} />
            </mesh>
          </>
        )}
      </group>
    </group>
  );
};

/**
 * Rectangular Overhead Steel Pavilion Frame on Résumé rooftop (Centerpiece).
 * Features:
 * - 4 vertical steel box columns with heavy base anchor shoes
 * - Top header box beams with welded corner plates
 * - Intermediate architectural rafters with underside recessed linear acid-lime light strips
 * - Horizontal sunshade louvers casting intricate geometric linear shadows on the deck
 */
const OverheadSteelFrame: React.FC<{
  center: [number, number, number];
  width: number;
  height: number;
  depth: number;
}> = ({ center, width, height, depth }) => {
  const [cx, cy, cz] = center;
  const colSize = 0.085;
  const beamSize = 0.085;
  const halfW = width / 2;
  const halfH = height / 2;
  const halfD = depth / 2;

  return (
    <group position={[cx, cy, cz]}>
      {/* 4 Vertical Steel Columns with Base Anchor Plates */}
      {[-halfW, halfW].map((x) =>
        [-halfD, halfD].map((z) => (
          <group key={`col-${x}-${z}`} position={[x, 0, z]}>
            {/* Base anchor shoe plate */}
            <mesh position={[0, -halfH + 0.03, 0]} material={materials.metalFrame} castShadow>
              <boxGeometry args={[colSize * 1.6, 0.06, colSize * 1.6]} />
            </mesh>
            {/* Main vertical column */}
            <mesh position={[0, 0, 0]} material={materials.metalFrame} castShadow>
              <boxGeometry args={[colSize, height, colSize]} />
            </mesh>
          </group>
        ))
      )}

      {/* Top Header Box Beams */}
      <mesh position={[0, halfH, -halfD]} material={materials.metalFrame} castShadow>
        <boxGeometry args={[width, beamSize, beamSize]} />
      </mesh>
      <mesh position={[0, halfH, halfD]} material={materials.metalFrame} castShadow>
        <boxGeometry args={[width, beamSize, beamSize]} />
      </mesh>
      <mesh position={[-halfW, halfH, 0]} material={materials.metalFrame} castShadow>
        <boxGeometry args={[beamSize, beamSize, depth]} />
      </mesh>
      <mesh position={[halfW, halfH, 0]} material={materials.metalFrame} castShadow>
        <boxGeometry args={[beamSize, beamSize, depth]} />
      </mesh>

      {/* Intermediate Architectural Rafters with Underside Acid-Lime Linear Light Strips */}
      {[-0.6, -0.3, 0, 0.3, 0.6].map((factor, i) => (
        <group key={`rafter-${i}`} position={[halfW * factor, halfH, 0]}>
          <mesh material={materials.metalFrame} castShadow>
            <boxGeometry args={[beamSize * 0.7, beamSize * 0.75, depth]} />
          </mesh>
          {/* Underside recessed architectural lime linear light strip */}
          <mesh position={[0, -beamSize * 0.38, 0]} material={materials.limeEmissive}>
            <boxGeometry args={[0.02, 0.01, depth * 0.9]} />
          </mesh>
        </group>
      ))}

      {/* Sunshade louvers on top surface casting linear shadows */}
      {[-halfD * 0.7, -halfD * 0.35, 0, halfD * 0.35, halfD * 0.7].map((lz, li) => (
        <mesh
          key={`sunshade-${li}`}
          position={[0, halfH + beamSize * 0.45, lz]}
          material={materials.metalFrame}
          castShadow
        >
          <boxGeometry args={[width * 0.95, 0.015, 0.04]} />
        </mesh>
      ))}
    </group>
  );
};

/**
 * Integrated Glazed Facade & Recessed Service Bays on the South Wall Face of Work Rooftop.
 * Creates an architectural centerpiece junction around the courtyard/stairs:
 * - Structural steel mullions and double-height reflective curtain wall glazing
 * - Warm architectural fixture strips providing lighting contrast
 * - Recessed service bays with metal ventilation louvers
 */
const CourtyardArchitecturalJunction: React.FC = () => {
  // Directly derived from COURSE_BOUNDS.workRooftop.mainSlab bounds
  const slab = COURSE_BOUNDS.workRooftop.mainSlab;
  const wallX = slab.position[0]; // -4.0
  const wallY = slab.position[1]; // 1.9 (vertical center)
  const wallZ = slab.position[2] + slab.size[2] / 2; // -1.4 (south solid wall face)
  const wallW = slab.size[0] - 0.1; // 4.5m (within solid collider envelope)
  const wallH = slab.size[1] - 0.1; // 3.7m (within solid collider envelope)

  return (
    <group name="courtyard-architectural-junction" position={[wallX, wallY, wallZ]}>
      {/* 1. Integrated Glazed Curtain Wall Facade attached flush within existing solid collider envelope */}
      {/* Dark recessed glazing backing plane (minimal epsilon offset +0.003) */}
      <mesh position={[0, 0, 0.003]} material={materials.skylineTower}>
        <planeGeometry args={[wallW, wallH]} />
      </mesh>

      {/* Translucent reflective architectural glass curtain wall (epsilon offset +0.008) */}
      <mesh position={[0, 0, 0.008]} material={materials.glassBalustrade}>
        <planeGeometry args={[wallW - 0.04, wallH - 0.04]} />
      </mesh>

      {/* Vertical structural steel mullions (epsilon offset +0.015, thickness 0.018) */}
      {[-1.5, -0.5, 0.5, 1.5].map((mx, mi) => (
        <mesh key={`mullion-${mi}`} position={[mx, 0, 0.015]} material={materials.metalFrame}>
          <boxGeometry args={[0.038, wallH, 0.018]} />
        </mesh>
      ))}

      {/* Horizontal transom beams (epsilon offset +0.015, thickness 0.018) */}
      {[-wallH * 0.25, wallH * 0.25].map((ty, ti) => (
        <mesh key={`transom-${ti}`} position={[0, ty, 0.015]} material={materials.metalFrame}>
          <boxGeometry args={[wallW, 0.038, 0.018]} />
        </mesh>
      ))}

      {/* Warm linear architectural fixture strip along curtain wall header */}
      <mesh position={[0, wallH / 2 - 0.05, 0.02]} material={materials.warmFixture}>
        <boxGeometry args={[wallW - 0.3, 0.025, 0.02]} />
      </mesh>

      {/* Recessed ventilation louver bay in lower section */}
      <group position={[-1.1, -wallH * 0.28, 0.012]}>
        <mesh material={materials.facadeLouver}>
          <planeGeometry args={[1.0, 0.65]} />
        </mesh>
        {/* Metal louver blades */}
        {[-0.22, -0.11, 0, 0.11, 0.22].map((ly, li) => (
          <mesh key={`bay-louver-${li}`} position={[0, ly, 0.008]} rotation={[-Math.PI / 6, 0, 0]} material={materials.metalRails}>
            <boxGeometry args={[0.96, 0.015, 0.018]} />
          </mesh>
        ))}
      </group>
    </group>
  );
};

/**
 * Checkpoint beacon with glowing core, rotating energy ring, aura beam, and local bounce.
 */
interface CheckpointBeaconProps {
  position: [number, number, number];
  id: string;
  isReview?: boolean;
}

const CheckpointBeacon: React.FC<CheckpointBeaconProps> = ({
  position,
  isReview = false,
}) => {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ringRef.current && !isReview) {
      const t = clock.getElapsedTime();
      ringRef.current.rotation.y = t * 1.1;
      ringRef.current.position.y = 0.52 + Math.sin(t * 2.4) * 0.07;
    }
  });

  return (
    <group position={position}>
      {/* Beveled Architectural Plinth */}
      <mesh position={[0, 0.06, 0]} material={materials.concreteTrim} castShadow receiveShadow>
        <cylinderGeometry args={[0.32, 0.38, 0.12, 16]} />
      </mesh>
      <mesh position={[0, 0.13, 0]} material={materials.metalRails} castShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.04, 16]} />
      </mesh>

      {/* Inner Glowing Crystal Core */}
      <mesh position={[0, 0.48, 0]} material={materials.limeBeaconCore}>
        <cylinderGeometry args={[0.065, 0.065, 0.72, 16]} />
      </mesh>

      {/* Orbiting Glass / Steel Energy Halo Ring */}
      <mesh
        ref={ringRef}
        position={[0, 0.52, 0]}
        rotation={[0.35, 0, 0.2]}
        material={materials.limeBeaconRing}
      >
        <torusGeometry args={[0.26, 0.022, 12, 32]} />
      </mesh>

      {/* Vertical Atmospheric Aura Beam */}
      <mesh position={[0, 1.8, 0]} material={materials.limeBeaconAura}>
        <cylinderGeometry args={[0.18, 0.24, 2.6, 16, 1, true]} />
      </mesh>
    </group>
  );
};

/**
 * Bold, purposeful acid-lime (#D6FF64) course wayfinding markings.
 * Features broad chevrons, runway tracks, and threshold marks with high emissive contrast.
 */
const CourseWayfinding: React.FC = () => {
  // Canonical first route jump: from spawn [-3.5, 1.2, 3.5] toward northwest reachable launch edge [-4.2, 1.2, 2.65]
  // Aimed at the first landing.
  // Chevrons point along -Z and -X (positive yaw = +0.36 rad in Three.js coordinates).
  // Transforming local tip (0, 0, -1) by +0.36 rad gives (-sin(0.36), 0, -cos(0.36)) = (-0.352, 0, -0.936).
  const chevronAngle = 0.36;
  const firstLanding = COURSE_BOUNDS.steppingPlatforms[0];

  return (
    <group name="course-wayfinding">
      {/* 1. START ROOFTOP: Obvious directional runway chevrons on reachable approach ground */}
      {[
        [-3.65, 1.204, 3.30],
        [-3.85, 1.204, 3.05],
        [-4.05, 1.204, 2.80],
      ].map(([cx, cy, cz], idx) => (
        <group key={`start-runway-chevron-${idx}`} position={[cx, cy, cz]} rotation={[0, chevronAngle, 0]}>
          {/* High-contrast charcoal substrate backing */}
          <group rotation={[-Math.PI / 2, 0, 0]}>
            <mesh position={[-0.14, 0.12, -0.001]} rotation={[0, 0, Math.PI / 4]} material={materials.wayfindingCharcoal}>
              <planeGeometry args={[0.38, 0.12]} />
            </mesh>
            <mesh position={[0.14, 0.12, -0.001]} rotation={[0, 0, -Math.PI / 4]} material={materials.wayfindingCharcoal}>
              <planeGeometry args={[0.38, 0.12]} />
            </mesh>
          </group>

          {/* Vibrant #D6FF64 lime chevron pointing forward-left toward jump takeoff */}
          <group rotation={[-Math.PI / 2, 0, 0]}>
            <mesh position={[-0.14, 0.12, 0.001]} rotation={[0, 0, Math.PI / 4]} material={materials.limeFloorArrows}>
              <planeGeometry args={[0.32, 0.065]} />
            </mesh>
            <mesh position={[0.14, 0.12, 0.001]} rotation={[0, 0, -Math.PI / 4]} material={materials.limeFloorArrows}>
              <planeGeometry args={[0.32, 0.065]} />
            </mesh>
          </group>
        </group>
      ))}

      {/* Start Northwest Takeoff Threshold Bar: at canonical reachable launch edge [-4.2, 1.204, 2.65] facing Stepping Platform 1 */}
      <group position={[-4.2, 1.204, 2.65]} rotation={[0, chevronAngle, 0]}>
        {/* Charcoal substrate */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} material={materials.wayfindingCharcoal}>
          <planeGeometry args={[1.3, 0.14]} />
        </mesh>
        {/* Vibrant Lime bar */}
        <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.limeFloorArrows}>
          <planeGeometry args={[1.2, 0.08]} />
        </mesh>
        {/* Takeoff arrow registration notch pointing along jump trajectory toward Stepping Platform 1 */}
        <mesh position={[0, 0.001, -0.09]} rotation={[-Math.PI / 2, 0, 0]} material={materials.limeFloorArrows}>
          <planeGeometry args={[0.08, 0.10]} />
        </mesh>
      </group>

      {/* 2. STEPPING PLATFORM 1 & 2: Safe landing registration marks */}
      <group position={[firstLanding.position[0], firstLanding.surfaceY + 0.004, firstLanding.position[2]]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} material={materials.wayfindingCharcoal}>
          <planeGeometry args={[0.9, 0.10]} />
        </mesh>
        <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.limeFloorArrows}>
          <planeGeometry args={[0.8, 0.05]} />
        </mesh>
      </group>

      <group position={[-4.5, 2.804, -0.55]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} material={materials.wayfindingCharcoal}>
          <planeGeometry args={[0.9, 0.10]} />
        </mesh>
        <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.limeFloorArrows}>
          <planeGeometry args={[0.8, 0.05]} />
        </mesh>
      </group>

      {/* 3. WORK ROOFTOP: Landing reception bar and course lead toward beam */}
      <group position={[-4.2, 3.804, -1.55]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} material={materials.wayfindingCharcoal}>
          <planeGeometry args={[1.2, 0.11]} />
        </mesh>
        <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.limeFloorArrows}>
          <planeGeometry args={[1.1, 0.065]} />
        </mesh>
      </group>
      <group position={[-3.6, 3.804, -2.4]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} material={materials.wayfindingCharcoal}>
          <planeGeometry args={[0.08, 1.4]} />
        </mesh>
        <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.limeFloorArrows}>
          <planeGeometry args={[0.045, 1.3]} />
        </mesh>
      </group>

      {/* Work Rooftop Takeoff Threshold facing Beam Jump to Explorations */}
      <group position={[-2.0, 3.804, -3.2]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} material={materials.wayfindingCharcoal}>
          <planeGeometry args={[0.11, 0.9]} />
        </mesh>
        <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.limeFloorArrows}>
          <planeGeometry args={[0.065, 0.8]} />
        </mesh>
      </group>

      {/* 4. EXPLORATION ROOFTOP: Terrace guide path & takeoff to Résumé */}
      <group position={[1.2, 2.604, -0.6]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} material={materials.wayfindingCharcoal}>
          <planeGeometry args={[0.08, 1.2]} />
        </mesh>
        <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.limeFloorArrows}>
          <planeGeometry args={[0.045, 1.1]} />
        </mesh>
      </group>
      <group position={[3.3, 2.604, 0.0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} material={materials.wayfindingCharcoal}>
          <planeGeometry args={[0.11, 0.9]} />
        </mesh>
        <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.limeFloorArrows}>
          <planeGeometry args={[0.065, 0.8]} />
        </mesh>
      </group>

      {/* 5. RÉSUMÉ ROOFTOP: Arrival threshold and runway line under pavilion */}
      <group position={[5.3, 4.204, 2.2]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} material={materials.wayfindingCharcoal}>
          <planeGeometry args={[1.0, 0.10]} />
        </mesh>
        <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.limeFloorArrows}>
          <planeGeometry args={[0.9, 0.06]} />
        </mesh>
      </group>
      <group position={[5.7, 4.204, 1.2]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} material={materials.wayfindingCharcoal}>
          <planeGeometry args={[0.08, 1.8]} />
        </mesh>
        <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.limeFloorArrows}>
          <planeGeometry args={[0.045, 1.7]} />
        </mesh>
      </group>
    </group>
  );
};

/**
 * Distant Futuristic City Skyline Silhouettes.
 * Multi-tiered architectural depth:
 * - Mid-distance towers (z: -20 to -26) with curtain-wall window grids, setbacks, and crowns
 * - Far-distance towers (z: -32 to -42) receding into atmospheric depth fog
 * - Mobile tier optimizes by filtering far-distance towers while keeping the silhouette
 */
interface DistantSkylineProps {
  isMobile?: boolean;
}

const DistantSkyline: React.FC<DistantSkylineProps> = ({ isMobile = false }) => {
  const towers: Array<[number, number, number, number, number, number, boolean, number]> = [
    // Mid-distance layer framing the rooftops
    [-22.0, 3.0, -24.0, 2.8, 17.0, 2.8, true, 1],
    [-15.0, 5.5, -26.0, 3.2, 22.0, 3.2, true, 2],
    [-8.5, 3.5, -22.0, 2.4, 15.0, 2.4, false, 3],
    [-2.0, 7.5, -28.0, 3.6, 26.0, 3.6, true, 1],
    [5.0, 4.5, -23.0, 2.6, 18.0, 2.6, false, 2],
    [12.0, 6.5, -27.0, 3.0, 23.0, 3.0, true, 4],
    [18.5, 4.0, -22.0, 2.6, 16.0, 2.6, false, 3],
    [25.0, 8.0, -29.0, 3.4, 28.0, 3.4, true, 1],

    // Far-distance layer receding into atmospheric fog
    [-28.0, 8.0, -38.0, 4.0, 32.0, 4.0, true, 2],
    [-18.0, 10.0, -42.0, 4.5, 36.0, 4.5, true, 1],
    [-10.0, 6.0, -34.0, 3.5, 24.0, 3.5, false, 3],
    [0.0, 12.0, -45.0, 5.0, 42.0, 5.0, true, 2],
    [9.0, 9.0, -38.0, 3.8, 30.0, 3.8, true, 4],
    [21.0, 11.0, -42.0, 4.2, 35.0, 4.2, true, 1],
    [30.0, 7.5, -36.0, 3.6, 26.0, 3.6, false, 3],
  ];

  // In mobile tier, filter out far-distance towers (z < -30) to preserve draw calls
  const activeTowers = isMobile ? towers.filter(([_, __, z]) => z >= -30.0) : towers;

  return (
    <group name="distant-skyline">
      {activeTowers.map(([x, y, z, w, h, d, hasGlass, crownType], idx) => (
        <group key={`tower-${idx}`} position={[x, y, z]}>
          {/* Main Tower Monolith */}
          <mesh material={materials.skylineTower} receiveShadow>
            <boxGeometry args={[w, h, d]} />
          </mesh>

          {/* Stepped Architectural Crown Setback */}
          <mesh position={[0, h / 2 + 1.6, 0]} material={materials.skylineTower}>
            <boxGeometry args={[w * 0.65, 3.2, d * 0.65]} />
          </mesh>

          {/* Crown Variations */}
          {crownType === 1 && (
            <mesh position={[0, h / 2 + 3.8, 0]} material={materials.metalMast}>
              <cylinderGeometry args={[0.03, 0.07, 1.8, 8]} />
            </mesh>
          )}

          {crownType === 2 && (
            <group position={[0, h / 2 + 3.5, 0]}>
              <mesh material={materials.metalMast}>
                <cylinderGeometry args={[0.02, 0.08, 2.4, 8]} />
              </mesh>
              {/* Slanted architectural glass crown tip */}
              <mesh position={[0, -0.4, 0]} rotation={[0.2, 0, 0]} material={materials.skylineTowerGlass}>
                <boxGeometry args={[w * 0.35, 0.8, d * 0.35]} />
              </mesh>
            </group>
          )}

          {crownType === 3 && (
            /* Mechanical penthouse with louvers */
            <mesh position={[0, h / 2 + 3.6, 0]} material={materials.facadeLouver}>
              <boxGeometry args={[w * 0.42, 1.2, d * 0.42]} />
            </mesh>
          )}

          {crownType === 4 && (
            /* Twin communications mast spires */
            <group position={[0, h / 2 + 3.6, 0]}>
              <mesh position={[-w * 0.15, 0, 0]} material={materials.metalMast}>
                <cylinderGeometry args={[0.02, 0.05, 1.6, 8]} />
              </mesh>
              <mesh position={[w * 0.15, 0, 0]} material={materials.metalMast}>
                <cylinderGeometry args={[0.02, 0.05, 1.6, 8]} />
              </mesh>
            </group>
          )}

          {/* Glass Facade Window Bands */}
          {hasGlass && (
            <>
              <mesh position={[0, 0, d / 2 + 0.015]} material={materials.skylineTowerGlass}>
                <planeGeometry args={[w * 0.78, h * 0.74]} />
              </mesh>
              <mesh position={[0, 0, -d / 2 - 0.015]} rotation={[0, Math.PI, 0]} material={materials.skylineTowerGlass}>
                <planeGeometry args={[w * 0.78, h * 0.74]} />
              </mesh>
            </>
          )}
        </group>
      ))}
    </group>
  );
};

/**
 * Complete Course Geometry component.
 */
export const CourseGeometry: React.FC<CourseGeometryProps> = ({
  isMobile = false,
  theme = 'dark',
  isDeterministicReview = false,
}) => {
  const [concreteColor, concreteNormal] = useTexture(['/rooftop/concrete.jpg', '/rooftop/concrete-normal.jpg']);
  const terraceMaterial = useMemo(() => {
    concreteColor.colorSpace = THREE.SRGBColorSpace;
    for (const map of [concreteColor, concreteNormal]) {
      map.wrapS = map.wrapT = THREE.RepeatWrapping;
      map.repeat.set(2, 2);
      map.needsUpdate = true;
    }
    return new THREE.MeshStandardMaterial({
      color: '#b5b8b1',
      map: concreteColor,
      normalMap: concreteNormal,
      normalScale: new THREE.Vector2(0.16, 0.16),
      roughness: 0.82,
    });
  }, [concreteColor, concreteNormal]);
  useEffect(() => {
    terraceMaterial.color.set(theme === 'light' ? '#e0e0d7' : '#b5b8b1');
  }, [terraceMaterial, theme]);
  useEffect(() => () => terraceMaterial.dispose(), [terraceMaterial]);

  const {
    startRooftop,
    workRooftop,
    explorationRooftop,
    resumeRooftop,
    groundSlab,
    steppingPlatforms,
    balustrades,
    architecturalObstacles,
  } = COURSE_BOUNDS;

  // Shared architectural obstacles
  const mastObstacle = architecturalObstacles?.find((o) => o.id === 'obstacle-mast-pedestal');
  const hatchObstacle = architecturalObstacles?.find((o) => o.id === 'obstacle-roof-hatch');

  return (
    <group name="course-geometry">
      {/* 0. DISTANT FUTURISTIC CITY SKYLINE */}
      <DistantSkyline isMobile={isMobile} />

      {/* 0. DARK/LIGHT GROUND SLAB BASE */}
      <mesh
        position={groundSlab.position}
        receiveShadow
        material={materials.groundSlab}
      >
        <boxGeometry args={groundSlab.size} />
      </mesh>

      {/* Ground slab geometric seam lines */}
      {[-8, -4, 0, 4, 8, 12].map((x) => (
        <mesh
          key={`grid-x-${x}`}
          position={[x, 0.006, 0.5]}
          rotation={[-Math.PI / 2, 0, 0]}
          material={materials.groundGridLine}
        >
          <planeGeometry args={[0.03, 24]} />
        </mesh>
      ))}
      {[-8, -4, 0, 4, 8].map((z) => (
        <mesh
          key={`grid-z-${z}`}
          position={[1.0, 0.006, z]}
          rotation={[-Math.PI / 2, 0, 0]}
          material={materials.groundGridLine}
        >
          <planeGeometry args={[28, 0.03]} />
        </mesh>
      ))}

      {/* 1. FOREGROUND-LEFT STARTING ROOFTOP */}
      <BeveledPlatform
        position={startRooftop.mainSlab.position}
        size={startRooftop.mainSlab.size}
        paverMaterial={terraceMaterial}
        hasPillars
        material={materials.concreteMain}
      />

      <BeveledPlatform
        position={startRooftop.lowerLanding.position}
        size={startRooftop.lowerLanding.size}
        paverMaterial={terraceMaterial}
        hasPillars
        material={materials.concreteLight}
      />

      <Stairs
        position={startRooftop.stairs.position}
        width={startRooftop.stairs.width}
        run={startRooftop.stairs.run}
        rise={startRooftop.stairs.rise}
        steps={startRooftop.stairs.steps}
        treadMaterial={terraceMaterial}
        rotationY={Math.PI}
      />

      {/* 2. BACK-LEFT ELEVATED WORK ROOFTOP (Checkpoint 01) */}
      <BeveledPlatform
        position={workRooftop.mainSlab.position}
        size={workRooftop.mainSlab.size}
        hasPillars
        material={materials.concreteDark}
      />

      {/* Integrated Glazed Facade & Recessed Service Bays (Courtyard Centerpiece Junction) */}
      <CourtyardArchitecturalJunction />

      {/* Chiller units with physical edge chamfers & recessed louvers */}
      {workRooftop.hvacUnits.map((hvac, idx) => (
        <HVACUnit key={`hvac-${idx}`} position={hvac.position} size={hvac.size} />
      ))}

      {/* Communications Mast (derived from shared architecturalObstacles) */}
      <CommunicationsMast obstacle={mastObstacle} isReview={isDeterministicReview} />

      {/* Roof access hatch (derived from shared architecturalObstacles) */}
      <RoofAccessHatch obstacle={hatchObstacle} />

      {/* Checkpoint 01 Beacon */}
      <CheckpointBeacon
        position={workRooftop.beaconPosition}
        id={CHECKPOINTS[1].id}
        isReview={isDeterministicReview}
      />

      {/* 3. CENTRAL EXPLORATION ROOFTOP (Checkpoint 02) */}
      <BeveledPlatform
        position={explorationRooftop.upperTerrace.position}
        size={explorationRooftop.upperTerrace.size}
        hasPillars
        material={materials.concreteMain}
      />

      <BeveledPlatform
        position={explorationRooftop.lowerTerrace.position}
        size={explorationRooftop.lowerTerrace.size}
        hasPillars
        material={materials.concreteLight}
      />

      <Stairs
        position={explorationRooftop.stairs.position}
        width={explorationRooftop.stairs.width}
        run={explorationRooftop.stairs.run}
        rise={explorationRooftop.stairs.rise}
        steps={explorationRooftop.stairs.steps}
        rotationY={Math.PI}
      />

      {/* Planters with refined architectural landscaping (clean silhouettes, no bowling balls) */}
      {explorationRooftop.planters.map((planter, idx) => (
        <PlanterBox
          key={`planter-${idx}`}
          position={planter.position}
          size={planter.size}
          sparseFoliage={isMobile}
        />
      ))}

      {/* Checkpoint 02 Beacon */}
      <CheckpointBeacon
        position={explorationRooftop.beaconPosition}
        id={CHECKPOINTS[2].id}
        isReview={isDeterministicReview}
      />

      {/* 4. FAR-RIGHT ELEVATED RÉSUMÉ ROOFTOP (Checkpoint 03) */}
      <BeveledPlatform
        position={resumeRooftop.mainSlab.position}
        size={resumeRooftop.mainSlab.size}
        hasPillars
        material={materials.concreteDark}
      />

      <OverheadSteelFrame
        center={resumeRooftop.overheadFrame.center}
        width={resumeRooftop.overheadFrame.width}
        height={resumeRooftop.overheadFrame.height}
        depth={resumeRooftop.overheadFrame.depth}
      />

      <Stairs
        position={resumeRooftop.stairs.position}
        width={resumeRooftop.stairs.width}
        run={resumeRooftop.stairs.run}
        rise={resumeRooftop.stairs.rise}
        steps={resumeRooftop.stairs.steps}
        rotationY={-Math.PI / 4}
      />

      {/* Checkpoint 03 Beacon */}
      <CheckpointBeacon
        position={resumeRooftop.beaconPosition}
        id={CHECKPOINTS[3].id}
        isReview={isDeterministicReview}
      />

      {/* 5. STEPPING PLATFORMS & NARROW BEAMS with subtle route wayfinding */}
      {steppingPlatforms.map((plat) => {
        const isBeam = plat.id === 'beam-work-exp';
        return (
          <group key={plat.id}>
            <BeveledPlatform
              position={plat.position}
              size={plat.size}
              hasPillars={plat.hasPillar}
              material={materials.concreteLight}
              surfacePavers={plat.id === 'step-start-work-1'}
              paverMaterial={terraceMaterial}
              wayfindingEdge={!isBeam}
              wayfindingCenterLine={isBeam}
            />
          </group>
        );
      })}

      {/* 6. CANONICAL PERIMETER BALUSTRADES (1:1 with physics colliders) */}
      {balustrades.map((b) => (
        <GlassBalustrade
          key={b.id}
          start={b.start}
          end={b.end}
          height={b.height}
        />
      ))}

      {/* 7. BOLD PURPOSEFUL ACID-LIME WAYFINDING SYSTEM */}
      <CourseWayfinding />
    </group>
  );
};
