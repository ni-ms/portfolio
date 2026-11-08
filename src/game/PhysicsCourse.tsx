import React from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { gameStore } from './gameStore';
import { COURSE_BOUNDS, CHECKPOINTS } from './courseConfig';
import type { CheckpointId } from '../types/game';

export interface PhysicsCourseProps {
  children?: React.ReactNode;
  showVisuals?: boolean;
}

export function PhysicsCourse({
  children,
  showVisuals: _showVisuals = false,
}: PhysicsCourseProps) {
  const handleCheckpointEnter = (id: CheckpointId) => {
    gameStore.getState().actions.reachCheckpoint(id);
  };

  const handleKillPlaneEnter = () => {
    gameStore.getState().actions.respawnPlayer();
  };

  const bounds = COURSE_BOUNDS;

  return (
    <group name="physics-course">
      {/* 0. GROUND SLAB BASE */}
      <RigidBody
        type="fixed"
        position={bounds.groundSlab.position}
        friction={0.8}
        restitution={0}
        userData={{ type: 'ground', name: 'ground-slab' }}
      >
        <CuboidCollider args={[bounds.groundSlab.size[0] / 2, bounds.groundSlab.size[1] / 2, bounds.groundSlab.size[2] / 2]} />
      </RigidBody>

      {/* 1. START ROOFTOP (Foreground-Left) */}
      <RigidBody
        type="fixed"
        position={bounds.startRooftop.mainSlab.position}
        friction={0.8}
        restitution={0}
        userData={{ type: 'platform', name: 'start-rooftop-main' }}
      >
        <CuboidCollider args={[bounds.startRooftop.mainSlab.size[0] / 2, bounds.startRooftop.mainSlab.size[1] / 2, bounds.startRooftop.mainSlab.size[2] / 2]} />
      </RigidBody>

      {/* Start Lower Landing */}
      <RigidBody
        type="fixed"
        position={bounds.startRooftop.lowerLanding.position}
        friction={0.8}
        restitution={0}
        userData={{ type: 'platform', name: 'start-lower-landing' }}
      >
        <CuboidCollider args={[bounds.startRooftop.lowerLanding.size[0] / 2, bounds.startRooftop.lowerLanding.size[1] / 2, bounds.startRooftop.lowerLanding.size[2] / 2]} />
      </RigidBody>

      {/* Start Stairs Smooth Ramp */}
      <RigidBody
        type="fixed"
        position={bounds.startRooftop.ramp.position}
        rotation={bounds.startRooftop.ramp.rotation}
        friction={0.0}
        restitution={0}
        userData={{ type: 'ramp', name: bounds.startRooftop.ramp.name }}
      >
        <CuboidCollider args={bounds.startRooftop.ramp.colliderArgs} />
      </RigidBody>

      {/* 2. WORK ROOFTOP (Back-Left, 01 / WORK) */}
      <RigidBody
        type="fixed"
        position={bounds.workRooftop.mainSlab.position}
        friction={0.8}
        restitution={0}
        userData={{ type: 'platform', name: 'work-rooftop-main' }}
      >
        <CuboidCollider args={[bounds.workRooftop.mainSlab.size[0] / 2, bounds.workRooftop.mainSlab.size[1] / 2, bounds.workRooftop.mainSlab.size[2] / 2]} />
      </RigidBody>

      {/* Work Rooftop HVAC Obstacles */}
      {bounds.workRooftop.hvacUnits.map((hvac, i) => (
        <RigidBody
          key={`hvac-${i}`}
          type="fixed"
          position={[hvac.position[0], hvac.position[1] + hvac.size[1] / 2, hvac.position[2]]}
          friction={0.5}
          userData={{ type: 'obstacle', name: `hvac-${i}` }}
        >
          <CuboidCollider args={[hvac.size[0] / 2, hvac.size[1] / 2, hvac.size[2] / 2]} />
        </RigidBody>
      ))}

      {/* 3. CENTRAL EXPLORATION ROOFTOP (02 / EXPLORATIONS) */}
      <RigidBody
        type="fixed"
        position={bounds.explorationRooftop.upperTerrace.position}
        friction={0.8}
        restitution={0}
        userData={{ type: 'platform', name: 'explorations-upper-terrace' }}
      >
        <CuboidCollider args={[bounds.explorationRooftop.upperTerrace.size[0] / 2, bounds.explorationRooftop.upperTerrace.size[1] / 2, bounds.explorationRooftop.upperTerrace.size[2] / 2]} />
      </RigidBody>

      <RigidBody
        type="fixed"
        position={bounds.explorationRooftop.lowerTerrace.position}
        friction={0.8}
        restitution={0}
        userData={{ type: 'platform', name: 'explorations-lower-terrace' }}
      >
        <CuboidCollider args={[bounds.explorationRooftop.lowerTerrace.size[0] / 2, bounds.explorationRooftop.lowerTerrace.size[1] / 2, bounds.explorationRooftop.lowerTerrace.size[2] / 2]} />
      </RigidBody>

      {/* Exploration Stairs Ramp */}
      <RigidBody
        type="fixed"
        position={bounds.explorationRooftop.ramp.position}
        rotation={bounds.explorationRooftop.ramp.rotation}
        friction={0.0}
        restitution={0}
        userData={{ type: 'ramp', name: bounds.explorationRooftop.ramp.name }}
      >
        <CuboidCollider args={bounds.explorationRooftop.ramp.colliderArgs} />
      </RigidBody>

      {/* Planters on Exploration Roof */}
      {bounds.explorationRooftop.planters.map((planter, i) => (
        <RigidBody
          key={`planter-${i}`}
          type="fixed"
          position={[planter.position[0], planter.position[1] + planter.size[1] / 2, planter.position[2]]}
          friction={0.6}
          userData={{ type: 'obstacle', name: `planter-${i}` }}
        >
          <CuboidCollider args={[planter.size[0] / 2, planter.size[1] / 2, planter.size[2] / 2]} />
        </RigidBody>
      ))}

      {/* 4. RÉSUMÉ ROOFTOP (Far-Right, 03 / RÉSUMÉ) */}
      <RigidBody
        type="fixed"
        position={bounds.resumeRooftop.mainSlab.position}
        friction={0.8}
        restitution={0}
        userData={{ type: 'platform', name: 'resume-rooftop-main' }}
      >
        <CuboidCollider args={[bounds.resumeRooftop.mainSlab.size[0] / 2, bounds.resumeRooftop.mainSlab.size[1] / 2, bounds.resumeRooftop.mainSlab.size[2] / 2]} />
      </RigidBody>

      {/* Résumé Stairs Ramp */}
      <RigidBody
        type="fixed"
        position={bounds.resumeRooftop.ramp.position}
        rotation={bounds.resumeRooftop.ramp.rotation}
        friction={0.0}
        restitution={0}
        userData={{ type: 'ramp', name: bounds.resumeRooftop.ramp.name }}
      >
        <CuboidCollider args={bounds.resumeRooftop.ramp.colliderArgs} />
      </RigidBody>

      {/* 5. STEPPING PLATFORMS & CONNECTING BEAMS */}
      {bounds.steppingPlatforms.map((plat) => (
        <RigidBody
          key={plat.id}
          type="fixed"
          position={plat.position}
          friction={0.8}
          userData={{ type: 'platform', name: plat.id }}
        >
          <CuboidCollider args={[plat.size[0] / 2, plat.size[1] / 2, plat.size[2] / 2]} />
        </RigidBody>
      ))}

      {/* 6. CHECKPOINT SENSOR TRIGGERS */}
      {CHECKPOINTS.map((cp) => (
        <RigidBody
          key={`sensor-${cp.id}`}
          type="fixed"
          position={cp.position}
          sensor
          onIntersectionEnter={() => handleCheckpointEnter(cp.id)}
          userData={{ type: 'sensor', checkpointId: cp.id }}
        >
          <CuboidCollider args={[1.4, 1.4, 1.4]} />
        </RigidBody>
      ))}

      {/* 7. FALL KILL PLANE (Below entire diorama at Y = -4.0) */}
      <RigidBody
        type="fixed"
        position={[0, -4.0, 0]}
        sensor
        onIntersectionEnter={handleKillPlaneEnter}
        userData={{ type: 'kill-plane' }}
      >
        <CuboidCollider args={[50, 0.5, 50]} />
      </RigidBody>

      {children}
    </group>
  );
}
