import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { materials } from './materials';
import { COURSE_BOUNDS, CHECKPOINTS } from './courseConfig';
import { isDeterministicReviewMode } from './quality';

export interface CourseGeometryProps {
  isMobile?: boolean;
  theme?: 'dark' | 'light';
}

/**
 * Procedural beveled architectural platform.
 * Features:
 * - Solid concrete structural core
 * - Surface paver deck with perimeter beveled coping stone
 * - Recessed underside reveal creating contact shadow separation
 * - Vertical structural support pylons extending to the ground
 */
interface PlatformProps {
  position: [number, number, number];
  size: [number, number, number];
  hasPillars?: boolean;
  material?: THREE.Material;
  topTrim?: boolean;
  surfacePavers?: boolean;
}

const BeveledPlatform: React.FC<PlatformProps> = ({
  position,
  size,
  hasPillars = false,
  material = materials.concreteMain,
  topTrim = true,
  surfacePavers = true,
}) => {
  const [w, h, d] = size;
  const halfH = h / 2;
  const trimThickness = 0.07;
  const trimOverhang = 0.04;

  // Support pillars beneath corners
  const pillarRadius = 0.16;
  const pillarHeight = position[1] - halfH;

  return (
    <group position={position}>
      {/* Main concrete slab */}
      <mesh castShadow receiveShadow material={material}>
        <boxGeometry args={[w, h, d]} />
      </mesh>

      {/* Surface paver deck with subtle expansion joint texture */}
      {surfacePavers && (
        <mesh
          position={[0, halfH + 0.002, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
          material={materials.concretePaver}
        >
          <planeGeometry args={[w - 0.08, d - 0.08]} />
        </mesh>
      )}

      {/* Perimeter beveled coping stone to catch directional light reflections */}
      {topTrim && (
        <group position={[0, halfH, 0]}>
          {/* North coping */}
          <mesh
            position={[0, trimThickness / 2, -d / 2 + trimThickness / 2 - trimOverhang / 2]}
            material={materials.concreteTrim}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[w + trimOverhang * 2, trimThickness, trimThickness + trimOverhang]} />
          </mesh>
          {/* South coping */}
          <mesh
            position={[0, trimThickness / 2, d / 2 - trimThickness / 2 + trimOverhang / 2]}
            material={materials.concreteTrim}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[w + trimOverhang * 2, trimThickness, trimThickness + trimOverhang]} />
          </mesh>
          {/* West coping */}
          <mesh
            position={[-w / 2 + trimThickness / 2 - trimOverhang / 2, trimThickness / 2, 0]}
            material={materials.concreteTrim}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[trimThickness + trimOverhang, trimThickness, d - trimThickness * 2]} />
          </mesh>
          {/* East coping */}
          <mesh
            position={[w / 2 - trimThickness / 2 + trimOverhang / 2, trimThickness / 2, 0]}
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

      {/* Vertical architectural support pylons */}
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
 * - Structural base mounting spigots
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
      {/* Metal Posts with Base Mounting Plates */}
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

      {/* Top Brushed Handrail */}
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
 * Architectural concrete staircase with tread bevels and side stringers.
 */
interface StairsProps {
  position: [number, number, number];
  width: number;
  run: number;
  rise: number;
  steps: number;
  rotationY?: number;
}

const Stairs: React.FC<StairsProps> = ({
  position,
  width,
  run,
  rise,
  steps,
  rotationY = 0,
}) => {
  const stepRun = run / steps;
  const stepRise = rise / steps;
  const bullnose = 0.03;

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Solid Steps */}
      {Array.from({ length: steps }).map((_, i) => {
        const stepH = (i + 1) * stepRise;
        const stepZ = -run / 2 + (i + 0.5) * stepRun;
        return (
          <group key={i}>
            {/* Main step mass */}
            <mesh
              position={[0, stepH / 2, stepZ]}
              material={materials.concreteLight}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[width, stepH, stepRun]} />
            </mesh>

            {/* Step tread bullnose / lip */}
            <mesh
              position={[0, stepH - 0.015, stepZ - stepRun / 2 - bullnose / 2]}
              material={materials.concreteTrim}
              castShadow
            >
              <boxGeometry args={[width + 0.02, 0.03, bullnose]} />
            </mesh>
          </group>
        );
      })}

      {/* Left Concrete Stringer Cheek Wall */}
      <mesh
        position={[-width / 2 - 0.04, rise / 2, 0]}
        material={materials.concreteTrim}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.07, rise, run]} />
      </mesh>

      {/* Right Concrete Stringer Cheek Wall */}
      <mesh
        position={[width / 2 + 0.04, rise / 2, 0]}
        material={materials.concreteTrim}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.07, rise, run]} />
      </mesh>
    </group>
  );
};

/**
 * Industrial Rooftop HVAC Chiller Unit with detailed louvers, dual fan cowls,
 * vibration-dampening curb, refrigerant manifolds, and electrical disconnect.
 */
const HVACUnit: React.FC<{
  position: [number, number, number];
  size: [number, number, number];
}> = ({ position, size }) => {
  const [w, h, d] = size;
  const curbHeight = 0.14;

  return (
    <group position={position}>
      {/* Concrete Vibration Isolation Mounting Curb */}
      <mesh position={[0, curbHeight / 2, 0]} material={materials.concreteTrim} castShadow receiveShadow>
        <boxGeometry args={[w * 1.06, curbHeight, d * 1.06]} />
      </mesh>

      {/* Heavy Galvanized Sheet-Metal Chiller Housing */}
      <mesh position={[0, curbHeight + h / 2, 0]} material={materials.hvacHousing} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
      </mesh>

      {/* Front Ventilation Louver Bank */}
      <mesh position={[0, curbHeight + h * 0.48, d / 2 + 0.012]} material={materials.hvacLouvers}>
        <boxGeometry args={[w * 0.88, h * 0.72, 0.02]} />
      </mesh>

      {/* Rear Ventilation Louver Bank */}
      <mesh position={[0, curbHeight + h * 0.48, -d / 2 - 0.012]} material={materials.hvacLouvers}>
        <boxGeometry args={[w * 0.88, h * 0.72, 0.02]} />
      </mesh>

      {/* Top Fan Exhaust Cowl 1 */}
      <mesh position={[-w * 0.22, curbHeight + h + 0.08, 0]} material={materials.hvacFan} castShadow>
        <cylinderGeometry args={[w * 0.22, w * 0.26, 0.16, 20]} />
      </mesh>
      {/* Top Fan Grill 1 */}
      <mesh position={[-w * 0.22, curbHeight + h + 0.165, 0]} material={materials.metalRails}>
        <cylinderGeometry args={[w * 0.21, w * 0.21, 0.015, 16]} />
      </mesh>

      {/* Top Fan Exhaust Cowl 2 */}
      <mesh position={[w * 0.22, curbHeight + h + 0.08, 0]} material={materials.hvacFan} castShadow>
        <cylinderGeometry args={[w * 0.22, w * 0.26, 0.16, 20]} />
      </mesh>
      {/* Top Fan Grill 2 */}
      <mesh position={[w * 0.22, curbHeight + h + 0.165, 0]} material={materials.metalRails}>
        <cylinderGeometry args={[w * 0.21, w * 0.21, 0.015, 16]} />
      </mesh>

      {/* Copper/Steel Refrigerant Piping Manifold */}
      <mesh position={[w / 2 + 0.035, curbHeight + h * 0.35, -d * 0.2]} material={materials.metalConduit}>
        <cylinderGeometry args={[0.025, 0.025, h * 0.65, 12]} />
      </mesh>
      <mesh position={[w / 2 + 0.035, curbHeight + h * 0.35, d * 0.2]} material={materials.metalConduit}>
        <cylinderGeometry args={[0.025, 0.025, h * 0.65, 12]} />
      </mesh>

      {/* Electrical Disconnect Safety Switch Box */}
      <mesh position={[w / 2 + 0.038, curbHeight + h * 0.72, 0]} material={materials.metalRails} castShadow>
        <boxGeometry args={[0.06, 0.16, 0.14]} />
      </mesh>
      {/* Lime Status LED indicator */}
      <mesh position={[w / 2 + 0.07, curbHeight + h * 0.74, 0]} material={materials.limeEmissive}>
        <boxGeometry args={[0.01, 0.02, 0.02]} />
      </mesh>
    </group>
  );
};

/**
 * Communications & Sensor Mast on Work Rooftop.
 * Features a slender lattice mast with an antenna spire and blinking obstruction beacon.
 */
const CommunicationsMast: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const beaconRef = useRef<THREE.Mesh>(null);
  const isReview = isDeterministicReviewMode();

  useFrame(({ clock }) => {
    if (beaconRef.current && !isReview) {
      const t = clock.getElapsedTime();
      const pulse = Math.sin(t * 3.5) > 0.4 ? 1.8 : 0.2;
      (beaconRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse;
    }
  });

  return (
    <group position={position}>
      {/* Base mounting pedestal */}
      <mesh position={[0, 0.1, 0]} material={materials.concreteTrim} castShadow>
        <boxGeometry args={[0.45, 0.2, 0.45]} />
      </mesh>

      {/* Vertical Mast Column */}
      <mesh position={[0, 1.4, 0]} material={materials.metalMast} castShadow>
        <cylinderGeometry args={[0.035, 0.06, 2.6, 12]} />
      </mesh>

      {/* Cross Arms */}
      <mesh position={[0, 1.8, 0]} material={materials.metalMast}>
        <boxGeometry args={[0.7, 0.03, 0.03]} />
      </mesh>
      <mesh position={[0, 2.3, 0]} material={materials.metalMast}>
        <boxGeometry args={[0.45, 0.025, 0.025]} />
      </mesh>

      {/* Microwave Dish Antenna */}
      <mesh position={[0.2, 1.8, 0]} rotation={[0, 0, Math.PI / 6]} material={materials.metalRails} castShadow>
        <cylinderGeometry args={[0.22, 0.05, 0.08, 16]} />
      </mesh>

      {/* Top Obstruction Beacon */}
      <mesh ref={beaconRef} position={[0, 2.75, 0]} material={materials.limeEmissive}>
        <sphereGeometry args={[0.05, 12, 12]} />
      </mesh>
    </group>
  );
};

/**
 * Roof Access Hatch with diamond-plate lid and grab handle.
 */
const RoofAccessHatch: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  return (
    <group position={position}>
      {/* Raised curb */}
      <mesh position={[0, 0.08, 0]} material={materials.concreteTrim} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.16, 0.9]} />
      </mesh>
      {/* Slanted metal lid */}
      <mesh position={[0, 0.17, 0]} rotation={[0.06, 0, 0]} material={materials.metalHatch} castShadow>
        <boxGeometry args={[0.94, 0.04, 0.94]} />
      </mesh>
      {/* Grab handle */}
      <mesh position={[0, 0.21, 0.32]} material={materials.metalRails}>
        <boxGeometry args={[0.22, 0.03, 0.03]} />
      </mesh>
    </group>
  );
};

/**
 * Concrete Planter Box with layered architectural greenery:
 * - Geometric boxwood shrubs
 * - Vertical ornamental grasses
 * - Cascading edge vines
 */
const PlanterBox: React.FC<{
  position: [number, number, number];
  size: [number, number, number];
  sparseFoliage?: boolean;
}> = ({ position, size, sparseFoliage = false }) => {
  const [w, h, d] = size;
  const wallThickness = 0.06;

  return (
    <group position={position}>
      {/* Concrete Planter Body */}
      <mesh position={[0, h / 2, 0]} material={materials.concreteTrim} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
      </mesh>

      {/* Dark potting soil */}
      <mesh position={[0, h - 0.03, 0]} material={materials.planterSoil} receiveShadow>
        <boxGeometry args={[w - wallThickness * 2, 0.02, d - wallThickness * 2]} />
      </mesh>

      {/* Layered Architectural Foliage */}
      <group position={[0, h, 0]}>
        {/* Main sculpted boxwood shrubs */}
        <mesh position={[-w * 0.22, 0.14, -d * 0.2]} material={materials.foliageMain} castShadow>
          <dodecahedronGeometry args={[0.19, 0]} />
        </mesh>
        <mesh position={[w * 0.24, 0.15, d * 0.12]} material={materials.foliageLight} castShadow>
          <dodecahedronGeometry args={[0.21, 0]} />
        </mesh>
        <mesh position={[0, 0.2, 0]} material={materials.foliageMain} castShadow>
          <dodecahedronGeometry args={[0.23, 0]} />
        </mesh>

        {!sparseFoliage && (
          <>
            {/* Architectural grass tufts */}
            <mesh position={[-w * 0.35, 0.18, d * 0.25]} material={materials.foliageAccent} castShadow>
              <coneGeometry args={[0.08, 0.32, 6]} />
            </mesh>
            <mesh position={[w * 0.35, 0.18, -d * 0.25]} material={materials.foliageAccent} castShadow>
              <coneGeometry args={[0.08, 0.32, 6]} />
            </mesh>

            {/* Overhanging trailing vine tendrils */}
            <mesh position={[w / 2 + 0.02, -0.07, 0]} material={materials.foliageLight} castShadow>
              <boxGeometry args={[0.035, 0.24, 0.18]} />
            </mesh>
            <mesh position={[-w / 2 - 0.02, -0.09, d * 0.18]} material={materials.foliageMain} castShadow>
              <boxGeometry args={[0.035, 0.28, 0.16]} />
            </mesh>
          </>
        )}
      </group>
    </group>
  );
};

/**
 * Rectangular Overhead Steel Pavilion Frame on Résumé rooftop.
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
            <mesh position={[0, -halfH + 0.03, 0]} material={materials.metalFrame} castShadow>
              <boxGeometry args={[colSize * 1.6, 0.06, colSize * 1.6]} />
            </mesh>
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

      {/* Intermediate Architectural Rafters */}
      {[-0.5, 0, 0.5].map((factor, i) => (
        <group key={`rafter-${i}`} position={[halfW * factor, halfH, 0]}>
          <mesh material={materials.metalFrame} castShadow>
            <boxGeometry args={[beamSize * 0.75, beamSize * 0.75, depth]} />
          </mesh>
          {/* Subtle architectural underside linear light strip */}
          <mesh position={[0, -beamSize * 0.4, 0]} material={materials.limeEmissive}>
            <boxGeometry args={[0.02, 0.01, depth * 0.85]} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

/**
 * Checkpoint beacon with glowing core, rotating energy ring, aura beam, and local bounce.
 */
interface CheckpointBeaconProps {
  position: [number, number, number];
  id: string;
}

const CheckpointBeacon: React.FC<CheckpointBeaconProps> = ({ position }) => {
  const ringRef = useRef<THREE.Mesh>(null);
  const isReview = isDeterministicReviewMode();

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

      {/* Floating Orbiting Energy Ring */}
      <mesh ref={ringRef} position={[0, 0.52, 0]} material={materials.limeBeaconRing}>
        <torusGeometry args={[0.25, 0.024, 12, 24]} />
      </mesh>

      {/* Translucent Vertical Energy Aura */}
      <mesh position={[0, 1.25, 0]} material={materials.limeBeaconAura}>
        <cylinderGeometry args={[0.085, 0.085, 1.9, 16]} />
      </mesh>

      {/* Calibrated Local Point Light (Restrained Lime, no blinding wash) */}
      <pointLight
        color="#D6FF64"
        intensity={1.5}
        distance={3.5}
        decay={2}
        position={[0, 0.6, 0]}
      />
    </group>
  );
};

/**
 * Floor route decals and tactical markings on the Start rooftop.
 */
const StartRooftopMarkings: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  return (
    <group position={position}>
      {/* Route Directional Chevrons */}
      {[
        [0, 0.4],
        [0.45, 0.0],
        [0.9, -0.45],
      ].map(([x, z], i) => (
        <group key={`arrow-${i}`} position={[x, 0, z]} rotation={[-Math.PI / 2, 0, -Math.PI / 4]}>
          <mesh material={materials.limeFloorArrows}>
            <planeGeometry args={[0.18, 0.44]} />
          </mesh>
        </group>
      ))}

      {/* Runway-Style START Boundary Mark */}
      <group position={[-0.8, 0, 0.6]} rotation={[-Math.PI / 2, 0, 0]}>
        {/* Northwest corner */}
        <mesh position={[-0.35, 0.25, 0]} material={materials.limeFloorArrows}>
          <planeGeometry args={[0.25, 0.03]} />
        </mesh>
        <mesh position={[-0.46, 0.14, 0]} material={materials.limeFloorArrows}>
          <planeGeometry args={[0.03, 0.25]} />
        </mesh>
        {/* Southeast corner */}
        <mesh position={[0.35, -0.25, 0]} material={materials.limeFloorArrows}>
          <planeGeometry args={[0.25, 0.03]} />
        </mesh>
        <mesh position={[0.46, -0.14, 0]} material={materials.limeFloorArrows}>
          <planeGeometry args={[0.03, 0.25]} />
        </mesh>
      </group>
    </group>
  );
};

/**
 * Distant Futuristic City Skyline Silhouettes.
 * Positioned in the distant negative Z horizon (receding into the atmospheric fog),
 * providing deep cinematic scale without cluttering foreground gameplay.
 */
interface DistantSkylineProps {
  isMobile?: boolean;
}

const DistantSkyline: React.FC<DistantSkylineProps> = ({ isMobile = false }) => {
  // Tower definitions [x, baseY, z, width, height, depth, hasGlassBand]
  const towers: Array<[number, number, number, number, number, number, boolean]> = [
    [-17.0, 4.0, -18.0, 4.2, 18.0, 4.2, true],
    [-11.5, 6.0, -22.0, 3.8, 22.0, 3.8, true],
    [-6.5, 3.0, -17.0, 3.2, 14.0, 3.2, false],
    [-1.0, 8.0, -25.0, 5.0, 28.0, 5.0, true],
    [5.0, 5.0, -19.0, 3.6, 17.0, 3.6, false],
    [10.5, 7.0, -23.0, 4.5, 24.0, 4.5, true],
    [15.5, 4.5, -18.0, 3.4, 16.0, 3.4, false],
    [20.0, 9.0, -26.0, 5.2, 30.0, 5.2, true],
  ];

  // In mobile tier, render half the towers to reduce draw calls
  const activeTowers = isMobile ? towers.filter((_, i) => i % 2 === 0) : towers;

  return (
    <group name="distant-skyline">
      {activeTowers.map(([x, y, z, w, h, d, hasGlass], idx) => (
        <group key={`tower-${idx}`} position={[x, y, z]}>
          {/* Main Tower Monolith */}
          <mesh material={materials.skylineTower}>
            <boxGeometry args={[w, h, d]} />
          </mesh>

          {/* Stepped Architectural Crown */}
          <mesh position={[0, h / 2 + 1.2, 0]} material={materials.skylineTower}>
            <boxGeometry args={[w * 0.7, 2.4, d * 0.7]} />
          </mesh>

          {/* Rooftop Spire */}
          <mesh position={[0, h / 2 + 3.2, 0]} material={materials.metalMast}>
            <cylinderGeometry args={[0.03, 0.08, 1.8, 8]} />
          </mesh>

          {/* Glass Facade Bands */}
          {hasGlass && (
            <mesh position={[0, 0, d / 2 + 0.015]} material={materials.skylineTowerGlass}>
              <planeGeometry args={[w * 0.8, h * 0.75]} />
            </mesh>
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
}) => {
  const {
    startRooftop,
    workRooftop,
    explorationRooftop,
    resumeRooftop,
    groundSlab,
    steppingPlatforms,
  } = COURSE_BOUNDS;

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
        hasPillars
        material={materials.concreteMain}
      />

      <BeveledPlatform
        position={startRooftop.lowerLanding.position}
        size={startRooftop.lowerLanding.size}
        hasPillars
        material={materials.concreteLight}
      />

      <Stairs
        position={startRooftop.stairs.position}
        width={startRooftop.stairs.width}
        run={startRooftop.stairs.run}
        rise={startRooftop.stairs.rise}
        steps={startRooftop.stairs.steps}
        rotationY={Math.PI}
      />

      <StartRooftopMarkings position={startRooftop.floorArrowsPosition} />

      {/* Start Rooftop Glass & Steel Balustrades */}
      <GlassBalustrade
        start={[-5.6, 1.2, 4.4]}
        end={[-5.6, 1.2, 1.6]}
      />
      <GlassBalustrade
        start={[-5.6, 1.2, 1.6]}
        end={[-3.5, 1.2, 1.6]}
      />
      <GlassBalustrade
        start={[-4.7, 0.6, 6.4]}
        end={[-2.3, 0.6, 6.4]}
      />

      {/* 2. BACK-LEFT ELEVATED WORK ROOFTOP (Checkpoint 01) */}
      <BeveledPlatform
        position={workRooftop.mainSlab.position}
        size={workRooftop.mainSlab.size}
        hasPillars
        material={materials.concreteDark}
      />

      {/* Chiller units */}
      {workRooftop.hvacUnits.map((hvac, idx) => (
        <HVACUnit key={`hvac-${idx}`} position={hvac.position} size={hvac.size} />
      ))}

      {/* Communications Mast on northwest corner */}
      <CommunicationsMast position={[-5.8, 3.8, -5.1]} />

      {/* Roof access hatch on southwest area */}
      <RoofAccessHatch position={[-2.4, 3.8, -2.1]} />

      {/* Checkpoint 01 Beacon */}
      <CheckpointBeacon
        position={workRooftop.beaconPosition}
        id={CHECKPOINTS[1].id}
      />

      {/* Work Rooftop Glass & Steel Balustrades */}
      <GlassBalustrade
        start={[-6.3, 3.8, -5.6]}
        end={[-6.3, 3.8, -1.4]}
      />
      <GlassBalustrade
        start={[-6.3, 3.8, -5.6]}
        end={[-1.7, 3.8, -5.6]}
      />
      <GlassBalustrade
        start={[-1.7, 3.8, -5.6]}
        end={[-1.7, 3.8, -3.8]}
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

      {/* Planters with architectural foliage */}
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
      />

      {/* Exploration Rooftop Glass & Steel Balustrades */}
      <GlassBalustrade
        start={[-1.6, 2.6, -2.3]}
        end={[3.6, 2.6, -2.3]}
      />
      <GlassBalustrade
        start={[-1.3, 1.8, 2.4]}
        end={[3.3, 1.8, 2.4]}
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
      />

      {/* Résumé Rooftop Glass & Steel Balustrades */}
      <GlassBalustrade
        start={[8.5, 4.2, -0.7]}
        end={[8.5, 4.2, 3.7]}
      />
      <GlassBalustrade
        start={[5.3, 4.2, -0.7]}
        end={[8.5, 4.2, -0.7]}
      />

      {/* 5. STEPPING PLATFORMS & NARROW BEAMS */}
      {steppingPlatforms.map((plat) => (
        <group key={plat.id}>
          <BeveledPlatform
            position={plat.position}
            size={plat.size}
            hasPillars={plat.hasPillar}
            material={materials.concreteLight}
            surfacePavers={false}
          />
        </group>
      ))}
    </group>
  );
};
