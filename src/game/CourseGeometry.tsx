import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
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
 * - Perimeter beveled coping stone with physical 45° chamfered edge facets and drip edge overhang
 * - Underside reveal strip creating crisp contact shadow separation
 * - Vertical structural support pylons extending toward the ground
 * - Modular precast facade panel relief seams, form-tie bolt hardware, and recessed ventilation louvers
 */
interface PlatformProps {
  position: [number, number, number];
  size: [number, number, number];
  hasPillars?: boolean;
  material?: THREE.Material;
  topTrim?: boolean;
  surfacePavers?: boolean;
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
          material={materials.concretePaver}
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

      {/* 3. Perimeter beveled coping stone with physical 45° chamfered edge facets */}
      {topTrim && (
        <group position={[0, halfH, 0]}>
          {/* North coping & chamfer */}
          <mesh
            position={[0, trimThickness / 2, -d / 2 + trimThickness / 2 - trimOverhang / 2]}
            material={materials.concreteTrim}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[w + trimOverhang * 2, trimThickness, trimThickness + trimOverhang]} />
          </mesh>
          <mesh
            position={[0, trimThickness, -d / 2 - trimOverhang + chamfer]}
            rotation={[Math.PI / 4, 0, 0]}
            material={materials.concreteTrim}
            castShadow
          >
            <boxGeometry args={[w + trimOverhang * 2, chamfer * 1.4, chamfer * 1.4]} />
          </mesh>

          {/* South coping & chamfer */}
          <mesh
            position={[0, trimThickness / 2, d / 2 - trimThickness / 2 + trimOverhang / 2]}
            material={materials.concreteTrim}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[w + trimOverhang * 2, trimThickness, trimThickness + trimOverhang]} />
          </mesh>
          <mesh
            position={[0, trimThickness, d / 2 + trimOverhang - chamfer]}
            rotation={[Math.PI / 4, 0, 0]}
            material={materials.concreteTrim}
            castShadow
          >
            <boxGeometry args={[w + trimOverhang * 2, chamfer * 1.4, chamfer * 1.4]} />
          </mesh>

          {/* West coping & chamfer */}
          <mesh
            position={[-w / 2 + trimThickness / 2 - trimOverhang / 2, trimThickness / 2, 0]}
            material={materials.concreteTrim}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[trimThickness + trimOverhang, trimThickness, d - trimThickness * 2]} />
          </mesh>
          <mesh
            position={[-w / 2 - trimOverhang + chamfer, trimThickness, 0]}
            rotation={[0, 0, Math.PI / 4]}
            material={materials.concreteTrim}
            castShadow
          >
            <boxGeometry args={[chamfer * 1.4, chamfer * 1.4, d + trimOverhang * 2]} />
          </mesh>

          {/* East coping & chamfer */}
          <mesh
            position={[w / 2 - trimThickness / 2 + trimOverhang / 2, trimThickness / 2, 0]}
            material={materials.concreteTrim}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[trimThickness + trimOverhang, trimThickness, d - trimThickness * 2]} />
          </mesh>
          <mesh
            position={[w / 2 + trimOverhang - chamfer, trimThickness, 0]}
            rotation={[0, 0, Math.PI / 4]}
            material={materials.concreteTrim}
            castShadow
          >
            <boxGeometry args={[chamfer * 1.4, chamfer * 1.4, d + trimOverhang * 2]} />
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

      {/* 4. Facade panel reveal seams, bolt anchors, and service details */}
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

          {/* Architectural Form-Tie Bolt Anchor Hardware on North/South facade */}
          {[-w * 0.35, 0, w * 0.35].map((bx, idx) => (
            <React.Fragment key={`form-tie-${idx}`}>
              <mesh position={[bx, 0.05, d / 2 + 0.005]} material={materials.metalBolt}>
                <cylinderGeometry args={[0.015, 0.015, 0.008, 8]} />
              </mesh>
              <mesh position={[bx, -0.05, d / 2 + 0.005]} material={materials.metalBolt}>
                <cylinderGeometry args={[0.015, 0.015, 0.008, 8]} />
              </mesh>
            </React.Fragment>
          ))}

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
 * - Structural base mounting spigots with visible bolt details
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
      {/* Metal Posts with Base Mounting Plates and Hardware */}
      {posts.map((offset, idx) => (
        <group key={`post-${idx}`} position={[0, 0, offset]}>
          {/* Base mounting shoe */}
          <mesh position={[0, 0.03, 0]} material={materials.metalRails} castShadow>
            <boxGeometry args={[postThickness * 1.8, 0.06, postThickness * 1.8]} />
          </mesh>
          {/* Anchor bolt fasteners */}
          <mesh position={[postThickness * 0.6, 0.065, 0]} material={materials.metalBolt}>
            <cylinderGeometry args={[0.008, 0.008, 0.015, 6]} />
          </mesh>
          <mesh position={[-postThickness * 0.6, 0.065, 0]} material={materials.metalBolt}>
            <cylinderGeometry args={[0.008, 0.008, 0.015, 6]} />
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
              position={[0, stepH + 0.015, stepZ + bullnose / 2]}
              material={materials.concreteTrim}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[width, 0.03, stepRun + bullnose]} />
            </mesh>
            {/* Recessed warm linear toe-kick accent light under each tread bullnose */}
            <mesh
              position={[0, stepH - 0.005, stepZ + stepRun / 2 + 0.01]}
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

/**
 * Realistic Industrial Rooftop HVAC Chiller Unit.
 * Features:
 * - Heavy sheet metal casing with beveled edge chamfers on all 4 upper perimeters
 * - Vibration isolator curb with corner isolation mounting plates
 * - Recessed dark intake louvers on 2 sides with distinct horizontal 3D blade planes
 * - Recessed top exhaust plenum with horizontal circular fan shroud ring and grille (axis along Y)
 * - Center aerodynamic fan spinner dome and radial spoke structure
 * - Copper/steel piping manifold with elbow flanges, disconnect switch, and status LED
 */
interface HVACUnitProps {
  position: [number, number, number];
  size: [number, number, number];
}

const HVACUnit: React.FC<HVACUnitProps> = ({ position, size }) => {
  const [w, h, d] = size;
  const curbHeight = 0.14;
  const fanRadius = Math.min(w, d) * 0.32;
  const chamfer = 0.022;

  return (
    <group position={position}>
      {/* Concrete Vibration Isolation Curb Base */}
      <mesh position={[0, curbHeight / 2, 0]} material={materials.concreteTrim} castShadow receiveShadow>
        <boxGeometry args={[w * 0.96, curbHeight, d * 0.96]} />
      </mesh>

      {/* Corner Neoprene/Steel Vibration Dampers */}
      {[-w * 0.44, w * 0.44].map((vx, i) =>
        [-d * 0.44, d * 0.44].map((vz, j) => (
          <mesh
            key={`damper-${i}-${j}`}
            position={[vx, curbHeight + 0.015, vz]}
            material={materials.metalBolt}
          >
            <cylinderGeometry args={[0.035, 0.04, 0.03, 8]} />
          </mesh>
        ))
      )}

      {/* Main Sheet Metal Housing */}
      <mesh position={[0, curbHeight + h / 2, 0]} material={materials.hvacHousing} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
      </mesh>

      {/* Physical 45° chamfered edge highlights on all 4 top casing edges */}
      <mesh
        position={[0, curbHeight + h, d / 2 - chamfer / 2]}
        rotation={[Math.PI / 4, 0, 0]}
        material={materials.metalFrame}
        castShadow
      >
        <boxGeometry args={[w * 0.98, chamfer, chamfer]} />
      </mesh>
      <mesh
        position={[0, curbHeight + h, -d / 2 + chamfer / 2]}
        rotation={[Math.PI / 4, 0, 0]}
        material={materials.metalFrame}
        castShadow
      >
        <boxGeometry args={[w * 0.98, chamfer, chamfer]} />
      </mesh>
      <mesh
        position={[-w / 2 + chamfer / 2, curbHeight + h, 0]}
        rotation={[0, 0, Math.PI / 4]}
        material={materials.metalFrame}
        castShadow
      >
        <boxGeometry args={[chamfer, chamfer, d * 0.98]} />
      </mesh>
      <mesh
        position={[w / 2 - chamfer / 2, curbHeight + h, 0]}
        rotation={[0, 0, Math.PI / 4]}
        material={materials.metalFrame}
        castShadow
      >
        <boxGeometry args={[chamfer, chamfer, d * 0.98]} />
      </mesh>

      {/* Front Intake Louver Recess & Blades */}
      <group position={[0, curbHeight + h * 0.5, d / 2 + 0.005]}>
        <mesh material={materials.hvacLouvers}>
          <planeGeometry args={[w * 0.78, h * 0.65]} />
        </mesh>
        {/* Horizontal blade slats */}
        {[-h * 0.22, -h * 0.11, 0, h * 0.11, h * 0.22].map((by, idx) => (
          <mesh
            key={`louver-f-${idx}`}
            position={[0, by, 0.012]}
            rotation={[-Math.PI / 5, 0, 0]}
            material={materials.metalFrame}
          >
            <boxGeometry args={[w * 0.76, 0.018, 0.035]} />
          </mesh>
        ))}
      </group>

      {/* Rear Intake Louver Recess & Blades */}
      <group position={[0, curbHeight + h * 0.5, -d / 2 - 0.005]} rotation={[0, Math.PI, 0]}>
        <mesh material={materials.hvacLouvers}>
          <planeGeometry args={[w * 0.78, h * 0.65]} />
        </mesh>
        {[-h * 0.22, -h * 0.11, 0, h * 0.11, h * 0.22].map((by, idx) => (
          <mesh
            key={`louver-r-${idx}`}
            position={[0, by, 0.012]}
            rotation={[-Math.PI / 5, 0, 0]}
            material={materials.metalFrame}
          >
            <boxGeometry args={[w * 0.76, 0.018, 0.035]} />
          </mesh>
        ))}
      </group>

      {/* Side Maintenance Access Panel with Hinges */}
      <group position={[w / 2 + 0.003, curbHeight + h * 0.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh material={materials.metalFrame}>
          <planeGeometry args={[d * 0.6, h * 0.65]} />
        </mesh>
        {/* Panel hinges */}
        <mesh position={[-d * 0.26, h * 0.22, 0.008]} material={materials.metalBolt}>
          <boxGeometry args={[0.02, 0.04, 0.015]} />
        </mesh>
        <mesh position={[-d * 0.26, -h * 0.22, 0.008]} material={materials.metalBolt}>
          <boxGeometry args={[0.02, 0.04, 0.015]} />
        </mesh>
        {/* Recessed turn-handle */}
        <mesh position={[d * 0.22, 0, 0.01]} material={materials.metalBolt}>
          <boxGeometry args={[0.015, 0.05, 0.015]} />
        </mesh>
      </group>

      {/* Top Exhaust Fan Shroud Ring - upright cylinder on top casing (axis aligned along Y) */}
      <mesh
        position={[0, curbHeight + h + 0.04, 0]}
        material={materials.metalRails}
        castShadow
      >
        <cylinderGeometry args={[fanRadius, fanRadius * 1.05, 0.08, 16]} />
      </mesh>

      {/* Aerodynamic Center Motor Dome / Spinner */}
      <mesh
        position={[0, curbHeight + h + 0.045, 0]}
        material={materials.metalRails}
        castShadow
      >
        <cylinderGeometry args={[fanRadius * 0.24, fanRadius * 0.28, 0.07, 16]} />
      </mesh>

      {/* Structural Fan Grille Spokes (Cross) */}
      <mesh position={[0, curbHeight + h + 0.065, 0]} material={materials.metalFrame}>
        <boxGeometry args={[fanRadius * 1.9, 0.015, 0.025]} />
      </mesh>
      <mesh position={[0, curbHeight + h + 0.065, 0]} material={materials.metalFrame}>
        <boxGeometry args={[0.025, 0.015, fanRadius * 1.9]} />
      </mesh>

      {/* Top Fan Center Hub & Recessed Grille (horizontal plane) */}
      <mesh
        position={[0, curbHeight + h + 0.02, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={materials.hvacFan}
      >
        <circleGeometry args={[fanRadius * 0.92, 16]} />
      </mesh>

      {/* Copper/Steel Refrigerant Piping Manifold with Flanges */}
      <group position={[w / 2 + 0.035, curbHeight + h * 0.35, -d * 0.2]}>
        <mesh material={materials.metalConduit}>
          <cylinderGeometry args={[0.025, 0.025, h * 0.65, 12]} />
        </mesh>
        <mesh position={[0, h * 0.25, 0]} material={materials.metalBolt}>
          <cylinderGeometry args={[0.038, 0.038, 0.02, 8]} />
        </mesh>
      </group>
      <group position={[w / 2 + 0.035, curbHeight + h * 0.35, d * 0.2]}>
        <mesh material={materials.metalConduit}>
          <cylinderGeometry args={[0.025, 0.025, h * 0.65, 12]} />
        </mesh>
        <mesh position={[0, h * 0.25, 0]} material={materials.metalBolt}>
          <cylinderGeometry args={[0.038, 0.038, 0.02, 8]} />
        </mesh>
      </group>

      {/* Electrical Disconnect Safety Switch Box with Lever */}
      <group position={[w / 2 + 0.038, curbHeight + h * 0.72, 0]}>
        <mesh material={materials.metalRails} castShadow>
          <boxGeometry args={[0.06, 0.16, 0.14]} />
        </mesh>
        {/* Disconnect lever */}
        <mesh position={[0.035, 0.02, 0.02]} rotation={[0, 0, Math.PI / 6]} material={materials.metalBolt}>
          <boxGeometry args={[0.02, 0.07, 0.015]} />
        </mesh>
      </group>

      {/* Lime Status LED indicator */}
      <mesh position={[w / 2 + 0.07, curbHeight + h * 0.74, 0]} material={materials.limeEmissive}>
        <boxGeometry args={[0.01, 0.02, 0.02]} />
      </mesh>
    </group>
  );
};

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
        {[-w * 0.2, 0, w * 0.2].map((sx, idx) => {
          const stemH = 0.45 + idx * 0.08;
          return (
            <group key={`stem-${idx}`} position={[sx, 0, (idx % 2 === 0 ? -1 : 1) * 0.08]}>
              {/* Slender vertical stem */}
              <mesh position={[0, stemH / 2, 0]} material={materials.foliageStem} castShadow>
                <cylinderGeometry args={[0.012, 0.016, stemH, 8]} />
              </mesh>
              {/* Delicate horizontal fan leaves at distinct nodes */}
              {[0.5, 0.75, 1.0].map((nodeFrac, lIdx) => (
                <group key={`fan-${lIdx}`} position={[0, stemH * nodeFrac, 0]} rotation={[0, (idx + lIdx) * 1.2, 0]}>
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
            {[-w * 0.32, w * 0.32].map((gx, gi) => (
              <group key={`grass-${gi}`} position={[gx, 0, (gi === 0 ? 0.15 : -0.15)]}>
                {[-0.2, 0, 0.2].map((rotZ, ri) => (
                  <mesh
                    key={`blade-${ri}`}
                    position={[rotZ * 0.1, 0.18, 0]}
                    rotation={[0, ri * 0.8, rotZ]}
                    material={materials.foliageAccent}
                    castShadow
                  >
                    <coneGeometry args={[0.04, 0.36, 4]} />
                  </mesh>
                ))}
              </group>
            ))}

            {/* Overhanging trailing ivy leaf tendrils over the planter rim */}
            <group position={[w / 2 + 0.015, -0.04, 0]}>
              <mesh position={[0, -0.06, 0]} material={materials.foliageLight} castShadow>
                <boxGeometry args={[0.02, 0.16, 0.12]} />
              </mesh>
              <mesh position={[0.005, -0.14, 0.02]} rotation={[0, 0, 0.15]} material={materials.foliageMain} castShadow>
                <boxGeometry args={[0.015, 0.12, 0.08]} />
              </mesh>
            </group>
          </>
        )}
      </group>
    </group>
  );
};

/**
 * Rectangular Overhead Steel Pavilion Frame on Résumé rooftop (Centerpiece).
 * Features:
 * - 4 vertical steel box columns with heavy base anchor shoes and anchor bolts
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
      {/* 4 Vertical Steel Columns with Base Anchor Plates and Bolts */}
      {[-halfW, halfW].map((x) =>
        [-halfD, halfD].map((z) => (
          <group key={`col-${x}-${z}`} position={[x, 0, z]}>
            {/* Base anchor shoe plate */}
            <mesh position={[0, -halfH + 0.03, 0]} material={materials.metalFrame} castShadow>
              <boxGeometry args={[colSize * 1.6, 0.06, colSize * 1.6]} />
            </mesh>
            {/* Anchor bolts */}
            {[-colSize * 0.6, colSize * 0.6].map((bx, bi) =>
              [-colSize * 0.6, colSize * 0.6].map((bz, bj) => (
                <mesh
                  key={`col-bolt-${bi}-${bj}`}
                  position={[bx, -halfH + 0.065, bz]}
                  material={materials.metalBolt}
                >
                  <cylinderGeometry args={[0.008, 0.008, 0.015, 6]} />
                </mesh>
              ))
            )}
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
  return (
    <group name="courtyard-architectural-junction" position={[-4.0, 1.7, -0.6]}>
      {/* 1. Integrated Glazed Curtain Wall Facade directly on the solid south face */}
      {/* Dark recessed glazing backing */}
      <mesh position={[0, 0, 0.005]} material={materials.skylineTower}>
        <planeGeometry args={[4.8, 3.1]} />
      </mesh>

      {/* Translucent reflective architectural glass curtain wall */}
      <mesh position={[0, 0, 0.015]} material={materials.glassBalustrade}>
        <planeGeometry args={[4.76, 3.06]} />
      </mesh>

      {/* Vertical structural steel mullions */}
      {[-1.8, -0.6, 0.6, 1.8].map((mx, mi) => (
        <mesh key={`mullion-${mi}`} position={[mx, 0, 0.025]} material={materials.metalFrame}>
          <boxGeometry args={[0.04, 3.1, 0.03]} />
        </mesh>
      ))}

      {/* Horizontal transom beams */}
      {[-0.75, 0.75].map((ty, ti) => (
        <mesh key={`transom-${ti}`} position={[0, ty, 0.025]} material={materials.metalFrame}>
          <boxGeometry args={[4.8, 0.04, 0.03]} />
        </mesh>
      ))}

      {/* Warm linear architectural fixture strip along curtain wall header */}
      <mesh position={[0, 1.55, 0.035]} material={materials.warmFixture}>
        <boxGeometry args={[4.6, 0.02, 0.02]} />
      </mesh>

      {/* Recessed ventilation louver bay in lower-left section */}
      <group position={[-1.2, -0.9, 0.02]}>
        <mesh material={materials.facadeLouver}>
          <planeGeometry args={[1.0, 0.65]} />
        </mesh>
        {/* Metal louver blades */}
        {[-0.22, -0.11, 0, 0.11, 0.22].map((ly, li) => (
          <mesh key={`bay-louver-${li}`} position={[0, ly, 0.015]} rotation={[-Math.PI / 6, 0, 0]} material={materials.metalRails}>
            <boxGeometry args={[0.96, 0.015, 0.03]} />
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
 * Bold, purposeful acid-lime (#D6FF64) course wayfinding markings.
 * Features broad chevrons, runway tracks, and threshold marks with high emissive contrast.
 */
const CourseWayfinding: React.FC = () => {
  return (
    <group name="course-wayfinding">
      {/* 1. START ROOFTOP: Bold, purposeful directional runway chevrons & lane tracks */}
      <group position={[-3.5, 1.204, 3.2]}>
        {/* Broad directional chevrons pointing toward stairs / landing */}
        {[-0.55, 0, 0.55].map((z, i) => (
          <group key={`start-chevron-${i}`} position={[0, 0, z]} rotation={[-Math.PI / 2, 0, Math.PI]}>
            {/* Left chevron wing */}
            <mesh position={[-0.14, 0.12, 0]} rotation={[0, 0, Math.PI / 4]} material={materials.limeFloorArrows}>
              <planeGeometry args={[0.32, 0.065]} />
            </mesh>
            {/* Right chevron wing */}
            <mesh position={[0.14, 0.12, 0]} rotation={[0, 0, -Math.PI / 4]} material={materials.limeFloorArrows}>
              <planeGeometry args={[0.32, 0.065]} />
            </mesh>
          </group>
        ))}

        {/* Dual outer runway boundary guide tracks */}
        <mesh position={[-0.85, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.limeFloorArrows}>
          <planeGeometry args={[0.045, 1.8]} />
        </mesh>
        <mesh position={[0.85, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.limeFloorArrows}>
          <planeGeometry args={[0.045, 1.8]} />
        </mesh>
      </group>

      {/* Broad Takeoff threshold bar at Start lower landing facing Stepping Platform 1 */}
      <group position={[-3.5, 0.604, 5.25]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} material={materials.limeFloorArrows}>
          <planeGeometry args={[1.2, 0.07]} />
        </mesh>
        {/* Threshold corner registration notches */}
        <mesh position={[-0.6, 0, -0.06]} rotation={[-Math.PI / 2, 0, 0]} material={materials.limeFloorArrows}>
          <planeGeometry args={[0.05, 0.12]} />
        </mesh>
        <mesh position={[0.6, 0, -0.06]} rotation={[-Math.PI / 2, 0, 0]} material={materials.limeFloorArrows}>
          <planeGeometry args={[0.05, 0.12]} />
        </mesh>
      </group>

      {/* 2. WORK ROOFTOP: Landing threshold and track to Checkpoint 1 beacon */}
      <mesh
        position={[-3.6, 3.804, -1.8]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={materials.limeFloorArrows}
      >
        <planeGeometry args={[1.1, 0.065]} />
      </mesh>
      <mesh
        position={[-4.0, 3.804, -2.8]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={materials.limeFloorArrows}
      >
        <planeGeometry args={[0.045, 1.8]} />
      </mesh>

      {/* 3. EXPLORATION ROOFTOP: Terrace guide path */}
      <mesh
        position={[0.8, 1.804, -2.6]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={materials.limeFloorArrows}
      >
        <planeGeometry args={[0.9, 0.065]} />
      </mesh>
      <mesh
        position={[0.8, 1.804, -1.8]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={materials.limeFloorArrows}
      >
        <planeGeometry args={[0.045, 1.4]} />
      </mesh>

      {/* 4. RÉSUMÉ ROOFTOP: Runway line leading under pavilion to Checkpoint 3 */}
      <mesh
        position={[4.6, 4.204, 1.8]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={materials.limeFloorArrows}
      >
        <planeGeometry args={[0.9, 0.065]} />
      </mesh>
      <mesh
        position={[5.2, 4.204, 0.5]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={materials.limeFloorArrows}
      >
        <planeGeometry args={[0.045, 2.4]} />
      </mesh>
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

          {/* Stepped Architectural Crown Setback 1 */}
          <mesh position={[0, h / 2 + 1.2, 0]} material={materials.skylineTower}>
            <boxGeometry args={[w * 0.75, 2.4, d * 0.75]} />
          </mesh>

          {/* Stepped Architectural Crown Setback 2 */}
          <mesh position={[0, h / 2 + 2.7, 0]} material={materials.skylineTower}>
            <boxGeometry args={[w * 0.48, 1.4, d * 0.48]} />
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
  isDeterministicReview = false,
}) => {
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
              surfacePavers={false}
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
