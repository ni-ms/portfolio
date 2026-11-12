import { expect, test } from '@playwright/test';

const isGameCode = (url: string) => /(?:\/src\/game\/GameStage\.tsx|\/assets\/GameStage-.*\.js)/.test(url);

test('Home requests the game only after Play, then releases it on exit', async ({ page }) => {
  const gameRequests: string[] = [];
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (isGameCode(url.pathname) || url.pathname.startsWith('/rooftop/')) gameRequests.push(url.pathname);
  });

  let releaseGame!: () => void;
  const delay = new Promise<void>((resolve) => { releaseGame = resolve; });
  await page.route((url) => isGameCode(url.pathname), async (route) => {
    await delay;
    await route.continue();
  });

  try {
    await page.goto('/');
    await page.getByRole('link', { name: 'Parkour Game', exact: true }).click();
    await expect(page).toHaveURL(/#parkour-game$/);
    await expect(page.getByRole('heading', { name: 'Parkour Game', exact: true })).toBeInViewport();

    const play = page.getByRole('button', { name: 'Play Parkour Game' });
    await expect(play).toBeVisible();
    await play.hover();
    await page.waitForLoadState('networkidle');
    expect(gameRequests).toEqual([]);
    await expect(page.locator('canvas')).toHaveCount(0);

    await play.click();
    await expect(page.getByRole('status')).toHaveText('Loading Parkour Game…');
    await expect.poll(() => gameRequests.some(isGameCode)).toBe(true);
    releaseGame();

    const mobile = (page.viewportSize()?.width ?? 0) <= 768;
    const exit = page.getByTestId(mobile ? 'overlay-exit-btn' : 'inline-exit-btn');
    await expect(exit).toBeVisible({ timeout: 20000 });
    await expect(page.locator('canvas')).toHaveCount(1);
    await page.keyboard.press('ArrowRight');
    await expect(page).toHaveURL(/#parkour-game$/);
    await expect.poll(() => gameRequests.some((url) => url.startsWith('/rooftop/'))).toBe(true);
    await exit.click();
    await expect(page.locator('canvas')).toHaveCount(0);
    await expect(play).toBeFocused();
    await expect(page.locator('body')).not.toHaveClass(/scroll-locked/);

    await page.reload();
    if (!mobile && (page.viewportSize()?.width ?? 0) >= 791) {
      await expect(page.locator('.home-scene')).toHaveAttribute('data-pinned', 'true');
    }
    await expect(page.getByRole('heading', { name: 'Parkour Game', exact: true })).toBeInViewport();
  } finally {
    releaseGame();
  }
});

test('leaving Home while the game is loading keeps the next page canvas-free', async ({ page }) => {
  let releaseGame!: () => void;
  const delay = new Promise<void>((resolve) => { releaseGame = resolve; });
  await page.route((url) => isGameCode(url.pathname), async (route) => {
    await delay;
    await route.continue();
  });

  try {
    await page.goto('/');
    await page.getByRole('button', { name: 'Play Parkour Game' }).click();
    await expect(page.getByRole('status')).toHaveText('Loading Parkour Game…');
    await page.evaluate(() => document.querySelector<HTMLAnchorElement>('.desktop-nav [href="/projects"]')?.click());
    await expect(page).toHaveURL(/\/projects$/);
    releaseGame();
    await page.waitForLoadState('networkidle');
    await expect(page.locator('canvas')).toHaveCount(0);
    await expect(page.locator('body')).not.toHaveClass(/scroll-locked/);
    await page.goBack();
    await expect(page.getByRole('button', { name: 'Play Parkour Game' })).toBeVisible();
    await expect(page.locator('canvas')).toHaveCount(0);
  } finally {
    releaseGame();
  }
});

test('the Parkour shortcut scrolls smoothly and honors reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const shortcut = page.getByRole('link', { name: 'Parkour Game', exact: true });
  const section = page.locator('#parkour-game');
  const positions = await shortcut.evaluate(async (link) => {
    (link as HTMLAnchorElement).click();
    const samples: number[] = [];
    const start = performance.now();
    do {
      await new Promise(requestAnimationFrame);
      samples.push(scrollY);
    } while (performance.now() - start < 950);
    return samples;
  });
  const end = positions.at(-1)!;
  expect(end).toBeGreaterThan(250);
  expect(positions.filter(y => y > 0 && y < end - 20).length).toBeGreaterThan(2);
  await expect(section).toBeFocused();
  await expect(page.getByRole('heading', { name: 'Parkour Game', exact: true })).toBeInViewport();

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await shortcut.click();
  await expect(section).toBeFocused();
  await expect(page.getByRole('heading', { name: 'Parkour Game', exact: true })).toBeInViewport();
});
