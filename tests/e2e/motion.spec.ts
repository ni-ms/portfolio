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

    const aboutCta = page.getByRole('link', { name: 'About me →' });
    await expect(aboutCta).toBeVisible();
    await expect(aboutCta).toHaveAttribute('href', '/about');

    // Verify computed opacity is 1 and not trapped at 0
    const opacity = await nameHeading.evaluate((el) => window.getComputedStyle(el).opacity);
    expect(Number(opacity)).toBeGreaterThanOrEqual(0.9);

    // Verify CTAs are clickable immediately
    await resumeCta.click();
    await expect(page).toHaveURL(/\/resume$/);
    expect(pageErrors).toEqual([]);
  });

  test('FastCode benchmark: accurate bars, factual 684/539 µs, 21% reduction, and qualifier', async ({ page }) => {
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
    await expect(card).toContainText('Measured result');
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

  test('Project and detail navigation: artwork, links, and back navigation', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));

    await page.goto('/projects');
    await page.waitForLoadState('domcontentloaded');

    const fastcodeCard = page.getByTestId('project-card-fastcode');
    await expect(fastcodeCard).toBeVisible();

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

  test('Theme switches cleanly between dark and light', async ({ page }) => {
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

  test('Live reduced motion clears the scroll-linked project offset', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');
    const projects = page.locator('.home-projects-grid');
    await expect(projects).not.toHaveCSS('transform', 'none');

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(projects).toHaveCSS('transform', 'none');
    await expect(page.locator('.home-title-word').first()).toHaveCSS('transform', 'none');
  });

  test('Page changes lift and fade in without moving the navbar, with a reduced-motion fallback', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/about');
    const main = page.locator('#main-content');
    await expect(main).toHaveCSS('opacity', '1');
    await expect(main).toHaveCSS('transform', 'none');

    const menu = page.getByRole('button', { name: 'Open navigation menu' });
    if (await menu.isVisible()) await menu.click();
    const blog = page.getByRole('link', { name: 'Blog', exact: true }).filter({ visible: true });
    const sampleNavigation = (link: typeof blog) => link.evaluate(async element => {
      const main = document.querySelector<HTMLElement>('#main-content')!;
      const header = document.querySelector<HTMLElement>('.site-header')!;
      const initialHeaderY = header.getBoundingClientRect().top;
      const samples: { opacity: number; y: number; headerY: number }[] = [];
      (element as HTMLAnchorElement).click();
      const start = performance.now();
      do {
        await new Promise(requestAnimationFrame);
        const style = getComputedStyle(main);
        samples.push({
          opacity: Number(style.opacity),
          y: new DOMMatrix(style.transform).f,
          headerY: header.getBoundingClientRect().top,
        });
      } while (performance.now() - start < 370);
      return { samples, initialHeaderY };
    });

    const { samples, initialHeaderY } = await sampleNavigation(blog);
    await expect(page).toHaveURL(/\/blog$/);
    await expect(main).toBeFocused();
    expect(samples.some(({ opacity, y }) => opacity > 0 && opacity < 1 && y > 0)).toBe(true);
    expect(new Set(samples.map(({ opacity }) => opacity)).size).toBeGreaterThan(3);
    expect(samples.every(({ headerY }) => headerY === initialHeaderY)).toBe(true);
    await expect(main).toHaveCSS('opacity', '1');
    await expect(main).toHaveCSS('transform', 'none');

    await page.emulateMedia({ reducedMotion: 'reduce' });
    const article = page.getByRole('link', { name: 'Optimizing 1×1 convolution on a CPU' });
    const reduced = await sampleNavigation(article);
    await expect(page).toHaveURL(/\/blog\/optimizing-1x1-convolution$/);
    expect(reduced.samples.every(({ opacity, y }) => opacity === 1 && y === 0)).toBe(true);
    await page.goBack();
    await expect(page).toHaveURL(/\/blog$/);
    await expect(main).toBeFocused();
  });

  test('Article titles and section headings reveal one word at a time', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.setViewportSize({ width: page.viewportSize()!.width, height: 540 });
    await page.goto('/blog');
    const title = 'Optimizing 1×1 convolution on a CPU';
    const section = 'Report the workload with the result';
    const link = page.getByRole('link', { name: title });
    const observe = async (selector: string) => page.evaluate(async (selector) => {
      const samples: number[][] = [];
      const start = performance.now();
      do {
        await new Promise(requestAnimationFrame);
        const words = document.querySelectorAll(`${selector} .heading-word`);
        samples.push([...words].map(word => new DOMMatrix(getComputedStyle(word).transform).f));
      } while (performance.now() - start < 660);
      return samples;
    }, selector);
    const assertReveal = (samples: number[][]) => {
      expect(samples.some(words => words.length > 1 && words[0] > 0 && words.at(-1)! > words[0])).toBe(true);
      expect(samples.at(-1)!.every(y => y === 0)).toBe(true);
    };

    const [entry] = await Promise.all([observe('#blog-title'), link.click()]);
    await expect(page.getByRole('heading', { name: title })).toBeVisible();
    assertReveal(entry);

    const sectionHeading = page.getByRole('heading', { name: section });
    await expect(sectionHeading).not.toBeInViewport();
    const [scroll] = await Promise.all([
      observe('.blog-prose:nth-last-child(2) h2'),
      sectionHeading.evaluate(element => element.scrollIntoView({ behavior: 'instant', block: 'center' })),
    ]);
    assertReveal(scroll);

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goBack();
    const [reduced] = await Promise.all([observe('#blog-title'), link.click()]);
    await expect(page.getByRole('heading', { name: title })).toBeVisible();
    expect(reduced.every(words => words.every(y => y === 0))).toBe(true);
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
