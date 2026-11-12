import { expect, test } from '@playwright/test';

test('desktop navigation uses one divider and the indicator tracks the active link', async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) <= 768, 'Desktop navigation');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/projects');
  await page.evaluate(() => document.fonts.ready);

  const nav = page.getByRole('navigation', { name: 'Primary navigation' });
  const indicator = nav.locator('.nav-active-indicator');
  await expect(indicator).toBeVisible();
  await expect(page.locator('.site-header')).toHaveCSS('border-bottom-width', '0px');
  await expect(page.locator('.header-container')).toHaveCSS('border-bottom-width', '1px');

  const { positions, target } = await nav.evaluate(async (element) => {
    const bar = element.querySelector<HTMLElement>('.nav-active-indicator')!;
    const about = element.querySelector<HTMLAnchorElement>('[href="/about"]')!;
    const positions = [bar.getBoundingClientRect().left];
    about.click();
    const start = performance.now();
    do {
      await new Promise(requestAnimationFrame);
      positions.push(bar.getBoundingClientRect().left);
    } while (performance.now() - start < 600);
    return { positions, target: about.getBoundingClientRect().left };
  });
  expect(positions.some((position) => position > positions[0] + 2 && position < target - 2)).toBe(true);
  expect(Math.abs(positions.at(-1)! - target)).toBeLessThan(1);
  await expect(nav.getByRole('link', { name: 'About' })).toHaveAttribute('aria-current', 'page');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await nav.getByRole('link', { name: 'Projects' }).click();
  await expect(page).toHaveURL(/\/projects$/);
  const projects = nav.getByRole('link', { name: 'Projects' });
  await expect(projects).toHaveAttribute('aria-current', 'page');
  await expect(indicator).toBeHidden();
  await expect(projects).toHaveCSS('border-bottom-color', 'rgb(214, 255, 100)');
});

test('supporting projects settle on scroll and clear animation when motion is reduced', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/projects');

  const project = page.getByTestId('project-card-scottypi');
  const card = page.locator('.projects-folder-item').first();
  await expect(card).not.toHaveCSS('transform', 'none');
  if ((page.viewportSize()?.width ?? 0) > 900) {
    const stacked = await page.locator('.projects-folder-item').evaluateAll(([front, back]) => {
      const a = front.getBoundingClientRect();
      const b = back.getBoundingClientRect();
      return Math.min(a.right, b.right) - Math.max(a.left, b.left) > a.width / 2;
    });
    expect(stacked).toBe(true);
  }
  await project.scrollIntoViewIfNeeded();
  await expect(card).toHaveCSS('transform', 'none');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('link', { name: 'ScottyPi', exact: true }).click();
  await expect(page).toHaveURL(/\/projects\/scottypi$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/projects$/);
  await expect(card).toHaveCSS('transform', 'none');
});
