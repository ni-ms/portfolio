import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const OUT_DIR = path.resolve('design/verification/T08');
fs.mkdirSync(OUT_DIR, { recursive: true });

const BASE_URL = 'http://localhost:3000';

const routes = [
  { path: '/', name: 'home' },
  { path: '/projects', name: 'projects' },
  { path: '/projects/fastcode', name: 'fastcode' },
  { path: '/resume', name: 'resume' },
  { path: '/about', name: 'about' },
];

async function capture() {
  console.log('Starting T08 comprehensive visual delivery verification...');
  const browser = await chromium.launch();
  const summary = {
    timestamp: new Date().toISOString(),
    layouts: [],
    viewports: [],
  };

  try {
    // 1. Desktop 1585x992 across all 5 layouts in both themes
    for (const theme of ['dark', 'light']) {
      const context = await browser.newContext({
        viewport: { width: 1585, height: 992 },
        deviceScaleFactor: 1,
      });
      const page = await context.newPage();

      // Set initial theme in localStorage
      await page.addInitScript((th) => {
        try {
          localStorage.setItem('nikhil-portfolio-theme', th);
        } catch {}
      }, theme);

      for (const r of routes) {
        await page.goto(`${BASE_URL}${r.path}`);
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(800); // allow GSAP entrance to settle

        const filename = `${r.name}-${theme}-1585x992.png`;
        const filepath = path.join(OUT_DIR, filename);
        await page.screenshot({ path: filepath });
        console.log(`Captured ${filename}`);
        summary.layouts.push({ route: r.path, theme, viewport: '1585x992', file: filename });
      }

      await context.close();
    }

    // 2. Responsive viewports on Home & FastCode Detail
    const responsiveConfigs = [
      { name: 'desktop-1440', viewport: { width: 1440, height: 900 } },
      { name: 'phone-390', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
      { name: 'phone-360', viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true },
      { name: 'tablet-768', viewport: { width: 768, height: 1024 }, isMobile: true, hasTouch: true },
      { name: 'landscape-844', viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true },
    ];

    for (const cfg of responsiveConfigs) {
      const context = await browser.newContext({
        viewport: cfg.viewport,
        isMobile: cfg.isMobile || false,
        hasTouch: cfg.hasTouch || false,
      });
      const page = await context.newPage();

      await page.goto(`${BASE_URL}/`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(800);
      const homeFile = `home-dark-${cfg.name}.png`;
      await page.screenshot({ path: path.join(OUT_DIR, homeFile) });
      console.log(`Captured ${homeFile}`);
      summary.viewports.push({ viewport: cfg.name, route: '/', file: homeFile });

      await context.close();
    }

    fs.writeFileSync(path.join(OUT_DIR, 'DELIVERY_SUMMARY.json'), JSON.stringify(summary, null, 2));
    console.log('T08 visual delivery verification completed successfully!');
  } finally {
    await browser.close();
  }
}

capture().catch((err) => {
  console.error('T08 capture failed:', err);
  process.exit(1);
});
