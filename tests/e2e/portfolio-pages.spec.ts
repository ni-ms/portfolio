import { test, expect } from '@playwright/test';

const routes = [
  ['/', 'Nikhil Sharma', 'Home'],
  ['/projects', 'Projects', 'Projects'],
  ['/projects/fastcode', 'FastCode', 'FastCode'],
  ['/projects/scottypi', 'ScottyPi', 'ScottyPi'],
  ['/projects/langmetric', 'Langmetric', 'Langmetric'],
  ['/resume', 'Résumé', 'Résumé'],
  ['/about', 'About', 'About'],
] as const;

test('mounted portfolio routes work in both themes with factual content and no overflow', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const theme of ['dark', 'light']) {
    await page.goto('/about');
    const current = await page.locator('html').getAttribute('data-theme');
    if (current !== theme) await page.getByRole('button', { name: `Switch to ${theme} mode` }).click();
    for (const [route, text, title] of routes) {
      await page.goto(route);
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      await expect(page).toHaveTitle(`${title} — Nikhil Sharma`);
      await expect(page.locator('main')).toHaveCount(1);
      await expect(page.locator('main')).toContainText(text);
      await expect(page.locator('main')).not.toContainText(/YOUR NAME|PROJECT ONE|Portfolio content is being integrated/);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      if (route !== '/') await expect(page.locator('canvas')).toHaveCount(0);
    }
  }
  expect(errors).toEqual([]);
});

test('project navigation and genuine résumé download are wired through the application', async ({ page, request }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'FastCode', exact: true }).click();
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
