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

    // 3. Next landing label 01 / WORK is framed cleanly inside canvas bounds
    const workLabel = initSnap.markerLabels.find((m) => m.text?.includes('01') || m.text?.includes('WORK'));
    expect(workLabel).toBeDefined();
    expect(workLabel!.rect.left).toBeGreaterThanOrEqual(initSnap.canvasRect!.left);
    expect(workLabel!.rect.right).toBeLessThanOrEqual(initSnap.canvasRect!.right);
    expect(workLabel!.rect.top).toBeGreaterThanOrEqual(initSnap.canvasRect!.top);
    expect(workLabel!.rect.bottom).toBeLessThanOrEqual(initSnap.canvasRect!.bottom);

    // 4. Enter inline play mode: click-to-play enters play-inline
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

    // 5. Light theme contrast verification: expand button meets contrast >= 4.5:1
    const themeBtn = page.locator('#toggle-theme-btn');
    await themeBtn.click(); // Switch to light
    await page.waitForTimeout(200);

    const expandBtn = page.getByTestId('inline-expand-btn');
    await expect(expandBtn).toBeVisible();
    const expandStyles = await expandBtn.evaluate((el) => {
      const s = getComputedStyle(el);
      return { color: s.color, background: s.backgroundColor };
    });
    // Color should be dark (#101414 = rgb(16, 20, 20)) over light background (rgb(242, 241, 234))
    expect(expandStyles.color).toContain('16, 20, 20');
    expect(expandStyles.background).toContain('242, 241, 234');

    await themeBtn.click(); // Switch back to dark
    await page.waitForTimeout(200);

    // 6. Expand button smoothly transitions from inline to expanded overlay
    await expandBtn.click();
    await page.waitForTimeout(350);

    const overlaySnap = await getHomeGameSnapshot(page);
    expect(overlaySnap.mode).toBe('play-overlay');
    // Canvas world persists without remounting (strictly 1 canvas)
    expect(overlaySnap.canvasCount).toBe(1);
    // Player position remains preserved
    expect(overlaySnap.physicalTranslation!.z).toBeCloseTo(moveSnap.physicalTranslation!.z, 1);

    // 7. Exit overlay restores preview mode and restores focus to enter-play-btn
    const exitBtn = page.getByTestId('overlay-exit-btn');
    await expect(exitBtn).toBeVisible();
    await exitBtn.click();
    await page.waitForTimeout(300);

    const exitSnap = await getHomeGameSnapshot(page);
    expect(exitSnap.mode).toBe('preview');
    expect(exitSnap.canvasCount).toBe(1);
    await expect(page.getByTestId('enter-play-btn')).toBeFocused();

    // 8. Theme switches preserve canvas and simulation state without leaks
    await themeBtn.click(); // Switch to light
    await page.waitForTimeout(250);
    const lightSnap = await getHomeGameSnapshot(page);
    expect(lightSnap.canvasCount).toBe(1);
    expect(lightSnap.physicalTranslation).toBeDefined();

    await themeBtn.click(); // Switch back to dark
    await page.waitForTimeout(250);
    const darkSnap = await getHomeGameSnapshot(page);
    expect(darkSnap.canvasCount).toBe(1);

    // 9. Inner route navigation unmounts game; returning remounts cleanly
    const navProjectsBtn = page.locator('#nav-projects');
    await navProjectsBtn.click();
    await page.waitForTimeout(200);
    expect(await page.locator('canvas').count()).toBe(0);

    const navHomeBtn = page.locator('#nav-home');
    await navHomeBtn.click();
    await page.waitForFunction(() => (window as any).__homeGame?.snapshot()?.canvasCount === 1, { timeout: 8000 });
    const remountSnap = await getHomeGameSnapshot(page);
    expect(remountSnap.canvasCount).toBe(1);

    // 10. Viewport Intersection & Offscreen Rendering Suspension
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

    // 2. Next landing label 01 / WORK is required to exist and must be completely framed inside canvas bounds
    const workLabel = snap.markerLabels.find((m) => m.text?.includes('01') || m.text?.includes('WORK'));
    expect(workLabel).toBeDefined();
    expect(workLabel!.rect.left).toBeGreaterThanOrEqual(snap.canvasRect!.left);
    expect(workLabel!.rect.right).toBeLessThanOrEqual(snap.canvasRect!.right);
    expect(workLabel!.rect.top).toBeGreaterThanOrEqual(snap.canvasRect!.top);
    expect(workLabel!.rect.bottom).toBeLessThanOrEqual(snap.canvasRect!.bottom);

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

    // Next landing label 01 / WORK is completely inside canvas bounds
    const workLabel = snap.markerLabels.find((m) => m.text?.includes('01') || m.text?.includes('WORK'));
    expect(workLabel).toBeDefined();
    expect(workLabel!.rect.left).toBeGreaterThanOrEqual(snap.canvasRect!.left);
    expect(workLabel!.rect.right).toBeLessThanOrEqual(snap.canvasRect!.right);
    expect(workLabel!.rect.top).toBeGreaterThanOrEqual(snap.canvasRect!.top);
    expect(workLabel!.rect.bottom).toBeLessThanOrEqual(snap.canvasRect!.bottom);
  });

  test('Desktop Sizing Settled — Return to Constrained Dimensions After Expanded Play', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Desktop Target (1585x992)', 'Desktop target only');

    await openHomeGameHarness(page);

    const initial = await page.evaluate(() => {
      const c = document.querySelector('.scene-canvas-container canvas');
      const s = document.querySelector('.game-slot-wrapper');
      return {
        canvasWidth: c?.getBoundingClientRect().width || 0,
        slotWidth: s?.getBoundingClientRect().width || 0,
      };
    });

    // Enter play and expand to overlay
    await page.getByTestId('enter-play-btn').click();
    await page.getByTestId('inline-expand-btn').click();
    await page.waitForFunction(() => document.querySelector('canvas')?.getBoundingClientRect().width === 1585);

    // Exit overlay
    await page.getByTestId('overlay-exit-btn').click();
    await page.waitForTimeout(600);

    const exitSettled = await page.evaluate(() => {
      const c = document.querySelector('.scene-canvas-container canvas');
      const s = document.querySelector('.game-slot-wrapper');
      return {
        canvasWidth: c?.getBoundingClientRect().width || 0,
        slotWidth: s?.getBoundingClientRect().width || 0,
        bodyScrollWidth: document.body.scrollWidth,
        scrollX: window.scrollX,
      };
    });

    expect(Math.abs(exitSettled.slotWidth - initial.slotWidth)).toBeLessThan(2);
    expect(Math.abs(exitSettled.canvasWidth - initial.canvasWidth)).toBeLessThan(2);
    expect(exitSettled.bodyScrollWidth).toBeLessThanOrEqual(1585);
    expect(exitSettled.scrollX).toBe(0);
  });

  test('Mobile Portal Containment & Tab Navigation — No Document Pan', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Mobile Target (390x844)', 'Mobile target only');

    await openHomeGameHarness(page);

    // Document and body widths must not exceed viewport width
    const initialWidths = await page.evaluate(() => ({
      docWidth: document.documentElement.scrollWidth,
      bodyWidth: document.body.scrollWidth,
    }));
    expect(initialWidths.docWidth).toBeLessThanOrEqual(390);
    expect(initialWidths.bodyWidth).toBeLessThanOrEqual(390);

    // Tab through all markers to Jump to 03 RÉSUMÉ section
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab');
      const label = await page.evaluate(() => document.activeElement?.getAttribute('aria-label') || '');
      if (label === 'Jump to 03 RÉSUMÉ section') break;
    }

    const tabState = await page.evaluate(() => {
      const active = document.activeElement;
      const rect = active?.getBoundingClientRect();
      const canvas = document.querySelector('canvas');
      const canvasRect = canvas?.getBoundingClientRect();
      return {
        activeLabel: active?.getAttribute('aria-label'),
        scrollX: window.scrollX,
        docScrollLeft: document.documentElement.scrollLeft,
        canvasLeft: canvasRect?.left,
        activeLeft: rect?.left,
        activeRight: rect?.right,
      };
    });

    expect(tabState.activeLabel).toBe('Jump to 03 RÉSUMÉ section');
    expect(tabState.scrollX).toBe(0);
    expect(tabState.docScrollLeft).toBe(0);
    expect(Math.abs((tabState.canvasLeft || 0) - 24)).toBeLessThan(2);
    expect(tabState.activeLeft).toBeGreaterThanOrEqual(0);
    expect(tabState.activeRight).toBeLessThanOrEqual(390);
  });

  test('WebGL Context Loss during Expanded Play — Safely Unmounts, Clears Input & Unlocks Scroll', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Desktop Target (1585x992)', 'Desktop target only');

    await openHomeGameHarness(page);

    // Enter play and expand to overlay
    await page.getByTestId('enter-play-btn').click();
    await page.getByTestId('inline-expand-btn').click();
    await page.waitForTimeout(200);

    expect(await page.evaluate(() => document.body.classList.contains('scroll-locked'))).toBe(true);

    // 1. Verify foreign canvas context loss does NOT affect owned simulation
    const foreignResult = await page.evaluate(async () => {
      const owned = document.querySelector('.scene-canvas-container canvas') as HTMLCanvasElement;
      const ownGl = owned.getContext('webgl2') as WebGL2RenderingContext;
      const foreign = document.createElement('canvas');
      foreign.id = 'foreign-test-canvas';
      foreign.style.cssText = 'position:fixed;width:2px;height:2px;bottom:0;left:0';
      document.body.append(foreign);
      const foreignGl = foreign.getContext('webgl2') as WebGL2RenderingContext;

      return await new Promise<{ ownLost: boolean; foreignLost: boolean; prevented: boolean; mode: string }>((resolve) => {
        foreign.addEventListener('webglcontextlost', (e) => {
          resolve({
            ownLost: ownGl.isContextLost(),
            foreignLost: foreignGl.isContextLost(),
            prevented: e.defaultPrevented,
            mode: (window as any).__homeGame?.gameStore?.getState().mode,
          });
        }, { once: true });
        foreignGl.getExtension('WEBGL_lose_context')?.loseContext();
      });
    });
    expect(foreignResult.ownLost).toBe(false);
    expect(foreignResult.foreignLost).toBe(true);
    expect(foreignResult.mode).toBe('play-overlay');
    await expect(page.locator('.scene-canvas-container canvas')).toHaveCount(1);
    await expect(page.getByTestId('home-game-fallback')).toHaveCount(0);

    // 2. Trigger actual WebGL context loss on OWNED canvas via extension
    const lostInjected = await page.evaluate(() => {
      const canvas = document.querySelector('.scene-canvas-container canvas') as HTMLCanvasElement;
      if (!canvas) return false;
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      const ext = gl?.getExtension('WEBGL_lose_context');
      if (!ext) return false;
      ext.loseContext();
      return true;
    });
    expect(lostInjected).toBe(true);

    // Fallback UI should mount
    const fallback = page.getByTestId('home-game-fallback');
    await expect(fallback).toBeVisible();
    await expect(fallback).toContainText('ROOFTOP COURSE · STATIC PREVIEW');
    await expect(fallback).toContainText('WebGL error · Fast navigation active');

    // Simulation cleanly unmounts
    await expect(page.locator('.scene-canvas-container canvas')).toHaveCount(0);

    // Store mode is reset to preview
    expect(await page.evaluate(() => (window as any).__homeGame?.gameStore?.getState().mode)).toBe('preview');

    // Body scroll lock is removed
    expect(await page.evaluate(() => document.body.classList.contains('scroll-locked'))).toBe(false);

    // Focus automatically connected to fallback link
    const focusedTag = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedTag).toBe('A');

    // Keyboard movement is not accepted
    await page.keyboard.down('KeyW');
    await page.waitForTimeout(50);
    const input = await page.evaluate(() => (window as any).__homeGame?.gameStore?.getState().input);
    expect(input?.forward).toBe(false);
    await page.keyboard.up('KeyW');
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

    // 3. Modified click on fallback link retains native browser action without navigating current view
    const projectLink = fallback.getByRole('link', { name: /01 \/ Projects/i });
    await expect(projectLink).toBeVisible();

    const modifiedClick = await projectLink.evaluate((el) => {
      let result: { defaultPrevented: boolean } | null = null;
      const bubbleHandler = (e: MouseEvent) => {
        result = { defaultPrevented: e.defaultPrevented };
        // Prevent top-frame browser navigation in test harness after recording
        e.preventDefault();
      };
      document.addEventListener('click', bubbleHandler, { once: true });
      const evt = new MouseEvent('click', { bubbles: true, cancelable: true, ctrlKey: true });
      el.dispatchEvent(evt);
      return result;
    });
    // Our handler must NOT have called preventDefault
    expect((modifiedClick as any)?.defaultPrevented).toBe(false);
    // Active route is unchanged
    await expect(page.locator('#harness-controls')).toContainText('Active Route: /');

    // 4. Ordinary unmodified primary click navigates to /projects route
    await projectLink.click();
    await expect(page.locator('#harness-controls')).toContainText('Active Route: /projects');
    await expect(page.locator('main')).toContainText(/SELECTED PROJECTS|Technical Projects/i);
  });

  test('Lazy Load Rejection — Honest Fallback Error State & Working Content', async ({ page }) => {
    // Abort GameExperience module request to simulate network failure during lazy loading
    await page.route('**/src/game/GameExperience.tsx*', (route) => route.abort('failed'));

    await page.goto(HOME_GAME_HARNESS_PATH);

    // 1. Fallback appears with honest error status (NOT "Course ready" or "3D SIMULATION")
    const fallback = page.getByTestId('home-game-fallback');
    await expect(fallback).toBeVisible();
    await expect(fallback).toContainText('ROOFTOP COURSE · STATIC PREVIEW');
    await expect(fallback).toContainText('WebGL error · Fast navigation active');
    await expect(fallback).not.toContainText('Course ready');

    // 2. Zero 3D canvases rendered
    await expect(page.locator('canvas')).toHaveCount(0);

    // 3. Ordinary fallback navigation works
    const aboutLink = fallback.getByRole('link', { name: /02 \/ Explorations/i });
    await expect(aboutLink).toBeVisible();
    await aboutLink.click();
    await expect(page.locator('#harness-controls')).toContainText('Active Route: /about');
  });
});
