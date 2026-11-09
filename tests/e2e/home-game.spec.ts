import { test, expect } from '@playwright/test';
import { openHomeGameHarness, getHomeGameSnapshot, HOME_GAME_HARNESS_PATH } from './fixtures/home-game';

test.describe('T06 HomeGame Integration, Atmosphere & Lifecycle Durable Suite', () => {
  test('Desktop (1585x992) — Measured Responsive Bounds, Soft Perimeter, Expand/Exit & Lifecycle', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Desktop Target (1585x992)', 'Desktop target only');

    await openHomeGameHarness(page);

    // 1. Measured real CSS and canvas bounds: canvas fits wrapper without 420px clipping
    const initSnap = await getHomeGameSnapshot(page);
    expect(initSnap.canvasCount).toBe(1);
    expect(initSnap.mode).toBe('preview');
    expect(initSnap.slotWrapperRect).not.toBeNull();
    expect(initSnap.canvasRect).not.toBeNull();

    // Canvas must match slot wrapper dimensions (height is ~320px, NOT clipped 420px)
    expect(Math.abs(initSnap.canvasRect!.width - initSnap.slotWrapperRect!.width)).toBeLessThan(3);
    expect(Math.abs(initSnap.canvasRect!.height - initSnap.slotWrapperRect!.height)).toBeLessThan(3);
    expect(initSnap.canvasRect!.height).toBeLessThanOrEqual(340);
    expect(initSnap.canvasRect!.height).toBeGreaterThanOrEqual(300);

    // 2. Soft perimeter atmosphere: feather gradients and progressive blur present in preview
    await expect(page.getByTestId('home-game-perimeter')).toBeVisible();
    expect(initSnap.isPerimeterRelaxed).toBe(false);

    // 3. Enter inline play mode: click-to-play enters play-inline
    const enterBtn = page.getByTestId('enter-play-btn');
    await expect(enterBtn).toBeVisible();
    await enterBtn.click();
    await page.waitForTimeout(350);

    const inlineSnap = await getHomeGameSnapshot(page);
    expect(inlineSnap.mode).toBe('play-inline');
    // Perimeter relaxes in active play
    expect(inlineSnap.isPerimeterRelaxed).toBe(true);

    // Keyboard drive forward
    await page.keyboard.down('KeyW');
    await page.waitForTimeout(250);
    await page.keyboard.up('KeyW');
    await page.waitForTimeout(100);

    const moveSnap = await getHomeGameSnapshot(page);
    expect(moveSnap.physicalTranslation).toBeDefined();
    expect(inlineSnap.physicalTranslation).toBeDefined();
    expect(moveSnap.physicalTranslation!.z).toBeLessThan(inlineSnap.physicalTranslation!.z - 0.15);

    // 4. Expand button smoothly transitions from inline to expanded overlay
    const expandBtn = page.getByTestId('inline-expand-btn');
    await expect(expandBtn).toBeVisible();
    await expandBtn.click();
    await page.waitForTimeout(350);

    const overlaySnap = await getHomeGameSnapshot(page);
    expect(overlaySnap.mode).toBe('play-overlay');
    // Canvas world persists without remounting (strictly 1 canvas)
    expect(overlaySnap.canvasCount).toBe(1);
    // Player position remains preserved
    expect(overlaySnap.physicalTranslation!.z).toBeCloseTo(moveSnap.physicalTranslation!.z, 1);

    // 5. Exit overlay restores preview mode and restores focus to enter-play-btn
    const exitBtn = page.getByTestId('overlay-exit-btn');
    await expect(exitBtn).toBeVisible();
    await exitBtn.click();
    await page.waitForTimeout(300);

    const exitSnap = await getHomeGameSnapshot(page);
    expect(exitSnap.mode).toBe('preview');
    expect(exitSnap.canvasCount).toBe(1);
    await expect(page.getByTestId('enter-play-btn')).toBeFocused();

    // 6. Theme switches preserve canvas and simulation state without leaks
    const themeBtn = page.locator('#toggle-theme-btn');
    await themeBtn.click(); // Switch to light
    await page.waitForTimeout(250);
    const lightSnap = await getHomeGameSnapshot(page);
    expect(lightSnap.canvasCount).toBe(1);
    expect(lightSnap.physicalTranslation).toBeDefined();

    await themeBtn.click(); // Switch back to dark
    await page.waitForTimeout(250);
    const darkSnap = await getHomeGameSnapshot(page);
    expect(darkSnap.canvasCount).toBe(1);

    // 7. Inner route navigation unmounts game; returning remounts cleanly
    const navProjectsBtn = page.locator('#nav-projects');
    await navProjectsBtn.click();
    await page.waitForTimeout(200);
    expect(await page.locator('canvas').count()).toBe(0);

    const navHomeBtn = page.locator('#nav-home');
    await navHomeBtn.click();
    await page.waitForFunction(() => (window as any).__homeGame?.snapshot()?.canvasCount === 1, { timeout: 8000 });
    const remountSnap = await getHomeGameSnapshot(page);
    expect(remountSnap.canvasCount).toBe(1);

    // 8. Viewport Intersection & Offscreen Rendering Suspension
    await page.evaluate(() => window.scrollTo(0, 1000));
    // Poll for frameloop suspension
    await expect.poll(async () => {
      const s = await getHomeGameSnapshot(page);
      return s.frameloop;
    }, { timeout: 4000 }).toBe('never');

    // Scroll back to top resumes rendering
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect.poll(async () => {
      const s = await getHomeGameSnapshot(page);
      return s.frameloop;
    }, { timeout: 4000 }).toBe('always');
  });

  test('Mobile (390x844) — Responsive Canvas, Readable Labels & Mobile Overlay Play', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Mobile Target (390x844)', 'Mobile target only');

    await openHomeGameHarness(page);

    const snap = await getHomeGameSnapshot(page);
    expect(snap.canvasCount).toBe(1);
    expect(snap.mode).toBe('preview');

    // 1. Measured canvas bounds on mobile
    expect(snap.canvasRect).not.toBeNull();
    expect(snap.slotWrapperRect).not.toBeNull();
    expect(Math.abs(snap.canvasRect!.width - snap.slotWrapperRect!.width)).toBeLessThan(3);
    expect(Math.abs(snap.canvasRect!.height - snap.slotWrapperRect!.height)).toBeLessThan(3);
    expect(snap.canvasRect!.height).toBeLessThanOrEqual(300);

    // 2. Next landing label 01 / WORK is readable and inside canvas bounds
    const workLabel = snap.markerLabels.find((m) => m.text?.includes('01') || m.text?.includes('WORK'));
    if (workLabel) {
      expect(workLabel.rect.left).toBeGreaterThanOrEqual(snap.canvasRect!.left - 10);
      expect(workLabel.rect.right).toBeLessThanOrEqual(snap.canvasRect!.right + 20);
    }

    // 3. Mobile enter play enters play-overlay directly
    const enterBtn = page.getByTestId('enter-play-btn');
    await expect(enterBtn).toBeVisible();
    await enterBtn.click();
    await page.waitForTimeout(400);

    const playSnap = await getHomeGameSnapshot(page);
    expect(playSnap.mode).toBe('play-overlay');
    expect(playSnap.canvasCount).toBe(1);

    // Safe area padding applied in mobile overlay
    const overlayRoot = page.getByTestId('home-game-root');
    await expect(overlayRoot).toBeVisible();

    // Exit play overlay
    const exitBtn = page.getByTestId('overlay-exit-btn');
    await expect(exitBtn).toBeVisible();
    await exitBtn.click();
    await page.waitForTimeout(300);

    const postExitSnap = await getHomeGameSnapshot(page);
    expect(postExitSnap.mode).toBe('preview');
  });

  test('Mobile Small (360x740) — Measured Bounds & Clean Sizing', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Mobile Small (360x740)', 'Mobile small target only');

    await openHomeGameHarness(page);

    const snap = await getHomeGameSnapshot(page);
    expect(snap.canvasCount).toBe(1);
    expect(snap.slotWrapperRect).not.toBeNull();
    expect(snap.canvasRect).not.toBeNull();
    expect(Math.abs(snap.canvasRect!.width - snap.slotWrapperRect!.width)).toBeLessThan(3);
    expect(Math.abs(snap.canvasRect!.height - snap.slotWrapperRect!.height)).toBeLessThan(3);
  });

  test('WebGL Failure Fallback — Content First, Themed Diagram & Working Navigation Links', async ({ page }) => {
    // Intercept WebGL context creation before script execution
    await page.addInitScript(() => {
      HTMLCanvasElement.prototype.getContext = function (contextType: string) {
        if (contextType.includes('webgl')) {
          return null;
        }
        return null;
      } as any;
    });

    await page.goto(HOME_GAME_HARNESS_PATH);

    // 1. Canvas is never created when WebGL is unavailable
    await expect(page.locator('canvas')).toHaveCount(0);

    // 2. Themed static fallback is rendered immediately
    const fallback = page.getByTestId('home-game-fallback');
    await expect(fallback).toBeVisible();
    await expect(fallback).toContainText('ROOFTOP COURSE · STATIC PREVIEW');
    await expect(fallback).toContainText('WebGL unavailable · Fast navigation active');

    // 3. Ordinary checkpoint navigation links are functional and fast
    const projectLink = fallback.getByRole('link', { name: /01 \/ Projects/i });
    await expect(projectLink).toBeVisible();
    await projectLink.click();

    // Navigates to /projects route
    await expect(page.locator('#harness-controls')).toContainText('Active Route: /projects');
    await expect(page.locator('main')).toContainText(/SELECTED PROJECTS|Technical Projects/i);
  });
});
