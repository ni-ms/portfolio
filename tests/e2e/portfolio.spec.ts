import { test, expect } from '@playwright/test';

test.describe('Parkour Portfolio Multi-Viewport Suite', () => {

  test('Desktop (1585x992) - Visual Review & Landmark Verification', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'Desktop Target (1585x992)') return;

    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // 1. Verify semantic landmarks and headline copy
    await expect(page.locator('.brand-name')).toHaveText('YOUR NAME');
    await expect(page.locator('.eyebrow-text')).toHaveText('PERSONAL PORTFOLIO / 001');
    
    // Headline spans
    const headlineLines = page.locator('.headline-line');
    await expect(headlineLines.first()).toHaveText('WORK');
    await expect(headlineLines.nth(1)).toHaveText('& IDEAS.');
    await expect(page.locator('.hero-subhead')).toHaveText('A collection of projects, ideas, and experiments.');

    // 2. Verify navigation links
    await expect(page.locator('.nav-link[href="#work"]')).toBeVisible();
    await expect(page.locator('.nav-link[href="#explorations"]')).toBeVisible();
    await expect(page.locator('.nav-link[href="#resume"]')).toBeVisible();
    await expect(page.locator('.nav-link[href="#contact"]')).toBeVisible();

    // 3. Verify no headshot or avatar on landing page
    const avatars = page.locator('img[alt*="avatar"], img[alt*="portrait"], img[alt*="headshot"]');
    await expect(avatars).toHaveCount(0);

    // 4. Verify 3-column selected work previews
    const projectCards = page.locator('.project-card');
    await expect(projectCards).toHaveCount(3);
    await expect(page.locator('#work .section-badge-title')).toHaveText('SELECTED PROJECTS');

    // 5. Verify 3D canvas is mounted
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    // Settle animation/physics frames
    await page.waitForTimeout(2000);

    // Capture desktop reference screenshot
    await page.screenshot({
      path: 'design/verification/desktop-1585x992-actual.png',
      fullPage: false
    });
  });

  test('Mobile (390x844) - Landing State Verification', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'Mobile Target (390x844)') return;

    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // 1. Verify mobile stacked layout
    await expect(page.locator('.brand-name')).toHaveText('YOUR NAME');
    await expect(page.locator('.mobile-menu-button')).toBeVisible();
    
    const headlineLines = page.locator('.headline-line');
    await expect(headlineLines.first()).toHaveText('WORK');
    
    await expect(page.locator('.mobile-play-button')).toBeVisible();
    await expect(page.locator('.mobile-play-button')).toHaveText('PLAY THE COURSE ↗');

    // Settle frames
    await page.waitForTimeout(1800);

    // Capture mobile landing reference screenshot
    await page.screenshot({
      path: 'design/verification/mobile-390x844-landing-actual.png',
      fullPage: false
    });
  });

  test('Mobile (390x844) - Expanded Play Mode & Multi-Touch Overlay', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'Mobile Target (390x844)') return;

    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Tap PLAY THE COURSE
    await page.locator('.mobile-play-button').click();
    await page.waitForSelector('.game-overlay-container');

    // Verify top status bar
    const overlay = page.locator('.game-overlay-container');
    await expect(overlay).toBeVisible();
    await expect(overlay).toContainText('EXPLORATION /');
    await expect(overlay).toContainText('ROOFTOPS');
    await expect(overlay.locator('[data-testid="overlay-exit-btn"]')).toBeVisible();

    // Verify touch controls
    await expect(page.locator('.dpad-cluster')).toBeVisible();
    await expect(page.locator('[data-testid="dpad-up"]')).toBeVisible();
    await expect(page.locator('[data-testid="dpad-down"]')).toBeVisible();
    await expect(page.locator('[data-testid="dpad-left"]')).toBeVisible();
    await expect(page.locator('[data-testid="dpad-right"]')).toBeVisible();

    await expect(page.locator('[data-testid="touch-jump-btn"]')).toBeVisible();
    await expect(page.locator('[data-testid="touch-reset-btn"]')).toBeVisible();
    await expect(overlay).toContainText('MOVE + JUMP TO EXPLORE');

    // Verify scroll lock on body
    const bodyClass = await page.evaluate(() => document.body.className);
    expect(bodyClass).toContain('scroll-locked');

    // Settle overlay frames
    await page.waitForTimeout(1800);

    // Capture mobile expanded play screenshot
    await page.screenshot({
      path: 'design/verification/mobile-390x844-play-mode-actual.png',
      fullPage: false
    });

    // Exit overlay
    await overlay.locator('[data-testid="overlay-exit-btn"]').click();
    await expect(page.locator('.game-overlay-container')).toHaveCount(0);

    // Verify scroll lock removed
    const bodyClassAfter = await page.evaluate(() => document.body.className);
    expect(bodyClassAfter).not.toContain('scroll-locked');
  });

  test('Project Modal Dialog Focus & Dismissal', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'Desktop Target (1585x992)') return;

    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Click Project One card
    const firstProject = page.locator('.project-card').first();
    await firstProject.click();

    const modal = page.locator('.project-modal-dialog');
    await expect(modal).toBeVisible();
    await expect(page.locator('#modal-project-title')).toContainText('PROJECT ONE');

    // Press Escape to dismiss
    await page.keyboard.press('Escape');
    await expect(modal).toHaveCount(0);
  });
});
