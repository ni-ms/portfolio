import * as THREE from 'three';

export interface PlayerLiveTransform {
  position: THREE.Vector3;
  rotationY: number;
  linvel: THREE.Vector3;
  isGrounded: boolean;
}

// Global live player transform readable by CameraRig and inspection without React rerenders
export const livePlayerTransform: PlayerLiveTransform = {
  position: new THREE.Vector3(-3.5, 1.7, 3.5),
  rotationY: 0,
  linvel: new THREE.Vector3(0, 0, 0),
  isGrounded: true,
};

export function updateLivePlayerTransform(
  x: number,
  y: number,
  z: number,
  vx: number,
  vy: number,
  vz: number,
  rotY: number,
  isGrounded: boolean
): void {
  livePlayerTransform.position.set(x, y, z);
  livePlayerTransform.linvel.set(vx, vy, vz);
  livePlayerTransform.rotationY = rotY;
  livePlayerTransform.isGrounded = isGrounded;
}
