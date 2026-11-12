import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium, expect } from '@playwright/test';

const baseURL = process.env.QA_BASE_URL || 'http://localhost:3176';
const dir = fileURLToPath(new URL('./recordings/', import.meta.url));
const desktop = { width: 959, height: 894 };
const phone = { width: 390, height: 844 };
const browser = await chromium.launch({ channel: 'chrome' });
await mkdir(dir, { recursive: true });

const pause = (page, ms = 650) => page.waitForTimeout(ms);
const top = (page) => page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
const caption = (page, text) => page.evaluate((text) => {
  let label = document.querySelector('[data-qa-caption]');
  if (!label) {
    label = document.createElement('div');
    label.setAttribute('data-qa-caption', '');
    label.setAttribute('aria-hidden', 'true');
    Object.assign(label.style, {
      position: 'fixed', left: '50%', bottom: '12px', transform: 'translateX(-50%)',
      zIndex: '2147483647', maxWidth: 'calc(100vw - 20px)', width: 'max-content',
      padding: '7px 12px', border: '1px solid #d6ff64', color: '#f2f1ea',
      background: '#101414', font: '600 13px/1.4 system-ui', pointerEvents: 'none',
    });
    document.body.append(label);
  }
  label.textContent = text;
}, text);

const playButton = (page) => page.getByRole('button', { name: 'Play Parkour Game' });
const theme = (page, next) => page.getByRole('button', { name: `Switch to ${next} mode` });
const name = (page) => page.getByRole('link', { name: 'Nikhil Sharma — Home', exact: true });
const menu = (page) => page.getByRole('button', { name: 'Open navigation menu' });

async function openGame(page, mobile = false) {
  await page.goto('/#parkour-game');
  await expect(page.getByRole('heading', { name: 'Parkour Game', exact: true })).toBeInViewport();
  await playButton(page).click();
  await expect(page.getByTestId(mobile ? 'overlay-exit-btn' : 'inline-exit-btn')).toBeVisible({ timeout: 20_000 });
}

async function record(file, viewport, run) {
  const mobile = viewport.width === phone.width;
  const context = await browser.newContext({
    baseURL, viewport, isMobile: mobile, hasTouch: mobile,
    reducedMotion: 'no-preference', recordVideo: { dir, size: viewport },
  });
  const page = await context.newPage();
  const video = page.video();
  try {
    await run(page, context);
    await pause(page, 850);
    await context.close();
    await video.saveAs(`${dir}${file}.webm`);
    await video.delete();
    console.log(`Recorded ${file}`);
  } catch (error) {
    await context.close();
    await video.delete();
    throw error;
  }
}

const tickets = [
  ['T01-routing-and-theme', desktop, async (page) => {
    await page.goto('/');
    await caption(page, 'T01 · Dark default, name link, and arrow-key navigation');
    await pause(page);
    await page.keyboard.press('ArrowRight');
    await expect(page).toHaveURL(/\/projects$/);
    await caption(page, 'Right arrow opens Projects');
    await pause(page);
    await theme(page, 'light').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await caption(page, 'The navbar toggle crossfades to light');
    await pause(page, 950);
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await caption(page, 'The selected theme persists after reload');
    await pause(page);
    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
    await caption(page, 'Browser Back returns to Home');
  }],
  ['T02-resume-and-download', desktop, async (page) => {
    await page.goto('/resume');
    await caption(page, 'T02 · Résumé with the real PDF and DOCX download links');
    const download = page.waitForEvent('download');
    await page.getByRole('link', { name: /Download résumé/ }).click();
    const result = await download;
    if (!result.suggestedFilename().endsWith('.pdf')) throw new Error('Expected a PDF download');
    await caption(page, 'PDF download verified · Nikhil_Sharma_Resume.pdf');
    await pause(page, 900);
    const education = page.getByRole('heading', { name: 'Education', exact: true });
    await education.evaluate(heading => {
      const y = scrollY + heading.getBoundingClientRect().top - innerHeight * 0.57;
      scrollTo({ top: y, behavior: 'instant' });
    });
    await expect(education).toBeInViewport();
    await caption(page, 'Education follows Core skills with one shared divider');
    await pause(page, 1700);
    await page.locator('.site-footer').scrollIntoViewIfNeeded();
    await caption(page, 'The résumé grid meets the footer on a single line');
  }],
  ['T03-grid-and-case-studies', desktop, async (page) => {
    await page.goto('/projects');
    await caption(page, 'T03 · Square grid and featured FastCode artwork');
    await pause(page);
    await page.getByRole('link', { name: 'FastCode', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'FastCode', exact: true })).toBeVisible();
    await caption(page, 'FastCode case study');
    await pause(page);
    await page.getByTestId('benchmark-comparison-card').scrollIntoViewIfNeeded();
    await caption(page, 'Measured workload · 684 µs baseline, 539 µs optimized');
    await pause(page, 1050);
    await page.getByRole('link', { name: /Next project.*ScottyPi/ }).click();
    await caption(page, 'Same grid for the ScottyPi and Langmetric case studies');
    await pause(page);
    await page.getByRole('link', { name: /Next project.*Langmetric/ }).click();
  }],
  ['T04-parkour-move-jump-reset', desktop, async (page) => {
    await openGame(page);
    await page.getByTestId('inline-expand-btn').click();
    await expect(page.getByTestId('overlay-exit-btn')).toBeVisible();
    await caption(page, 'T04 · Live Parkour Game · W moves, Space jumps, R resets');
    await pause(page, 550);
    await page.keyboard.down('KeyW');
    await pause(page, 430);
    await page.keyboard.press('Space');
    await pause(page, 240);
    await page.keyboard.up('KeyW');
    await caption(page, 'Jump and landing with the follow camera');
    await pause(page, 1000);
    await page.keyboard.press('KeyR');
    await caption(page, 'R returns the player to the start');
    await pause(page, 700);
    await page.keyboard.press('Escape');
    await expect(playButton(page)).toBeFocused();
    await caption(page, 'Esc exits and restores focus to Play');
  }],
  ['T05-rooftop-dark-and-light', desktop, async (page) => {
    await openGame(page);
    await caption(page, 'T05 · Live rooftop · textured concrete, stairs, vents, and lighting');
    await pause(page, 1000);
    await theme(page, 'light').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(page.locator('canvas')).toHaveCount(1);
    await caption(page, 'The live scene updates in light mode');
    await pause(page, 1300);
    await theme(page, 'dark').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await caption(page, 'Back to the dark rooftop with one active canvas');
  }],
  ['T06-mobile-click-to-play', phone, async (page, context) => {
    await page.goto('/');
    await caption(page, 'T06 · Emulated phone · Parkour is loaded on Play');
    await page.getByRole('link', { name: 'Parkour Game', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Parkour Game', exact: true })).toBeInViewport();
    await expect(page.locator('canvas')).toHaveCount(0);
    await caption(page, 'Smooth scroll to the preview · no live canvas yet');
    await pause(page, 900);
    await playButton(page).click();
    await expect(page.getByTestId('overlay-exit-btn')).toBeVisible({ timeout: 20_000 });
    await caption(page, 'Expanded touch controls · move and jump together');
    await pause(page, 450);
    const point = async (id, testId) => {
      const box = await page.getByTestId(testId).boundingBox();
      if (!box) throw new Error(`Missing control ${testId}`);
      return { id, x: box.x + box.width / 2, y: box.y + box.height / 2 };
    };
    const points = [await point(1, 'dpad-up'), await point(2, 'touch-jump-btn')];
    const session = await context.newCDPSession(page);
    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: points });
    await pause(page, 430);
    await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await pause(page, 650);
    await page.getByTestId('overlay-exit-btn').click();
    await expect(page.locator('canvas')).toHaveCount(0);
    await caption(page, 'Exit removes the game and returns to the portfolio');
  }],
  ['T07-home-scroll-and-cursor', desktop, async (page) => {
    await page.goto('/about');
    await caption(page, 'T07 · Quick Home demo');
    await name(page).click();
    await expect(page.locator('.home-scene')).toHaveAttribute('data-pinned', 'true');
    await caption(page, 'Individual headline words slide in on entry');
    await pause(page, 850);
    await page.mouse.move(500, 550);
    await caption(page, 'Scroll down · the frame stays put as projects rise');
    for (let i = 0; i < 9; i++) {
      await page.mouse.wheel(0, 100);
      await pause(page, 115);
    }
    const fastCode = page.getByRole('link', { name: 'FastCode', exact: true });
    await expect(fastCode).toBeInViewport();
    await fastCode.hover();
    await caption(page, 'Matching image frames, artwork hover, and the lime cursor');
    await pause(page, 1050);
    await caption(page, 'Scroll back up · the same motion reverses');
    for (let i = 0; i < 9; i++) {
      await page.mouse.wheel(0, -100);
      await pause(page, 115);
    }
    await top(page);
    await page.getByRole('link', { name: 'Parkour Game', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Parkour Game', exact: true })).toBeInViewport();
    await caption(page, 'Parkour shortcut scrolls to the preview');
  }],
  ['T08-responsive-route-check', phone, async (page) => {
    await page.goto('/');
    await caption(page, 'T08 · Emulated phone · responsive grid and navigation');
    await pause(page);
    await menu(page).click();
    await caption(page, 'The menu exposes all primary destinations');
    await pause(page);
    await page.getByRole('dialog').getByRole('link', { name: 'About', exact: true }).click();
    await caption(page, 'About and contact');
    await page.getByRole('heading', { name: 'Get in touch' }).scrollIntoViewIfNeeded();
    await pause(page, 900);
    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
    await caption(page, 'Browser Back restores Home');
    await pause(page);
    await page.goto('/missing-page');
    await caption(page, 'Unknown routes show a working 404');
    await expect(page.getByRole('heading', { name: 'Page Not Found' })).toBeVisible();
  }],
  ['blog-and-cursor', desktop, async (page) => {
    await page.goto('/projects');
    await page.mouse.move(8, 120);
    await caption(page, 'Blog and cursor update · the ring starts as a circle');
    await pause(page, 850);
    const blog = page.getByRole('link', { name: 'Blog', exact: true });
    await blog.hover();
    await caption(page, 'Hover Blog · the ring fits the link');
    await pause(page, 850);
    await blog.click();
    await expect(page.getByRole('heading', { name: 'Blog', exact: true })).toBeVisible();
    await theme(page, 'light').hover();
    await caption(page, 'Hover the theme button · the outline reshapes');
    await pause(page, 850);
    await theme(page, 'light').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    const post = page.getByRole('link', { name: 'Optimizing 1×1 convolution on a CPU', exact: true });
    await post.hover();
    await caption(page, 'Two engineering notes based on FastCode and ScottyPi');
    await pause(page, 950);
    await post.click();
    await expect(page.getByRole('heading', { name: 'Optimizing 1×1 convolution on a CPU' })).toBeVisible();
    await caption(page, 'The article opens on its own URL');
    await pause(page, 1000);
    await page.getByRole('contentinfo').scrollIntoViewIfNeeded();
    await caption(page, 'The footer now contains just contact links');
  }],
  ['home-projects-heading-before-after', desktop, async (page) => {
    await page.goto('/');
    const scene = page.locator('.home-scene[data-pinned]');
    const grid = page.locator('.home-projects-grid');
    await expect(scene).toBeAttached();
    await page.evaluate(() => document.fonts.ready);
    await page.mouse.move(500, 550);
    const heading = page.locator('.home-projects-heading');
    const before = Math.round((await heading.boundingBox()).height);
    await caption(page, `At the top · the Selected projects block is ${before} px tall`);
    await pause(page, 1050);
    async function scrollBy(total) {
      for (let index = 0; index < 16; index++) {
        const step = Math.round(total * (index + 1) / 16) - Math.round(total * index / 16);
        await page.mouse.wheel(0, step);
        await pause(page, 90);
      }
    }
    const distance = Math.floor(desktop.height * 1.06) - 2;
    await scrollBy(distance);
    await expect(grid).toBeInViewport({ ratio: 0.93 });
    await expect.poll(async () => Math.round((await heading.boundingBox()).height)).toBe(68);
    await caption(page, 'With the cards in view · the heading is a 68 px bar');
    await pause(page, 1550);
    await caption(page, 'Scroll back up · the same motion reverses');
    await scrollBy(-distance);
    await expect(grid).not.toBeInViewport();
    await expect(page.locator('.home-role-title')).toBeInViewport();
  }],
];

try {
  const filter = process.argv.slice(2);
  for (const [file, viewport, run] of tickets) {
    if (filter.length === 0 || filter.some((prefix) => file.startsWith(prefix))) {
      await record(file, viewport, run);
    }
  }
} finally {
  await browser.close();
}
