import { test, expect } from '@playwright/test';

const routes = [
  ['/', 'Nikhil Sharma', 'Home'],
  ['/projects', 'Projects', 'Projects'],
  ['/projects/fastcode', 'FastCode', 'FastCode'],
  ['/projects/scottypi', 'ScottyPi', 'ScottyPi'],
  ['/projects/langmetric', 'Langmetric', 'Langmetric'],
  ['/blog', 'Blog', 'Blog'],
  ['/blog/optimizing-1x1-convolution', '684 µs', 'Optimizing 1×1 convolution on a CPU'],
  ['/blog/combining-keyword-and-semantic-search', '133 passages', 'Combining keyword and semantic search'],
  ['/resume', 'Résumé', 'Résumé'],
  ['/about', 'About', 'About'],
  ['/missing-page', 'Page Not Found', 'Page not found'],
] as const;

test('mounted portfolio routes work in both themes with factual content and no overflow', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const theme of ['dark', 'light']) {
    await page.goto('/about');
    const current = await page.locator('html').getAttribute('data-theme');
    if (current !== theme) await page.getByRole('button', { name: `Switch to ${theme} mode` }).click();
    let homeFrame;
    for (const [route, text, title] of routes) {
      await page.goto(route);
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      await expect(page).toHaveTitle(`${title} — Nikhil Sharma`);
      await expect(page.locator('main')).toHaveCount(1);
      await expect(page.locator('main')).toContainText(text);
      await expect(page.locator('main')).not.toContainText(/YOUR NAME|PROJECT ONE|Portfolio content is being integrated/);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const frame = page.locator('main .portfolio-frame');
      await expect(frame).toHaveCSS('border-left-width', '1px');
      const { x, width } = (await frame.boundingBox())!;
      if (route === '/') homeFrame = { x, width };
      expect({ x, width }).toEqual(homeFrame);
      if (route !== '/') await expect(page.locator('canvas')).toHaveCount(0);
    }
  }
  expect(errors).toEqual([]);
});

test('project navigation and genuine résumé download are wired through the application', async ({ page, request }) => {
  await page.goto('/');
  const fastCode = page.getByRole('link', { name: 'FastCode', exact: true });
  const { width, height } = page.viewportSize()!;
  if (width >= 791 && height >= 640) {
    await expect(page.locator('.home-scene')).toHaveAttribute('data-pinned', 'true');
    await page.evaluate(() => scrollTo({ top: innerHeight * 1.06, behavior: 'instant' }));
    await expect(fastCode).toBeInViewport();
  }
  await fastCode.click();
  await expect(page).toHaveURL(/\/projects\/fastcode$/);
  await expect(page.locator('#main-content')).toBeFocused();
  await expect(page.locator('main')).toContainText('684 µs');
  await expect(page.locator('main')).toContainText('539 µs');
  await expect(page.locator('main')).toContainText('primary benchmark workload');
  await page.goto('/resume');
  await expect(page.locator('main')).toContainText('Tech Mahindra');
  await expect(page.locator('main')).toContainText('Intuitive Surgical');
  await expect(page.locator('main')).toContainText('Expected 2027');
  const response = await request.get('/resume/Nikhil_Sharma_Resume.pdf');
  expect(response.ok()).toBe(true);
  expect((await response.body()).subarray(0, 5).toString()).toBe('%PDF-');
  await expect(page.locator('a[download][href="/resume/Nikhil_Sharma_Resume.pdf"]').first()).toBeVisible();
});

test('Résumé places Education below Core skills and joins the frame to the footer', async ({ page }) => {
  await page.goto('/resume');
  await page.evaluate(() => document.fonts.ready);
  const bounds = await page.evaluate(() => {
    const skills = document.getElementById('skills-heading')!.closest('section')!.getBoundingClientRect();
    const education = document.getElementById('education-heading')!.closest('section')!.getBoundingClientRect();
    const frame = document.querySelector('.resume-page-container')!.getBoundingClientRect();
    const footer = document.querySelector('.site-footer')!.getBoundingClientRect();
    const links = document.querySelector('.resume-projects-list')!.getBoundingClientRect();
    const research = document.getElementById('research-heading')!.closest('section')!.getBoundingClientRect();
    return { skillsBottom: skills.bottom, educationTop: education.top, frameBottom: frame.bottom, footerTop: footer.top, linksBottom: links.bottom, researchTop: research.top };
  });
  expect(bounds.educationTop).toBeCloseTo(bounds.skillsBottom, 0);
  expect(bounds.frameBottom).toBeCloseTo(bounds.footerTop, 0);
  expect(bounds.linksBottom).toBeCloseTo(bounds.researchTop, 0);
});


test('Blog links work from the navigation through the case study, with the new icon and no QA page', async ({ page, request }) => {
  await page.goto('/');
  const menu = page.getByRole('button', { name: 'Open navigation menu' });
  if (await menu.isVisible()) await menu.click();
  await page.getByRole('link', { name: 'Blog', exact: true }).filter({ visible: true }).click();
  await expect(page).toHaveURL(/\/blog$/);
  await page.getByRole('link', { name: 'Optimizing 1×1 convolution on a CPU', exact: true }).click();
  await expect(page.locator('#main-content')).toBeFocused();
  await expect(page).toHaveTitle('Optimizing 1×1 convolution on a CPU — Nikhil Sharma');
  await page.getByRole('link', { name: 'FastCode case study ↗' }).click();
  await expect(page).toHaveURL(/\/projects\/fastcode$/);
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'Optimizing 1×1 convolution on a CPU' })).toBeVisible();

  const footer = page.getByRole('contentinfo');
  await expect(footer).not.toContainText('Nearly 3 years');
  await expect(footer.getByRole('link')).toHaveCount(3);
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', '/favicon.svg');
  const icon = await request.get('/favicon.svg');
  expect(icon.ok()).toBe(true);
  expect(icon.headers()['content-type']).toContain('image/svg+xml');
  const qa = await request.get('/qa/index.html');
  expect(await qa.text()).not.toContain('Portfolio QA recordings');
});
