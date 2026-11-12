import { test, expect } from '@playwright/test';

test('dark default, explicit theme persistence, history and direct routes', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/about');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: 'Switch to light mode' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  // At narrow widths the same destinations are in the accessible menu.
  const menu = page.getByRole('button', { name: 'Open navigation menu' });
  if (await menu.isVisible()) await menu.click();
  await page.getByRole('link', { name: 'Projects', exact: true }).filter({ visible: true }).click();
  await expect(page).toHaveURL(/\/projects$/);
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page).toHaveTitle('Projects — Nikhil Sharma');
  await page.goBack();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.locator('#main-content')).toBeFocused();
  await page.goForward();
  await expect(page).toHaveURL(/\/projects$/);
  await page.goto('/does-not-exist');
  await expect(page.getByRole('heading', { name: /page not found/i })).toBeVisible();
  await expect(page).toHaveTitle('Page not found — Nikhil Sharma');
});

test('storage failure keeps usable dark theme', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(Storage.prototype, 'getItem', { value: () => { throw new Error('Storage disabled'); } });
    Object.defineProperty(Storage.prototype, 'setItem', { value: () => { throw new Error('Storage disabled'); } });
  });
  await page.goto('/resume');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: 'Switch to light mode' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('malformed fragment does not break route focus', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/about#%E0%A4%A');
  await expect(page.locator('#main-content')).toBeFocused();
  expect(errors).toEqual([]);
});

test('history navigation closes an open mobile menu and releases scroll', async ({ page }) => {
  await page.goto('/projects');
  const menu = page.getByRole('button', { name: 'Open navigation menu' });
  if (!(await menu.isVisible())) return;
  await menu.click();
  await page.getByRole('dialog').getByRole('link', { name: 'About', exact: true }).click();
  await expect(page).toHaveURL(/\/about$/);
  await menu.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/\/projects$/);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.locator('body')).not.toHaveClass(/scroll-locked/);
  await expect(page.locator('#main-content')).toBeFocused();
});

test('fragment focus follows its section and Back restores the reading position', async ({ page }) => {
  const viewport = page.viewportSize();
  if (viewport && viewport.height > 900) await page.setViewportSize({ ...viewport, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/about#contact');
  await expect(page.locator('#contact')).toBeFocused();
  await page.keyboard.press('Tab');
  expect(await page.evaluate(() => document.activeElement?.closest('#contact') !== null)).toBe(true);
  await page.locator('footer').scrollIntoViewIfNeeded();
  const before = await page.evaluate(() => window.scrollY);
  expect(before).toBeGreaterThan(100);
  await page.evaluate(() => document.querySelector<HTMLAnchorElement>('.desktop-nav a[href="/resume"]')?.click());
  await expect(page).toHaveURL(/\/resume$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/about#contact$/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeCloseTo(before, 0);
  await expect(page.locator('#contact')).toBeFocused();
});
