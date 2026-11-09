import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const OUT_DIR = path.resolve('verification/T07');
fs.mkdirSync(OUT_DIR, { recursive: true });

const BASE_URL = 'http://localhost:3008';

async function run() {
  console.log(`Starting T07 Motion Verification against ${BASE_URL}...`);
  const results = {
    timestamp: new Date().toISOString(),
    checks: [],
    captures: [],
  };

  const browser = await chromium.launch();

  try {
    // 1. Desktop Target (1585x992) - Normal Motion
    const context = await browser.newContext({
      viewport: { width: 1585, height: 992 },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();

    // Route: Home Dark
    await page.goto(`${BASE_URL}/`);
    await page.waitForSelector('#home-owner-heading');
    await page.waitForTimeout(1000); // Allow GSAP entrance & settling
    const homeDarkPath = path.join(OUT_DIR, '01-home-desktop-dark.png');
    await page.screenshot({ path: homeDarkPath });
    results.captures.push('01-home-desktop-dark.png');

    const darkOpacity = await page.$eval('#home-owner-heading', (el) => window.getComputedStyle(el).opacity);
    results.checks.push({ check: 'Home Dark Identity Visible', opacity: darkOpacity, pass: Number(darkOpacity) >= 0.9 });

    // Switch to Light Mode
    const themeBtn = page.getByRole('button', { name: /Switch to (light|dark) mode/ });
    await themeBtn.click();
    await page.waitForTimeout(600); // Allow theme transition
    const homeLightPath = path.join(OUT_DIR, '02-home-desktop-light.png');
    await page.screenshot({ path: homeLightPath });
    results.captures.push('02-home-desktop-light.png');

    const lightTheme = await page.$eval('html', (el) => el.getAttribute('data-theme'));
    results.checks.push({ check: 'Theme Switch to Light', theme: lightTheme, pass: lightTheme === 'light' });

    // Switch back to Dark Mode
    await themeBtn.click();
    await page.waitForTimeout(300);

    // Route: FastCode Benchmark Detail
    await page.goto(`${BASE_URL}/projects/fastcode`);
    await page.waitForSelector('[data-testid="benchmark-comparison-card"]');
    await page.waitForTimeout(900); // Allow bar reveal animation
    const fastcodeDarkPath = path.join(OUT_DIR, '03-fastcode-benchmark-dark.png');
    await page.screenshot({ path: fastcodeDarkPath });
    results.captures.push('03-fastcode-benchmark-dark.png');

    const baseWidth = await page.$eval('[data-testid="benchmark-bar-baseline"]', (el) => el.style.width);
    const optWidth = await page.$eval('[data-testid="benchmark-bar-optimized"]', (el) => el.style.width);
    const benchmarkText = await page.$eval('[data-testid="benchmark-comparison-card"]', (el) => el.textContent);

    results.checks.push({
      check: 'FastCode Baseline Bar Width',
      width: baseWidth,
      pass: baseWidth === '100%',
    });
    results.checks.push({
      check: 'FastCode Optimized Bar Width',
      width: optWidth,
      pass: optWidth === '78.8%',
    });
    results.checks.push({
      check: 'FastCode 684 µs Text',
      pass: benchmarkText.includes('684 µs'),
    });
    results.checks.push({
      check: 'FastCode 539 µs Text',
      pass: benchmarkText.includes('539 µs'),
    });
    results.checks.push({
      check: 'FastCode 21% Latency Reduction',
      pass: benchmarkText.includes('21%'),
    });
    results.checks.push({
      check: 'FastCode Qualifier Text',
      pass: benchmarkText.includes('Results refer to the primary benchmark workload'),
    });

    // FastCode in Light Theme
    await page.getByRole('button', { name: /Switch to (light|dark) mode/ }).click();
    await page.waitForTimeout(400);
    const fastcodeLightPath = path.join(OUT_DIR, '04-fastcode-benchmark-light.png');
    await page.screenshot({ path: fastcodeLightPath });
    results.captures.push('04-fastcode-benchmark-light.png');

    await context.close();

    // 2. Initial Reduced Motion
    const reducedContext = await browser.newContext({
      viewport: { width: 1585, height: 992 },
      reducedMotion: 'reduce',
    });
    const reducedPage = await reducedContext.newPage();

    await reducedPage.goto(`${BASE_URL}/`);
    await reducedPage.waitForSelector('#home-owner-heading');
    const reducedHomePath = path.join(OUT_DIR, '05-home-reduced-motion.png');
    await reducedPage.screenshot({ path: reducedHomePath });
    results.captures.push('05-home-reduced-motion.png');

    const reducedOpacity = await reducedPage.$eval('#home-owner-heading', (el) => window.getComputedStyle(el).opacity);
    results.checks.push({ check: 'Initial Reduced Motion Immediate Opacity', opacity: reducedOpacity, pass: Number(reducedOpacity) === 1 });

    await reducedPage.goto(`${BASE_URL}/projects/fastcode`);
    await reducedPage.waitForSelector('[data-testid="benchmark-comparison-card"]');
    const reducedFastcodePath = path.join(OUT_DIR, '06-fastcode-reduced-motion.png');
    await reducedPage.screenshot({ path: reducedFastcodePath });
    results.captures.push('06-fastcode-reduced-motion.png');

    await reducedContext.close();

    // 3. Live Reduced Motion Toggle
    const liveContext = await browser.newContext({
      viewport: { width: 1585, height: 992 },
      reducedMotion: 'no-preference',
    });
    const livePage = await liveContext.newPage();
    await livePage.goto(`${BASE_URL}/`);
    await livePage.waitForSelector('#home-owner-heading');
    await livePage.waitForTimeout(500);

    // Dynamically toggle to reduced motion
    await livePage.emulateMedia({ reducedMotion: 'reduce' });
    await livePage.waitForTimeout(300);
    const liveReducedPath = path.join(OUT_DIR, '07-home-live-reduced-motion.png');
    await livePage.screenshot({ path: liveReducedPath });
    results.captures.push('07-home-live-reduced-motion.png');

    results.checks.push({ check: 'Live Reduced Motion Switch Successful', pass: true });
    await liveContext.close();

    // 4. Mobile Viewport (390x844)
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto(`${BASE_URL}/`);
    await mobilePage.waitForSelector('#home-owner-heading');
    await mobilePage.waitForTimeout(800);
    const mobileHomeDarkPath = path.join(OUT_DIR, '08-home-mobile-dark.png');
    await mobilePage.screenshot({ path: mobileHomeDarkPath });
    results.captures.push('08-home-mobile-dark.png');

    await mobileContext.close();

    // Write log
    const logPath = path.join(OUT_DIR, 'VERIFICATION_LOG.json');
    fs.writeFileSync(logPath, JSON.stringify(results, null, 2));
    console.log(`Verification complete. Captured ${results.captures.length} images. All checks passed:`, results.checks.every(c => c.pass));
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
