import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  RigidBody,
  RapierRigidBody,
  CapsuleCollider,
  useRapier,
} from '@react-three/rapier';
import * as THREE from 'three';
import { gameStore, useGameStore } from './gameStore';
import { normalizeMovementInput, JumpController } from './controllerUtils';
import { updateLivePlayerTransform } from './playerTransform';

export interface PlayerControllerProps {
  initialPosition?: [number, number, number];
  moveSpeed?: number;
  jumpVelocity?: number;
  playerRef?: React.RefObject<THREE.Object3D | null>;
}

export function PlayerController({
  initialPosition,
  moveSpeed = 5.2,
  jumpVelocity = 6.4,
  playerRef,
}: PlayerControllerProps) {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const visualGroupRef = useRef<THREE.Group>(null);
  const currentRotationY = useRef(0);

  const rapier = useRapier();
  const jumpController = useMemo(() => new JumpController(100, 120, 200), []);

  const checkpoints = useGameStore((s) => s.checkpoints);
  const currentCheckpointId = useGameStore((s) => s.currentCheckpointId);

  // Spawn position from initialPosition prop or current checkpoint
  const activeSpawn = useMemo(() => {
    if (initialPosition) return initialPosition;
    const cp = checkpoints.find((c) => c.id === currentCheckpointId) || checkpoints[0];
    return cp.spawnPosition;
  }, [initialPosition, checkpoints, currentCheckpointId]);

  // Initial placement & respawn on mount if needed
  useEffect(() => {
    if (rigidBodyRef.current) {
      rigidBodyRef.current.setTranslation(
        { x: activeSpawn[0], y: activeSpawn[1], z: activeSpawn[2] },
        true
      );
      rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      rigidBodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
      updateLivePlayerTransform(
        activeSpawn[0],
        activeSpawn[1],
        activeSpawn[2],
        0,
        0,
        0,
        0,
        true
      );
    }
  }, [activeSpawn]);

  useFrame((state, delta) => {
    const rb = rigidBodyRef.current;
    if (!rb) return;

    const safeDelta = Math.min(delta, 0.05);
    const now = performance.now();
    const store = gameStore.getState();

    // 1. Check for manual or kill-plane respawn request
    if (store.isRespawning) {
      const targetCp =
        store.checkpoints.find((c) => c.id === store.currentCheckpointId) ||
        store.checkpoints[0];
      const [sx, sy, sz] = targetCp.spawnPosition;

      rb.setTranslation({ x: sx, y: sy, z: sz }, true);
      rb.setLinvel({ x: 0, y: 0, z: 0 }, true);
      rb.setAngvel({ x: 0, y: 0, z: 0 }, true);

      jumpController.reset();
      updateLivePlayerTransform(sx, sy, sz, 0, 0, 0, currentRotationY.current, true);
      if (playerRef?.current) {
        playerRef.current.position.set(sx, sy, sz);
      }
      gameStore.setState({ isRespawning: false, isGrounded: true });
      return;
    }

    const pos = rb.translation();

    // 2. Kill plane check (fallback if below course)
    if (pos.y < -5.0) {
      store.actions.respawnPlayer();
      return;
    }

    // 3. Ground detection via Rapier downward raycast
    // Ray origin from center of capsule down towards feet
    const rayOrigin = { x: pos.x, y: pos.y + 0.35, z: pos.z };
    const rayDir = { x: 0, y: -1, z: 0 };
    const maxRayDistance = 0.58; // 0.35 to capsule bottom + 0.23 ground margin for ramps/stairs

    let isGrounded = false;
    try {
      const ray = new rapier.rapier.Ray(rayOrigin, rayDir);
      // Cast ray ignoring the player's own collider
      const hit = rapier.world.castRay(
        ray,
        maxRayDistance,
        true,
        undefined,
        undefined,
        undefined,
        rb
      );
      if (hit && hit.timeOfImpact <= maxRayDistance) {
        isGrounded = true;
      }
    } catch {
      // Fallback: check linear velocity Y near 0 if raycast fails
      const linvel = rb.linvel();
      isGrounded = Math.abs(linvel.y) < 0.15;
    }

    // Update jump controller and game store
    jumpController.updateGrounded(isGrounded, now);
    if (store.isGrounded !== isGrounded) {
      gameStore.setState({ isGrounded });
    }

    // 4. Edge-triggered input processing
    const input = store.input;
    jumpController.updateJumpInput(Boolean(input.jump), now);

    // 5. Jump execution
    const currentLinvel = rb.linvel();
    let newVy = currentLinvel.y;

    if (jumpController.canJump(now, isGrounded)) {
      jumpController.executeJump(now);
      newVy = jumpVelocity;
    }

    // 6. Camera-relative horizontal movement
    const camDir = new THREE.Vector3();
    state.camera.getWorldDirection(camDir);
    camDir.y = 0;
    camDir.normalize();

    const camRight = new THREE.Vector3();
    camRight.crossVectors(camDir, new THREE.Vector3(0, 1, 0)).normalize();

    const norm = normalizeMovementInput(input);
    const moveDir = new THREE.Vector3();
    // norm.z: forward is -1, backward is +1
    moveDir.addScaledVector(camDir, -norm.z);
    // norm.x: right is +1, left is -1
    moveDir.addScaledVector(camRight, norm.x);

    if (moveDir.lengthSq() > 0.001) {
      moveDir.normalize();
    }

    // Responsive acceleration with smooth stairs/ground damping
    const targetVx = moveDir.x * moveSpeed * (norm.isMoving ? 1 : 0);
    const targetVz = moveDir.z * moveSpeed * (norm.isMoving ? 1 : 0);

    const accel = isGrounded ? 22 : 9; // High ground friction/responsiveness, smooth air drift
    const newVx = THREE.MathUtils.damp(currentLinvel.x, targetVx, accel, safeDelta);
    const newVz = THREE.MathUtils.damp(currentLinvel.z, targetVz, accel, safeDelta);

    rb.setLinvel({ x: newVx, y: newVy, z: newVz }, true);

    // 7. Visual character orientation
    if (visualGroupRef.current && norm.isMoving && moveDir.lengthSq() > 0.01) {
      const targetAngle = Math.atan2(moveDir.x, moveDir.z);
      currentRotationY.current = THREE.MathUtils.damp(
        currentRotationY.current,
        targetAngle,
        15,
        safeDelta
      );
      visualGroupRef.current.rotation.y = currentRotationY.current;
    }

    // 8. Update live player transform for CameraRig and diagnostics
    updateLivePlayerTransform(
      pos.x,
      pos.y,
      pos.z,
      newVx,
      newVy,
      newVz,
      currentRotationY.current,
      isGrounded
    );

    if (playerRef?.current) {
      playerRef.current.position.set(pos.x, pos.y, pos.z);
    }
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      colliders={false}
      type="dynamic"
      position={activeSpawn}
      enabledRotations={[false, false, false]}
      friction={0.2}
      restitution={0}
      linearDamping={0.6}
      angularDamping={1.0}
      userData={{ type: 'player' }}
    >
      {/* 
        Capsule collider: height ~0.8m, radius ~0.2m.
        In Rapier, args are [halfHeight, radius].
        Total height = 2 * halfHeight + 2 * radius = 2*(0.2) + 2*(0.2) = 0.8m.
      */}
      <CapsuleCollider args={[0.2, 0.2]} position={[0, 0.4, 0]} />

      {/* Lightweight stylized faceless avatar */}
      <group ref={visualGroupRef}>
        {/* Main body capsule: matte warm off-white */}
        <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
          <capsuleGeometry args={[0.2, 0.4, 8, 16]} />
          <meshStandardMaterial
            color="#F2F1EA"
            roughness={0.3}
            metalness={0.05}
          />
        </mesh>

        {/* Visor / Runner Headband: Electric Acid Lime #D6FF64 */}
        <mesh castShadow position={[0, 0.52, 0.12]}>
          <boxGeometry args={[0.26, 0.07, 0.14]} />
          <meshStandardMaterial
            color="#D6FF64"
            emissive="#D6FF64"
            emissiveIntensity={0.65}
            roughness={0.2}
          />
        </mesh>

        {/* Back harness pack: Dark graphite #21292B */}
        <mesh castShadow position={[0, 0.38, -0.16]}>
          <boxGeometry args={[0.2, 0.22, 0.08]} />
          <meshStandardMaterial color="#21292B" roughness={0.6} />
        </mesh>

        {/* Back route emblem accent on harness: Electric Acid Lime */}
        <mesh position={[0, 0.38, -0.205]}>
          <boxGeometry args={[0.06, 0.12, 0.015]} />
          <meshStandardMaterial
            color="#D6FF64"
            emissive="#D6FF64"
            emissiveIntensity={0.8}
            roughness={0.2}
          />
        </mesh>
      </group>
    </RigidBody>
  );
}
