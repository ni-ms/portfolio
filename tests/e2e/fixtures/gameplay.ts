import { Page, expect } from '@playwright/test';

export const GAMEPLAY_HARNESS_PATH = '/tests/e2e/fixtures/gameplay-harness.html';

export interface GameplaySnapshot {
  t: number;
  mode: string;
  cp: string;
  unlocked: string[];
  input: {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
    jump: boolean;
  };
  grounded: boolean;
  p: [number, number, number];
  v: [number, number, number];
  physical?: { x: number; y: number; z: number };
  physicalV?: { x: number; y: number; z: number };
  frameloop?: string;
  hidden: boolean;
  visibility: string;
  rect?: { x: number; y: number; width: number; height: number; top: number; right: number; bottom: number; left: number };
  canvas: number;
  renderFrame?: number;
  locked: boolean;
  scrollY: number;
  focus: string;
}

export async function openGameplayHarness(page: Page) {
  await page.goto(GAMEPLAY_HARNESS_PATH);
  await page.waitForFunction(() => (window as any).__gameplay?.body(), { timeout: 15000 });
  await page.waitForTimeout(300);
}

export async function getGameplaySnapshot(page: Page): Promise<GameplaySnapshot> {
  return await page.evaluate(() => (window as any).__gameplay.snapshot());
}

export async function enterPlayMode(page: Page) {
  const enterBtn = page.getByTestId('enter-play-btn');
  await expect(enterBtn).toBeVisible();
  await enterBtn.click();
  await page.waitForTimeout(400);
}

export async function exitPlayMode(page: Page, isMobile = false) {
  if (isMobile) {
    const exitBtn = page.getByTestId('overlay-exit-btn');
    await expect(exitBtn).toBeVisible();
    await exitBtn.click();
  } else {
    const exitBtn = page.getByTestId('inline-exit-btn');
    if (await exitBtn.isVisible()) {
      await exitBtn.click();
    } else {
      await page.keyboard.press('Escape');
    }
  }
  await page.waitForTimeout(200);
}
