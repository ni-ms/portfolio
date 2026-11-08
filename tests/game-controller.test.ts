import { describe, it, expect, beforeEach } from 'vitest';
import { gameStore, DEFAULT_CHECKPOINTS } from '../src/game/gameStore';
import { CHECKPOINTS, COURSE_BOUNDS } from '../src/game/courseConfig';
import {
  normalizeMovementInput,
  JumpController,
} from '../src/game/controllerUtils';
import {
  livePlayerTransform,
  updateLivePlayerTransform,
} from '../src/game/playerTransform';
import type { InputState } from '../src/types/game';

describe('Game Controller & Physics Unit Tests', () => {
  beforeEach(() => {
    gameStore.reset();
  });

  describe('1. Diagonal Movement Input Normalization', () => {
    it('should keep single axis movement magnitude exactly at 1.0', () => {
      const forwardInput: InputState = {
        forward: true,
        backward: false,
        left: false,
        right: false,
        jump: false,
      };
      const resultFwd = normalizeMovementInput(forwardInput);
      expect(resultFwd.isMoving).toBe(true);
      expect(resultFwd.x).toBe(0);
      expect(resultFwd.z).toBe(-1);
      expect(resultFwd.length).toBeCloseTo(1.0, 5);

      const rightInput: InputState = {
        forward: false,
        backward: false,
        left: false,
        right: true,
        jump: false,
      };
      const resultRight = normalizeMovementInput(rightInput);
      expect(resultRight.isMoving).toBe(true);
      expect(resultRight.x).toBe(1);
      expect(resultRight.z).toBe(0);
      expect(resultRight.length).toBeCloseTo(1.0, 5);
    });

    it('should normalize diagonal movement so magnitude does NOT exceed 1.0', () => {
      const diagonalInput: InputState = {
        forward: true,
        backward: false,
        left: false,
        right: true,
        jump: false,
      };

      // Raw unnormalized length would be sqrt(1^2 + (-1)^2) = sqrt(2) ~ 1.4142
      const result = normalizeMovementInput(diagonalInput);

      expect(result.isMoving).toBe(true);
      expect(result.length).toBeCloseTo(1.0, 5);
      expect(result.length).toBeLessThanOrEqual(1.00001);
      expect(result.x).toBeCloseTo(1 / Math.SQRT2, 5);
      expect(result.z).toBeCloseTo(-1 / Math.SQRT2, 5);
    });

    it('should normalize all 4 diagonal quadrant inputs to magnitude 1.0', () => {
      const diagonals: Array<[boolean, boolean, boolean, boolean]> = [
        [true, false, false, true],  // forward + right
        [true, false, true, false],  // forward + left
        [false, true, false, true],  // backward + right
        [false, true, true, false],  // backward + left
      ];

      for (const [fwd, bwd, left, right] of diagonals) {
        const input: InputState = {
          forward: fwd,
          backward: bwd,
          left,
          right,
          jump: false,
        };
        const result = normalizeMovementInput(input);
        expect(result.isMoving).toBe(true);
        expect(result.length).toBeCloseTo(1.0, 5);
      }
    });

    it('should return magnitude 0 when idle or opposing inputs cancel', () => {
      const idleInput: InputState = {
        forward: false,
        backward: false,
        left: false,
        right: false,
        jump: false,
      };
      const resultIdle = normalizeMovementInput(idleInput);
      expect(resultIdle.isMoving).toBe(false);
      expect(resultIdle.length).toBe(0);

      const cancelInput: InputState = {
        forward: true,
        backward: true,
        left: true,
        right: true,
        jump: false,
      };
      const resultCancel = normalizeMovementInput(cancelInput);
      expect(resultCancel.isMoving).toBe(false);
      expect(resultCancel.length).toBe(0);
    });
  });

  describe('2. Jump Buffering and Coyote Time Window', () => {
    it('should allow normal jumping when grounded and jump is pressed', () => {
      const jc = new JumpController(100, 120, 200);
      const now = 1000;

      jc.updateGrounded(true, now);
      jc.onJumpPressed(now);

      expect(jc.canJump(now, true)).toBe(true);

      jc.executeJump(now);
      // Once consumed, should not jump again immediately
      expect(jc.canJump(now, true)).toBe(false);
    });

    it('should buffer jump pressed up to 100ms before landing (Jump Buffering)', () => {
      const jc = new JumpController(100, 120, 200);

      // Player in mid-air presses jump 70ms before touching ground
      const jumpPressTime = 1000;
      jc.onJumpPressed(jumpPressTime);

      // Still in air 50ms later -> cannot jump yet
      expect(jc.canJump(1050, false)).toBe(false);

      // Lands on ground at 1070ms (70ms after jump press <= 100ms buffer)
      const landTime = 1070;
      jc.updateGrounded(true, landTime);

      expect(jc.canJump(landTime, true)).toBe(true);

      jc.executeJump(landTime);
      expect(jc.canJump(landTime, true)).toBe(false);
    });

    it('should reject buffered jump if landing occurs > 100ms after press', () => {
      const jc = new JumpController(100, 120, 200);

      const jumpPressTime = 1000;
      jc.onJumpPressed(jumpPressTime);

      // Lands at 1150ms (150ms after press > 100ms buffer)
      const landTime = 1150;
      jc.updateGrounded(true, landTime);

      expect(jc.canJump(landTime, true)).toBe(false);
    });

    it('should allow jumping within 120ms after leaving ground (Coyote Time)', () => {
      const jc = new JumpController(100, 120, 200);

      // Player walks off edge at t=2000
      const leaveLedgeTime = 2000;
      jc.updateGrounded(true, leaveLedgeTime);

      // Player is now airborne
      const airTime = 2080; // 80ms after leaving ground (<= 120ms coyote time)
      jc.onJumpPressed(airTime);

      // In air, but within coyote window!
      expect(jc.canJump(airTime, false)).toBe(true);

      jc.executeJump(airTime);
      // Coyote consumed
      expect(jc.canJump(airTime, false)).toBe(false);
    });

    it('should reject jump if coyote time window (> 120ms) has expired', () => {
      const jc = new JumpController(100, 120, 200);

      const leaveLedgeTime = 2000;
      jc.updateGrounded(true, leaveLedgeTime);

      // Airborne for 160ms (> 120ms) before pressing jump
      const lateTime = 2160;
      jc.onJumpPressed(lateTime);

      expect(jc.canJump(lateTime, false)).toBe(false);
    });

    it('should enforce jump cooldown to prevent double-firing', () => {
      const jc = new JumpController(100, 120, 200);
      const jumpTime = 3000;

      jc.updateGrounded(true, jumpTime);
      jc.onJumpPressed(jumpTime);
      jc.executeJump(jumpTime);

      // Attempt immediate second jump at 3100 (100ms < 200ms cooldown)
      jc.updateGrounded(true, 3100);
      jc.onJumpPressed(3100);
      expect(jc.canJump(3100, true)).toBe(false);

      // At 3250ms (250ms >= 200ms cooldown), player presses jump again
      jc.onJumpPressed(3250);
      expect(jc.canJump(3250, true)).toBe(true);
    });
  });

  describe('3. Respawn, Checkpoints & Velocity Reset', () => {
    it('should initialize at start checkpoint cp-start', () => {
      const state = gameStore.getState();
      expect(state.currentCheckpointId).toBe('cp-start');
      expect(state.checkpoints[0].unlocked).toBe(true);
      expect(state.checkpoints[1].unlocked).toBe(false);
    });

    it('should unlock checkpoint and update currentCheckpointId on reachCheckpoint', () => {
      const { reachCheckpoint } = gameStore.getState().actions;

      reachCheckpoint('cp-work');
      let state = gameStore.getState();
      expect(state.currentCheckpointId).toBe('cp-work');
      const workCp = state.checkpoints.find((c) => c.id === 'cp-work');
      expect(workCp?.unlocked).toBe(true);

      reachCheckpoint('cp-explorations');
      state = gameStore.getState();
      expect(state.currentCheckpointId).toBe('cp-explorations');
      const expCp = state.checkpoints.find((c) => c.id === 'cp-explorations');
      expect(expCp?.unlocked).toBe(true);
    });

    it('should set isRespawning flag and clear inputs on resetToCheckpoint', () => {
      const { setInput, resetToCheckpoint, reachCheckpoint } =
        gameStore.getState().actions;

      reachCheckpoint('cp-work');
      setInput({ forward: true, jump: true });

      expect(gameStore.getState().input.forward).toBe(true);
      expect(gameStore.getState().input.jump).toBe(true);

      resetToCheckpoint();

      const state = gameStore.getState();
      expect(state.isRespawning).toBe(true);
      expect(state.input.forward).toBe(false);
      expect(state.input.jump).toBe(false);
      expect(state.currentCheckpointId).toBe('cp-work');
    });

    it('should simulate physics rigid-body respawn: reset position and clear linear/angular velocity', () => {
      const { reachCheckpoint, respawnPlayer } = gameStore.getState().actions;
      reachCheckpoint('cp-work');
      respawnPlayer();

      const store = gameStore.getState();
      expect(store.isRespawning).toBe(true);

      // Mock RigidBody
      const mockRigidBody = {
        translation: { x: 10, y: -7.5, z: 20 },
        linvel: { x: 4.5, y: -18.2, z: 2.1 },
        angvel: { x: 1.2, y: 0.5, z: -0.8 },
        setTranslation(pos: { x: number; y: number; z: number }) {
          this.translation = { ...pos };
        },
        setLinvel(vel: { x: number; y: number; z: number }) {
          this.linvel = { ...vel };
        },
        setAngvel(vel: { x: number; y: number; z: number }) {
          this.angvel = { ...vel };
        },
      };

      // Execute simulated respawn loop
      if (store.isRespawning) {
        const targetCp =
          store.checkpoints.find((c) => c.id === store.currentCheckpointId) ||
          store.checkpoints[0];
        const [sx, sy, sz] = targetCp.spawnPosition;

        mockRigidBody.setTranslation({ x: sx, y: sy, z: sz });
        mockRigidBody.setLinvel({ x: 0, y: 0, z: 0 });
        mockRigidBody.setAngvel({ x: 0, y: 0, z: 0 });

        gameStore.setState({ isRespawning: false, isGrounded: true });
      }

      const workSpawn = DEFAULT_CHECKPOINTS.find((c) => c.id === 'cp-work')!.spawnPosition;

      expect(mockRigidBody.translation).toEqual({
        x: workSpawn[0],
        y: workSpawn[1],
        z: workSpawn[2],
      });
      expect(mockRigidBody.linvel).toEqual({ x: 0, y: 0, z: 0 });
      expect(mockRigidBody.angvel).toEqual({ x: 0, y: 0, z: 0 });
      expect(gameStore.getState().isRespawning).toBe(false);
    });
  });

  describe('4. Input Clearance & Pointer Cancellation Safety', () => {
    it('should clear all inputs on clearInput()', () => {
      const { setInput, clearInput } = gameStore.getState().actions;

      setInput({
        forward: true,
        backward: false,
        left: true,
        right: false,
        jump: true,
      });

      expect(gameStore.getState().input.forward).toBe(true);
      expect(gameStore.getState().input.left).toBe(true);
      expect(gameStore.getState().input.jump).toBe(true);

      clearInput();

      const input = gameStore.getState().input;
      expect(input.forward).toBe(false);
      expect(input.backward).toBe(false);
      expect(input.left).toBe(false);
      expect(input.right).toBe(false);
      expect(input.jump).toBe(false);
    });

    it('should automatically clear inputs when transitioning to preview mode', () => {
      const { setMode, setInput } = gameStore.getState().actions;

      setMode('play-inline');
      setInput({ forward: true, jump: true });

      expect(gameStore.getState().mode).toBe('play-inline');
      expect(gameStore.getState().input.forward).toBe(true);

      // Exit to preview mode
      setMode('preview');

      expect(gameStore.getState().mode).toBe('preview');
      expect(gameStore.getState().input.forward).toBe(false);
      expect(gameStore.getState().input.jump).toBe(false);
    });

    it('should simulate pointer cancel clearing multi-touch pointer state', () => {
      const activePointers = new Map<number, keyof InputState>();

      // Thumb 1 presses D-Pad UP (pointerId: 101)
      activePointers.set(101, 'forward');
      gameStore.getState().actions.setInput({ forward: true });

      // Thumb 2 presses JUMP (pointerId: 102)
      activePointers.set(102, 'jump');
      gameStore.getState().actions.setInput({ jump: true });

      expect(gameStore.getState().input.forward).toBe(true);
      expect(gameStore.getState().input.jump).toBe(true);

      // Pointer cancel occurs on thumb 1 (e.g. system notification or gesture bar)
      const cancelledAction = activePointers.get(101);
      if (cancelledAction) {
        activePointers.delete(101);
        gameStore.getState().actions.setInput({ [cancelledAction]: false });
      }

      // Jump remains active, forward is released cleanly without stuck input!
      expect(gameStore.getState().input.forward).toBe(false);
      expect(gameStore.getState().input.jump).toBe(true);

      // Window blur occurs -> clears all remaining pointers
      activePointers.clear();
      gameStore.getState().actions.clearInput();

      expect(gameStore.getState().input.jump).toBe(false);
      expect(gameStore.getState().input.forward).toBe(false);
    });

    it('should navigate to section, exit overlay mode, and clear input', () => {
      const { setMode, setInput, navigateToSection } =
        gameStore.getState().actions;

      setMode('play-overlay');
      setInput({ forward: true });

      expect(gameStore.getState().mode).toBe('play-overlay');

      navigateToSection('work');

      expect(gameStore.getState().mode).toBe('preview');
      expect(gameStore.getState().input.forward).toBe(false);
    });
  });

  describe('5. Jump Edge-Triggered Semantics (Holding Jump Does NOT Refill Buffer)', () => {
    it('holding jump continuously across frames does NOT refill buffer upon landing', () => {
      const jc = new JumpController(100, 120, 200);

      // Initial press while grounded at t=1000
      jc.updateGrounded(true, 1000);
      jc.updateJumpInput(true, 1000);

      expect(jc.canJump(1000, true)).toBe(true);
      jc.executeJump(1000);
      expect(jc.canJump(1000, true)).toBe(false);

      // Player in air for 500ms, constantly holding jump
      for (let t = 1016; t <= 1500; t += 16) {
        jc.updateGrounded(false, t);
        jc.updateJumpInput(true, t);
        expect(jc.canJump(t, false)).toBe(false);
      }

      // Player touches down at t=1600 while STILL holding jump
      jc.updateGrounded(true, 1600);
      jc.updateJumpInput(true, 1600);

      // Because jump was held and not re-pressed, buffer is NOT refilled!
      expect(jc.canJump(1600, true)).toBe(false);

      // Releasing jump
      jc.updateJumpInput(false, 1620);
      expect(jc.canJump(1620, true)).toBe(false);

      // Re-pressing jump triggers fresh jump!
      jc.updateJumpInput(true, 1650);
      expect(jc.canJump(1650, true)).toBe(true);
    });

    it('mid-air fresh press buffers jump and executes immediately upon landing', () => {
      const jc = new JumpController(100, 120, 200);

      // Airborne at t=2000
      jc.updateGrounded(false, 2000);
      jc.updateJumpInput(false, 2000);

      // 60ms before touchdown, user presses jump
      jc.updateJumpInput(true, 2040);
      expect(jc.canJump(2040, false)).toBe(false);

      // Landing at t=2100 (60ms <= 100ms buffer)
      jc.updateGrounded(true, 2100);
      expect(jc.canJump(2100, true)).toBe(true);

      jc.executeJump(2100);
      expect(jc.canJump(2100, true)).toBe(false);
    });
  });

  describe('6. Checkpoint and Spawn Consistency Across Store and Course', () => {
    it('gameStore checkpoints must match courseConfig CHECKPOINTS coordinates exactly', () => {
      const storeCps = gameStore.getState().checkpoints;
      expect(storeCps).toHaveLength(CHECKPOINTS.length);

      storeCps.forEach((scp) => {
        const ccp = CHECKPOINTS.find((c) => c.id === scp.id);
        expect(ccp).toBeDefined();
        expect(scp.position).toEqual(ccp!.position);
        expect(scp.spawnPosition).toEqual(ccp!.spawnPosition);
        expect(scp.targetRoute).toEqual(ccp!.targetRoute);
        expect(scp.targetSectionId).toEqual(ccp!.targetSectionId);
      });
    });

    it('every checkpoint spawn position is above platform surface elevation', () => {
      CHECKPOINTS.forEach((cp) => {
        expect(cp.spawnPosition[1]).toBeGreaterThan(cp.position[1]);
        expect(cp.spawnPosition[1] - cp.position[1]).toBeGreaterThanOrEqual(0.4);
      });
    });

    it('all checkpoints map to valid portfolio routes per CONTRACTS revision 1', () => {
      const expectedRoutes: Record<string, string> = {
        'cp-start': '/',
        'cp-work': '/projects',
        'cp-explorations': '/about',
        'cp-resume': '/resume',
      };

      CHECKPOINTS.forEach((cp) => {
        expect(cp.targetRoute).toBe(expectedRoutes[cp.id]);
      });
    });

    it('spawn positions reside within horizontal bounding boxes of their rooftops', () => {
      const { startRooftop, workRooftop, explorationRooftop, resumeRooftop } = COURSE_BOUNDS;

      // Start Rooftop spawn
      const startCp = CHECKPOINTS[0];
      expect(startCp.spawnPosition[0]).toBeGreaterThanOrEqual(startRooftop.mainSlab.position[0] - startRooftop.mainSlab.size[0] / 2);
      expect(startCp.spawnPosition[0]).toBeLessThanOrEqual(startRooftop.mainSlab.position[0] + startRooftop.mainSlab.size[0] / 2);

      // Work Rooftop spawn
      const workCp = CHECKPOINTS[1];
      expect(workCp.spawnPosition[0]).toBeGreaterThanOrEqual(workRooftop.mainSlab.position[0] - workRooftop.mainSlab.size[0] / 2);
      expect(workCp.spawnPosition[0]).toBeLessThanOrEqual(workRooftop.mainSlab.position[0] + workRooftop.mainSlab.size[0] / 2);

      // Exploration Rooftop spawn
      const expCp = CHECKPOINTS[2];
      expect(expCp.spawnPosition[0]).toBeGreaterThanOrEqual(explorationRooftop.upperTerrace.position[0] - explorationRooftop.upperTerrace.size[0] / 2);
      expect(expCp.spawnPosition[0]).toBeLessThanOrEqual(explorationRooftop.upperTerrace.position[0] + explorationRooftop.upperTerrace.size[0] / 2);

      // Resume Rooftop spawn
      const resCp = CHECKPOINTS[3];
      expect(resCp.spawnPosition[0]).toBeGreaterThanOrEqual(resumeRooftop.mainSlab.position[0] - resumeRooftop.mainSlab.size[0] / 2);
      expect(resCp.spawnPosition[0]).toBeLessThanOrEqual(resumeRooftop.mainSlab.position[0] + resumeRooftop.mainSlab.size[0] / 2);
    });
  });

  describe('7. Live Player Transform Integration', () => {
    it('livePlayerTransform is updated without React state rerenders', () => {
      updateLivePlayerTransform(2.5, 4.0, -1.2, 3.0, 0.0, -2.0, 1.57, true);

      expect(livePlayerTransform.position.x).toBeCloseTo(2.5);
      expect(livePlayerTransform.position.y).toBeCloseTo(4.0);
      expect(livePlayerTransform.position.z).toBeCloseTo(-1.2);
      expect(livePlayerTransform.linvel.x).toBeCloseTo(3.0);
      expect(livePlayerTransform.rotationY).toBeCloseTo(1.57);
      expect(livePlayerTransform.isGrounded).toBe(true);
    });
  });
});
