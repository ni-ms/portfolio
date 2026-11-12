import { Page, expect } from '@playwright/test';

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
  await page.locator('#parkour-game').evaluate(section => {
    section.tabIndex = -1;
    section.focus({ preventScroll: true });
    section.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  // Physics readiness precedes the asynchronous Html portal commit. Wait for
  // rendered badge boxes before tests inspect their required bounds or hits.
  await expect.poll(async () => {
    const snap = await getHomeGameSnapshot(page);
    return snap.markerLabels.filter((marker) => marker.rect.width > 0 && marker.rect.height > 0).length;
  }, { timeout: 5000, message: 'All three waypoint badges have rendered' }).toBe(3);
}

export async function getHomeGameSnapshot(page: Page): Promise<HomeGameSnapshot> {
  return await page.evaluate(() => (window as any).__homeGame.snapshot());
}
