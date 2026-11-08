import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { materials } from './materials';
import { COURSE_BOUNDS, CHECKPOINTS } from './courseConfig';
import { isDeterministicReviewMode } from './quality';

/**
 * Procedural beveled architectural platform.
 * Combines a solid main mass, a perimeter edge trim to catch directional highlights,
 * and vertical support columns extending to the ground.
 */
interface PlatformProps {
  position: [number, number, number];
  size: [number, number, number];
  hasPillars?: boolean;
  material?: THREE.Material;
  topTrim?: boolean;
}

const BeveledPlatform: React.FC<PlatformProps> = ({
  position,
  size,
  hasPillars = false,
  material = materials.concreteMain,
  topTrim = true,
}) => {
  const [w, h, d] = size;
  const halfH = h / 2;
  const trimThickness = 0.06;

  // Support pillars beneath corners
  const pillarRadius = 0.16;
  const pillarHeight = position[1] - halfH;

  return (
    <group position={position}>
      {/* Main concrete slab */}
      <mesh castShadow receiveShadow material={material}>
        <boxGeometry args={[w, h, d]} />
      </mesh>

      {/* Edge trims to catch directional light reflections on seams */}
      {topTrim && (
        <group position={[0, halfH, 0]}>
          {/* North edge */}
          <mesh position={[0, trimThickness / 2, -d / 2 + trimThickness / 2]} material={materials.concreteTrim} castShadow>
            <boxGeometry args={[w, trimThickness, trimThickness]} />
          </mesh>
          {/* South edge */}
          <mesh position={[0, trimThickness / 2, d / 2 - trimThickness / 2]} material={materials.concreteTrim} castShadow>
            <boxGeometry args={[w, trimThickness, trimThickness]} />
          </mesh>
          {/* West edge */}
          <mesh position={[-w / 2 + trimThickness / 2, trimThickness / 2, 0]} material={materials.concreteTrim} castShadow>
            <boxGeometry args={[trimThickness, trimThickness, d - trimThickness * 2]} />
          </mesh>
          {/* East edge */}
          <mesh position={[w / 2 - trimThickness / 2, trimThickness / 2, 0]} material={materials.concreteTrim} castShadow>
            <boxGeometry args={[trimThickness, trimThickness, d - trimThickness * 2]} />
          </mesh>
        </group>
      )}

      {/* Vertical support pillars down to ground if elevated */}
      {hasPillars && pillarHeight > 0.2 && (
        <group position={[0, -halfH - pillarHeight / 2, 0]}>
          <mesh position={[-w * 0.38, 0, -d * 0.38]} material={materials.concretePillar} castShadow receiveShadow>
            <cylinderGeometry args={[pillarRadius, pillarRadius, pillarHeight, 16]} />
          </mesh>
          <mesh position={[w * 0.38, 0, -d * 0.38]} material={materials.concretePillar} castShadow receiveShadow>
            <cylinderGeometry args={[pillarRadius, pillarRadius, pillarHeight, 16]} />
          </mesh>
          <mesh position={[-w * 0.38, 0, d * 0.38]} material={materials.concretePillar} castShadow receiveShadow>
            <cylinderGeometry args={[pillarRadius, pillarRadius, pillarHeight, 16]} />
          </mesh>
          <mesh position={[w * 0.38, 0, d * 0.38]} material={materials.concretePillar} castShadow receiveShadow>
            <cylinderGeometry args={[pillarRadius, pillarRadius, pillarHeight, 16]} />
          </mesh>
        </group>
      )}
    </group>
  );
};

/**
 * Slender dark metal safety railing along edges.
 */
interface RailingProps {
  start: [number, number, number];
  end: [number, number, number];
  height?: number;
  postSpacing?: number;
}

const Railing: React.FC<RailingProps> = ({ start, end, height = 0.85, postSpacing = 1.2 }) => {
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

  const postThickness = 0.035;
  const railThickness = 0.03;

  return (
    <group position={[midX, baseY, midZ]} rotation={[0, angle, 0]}>
      {/* Posts */}
      {posts.map((offset, idx) => (
        <mesh
          key={idx}
          position={[0, height / 2, offset]}
          material={materials.metalRails}
          castShadow
        >
          <boxGeometry args={[postThickness, height, postThickness]} />
        </mesh>
      ))}

      {/* Top handrail */}
      <mesh
        position={[0, height, 0]}
        material={materials.metalRails}
        castShadow
      >
        <boxGeometry args={[railThickness, railThickness, length]} />
      </mesh>

      {/* Mid safety bar */}
      <mesh
        position={[0, height * 0.5, 0]}
        material={materials.metalRails}
        castShadow
      >
        <boxGeometry args={[railThickness * 0.8, railThickness * 0.8, length]} />
      </mesh>
    </group>
  );
};

/**
 * Architectural concrete staircase.
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

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {Array.from({ length: steps }).map((_, i) => {
        const stepH = (i + 1) * stepRise;
        const stepZ = -run / 2 + (i + 0.5) * stepRun;
        return (
          <mesh
            key={i}
            position={[0, stepH / 2, stepZ]}
            material={materials.concreteLight}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[width, stepH, stepRun]} />
          </mesh>
        );
      })}
    </group>
  );
};

/**
 * Detailed rooftop HVAC unit with louvers, fan exhaust cowl, and conduit.
 */
const HVACUnit: React.FC<{ position: [number, number, number]; size: [number, number, number] }> = ({
  position,
  size,
}) => {
  const [w, h, d] = size;
  const curbHeight = 0.12;

  return (
    <group position={position}>
      {/* Concrete mounting curb */}
      <mesh position={[0, curbHeight / 2, 0]} material={materials.concreteTrim} castShadow receiveShadow>
        <boxGeometry args={[w * 1.05, curbHeight, d * 1.05]} />
      </mesh>

      {/* Main metal housing */}
      <mesh position={[0, curbHeight + h / 2, 0]} material={materials.hvacHousing} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
      </mesh>

      {/* Front louver slats */}
      <mesh position={[0, curbHeight + h * 0.45, d / 2 + 0.01]} material={materials.hvacLouvers}>
        <boxGeometry args={[w * 0.85, h * 0.65, 0.02]} />
      </mesh>

      {/* Back louver slats */}
      <mesh position={[0, curbHeight + h * 0.45, -d / 2 - 0.01]} material={materials.hvacLouvers}>
        <boxGeometry args={[w * 0.85, h * 0.65, 0.02]} />
      </mesh>

      {/* Top fan exhaust cylinder cowl */}
      <mesh position={[0, curbHeight + h + 0.08, 0]} material={materials.hvacFan} castShadow>
        <cylinderGeometry args={[w * 0.28, w * 0.32, 0.16, 24]} />
      </mesh>

      {/* Top protective fan grill */}
      <mesh position={[0, curbHeight + h + 0.165, 0]} material={materials.metalRails}>
        <cylinderGeometry args={[w * 0.27, w * 0.27, 0.01, 16]} />
      </mesh>

      {/* External electrical conduit pipe */}
      <mesh position={[w / 2 + 0.03, curbHeight + h * 0.3, 0]} material={materials.metalRails}>
        <boxGeometry args={[0.04, h * 0.5, 0.04]} />
      </mesh>
    </group>
  );
};

/**
 * Concrete planter with sparse hanging greenery.
 */
const PlanterBox: React.FC<{ position: [number, number, number]; size: [number, number, number] }> = ({
  position,
  size,
}) => {
  const [w, h, d] = size;
  const wallThickness = 0.06;

  return (
    <group position={position}>
      {/* Concrete planter outer rim */}
      <mesh position={[0, h / 2, 0]} material={materials.concreteTrim} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
      </mesh>

      {/* Dark potting soil */}
      <mesh position={[0, h - 0.04, 0]} material={materials.planterSoil} receiveShadow>
        <boxGeometry args={[w - wallThickness * 2, 0.02, d - wallThickness * 2]} />
      </mesh>

      {/* Sparse stylized low-poly foliage */}
      <group position={[0, h, 0]}>
        {/* Main shrub clusters */}
        <mesh position={[-w * 0.2, 0.12, -d * 0.2]} material={materials.foliageMain} castShadow>
          <dodecahedronGeometry args={[0.18, 0]} />
        </mesh>
        <mesh position={[w * 0.22, 0.14, d * 0.1]} material={materials.foliageLight} castShadow>
          <dodecahedronGeometry args={[0.2, 0]} />
        </mesh>
        <mesh position={[0, 0.18, 0]} material={materials.foliageMain} castShadow>
          <dodecahedronGeometry args={[0.22, 0]} />
        </mesh>
        {/* Subtle hanging foliage tendrils spilling over the edge */}
        <mesh position={[w / 2 + 0.02, -0.06, 0]} material={materials.foliageLight} castShadow>
          <boxGeometry args={[0.04, 0.22, 0.16]} />
        </mesh>
        <mesh position={[-w / 2 - 0.02, -0.08, d * 0.15]} material={materials.foliageMain} castShadow>
          <boxGeometry args={[0.04, 0.26, 0.14]} />
        </mesh>
      </group>
    </group>
  );
};

/**
 * Rectangular overhead steel frame on Résumé rooftop.
 */
const OverheadSteelFrame: React.FC<{
  center: [number, number, number];
  width: number;
  height: number;
  depth: number;
}> = ({ center, width, height, depth }) => {
  const [cx, cy, cz] = center;
  const postThickness = 0.08;
  const beamThickness = 0.08;
  const halfW = width / 2;
  const halfH = height / 2;
  const halfD = depth / 2;

  return (
    <group position={[cx, cy, cz]}>
      {/* 4 Vertical steel columns */}
      <mesh position={[-halfW, 0, -halfD]} material={materials.metalFrame} castShadow>
        <boxGeometry args={[postThickness, height, postThickness]} />
      </mesh>
      <mesh position={[halfW, 0, -halfD]} material={materials.metalFrame} castShadow>
        <boxGeometry args={[postThickness, height, postThickness]} />
      </mesh>
      <mesh position={[-halfW, 0, halfD]} material={materials.metalFrame} castShadow>
        <boxGeometry args={[postThickness, height, postThickness]} />
      </mesh>
      <mesh position={[halfW, 0, halfD]} material={materials.metalFrame} castShadow>
        <boxGeometry args={[postThickness, height, postThickness]} />
      </mesh>

      {/* Top perimeter rectangular box header beams */}
      <mesh position={[0, halfH, -halfD]} material={materials.metalFrame} castShadow>
        <boxGeometry args={[width, beamThickness, beamThickness]} />
      </mesh>
      <mesh position={[0, halfH, halfD]} material={materials.metalFrame} castShadow>
        <boxGeometry args={[width, beamThickness, beamThickness]} />
      </mesh>
      <mesh position={[-halfW, halfH, 0]} material={materials.metalFrame} castShadow>
        <boxGeometry args={[beamThickness, beamThickness, depth]} />
      </mesh>
      <mesh position={[halfW, halfH, 0]} material={materials.metalFrame} castShadow>
        <boxGeometry args={[beamThickness, beamThickness, depth]} />
      </mesh>

      {/* Intermediate rafters */}
      <mesh position={[-halfW * 0.33, halfH, 0]} material={materials.metalFrame} castShadow>
        <boxGeometry args={[beamThickness * 0.7, beamThickness * 0.7, depth]} />
      </mesh>
      <mesh position={[halfW * 0.33, halfH, 0]} material={materials.metalFrame} castShadow>
        <boxGeometry args={[beamThickness * 0.7, beamThickness * 0.7, depth]} />
      </mesh>
    </group>
  );
};

/**
 * Checkpoint beacon with glowing core and floating animated pulse ring.
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
      ringRef.current.rotation.y = t * 1.2;
      ringRef.current.position.y = 0.5 + Math.sin(t * 2.5) * 0.08;
    }
  });

  return (
    <group position={position}>
      {/* Plinth */}
      <mesh position={[0, 0.06, 0]} material={materials.concreteTrim} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.35, 0.12, 16]} />
      </mesh>

      {/* Inner glowing core pillar */}
      <mesh position={[0, 0.45, 0]} material={materials.limeBeaconCore}>
        <cylinderGeometry args={[0.07, 0.07, 0.7, 16]} />
      </mesh>

      {/* Floating pulsating ring */}
      <mesh ref={ringRef} position={[0, 0.5, 0]} material={materials.limeBeaconRing}>
        <torusGeometry args={[0.24, 0.025, 12, 24]} />
      </mesh>

      {/* Translucent vertical energy beam */}
      <mesh position={[0, 1.2, 0]} material={materials.limeBeaconAura}>
        <cylinderGeometry args={[0.09, 0.09, 1.8, 16]} />
      </mesh>

      {/* Subtle local point light casting lime bounce on concrete */}
      <pointLight color="#D6FF64" intensity={1.5} distance={3.5} decay={2} position={[0, 0.6, 0]} />
    </group>
  );
};

/**
 * Floor route decals and arrows on the Start rooftop.
 */
const StartRooftopMarkings: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  return (
    <group position={position}>
      {/* Route arrow 1 pointing towards stairs/course */}
      <group position={[0, 0, 0.4]} rotation={[-Math.PI / 2, 0, -Math.PI / 4]}>
        <mesh material={materials.limeFloorArrows}>
          <planeGeometry args={[0.18, 0.45]} />
        </mesh>
      </group>

      {/* Route arrow 2 */}
      <group position={[0.45, 0, 0.0]} rotation={[-Math.PI / 2, 0, -Math.PI / 4]}>
        <mesh material={materials.limeFloorArrows}>
          <planeGeometry args={[0.18, 0.45]} />
        </mesh>
      </group>

      {/* Route arrow 3 */}
      <group position={[0.9, 0, -0.45]} rotation={[-Math.PI / 2, 0, -Math.PI / 4]}>
        <mesh material={materials.limeFloorArrows}>
          <planeGeometry args={[0.18, 0.45]} />
        </mesh>
      </group>

      {/* Stylized START floor frame mark */}
      <group position={[-0.8, 0, 0.6]} rotation={[-Math.PI / 2, 0, 0]}>
        {/* Corner framing brackets */}
        <mesh position={[-0.35, 0.25, 0]} material={materials.limeFloorArrows}>
          <planeGeometry args={[0.25, 0.03]} />
        </mesh>
        <mesh position={[-0.46, 0.14, 0]} material={materials.limeFloorArrows}>
          <planeGeometry args={[0.03, 0.25]} />
        </mesh>
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
 * Complete Course Geometry component.
 * Recreates all architectural landmarks:
 * - Starting rooftop with stairs, painted floor arrows, START marking
 * - Back-left elevated work rooftop with HVAC units, louvers, Checkpoint 01 beacon
 * - Central exploration rooftop with stairs, planters with sparse greenery, Checkpoint 02 beacon
 * - Far-right elevated résumé rooftop with stairs, rectangular overhead steel frame, Checkpoint 03 beacon
 * - Stepping platforms, narrow beams, concrete ramps, slender safety rails, vertical support pillars, and dark ground slab
 * - Bevels and architectural seams on edges to catch the directional light nicely
 */
export const CourseGeometry: React.FC = () => {
  const { startRooftop, workRooftop, explorationRooftop, resumeRooftop, groundSlab, steppingPlatforms } =
    COURSE_BOUNDS;

  return (
    <group name="course-geometry">
      {/* =========================================================================
          DARK GROUND SLAB (Seamless blend into page background #101414)
          ========================================================================= */}
      <mesh
        position={groundSlab.position}
        receiveShadow
        material={materials.groundSlab}
      >
        <boxGeometry args={groundSlab.size} />
      </mesh>

      {/* Subtle ground slab seam lines for scale */}
      {[-8, -4, 0, 4, 8, 12].map((x) => (
        <mesh key={`grid-x-${x}`} position={[x, 0.005, 0.5]} rotation={[-Math.PI / 2, 0, 0]} material={materials.groundGridLine}>
          <planeGeometry args={[0.03, 24]} />
        </mesh>
      ))}
      {[-8, -4, 0, 4, 8].map((z) => (
        <mesh key={`grid-z-${z}`} position={[1.0, 0.005, z]} rotation={[-Math.PI / 2, 0, 0]} material={materials.groundGridLine}>
          <planeGeometry args={[28, 0.03]} />
        </mesh>
      ))}

      {/* =========================================================================
          1. FOREGROUND-LEFT STARTING ROOFTOP
          ========================================================================= */}
      {/* Main Slab */}
      <BeveledPlatform
        position={startRooftop.mainSlab.position}
        size={startRooftop.mainSlab.size}
        hasPillars
        material={materials.concreteMain}
      />

      {/* Lower Landing Slab */}
      <BeveledPlatform
        position={startRooftop.lowerLanding.position}
        size={startRooftop.lowerLanding.size}
        hasPillars
        material={materials.concreteLight}
      />

      {/* Stairs connecting Lower Landing to Main Slab */}
      <Stairs
        position={startRooftop.stairs.position}
        width={startRooftop.stairs.width}
        run={startRooftop.stairs.run}
        rise={startRooftop.stairs.rise}
        steps={startRooftop.stairs.steps}
        rotationY={Math.PI}
      />

      {/* Painted lime floor arrows and START marking */}
      <StartRooftopMarkings position={startRooftop.floorArrowsPosition} />

      {/* Safety Railings along start rooftop outer edges */}
      <Railing
        start={[-5.6, 1.2, 5.4]}
        end={[-5.6, 1.2, 1.6]}
      />
      <Railing
        start={[-5.6, 1.2, 1.6]}
        end={[-3.5, 1.2, 1.6]}
      />
      <Railing
        start={[-4.7, 0.6, 6.3]}
        end={[-2.3, 0.6, 6.3]}
      />

      {/* =========================================================================
          2. BACK-LEFT ELEVATED WORK ROOFTOP (Checkpoint 01)
          ========================================================================= */}
      {/* Main elevated slab */}
      <BeveledPlatform
        position={workRooftop.mainSlab.position}
        size={workRooftop.mainSlab.size}
        hasPillars
        material={materials.concreteDark}
      />

      {/* HVAC Units on maintenance equipment curbs */}
      {workRooftop.hvacUnits.map((hvac, idx) => (
        <HVACUnit key={`hvac-${idx}`} position={hvac.position} size={hvac.size} />
      ))}

      {/* Checkpoint 01 Beacon */}
      <CheckpointBeacon
        position={workRooftop.beaconPosition}
        id={CHECKPOINTS[1].id}
      />

      {/* Safety Railings around work rooftop */}
      <Railing
        start={[-6.3, 3.8, -5.6]}
        end={[-6.3, 3.8, -1.4]}
      />
      <Railing
        start={[-6.3, 3.8, -5.6]}
        end={[-1.7, 3.8, -5.6]}
      />
      <Railing
        start={[-1.7, 3.8, -5.6]}
        end={[-1.7, 3.8, -3.8]}
      />

      {/* =========================================================================
          3. CENTRAL EXPLORATION ROOFTOP (Checkpoint 02)
          ========================================================================= */}
      {/* Upper Terrace */}
      <BeveledPlatform
        position={explorationRooftop.upperTerrace.position}
        size={explorationRooftop.upperTerrace.size}
        hasPillars
        material={materials.concreteMain}
      />

      {/* Lower Terrace */}
      <BeveledPlatform
        position={explorationRooftop.lowerTerrace.position}
        size={explorationRooftop.lowerTerrace.size}
        hasPillars
        material={materials.concreteLight}
      />

      {/* Connecting Staircase */}
      <Stairs
        position={explorationRooftop.stairs.position}
        width={explorationRooftop.stairs.width}
        run={explorationRooftop.stairs.run}
        rise={explorationRooftop.stairs.rise}
        steps={explorationRooftop.stairs.steps}
        rotationY={Math.PI}
      />

      {/* Planters with sparse hanging greenery */}
      {explorationRooftop.planters.map((planter, idx) => (
        <PlanterBox key={`planter-${idx}`} position={planter.position} size={planter.size} />
      ))}

      {/* Checkpoint 02 Beacon */}
      <CheckpointBeacon
        position={explorationRooftop.beaconPosition}
        id={CHECKPOINTS[2].id}
      />

      {/* Railings on upper and lower terraces */}
      <Railing
        start={[-1.6, 2.6, -2.3]}
        end={[3.6, 2.6, -2.3]}
      />
      <Railing
        start={[-1.3, 1.8, 2.4]}
        end={[3.3, 1.8, 2.4]}
      />

      {/* =========================================================================
          4. FAR-RIGHT ELEVATED RÉSUMÉ ROOFTOP (Checkpoint 03)
          ========================================================================= */}
      {/* Main elevated slab */}
      <BeveledPlatform
        position={resumeRooftop.mainSlab.position}
        size={resumeRooftop.mainSlab.size}
        hasPillars
        material={materials.concreteDark}
      />

      {/* Rectangular overhead steel frame */}
      <OverheadSteelFrame
        center={resumeRooftop.overheadFrame.center}
        width={resumeRooftop.overheadFrame.width}
        height={resumeRooftop.overheadFrame.height}
        depth={resumeRooftop.overheadFrame.depth}
      />

      {/* Access Stairs */}
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

      {/* Safety Railings along edge */}
      <Railing
        start={[8.5, 4.2, -0.7]}
        end={[8.5, 4.2, 3.7]}
      />
      <Railing
        start={[3.9, 4.2, -0.7]}
        end={[8.5, 4.2, -0.7]}
      />

      {/* =========================================================================
          5. STEPPING PLATFORMS & NARROW BEAMS (Connective tissue)
          ========================================================================= */}
      {steppingPlatforms.map((plat) => (
        <group key={plat.id}>
          <BeveledPlatform
            position={plat.position}
            size={plat.size}
            hasPillars={plat.hasPillar}
            material={materials.concreteLight}
          />
        </group>
      ))}
    </group>
  );
};
