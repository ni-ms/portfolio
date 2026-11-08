import { test, expect } from '@playwright/test';
import { openGameplayHarness, enterPlayMode, exitPlayMode } from './fixtures/gameplay';

test.describe('Gameplay & GameExperience Durable Real-Component Suite', () => {
  test('Desktop (1585x992) - Lifecycle, Canvas & Modal Focus Restoration', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'Desktop Target (1585x992)') return;

    await openGameplayHarness(page);

    // 1. Single persistent canvas mounted in preview
    const canvas = page.locator('canvas');
    await expect(canvas).toHaveCount(1);
    await expect(canvas).toBeVisible();

    // 2. Click-to-play enters inline mode
    const enterBtn = page.getByTestId('enter-play-btn');
    await expect(enterBtn).toBeVisible();
    await enterBtn.click();
    await page.waitForTimeout(300);

    // Inline HUD is visible
    const exitBtn = page.getByTestId('inline-exit-btn');
    await expect(exitBtn).toBeVisible();

    // 3. Exit inline play via button
    await exitBtn.click();
    await page.waitForTimeout(200);

    // 4. Focus is cleanly restored to the connected trigger
    await expect(page.getByTestId('enter-play-btn')).toBeFocused();
    await expect(page.locator('body')).not.toHaveClass(/scroll-locked/);
  });

  test('Mobile (390x844) - Overlay Dialog, Focus Trap & Multi-Touch Controls', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'Mobile Target (390x844)') return;

    await openGameplayHarness(page);

    // 1. Open mobile overlay
    await enterPlayMode(page);

    // 2. Verify dialog role, scroll lock & touch controls
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(page.locator('body')).toHaveClass(/scroll-locked/);

    await expect(page.getByTestId('dpad-up')).toBeVisible();
    await expect(page.getByTestId('dpad-down')).toBeVisible();
    await expect(page.getByTestId('dpad-left')).toBeVisible();
    await expect(page.getByTestId('dpad-right')).toBeVisible();
    await expect(page.getByTestId('touch-jump-btn')).toBeVisible();
    await expect(page.getByTestId('overlay-exit-btn')).toBeVisible();

    // 3. Focus containment / modal trap
    await page.keyboard.press('Shift+Tab');
    await expect(page.getByTestId('touch-jump-btn')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByTestId('overlay-exit-btn')).toBeFocused();

    // 4. Dismiss overlay
    await page.getByTestId('overlay-exit-btn').click();
    await page.waitForTimeout(200);

    // 5. Scroll lock released and focus restored
    await expect(page.locator('body')).not.toHaveClass(/scroll-locked/);
    await expect(page.getByTestId('enter-play-btn')).toBeFocused();
  });

  test('Container Viewport & Visibility Handling', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'Desktop Target (1585x992)') return;

    await openGameplayHarness(page);

    // When scrolled offscreen below fold, rendering frameloop suspends
    await page.evaluate(() => {
      const vp = document.querySelector('#viewport') as HTMLElement;
      if (vp) vp.style.marginTop = '1400px';
    });
    await page.waitForTimeout(200);

    const isSuspended = await page.evaluate(() => {
      const snap = (window as any).__review?.snapshot();
      return snap?.frameloop === 'never';
    });
    expect(isSuspended).toBe(true);
  });
});
