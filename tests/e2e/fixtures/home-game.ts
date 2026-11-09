import { Page } from '@playwright/test';

export const HOME_GAME_HARNESS_PATH = '/tests/e2e/fixtures/home-game-harness.html';

export interface HomeGameSnapshot {
  t: number;
  canvasCount: number;
  canvasRect: { x: number; y: number; width: number; height: number; top: number; right: number; bottom: number; left: number } | null;
  canvasContainerRect: { x: number; y: number; width: number; height: number; top: number; right: number; bottom: number; left: number } | null;
  slotWrapperRect: { x: number; y: number; width: number; height: number; top: number; right: number; bottom: number; left: number } | null;
  homeRootRect: { x: number; y: number; width: number; height: number; top: number; right: number; bottom: number; left: number } | null;
  perimeterRect: { x: number; y: number; width: number; height: number; top: number; right: number; bottom: number; left: number } | null;
  isPerimeterRelaxed: boolean;
  mode: string;
  currentCheckpointId: string;
  unlockedCheckpoints: string[];
  frameloop?: string;
  renderFrame?: number;
  hidden: boolean;
  scrollY: number;
  activeElementId?: string;
  playerPosition: [number, number, number];
  physicalTranslation?: { x: number; y: number; z: number };
  isGrounded: boolean;
  markerLabels: Array<{
    text?: string;
    rect: { x: number; y: number; width: number; height: number; top: number; right: number; bottom: number; left: number };
  }>;
}

export async function openHomeGameHarness(page: Page) {
  await page.goto(HOME_GAME_HARNESS_PATH);
  await page.waitForFunction(() => {
    const snap = (window as any).__homeGame?.snapshot();
    return snap && snap.canvasCount === 1 && (window as any).__homeGame?.getPlayerBody();
  }, { timeout: 15000 });
  await page.waitForTimeout(300);
}

export async function getHomeGameSnapshot(page: Page): Promise<HomeGameSnapshot> {
  return await page.evaluate(() => (window as any).__homeGame.snapshot());
}
