import { Page, expect } from '@playwright/test';

export const GAMEPLAY_HARNESS_URL = 'http://localhost:3004/.agent-runs/rereview-t04.html?deterministic';

export async function openGameplayHarness(page: Page) {
  await page.goto(GAMEPLAY_HARNESS_URL);
  await page.waitForSelector('canvas', { state: 'visible', timeout: 15000 });
  await page.waitForTimeout(300);
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
