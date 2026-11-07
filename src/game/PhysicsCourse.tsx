import React from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { gameStore, useGameStore } from './gameStore';
import type { CheckpointId } from '../types/game';

export interface PhysicsCourseProps {
  children?: React.ReactNode;
  showVisuals?: boolean;
}

export function PhysicsCourse({
  children,
  showVisuals = true,
}: PhysicsCourseProps) {
  const currentCheckpointId = useGameStore((s) => s.currentCheckpointId);

  const handleCheckpointEnter = (id: CheckpointId) => {
    gameStore.getState().actions.reachCheckpoint(id);
  };

  const handleKillPlaneEnter = () => {
    gameStore.getState().actions.respawnPlayer();
  };

  return (
    <group name="physics-course">
      {/* 1. START ROOFTOP PLATFORM (Foreground-Left) */}
      <RigidBody
        type="fixed"
        position={[-3.5, 0.5, 3.5]}
        friction={0.8}
        restitution={0}
        userData={{ type: 'platform', name: 'start-rooftop' }}
      >
        <CuboidCollider args={[2.2, 0.5, 2.2]} />
        {showVisuals && (
          <mesh castShadow receiveShadow>
            <boxGeometry args={[4.4, 1.0, 4.4]} />
            <meshStandardMaterial color="#C8CAC7" roughness={0.7} metalness={0.05} />
          </mesh>
        )}
      </RigidBody>

      {/* 2. SMOOTH STAIRS RAMP 1 (Start -> Work Rooftop) */}
      {/*
        Using an inclined smooth ramp collider over stairs to eliminate capsule edge-snagging.
        Angle ~ 19.5 degrees: spans from z=1.3 (y=1.0) to z=-1.5 (y=3.0)
      */}
      <RigidBody
        type="fixed"
        position={[-4.2, 1.9, 0.8]}
        rotation={[-0.32, 0, 0]}
        friction={0.8}
        restitution={0}
        userData={{ type: 'ramp', name: 'start-to-work-ramp' }}
      >
        <CuboidCollider args={[1.2, 0.2, 2.0]} />
        {showVisuals && (
          <mesh castShadow receiveShadow>
            <boxGeometry args={[2.4, 0.4, 4.0]} />
            <meshStandardMaterial color="#C8CAC7" roughness={0.7} metalness={0.05} />
          </mesh>
        )}
      </RigidBody>

      {/* 3. WORK ROOFTOP PLATFORM (Back-Left, 01 / WORK) */}
      <RigidBody
        type="fixed"
        position={[-5.0, 2.5, -4.0]}
        friction={0.8}
        restitution={0}
        userData={{ type: 'platform', name: 'work-rooftop' }}
      >
        <CuboidCollider args={[2.5, 0.5, 2.5]} />
        {showVisuals && (
          <mesh castShadow receiveShadow>
            <boxGeometry args={[5.0, 1.0, 5.0]} />
            <meshStandardMaterial color="#C8CAC7" roughness={0.7} metalness={0.05} />
          </mesh>
        )}
      </RigidBody>

      {/* Work Rooftop HVAC Obstacle Colliders */}
      <RigidBody
        type="fixed"
        position={[-6.2, 3.5, -5.2]}
        friction={0.5}
        userData={{ type: 'obstacle', name: 'hvac-unit' }}
      >
        <CuboidCollider args={[0.7, 0.5, 0.9]} />
        {showVisuals && (
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.4, 1.0, 1.8]} />
            <meshStandardMaterial color="#7A8284" roughness={0.5} metalness={0.3} />
          </mesh>
        )}
      </RigidBody>

      {/* 4. INTERMEDIATE STEPPING BEAMS (Work -> Explorations) */}
      <RigidBody
        type="fixed"
        position={[-1.8, 3.4, -4.6]}
        friction={0.8}
        userData={{ type: 'platform', name: 'stepping-beam-1' }}
      >
        <CuboidCollider args={[0.7, 0.15, 0.5]} />
        {showVisuals && (
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.4, 0.3, 1.0]} />
            <meshStandardMaterial color="#B0B4B2" roughness={0.6} />
          </mesh>
        )}
      </RigidBody>

      <RigidBody
        type="fixed"
        position={[-0.2, 3.8, -4.8]}
        friction={0.8}
        userData={{ type: 'platform', name: 'stepping-beam-2' }}
      >
        <CuboidCollider args={[0.7, 0.15, 0.5]} />
        {showVisuals && (
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.4, 0.3, 1.0]} />
            <meshStandardMaterial color="#B0B4B2" roughness={0.6} />
          </mesh>
        )}
      </RigidBody>

      {/* 5. EXPLORATIONS ROOFTOP PLATFORM (Center, 02 / EXPLORATIONS) */}
      <RigidBody
        type="fixed"
        position={[2.0, 3.8, -5.0]}
        friction={0.8}
        restitution={0}
        userData={{ type: 'platform', name: 'explorations-rooftop' }}
      >
        <CuboidCollider args={[2.5, 0.5, 2.5]} />
        {showVisuals && (
          <mesh castShadow receiveShadow>
            <boxGeometry args={[5.0, 1.0, 5.0]} />
            <meshStandardMaterial color="#C8CAC7" roughness={0.7} metalness={0.05} />
          </mesh>
        )}
      </RigidBody>

      {/* Planter Obstacle on Explorations Roof */}
      <RigidBody
        type="fixed"
        position={[3.4, 4.6, -4.0]}
        friction={0.6}
        userData={{ type: 'obstacle', name: 'planter-box' }}
      >
        <CuboidCollider args={[0.6, 0.3, 1.2]} />
        {showVisuals && (
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.2, 0.6, 2.4]} />
            <meshStandardMaterial color="#5E6566" roughness={0.8} />
          </mesh>
        )}
      </RigidBody>

      {/* 6. SMOOTH STAIRS RAMP 2 (Explorations -> Résumé) */}
      {/* Inclined ramp from Explorations (y=4.3) to Résumé (y=5.8) */}
      <RigidBody
        type="fixed"
        position={[4.6, 5.0, -3.0]}
        rotation={[0.24, 0.45, 0]}
        friction={0.8}
        restitution={0}
        userData={{ type: 'ramp', name: 'explorations-to-resume-ramp' }}
      >
        <CuboidCollider args={[1.2, 0.2, 2.0]} />
        {showVisuals && (
          <mesh castShadow receiveShadow>
            <boxGeometry args={[2.4, 0.4, 4.0]} />
            <meshStandardMaterial color="#C8CAC7" roughness={0.7} metalness={0.05} />
          </mesh>
        )}
      </RigidBody>

      {/* 7. RÉSUMÉ ROOFTOP PLATFORM (Far Right, 03 / RÉSUMÉ) */}
      <RigidBody
        type="fixed"
        position={[7.0, 5.3, -1.0]}
        friction={0.8}
        restitution={0}
        userData={{ type: 'platform', name: 'resume-rooftop' }}
      >
        <CuboidCollider args={[2.5, 0.5, 2.5]} />
        {showVisuals && (
          <mesh castShadow receiveShadow>
            <boxGeometry args={[5.0, 1.0, 5.0]} />
            <meshStandardMaterial color="#C8CAC7" roughness={0.7} metalness={0.05} />
          </mesh>
        )}
      </RigidBody>

      {/* 8. CHECKPOINT SENSOR TRIGGERS */}
      {/* 01 / WORK SENSOR */}
      <RigidBody
        type="fixed"
        position={[-5.0, 3.5, -4.0]}
        sensor
        onIntersectionEnter={(payload) => {
          if (payload.other.rigidBodyObject?.userData?.type === 'player') {
            handleCheckpointEnter('cp-work');
          }
        }}
      >
        <CuboidCollider args={[1.2, 0.8, 1.2]} />
        {showVisuals && (
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.8, 0.8, 0.05, 32]} />
            <meshStandardMaterial
              color="#D6FF64"
              emissive="#D6FF64"
              emissiveIntensity={currentCheckpointId === 'cp-work' ? 0.9 : 0.4}
              transparent
              opacity={0.75}
            />
          </mesh>
        )}
      </RigidBody>

      {/* 02 / EXPLORATIONS SENSOR */}
      <RigidBody
        type="fixed"
        position={[2.0, 4.8, -5.0]}
        sensor
        onIntersectionEnter={(payload) => {
          if (payload.other.rigidBodyObject?.userData?.type === 'player') {
            handleCheckpointEnter('cp-explorations');
          }
        }}
      >
        <CuboidCollider args={[1.2, 0.8, 1.2]} />
        {showVisuals && (
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.8, 0.8, 0.05, 32]} />
            <meshStandardMaterial
              color="#D6FF64"
              emissive="#D6FF64"
              emissiveIntensity={currentCheckpointId === 'cp-explorations' ? 0.9 : 0.4}
              transparent
              opacity={0.75}
            />
          </mesh>
        )}
      </RigidBody>

      {/* 03 / RÉSUMÉ SENSOR */}
      <RigidBody
        type="fixed"
        position={[7.0, 6.3, -1.0]}
        sensor
        onIntersectionEnter={(payload) => {
          if (payload.other.rigidBodyObject?.userData?.type === 'player') {
            handleCheckpointEnter('cp-resume');
          }
        }}
      >
        <CuboidCollider args={[1.2, 0.8, 1.2]} />
        {showVisuals && (
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.8, 0.8, 0.05, 32]} />
            <meshStandardMaterial
              color="#D6FF64"
              emissive="#D6FF64"
              emissiveIntensity={currentCheckpointId === 'cp-resume' ? 0.9 : 0.4}
              transparent
              opacity={0.75}
            />
          </mesh>
        )}
      </RigidBody>

      {/* 9. FALL DETECTION KILL PLANE (y = -6.0) */}
      <RigidBody
        type="fixed"
        position={[0, -6.0, 0]}
        sensor
        onIntersectionEnter={(payload) => {
          if (payload.other.rigidBodyObject?.userData?.type === 'player') {
            handleKillPlaneEnter();
          }
        }}
      >
        <CuboidCollider args={[75, 0.5, 75]} />
      </RigidBody>

      {/* Custom children (e.g. Worker 2's detailed visual scene or decorations) */}
      {children}
    </group>
  );
}
