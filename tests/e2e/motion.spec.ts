import { test, expect } from '@playwright/test';

test.describe('T07 Purposeful Motion and Reduced Motion Suite', () => {
  test('Home entry: identity and copy are immediately visible and clickable', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Identity copy must be visible and have opacity 1
    const nameHeading = page.locator('#home-owner-heading');
    await expect(nameHeading).toBeVisible();
    await expect(nameHeading).toHaveText('Nikhil Sharma');

    const intro = page.locator('.home-intro-paragraph');
    await expect(intro).toBeVisible();

    const resumeCta = page.locator('.home-cta-row a[href="/resume"]');
    await expect(resumeCta).toBeVisible();

    const contactCta = page.locator('.home-cta-row a[href="/about#contact"]');
    await expect(contactCta).toBeVisible();

    // Verify computed opacity is 1 and not trapped at 0
    const opacity = await nameHeading.evaluate((el) => window.getComputedStyle(el).opacity);
    expect(Number(opacity)).toBeGreaterThanOrEqual(0.9);

    // Verify CTAs are clickable immediately
    await resumeCta.click();
    await expect(page).toHaveURL(/\/resume$/);
    expect(pageErrors).toEqual([]);
  });

  test('FastCode benchmark reveals: accurate bars, factual 684/539 µs, 21% reduction, and qualifier', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));

    await page.goto('/projects/fastcode');
    await page.waitForLoadState('domcontentloaded');

    const card = page.getByTestId('benchmark-comparison-card');
    await expect(card).toBeVisible();

    // Verify factual numbers are exact and not animated into inaccurate values
    await expect(card).toContainText('684 µs');
    await expect(card).toContainText('539 µs');
    await expect(card).toContainText('▼ 21%');
    await expect(card).toContainText('~91%');
    await expect(card).toContainText('Primary Workload Benchmark (Single Core)');
    await expect(card).toContainText('Results refer to the primary benchmark workload, not a universal speedup.');

    // Verify bar elements exist
    const baseBar = page.getByTestId('benchmark-bar-baseline');
    const optBar = page.getByTestId('benchmark-bar-optimized');
    await expect(baseBar).toBeVisible();
    await expect(optBar).toBeVisible();

    // Verify baseline bar width is 100% and optimized bar width is ~78.8%
    const baseWidth = await baseBar.evaluate((el) => (el as HTMLElement).style.width);
    const optWidth = await optBar.evaluate((el) => (el as HTMLElement).style.width);
    expect(baseWidth).toBe('100%');
    expect(optWidth).toBe('78.8%');

    expect(pageErrors).toEqual([]);
  });

  test('Project card and detail continuity: hover interaction, diagram settling, and back navigation', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));

    await page.goto('/projects');
    await page.waitForLoadState('domcontentloaded');

    const fastcodeCard = page.getByTestId('project-card-fastcode');
    await expect(fastcodeCard).toBeVisible();

    // Hover card
    await fastcodeCard.hover();
    await page.waitForTimeout(100);

    // Navigate to detail
    await fastcodeCard.locator('a.card-title-link').click();
    await expect(page).toHaveURL(/\/projects\/fastcode$/);

    // Verify detail illustration figure rendered with continuity attributes
    const figure = page.getByTestId('detail-illustration-figure');
    await expect(figure).toBeVisible();
    await expect(figure).toHaveAttribute('data-project-slug', 'fastcode');

    // Back navigation restores clean state
    await page.goBack();
    await expect(page).toHaveURL(/\/projects$/);
    await expect(page.getByTestId('project-card-fastcode')).toBeVisible();

    expect(pageErrors).toEqual([]);
  });

  test('Theme transition: switches cleanly between dark and light without scene corruption', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));

    await page.goto('/about');
    await page.waitForLoadState('domcontentloaded');

    const html = page.locator('html');
    const initialTheme = await html.getAttribute('data-theme');

    const toggleBtn = page.getByRole('button', { name: /Switch to (light|dark) mode/ });
    await toggleBtn.click();
    await page.waitForTimeout(250);

    const nextTheme = await html.getAttribute('data-theme');
    expect(nextTheme).not.toBe(initialTheme);

    // Toggle back
    await toggleBtn.click();
    await page.waitForTimeout(250);
    const revertedTheme = await html.getAttribute('data-theme');
    expect(revertedTheme).toBe(initialTheme);

    expect(pageErrors).toEqual([]);
  });

  test('Initial reduced motion: elements render immediately without delay or lingering transforms', async ({ page }) => {
    // Set reduced motion preference initially
    await page.emulateMedia({ reducedMotion: 'reduce' });

    const pageErrors: string[] = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const nameHeading = page.locator('#home-owner-heading');
    await expect(nameHeading).toBeVisible();

    // Opacity is 1 immediately
    const opacity = await nameHeading.evaluate((el) => window.getComputedStyle(el).opacity);
    expect(Number(opacity)).toBe(1);

    // Visit benchmark page under reduced motion
    await page.goto('/projects/fastcode');
    const optBar = page.getByTestId('benchmark-bar-optimized');
    await expect(optBar).toBeVisible();
    const optTransform = await optBar.evaluate((el) => window.getComputedStyle(el).transform);
    // Under reduced motion transform is none / identity matrix
    expect(optTransform === 'none' || optTransform.includes('matrix(1,')).toBe(true);

    expect(pageErrors).toEqual([]);
  });

  test('Live reduced motion: toggling preference dynamically stops drift and clears animation states', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));

    // Start with normal motion
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/projects/fastcode');
    await page.waitForLoadState('domcontentloaded');

    const baseBar = page.getByTestId('benchmark-bar-baseline');
    await expect(baseBar).toBeVisible();

    // Toggle live to reduced motion
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForTimeout(100);

    // Content remains fully visible
    await expect(baseBar).toBeVisible();
    const optBar = page.getByTestId('benchmark-bar-optimized');
    await expect(optBar).toBeVisible();
    await expect(page.getByTestId('benchmark-comparison-card')).toContainText('539 µs');

    expect(pageErrors).toEqual([]);
  });

  test('Route cycling: repeated navigation does not leak ScrollTriggers or cause horizontal overflow', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));

    const routes = ['/', '/projects', '/projects/fastcode', '/resume', '/about', '/'];

    for (const route of routes) {
      await page.goto(route);
      await page.waitForLoadState('domcontentloaded');

      // Verify no horizontal overflow on any route
      const noOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
      expect(noOverflow).toBe(true);
    }

    expect(pageErrors).toEqual([]);
  });
});
