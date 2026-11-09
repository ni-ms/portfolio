import { test, expect } from '@playwright/test';
import { openGameplayHarness, getGameplaySnapshot, enterPlayMode, exitPlayMode } from './fixtures/gameplay';

test.describe('Gameplay & GameExperience Durable Tracked Suite', () => {
  test('Desktop (1585x992) — Inline Lifecycle, Measured Keyboard Movement & Focus Restoration', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Desktop Target (1585x992)', 'Desktop target only');

    await openGameplayHarness(page);

    // 1. Single persistent canvas mounted in preview
    const initialSnap = await getGameplaySnapshot(page);
    expect(initialSnap.canvas).toBe(1);
    expect(initialSnap.mode).toBe('preview');

    // 2. Click-to-play enters inline mode
    await enterPlayMode(page);
    const playSnap = await getGameplaySnapshot(page);
    expect(playSnap.mode).toBe('play-inline');

    // 3. Measure real movement via forward keyboard drive
    const beforeMove = await getGameplaySnapshot(page);
    await page.keyboard.down('KeyW');
    await page.waitForTimeout(250);
    await page.keyboard.up('KeyW');
    await page.waitForTimeout(100);

    const afterMove = await getGameplaySnapshot(page);
    // Player must have moved forward (negative Z delta)
    expect(afterMove.physical).toBeDefined();
    expect(beforeMove.physical).toBeDefined();
    expect(afterMove.physical!.z).toBeLessThan(beforeMove.physical!.z - 0.2);

    // 4. Exit inline play and assert focus restoration to connected button
    await exitPlayMode(page, false);
    const exitSnap = await getGameplaySnapshot(page);
    expect(exitSnap.mode).toBe('preview');
    expect(exitSnap.locked).toBe(false);
    await expect(page.getByTestId('enter-play-btn')).toBeFocused();
  });

  test('Desktop (1585x992) — Viewport Intersection & Offscreen Rendering Suspension', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Desktop Target (1585x992)', 'Desktop target only');

    await openGameplayHarness(page);

    // Partly scrolled within viewport: rendering advances
    await page.evaluate(() => window.scrollTo(0, 300));
    await page.waitForTimeout(150);
    const snapA = await getGameplaySnapshot(page);
    await page.waitForTimeout(300);
    const snapB = await getGameplaySnapshot(page);
    expect(snapB.renderFrame!).toBeGreaterThan(snapA.renderFrame!);

    // Pushed below fold: container is scrolled offscreen
    await page.evaluate(() => {
      const vp = document.querySelector('#viewport') as HTMLElement;
      if (vp) vp.style.marginTop = '1400px';
    });
    // IntersectionObserver and React commit asynchronously. Wait for the actual
    // suspended state, then measure frame stability; a wall-clock sleep can
    // sample before the observer commits on a software-rendered browser.
    await expect.poll(
      async () => (await getGameplaySnapshot(page)).frameloop,
      { timeout: 2000, message: 'Offscreen rendering suspends within two seconds' }
    ).toBe('never');

    const offscreenSnapStart = await getGameplaySnapshot(page);
    expect(offscreenSnapStart.rect!.top).toBeGreaterThan(992);
    expect(offscreenSnapStart.frameloop).toBe('never');

    await page.waitForTimeout(350);
    const offscreenSnapEnd = await getGameplaySnapshot(page);
    // Frameloop is suspended: renderFrame did not advance
    expect(offscreenSnapEnd.renderFrame).toBe(offscreenSnapStart.renderFrame);
  });

  test('Mobile (390x844) — Real Multi-Touch Movement, Jump Impulse, Release & Pointer Cancellation', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Mobile Target (390x844)', 'Mobile target only');

    await openGameplayHarness(page);
    await enterPlayMode(page);

    const start = await getGameplaySnapshot(page);
    expect(start.mode).toBe('play-overlay');
    expect(start.locked).toBe(true);

    // Measure bounding boxes of touch controls
    const upBox = await page.getByTestId('dpad-up').boundingBox();
    const jumpBox = await page.getByTestId('touch-jump-btn').boundingBox();
    expect(upBox).not.toBeNull();
    expect(jumpBox).not.toBeNull();

    const upPoint = { id: 61, x: upBox!.x + upBox!.width / 2, y: upBox!.y + upBox!.height / 2 };
    const jumpPoint = { id: 62, x: jumpBox!.x + jumpBox!.width / 2, y: jumpBox!.y + jumpBox!.height / 2 };

    const cdp = await page.context().newCDPSession(page);

    // Dispatch real two-finger touch: D-pad Up + Touch Jump simultaneously
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [upPoint] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [upPoint, jumpPoint] });
    await page.waitForTimeout(140);

    const both = await getGameplaySnapshot(page);
    expect(both.input.forward).toBe(true);
    expect(both.input.jump).toBe(true);
    // Real physical displacement: jump impulse gained height (Y) and move gained forward displacement (negative Z)
    expect(both.physical!.y).toBeGreaterThan(start.physical!.y + 0.15);
    expect(both.physical!.z).toBeLessThan(start.physical!.z - 0.15);

    // Release jump finger: forward input must persist, jump must release
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [jumpPoint] });
    await page.waitForTimeout(60);
    const release = await getGameplaySnapshot(page);
    expect(release.input.forward).toBe(true);
    expect(release.input.jump).toBe(false);

    // Pointer cancellation on D-pad Up clears movement input cleanly
    await page.getByTestId('dpad-up').dispatchEvent('pointercancel', { pointerId: 61, pointerType: 'touch' });
    await page.waitForTimeout(60);
    const cancelled = await getGameplaySnapshot(page);
    expect(cancelled.input.forward).toBe(false);
  });

  test('Mobile (390x844) — Modal Focus Containment, Exit & Scroll Restoration', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Mobile Target (390x844)', 'Mobile target only');

    await openGameplayHarness(page);

    // Scroll to 180 before entering play
    await page.evaluate(() => window.scrollTo(0, 180));
    await page.waitForTimeout(100);

    await enterPlayMode(page);
    const openSnap = await getGameplaySnapshot(page);
    expect(openSnap.mode).toBe('play-overlay');
    expect(openSnap.locked).toBe(true);

    // Modal focus trap containment: Shift+Tab from exit button wraps to bottom jump button
    await page.keyboard.press('Shift+Tab');
    const backFocus = await getGameplaySnapshot(page);
    expect(backFocus.focus).toBe('touch-jump-btn');

    // Tab from jump button wraps back to top exit button
    await page.getByTestId('touch-jump-btn').focus();
    await page.keyboard.press('Tab');
    const fwdFocus = await getGameplaySnapshot(page);
    expect(fwdFocus.focus).toBe('overlay-exit-btn');

    // Exit overlay
    await page.getByTestId('overlay-exit-btn').click();
    await page.waitForTimeout(200);

    const exitSnap = await getGameplaySnapshot(page);
    expect(exitSnap.mode).toBe('preview');
    expect(exitSnap.locked).toBe(false);
    expect(exitSnap.scrollY).toBe(180);
    await expect(page.getByTestId('enter-play-btn')).toBeFocused();
  });
});
