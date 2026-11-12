import { expect, test } from '@playwright/test';

test('desktop navigation has one divider and marks the active link in place', async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) <= 768, 'Desktop navigation');
  await page.goto('/projects');

  const nav = page.getByRole('navigation', { name: 'Primary navigation' });
  await expect(page.locator('.site-header')).toHaveCSS('border-bottom-width', '0px');
  await expect(page.locator('.header-container')).toHaveCSS('border-bottom-width', '1px');

  const projects = nav.getByRole('link', { name: 'Projects' });
  const about = nav.getByRole('link', { name: 'About' });
  await expect(projects).toHaveAttribute('aria-current', 'page');
  await expect(projects).toHaveCSS('border-bottom-color', 'rgb(214, 255, 100)');
  await about.click();
  await expect(about).toHaveAttribute('aria-current', 'page');
  await expect(about).toHaveCSS('border-bottom-color', 'rgb(214, 255, 100)');
  await expect(projects).toHaveCSS('border-bottom-color', 'rgba(0, 0, 0, 0)');
});

test('Selected projects fills the lower opening screen and reverses with scroll', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const heading = page.locator('.home-projects-heading');
  const grid = page.locator('.home-projects-grid');
  const title = page.locator('.home-role-title');
  const openingTitleBounds = (await title.boundingBox())!;
  const titleCoveredByProjects = () => title.evaluate(element => {
    const bounds = element.getBoundingClientRect();
    const foreground = document.elementFromPoint(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2);
    return Boolean(foreground?.closest('.home-projects-heading, .home-projects-reveal'));
  });
  const viewportHeight = page.viewportSize()!.height;
  const headingBounds = (await heading.boundingBox())!;
  expect(headingBounds.y).toBeLessThan(viewportHeight - 70);
  expect(headingBounds.y + headingBounds.height).toBeCloseTo(viewportHeight, 0);
  await expect(grid.locator('.portfolio-project-card')).toHaveCount(3);

  const offset = () => grid.evaluate(element => new DOMMatrix(getComputedStyle(element).transform).f);
  if (page.viewportSize()!.width >= 791 && viewportHeight >= 640) {
    const scene = page.locator('.home-scene');
    await expect(scene).toHaveAttribute('data-pinned', 'true');
    const initialScene = (await scene.boundingBox())!;
    const titleSize = () => heading.locator('h2').evaluate(element => parseFloat(getComputedStyle(element).fontSize));
    const openingTitleSize = await titleSize();
    await expect.poll(offset).toBeCloseTo(36, 0);
    await expect(grid).not.toBeInViewport();

    await page.evaluate(() => scrollTo({ top: Math.floor(innerHeight * 0.10), behavior: 'instant' }));
    await expect.poll(async () => (await heading.boundingBox())!.y).toBeLessThan(headingBounds.y - 5);
    await expect(grid).not.toBeInViewport();

    await page.evaluate(() => scrollTo({ top: Math.floor(innerHeight * 0.25), behavior: 'instant' }));
    await expect(grid).toBeInViewport();
    await expect.poll(offset).toBeLessThan(18);
    expect(await offset()).toBeGreaterThan(0);
    expect((await heading.boundingBox())!.height).toBeLessThan(headingBounds.height / 2);
    expect(await titleSize()).toBeLessThan(openingTitleSize * 0.75);
    const panelY = (await heading.boundingBox())!.y;
    expect(panelY).toBeGreaterThan(initialScene.y + 50);
    expect((await title.boundingBox())!.y).toBeCloseTo(openingTitleBounds.y, 0);
    expect((await scene.boundingBox())!.y).toBeCloseTo(initialScene.y, 0);
    const artScale = () => grid.locator('.card-media-img').first().evaluate(element => Number(getComputedStyle(element).scale));
    expect(await artScale()).toBeGreaterThan(1);

    // Sample the scrub during travel, before the grid reaches the dock.
    await page.waitForTimeout(550);
    const rise = await grid.evaluate(async element => {
      scrollTo({ top: Math.floor(innerHeight * 0.55), behavior: 'instant' });
      const positions: number[] = [];
      const start = performance.now();
      do {
        await new Promise(requestAnimationFrame);
        positions.push(element.getBoundingClientRect().top);
      } while (performance.now() - start < 400);
      return positions;
    });
    expect(new Set(rise.map(Math.round)).size).toBeGreaterThan(3);
    expect(rise[0] - rise.at(-1)!).toBeGreaterThan(100);
    await expect.poll(titleCoveredByProjects).toBe(true);
    expect((await title.boundingBox())!.y).toBeCloseTo(openingTitleBounds.y, 0);
    await page.evaluate(() => scrollTo({ top: Math.ceil(innerHeight * 0.77), behavior: 'instant' }));
    await expect.poll(async () => (await heading.boundingBox())!.y).toBeCloseTo(initialScene.y, 0);
    await expect.poll(titleCoveredByProjects).toBe(true);
    const dockedY = (await heading.boundingBox())!.y;
    await page.evaluate(() => scrollTo({ top: Math.floor(innerHeight * 0.98), behavior: 'instant' }));
    await expect.poll(async () => (await heading.boundingBox())!.y).toBeCloseTo(dockedY, 0);
    await expect.poll(offset).toBe(0);
    await expect(grid).toBeInViewport({ ratio: 0.94 });
    await page.evaluate(() => scrollTo({ top: Math.ceil(innerHeight * 1.06), behavior: 'instant' }));
    await expect.poll(artScale).toBe(1);
    const compactHeading = (await heading.boundingBox())!;
    expect(compactHeading.height).toBeCloseTo(68, 0);
    expect(await titleSize()).toBeCloseTo(openingTitleSize * 0.6, 0);
    expect(Math.abs((await grid.boundingBox())!.y - compactHeading.y - compactHeading.height)).toBeLessThan(2);
    const frames = await grid.locator('.card-media-img').evaluateAll(images =>
      images.map(image => ({ width: image.clientWidth, height: image.clientHeight, fit: getComputedStyle(image).objectFit })));
    expect(frames.every(({ width, height, fit }) =>
      Math.abs(width - frames[0].width) <= 1 && height === frames[0].height && fit === 'cover')).toBe(true);
    await page.evaluate(() => scrollTo({ top: Math.floor(innerHeight * 1.26), behavior: 'instant' }));
    await expect(heading).not.toBeInViewport();
    await page.evaluate(() => scrollTo({ top: Math.floor(innerHeight * 0.25), behavior: 'instant' }));
    await expect.poll(async () => (await heading.boundingBox())!.y).toBeGreaterThan(initialScene.y + 50);
    await expect(grid).toBeInViewport();
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    await expect.poll(offset).toBeCloseTo(36, 0);
    await expect.poll(async () => (await heading.boundingBox())!.y).toBeCloseTo(headingBounds.y, 0);
    await expect.poll(async () => (await heading.boundingBox())!.height).toBeCloseTo(headingBounds.height, 0);
    await expect.poll(titleSize).toBeCloseTo(openingTitleSize, 0);
    await expect(grid).not.toBeInViewport();
    await expect.poll(titleCoveredByProjects).toBe(false);

    const projectLink = grid.getByRole('link', { name: 'FastCode', exact: true });
    await projectLink.focus();
    await expect(projectLink).toBeInViewport();
    const heroLink = page.getByRole('link', { name: 'Parkour Game', exact: true });
    await heroLink.focus();
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
    return;
  }
  await expect.poll(offset).toBeCloseTo(64, 0);
  await page.evaluate(() => window.scrollTo({ top: innerHeight * 0.14, behavior: 'instant' }));
  await expect.poll(offset).toBeCloseTo(32, 0);
  await page.evaluate(() => window.scrollTo({ top: innerHeight * 0.32, behavior: 'instant' }));
  await expect.poll(offset).toBe(0);
  const overlapScroll = headingBounds.y - openingTitleBounds.y - openingTitleBounds.height / 2 + 18;
  await page.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), overlapScroll);
  await expect.poll(titleCoveredByProjects).toBe(true);
  await expect.poll(async () => (await title.boundingBox())!.y).toBeCloseTo(openingTitleBounds.y, 0);
  // The stacked mobile cards provide enough scrolling room to reach and hold the dock.
  if (page.viewportSize()!.width <= 620) {
    const navbar = page.locator('.site-header');
    const navbarBottom = (await navbar.boundingBox())!.height;
    const dockScroll = headingBounds.y - navbarBottom;
    await page.evaluate(y => scrollTo({ top: y + 10, behavior: 'instant' }), dockScroll);
    await expect.poll(async () => (await heading.boundingBox())!.y).toBeCloseTo(navbarBottom, 0);
    await page.evaluate(y => scrollTo({ top: y + 85, behavior: 'instant' }), dockScroll);
    await expect.poll(async () => (await heading.boundingBox())!.y).toBeCloseTo(navbarBottom, 0);
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await expect.poll(offset).toBeCloseTo(64, 0);
});

test('project hover gives quick artwork and link feedback', async ({ page }) => {
  test.skip(!await page.evaluate(() => matchMedia('(hover: hover) and (pointer: fine)').matches), 'Pointer hover');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/projects');
  const card = page.getByTestId('project-card-fastcode');
  await card.hover();
  await expect(card.locator('.card-media-img')).not.toHaveCSS('transform', 'none');
  await expect(card.locator('.card-title-link')).toHaveCSS('text-decoration-line', 'underline');
  await expect(card).toHaveCSS('transform', 'none');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(card.locator('.card-media-img')).toHaveCSS('transform', 'none');
  await expect(card.locator('.card-title-link')).toHaveCSS('text-decoration-line', 'underline');
});

test('Home reveals the words individually and settles in under a second', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/about');
  const samples = await page.locator('.header-brand').evaluate(async (element) => {
    (element as HTMLAnchorElement).click();
    const start = performance.now();
    const samples = [];
    do {
      await new Promise(requestAnimationFrame);
      const words = [...document.querySelectorAll('.home-title-word')];
      if (words.length === 5) {
        const offsets = words.map(word => new DOMMatrix(getComputedStyle(word).transform).f);
        samples.push({ time: performance.now() - start, offsets });
      }
    } while (performance.now() - start < 800);
    return samples;
  });
  expect(samples.some(({ offsets }) => offsets[0] > 0 && offsets[4] > offsets[0] + 8)).toBe(true);
  expect(samples.find(({ time }) => time >= 650)?.offsets).toEqual([0, 0, 0, 0, 0]);
});

test('the cursor outlines buttons, navigation links and hyperlinks, and stays circular over plain text', async ({ page }) => {
  test.skip(!await page.evaluate(() => matchMedia('(hover: hover) and (pointer: fine)').matches), 'Pointer hover');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/resume');
  await page.evaluate(() => document.fonts.ready);
  const cursor = page.locator('.portfolio-cursor');
  const ring = cursor.locator('.portfolio-cursor-ring');
  const shape = () => ring.evaluate(element => {
    const style = getComputedStyle(element, '::before');
    return { width: parseFloat(style.width), height: parseFloat(style.height), radius: style.borderRadius };
  });
  const circle = { width: 35, height: 35, radius: '50%' };

  const theme = page.getByRole('button', { name: 'Switch to light mode' });
  await theme.hover({ position: { x: 8, y: 20 } });
  await expect(cursor).toBeVisible();
  await expect(cursor).toHaveAttribute('data-active', 'true');
  await expect.poll(shape).toEqual({ width: 54, height: 52, radius: '5px' });
  const themeBounds = (await theme.boundingBox())!;
  await expect.poll(async () => (await ring.boundingBox())!.x).toBeCloseTo(themeBounds.x + themeBounds.width / 2, 0);

  const download = page.getByRole('link', { name: 'Download résumé ↓' });
  await download.hover();
  await expect.poll(async () => (await shape()).width).toBeCloseTo((await download.boundingBox())!.width + 10, 0);

  const link = page.locator('.header-brand');
  await expect(link.locator('.header-emblem')).toHaveCount(0);
  const linkBounds = (await link.boundingBox())!;
  expect(Math.abs(themeBounds.y - linkBounds.y)).toBeLessThan(1);
  await link.hover();
  await expect(link).toHaveCSS('cursor', 'none');
  await expect(cursor).toHaveAttribute('data-active', 'true');
  await expect.poll(async () => (await shape()).width).toBeCloseTo(linkBounds.width + 10, 0);

  const navLink = page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', { name: 'Blog' });
  await navLink.hover();
  await expect.poll(shape).toEqual({
    width: expect.closeTo((await navLink.boundingBox())!.width + 10, 1),
    height: expect.closeTo((await navLink.boundingBox())!.height + 8, 1),
    radius: '5px',
  });

  const heading = page.getByRole('heading', { name: 'Résumé', exact: true });
  const headingBounds = (await heading.boundingBox())!;
  await page.mouse.move(headingBounds.x + 20, headingBounds.y + headingBounds.height / 2);
  await expect.poll(shape).toEqual(circle);

  await expect(cursor).not.toHaveAttribute('data-active', 'true');

  await navLink.click();
  const article = page.getByRole('link', { name: 'Optimizing 1×1 convolution on a CPU' });
  await article.hover();
  await expect(cursor).toHaveAttribute('data-active', 'true');
  await expect.poll(async () => (await shape()).width).toBeCloseTo((await article.boundingBox())!.width + 10, 0);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(cursor).toBeHidden();
  await expect(link).toHaveCSS('cursor', 'pointer');
});
