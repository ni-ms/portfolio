import { test, expect } from '@playwright/test';

test.describe('Parkour Portfolio Integrated Multi-Viewport & Route Suite (T08)', () => {
  test('Desktop (1585x992) - Visual Review & Landmark Verification', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'Desktop Target (1585x992)') return;

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // 1. Verify semantic landmarks and real headline / identity copy
    const nameHeading = page.locator('#home-owner-heading');
    await expect(nameHeading).toHaveText('Nikhil Sharma');
    await expect(page.locator('.home-role-title')).toContainText('Software & Applied AI Engineer');
    await expect(page.locator('.home-intro-paragraph')).toContainText('I build production backend services and enterprise web applications');
    await expect(page.locator('.home-education-line')).toContainText('M.S. Software Engineering');

    // 2. Verify navigation links
    await expect(page.locator('header a[href="/projects"]')).toBeVisible();
    await expect(page.locator('header a[href="/resume"]')).toBeVisible();
    await expect(page.locator('header a[href="/about"]')).toBeVisible();

    // 3. Verify real PhotoPlaceholder rendered without broken image
    const photo = page.locator('.home-photo');
    await expect(photo).toBeVisible();

    // 4. Verify 3 selected projects in home preview
    const projectCards = page.locator('.home-projects-grid .portfolio-project-card');
    await expect(projectCards).toHaveCount(3);
    await expect(page.locator('#home-projects-heading')).toHaveText('Selected projects');

    await expect(page.getByRole('button', { name: 'Play Parkour Game' })).toBeVisible();
    await expect(page.locator('canvas')).toHaveCount(0);

    // Capture desktop reference screenshot
    await page.screenshot({
      path: 'design/verification/T08/desktop-1585x992-actual.png',
      fullPage: false,
    });
  });

  test('Mobile (390x844) - Landing State Verification', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'Mobile Target (390x844)') return;

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // 1. Verify mobile stacked layout
    await expect(page.locator('#home-owner-heading')).toHaveText('Nikhil Sharma');
    await expect(page.locator('.mobile-menu-button')).toBeVisible();
    await expect(page.locator('.home-intro-paragraph')).toBeVisible();

    await expect(page.getByRole('button', { name: 'Play Parkour Game' })).toBeVisible();
    await expect(page.locator('canvas')).toHaveCount(0);

    // Capture mobile landing reference screenshot
    await page.screenshot({
      path: 'design/verification/T08/mobile-390x844-landing-actual.png',
      fullPage: false,
    });
  });

  test('Mobile (390x844) - Expanded Play Mode & Touch Controls', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'Mobile Target (390x844)') return;

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    await page.getByRole('button', { name: 'Play Parkour Game' }).click();
    await expect(page.getByTestId('touch-jump-btn')).toBeVisible({ timeout: 20000 });
    await expect(page.locator('canvas')).toHaveCount(1);

    await page.screenshot({
      path: 'design/verification/T08/mobile-390x844-play-mode-actual.png',
      fullPage: false,
    });

    await page.getByTestId('overlay-exit-btn').click();
    await expect(page.locator('canvas')).toHaveCount(0);
  });

  test('Project Navigation & Detail Technical Deep Dive', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'Desktop Target (1585x992)') return;

    await page.goto('/projects');
    await page.waitForLoadState('domcontentloaded');

    // Verify all projects present
    const projectCards = page.locator('.portfolio-project-card');
    await expect(projectCards).toHaveCount(3);

    // Navigate to FastCode deep dive
    const fastcodeLink = page.locator('a[href="/projects/fastcode"]').first();
    await fastcodeLink.click();
    await expect(page).toHaveURL(/\/projects\/fastcode$/);

    // Verify detail elements
    await expect(page.locator('#project-title')).toContainText('FastCode');
    await expect(page.locator('.detail-illustration-figure')).toBeVisible();
    await expect(page.locator('[data-testid="benchmark-comparison-card"]')).toBeVisible();

    // Capture detail deep-dive screenshot
    await page.screenshot({
      path: 'design/verification/T08/desktop-1585x992-fastcode-detail.png',
      fullPage: false,
    });

    // Navigate back to projects
    await page.locator('a.detail-back-link').click();
    await expect(page).toHaveURL(/\/projects$/);
  });
});
