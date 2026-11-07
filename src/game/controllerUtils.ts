import type { InputState } from '../types/game';

/**
 * Normalizes 2D directional movement input to prevent faster diagonal traversal.
 * When both horizontal and vertical axes are pressed, the raw magnitude is sqrt(2) (~1.414).
 * This function caps the maximum vector magnitude strictly to <= 1.0.
 */
export function normalizeMovementInput(input: InputState): {
  x: number;
  z: number;
  isMoving: boolean;
  length: number;
} {
  let x = 0;
  let z = 0;

  if (input.right) x += 1;
  if (input.left) x -= 1;
  if (input.forward) z -= 1; // forward = into the scene (-Z in standard 3D space)
  if (input.backward) z += 1;

  const len = Math.hypot(x, z);
  if (len > 1) {
    x /= len;
    z /= len;
  }

  return {
    x,
    z,
    isMoving: len > 0,
    length: Math.hypot(x, z),
  };
}

/**
 * Manages responsive jump buffering (~100ms) and coyote time (~120ms).
 *
 * Jump Buffering:
 * If the player presses Jump slightly BEFORE touching the ground (e.g. 80ms before landing),
 * the jump input is buffered and executes the instant the character touches down.
 *
 * Coyote Time:
 * If the player walks off a ledge or stair edge, they can still jump for ~120ms after
 * leaving the solid surface, preventing punishing near-edge missed jumps.
 */
export class JumpController {
  private jumpBufferMs: number;
  private coyoteTimeMs: number;
  private jumpCooldownMs: number;

  private lastJumpPressTime: number = -Infinity;
  private lastGroundedTime: number = -Infinity;
  private lastJumpExecutedTime: number = -Infinity;

  constructor(jumpBufferMs = 100, coyoteTimeMs = 120, jumpCooldownMs = 200) {
    this.jumpBufferMs = jumpBufferMs;
    this.coyoteTimeMs = coyoteTimeMs;
    this.jumpCooldownMs = jumpCooldownMs;
  }

  /**
   * Called whenever the jump button/space is actively pressed.
   */
  public onJumpPressed(now: number): void {
    this.lastJumpPressTime = now;
  }

  /**
   * Called on every physics/frame step with current grounded status.
   */
  public updateGrounded(isGrounded: boolean, now: number): void {
    if (isGrounded) {
      this.lastGroundedTime = now;
    }
  }

  /**
   * Checks if a jump can be performed at current timestamp `now`.
   */
  public canJump(now: number, isGrounded: boolean): boolean {
    const isBuffered = now - this.lastJumpPressTime <= this.jumpBufferMs;
    const hasCoyote = isGrounded || now - this.lastGroundedTime <= this.coyoteTimeMs;
    const cooldownCleared = now - this.lastJumpExecutedTime >= this.jumpCooldownMs;

    return isBuffered && hasCoyote && cooldownCleared;
  }

  /**
   * Consumes the jump request and coyote buffer upon executing the jump.
   */
  public executeJump(now: number): void {
    this.lastJumpPressTime = -Infinity;
    this.lastGroundedTime = -Infinity;
    this.lastJumpExecutedTime = now;
  }

  /**
   * Resets all internal state (e.g. upon respawn or pause).
   */
  public reset(): void {
    this.lastJumpPressTime = -Infinity;
    this.lastGroundedTime = -Infinity;
    this.lastJumpExecutedTime = -Infinity;
  }

  public getDebugState(now: number, isGrounded: boolean) {
    return {
      isBuffered: now - this.lastJumpPressTime <= this.jumpBufferMs,
      hasCoyote: isGrounded || now - this.lastGroundedTime <= this.coyoteTimeMs,
      timeSinceJumpPress: now - this.lastJumpPressTime,
      timeSinceGrounded: now - this.lastGroundedTime,
      canJump: this.canJump(now, isGrounded),
    };
  }
}
