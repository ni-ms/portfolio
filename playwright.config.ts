import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: /.*\.spec\.ts/,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    video: 'off',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'Desktop Target (1585x992)',
      use: {
        viewport: { width: 1585, height: 992 },
        deviceScaleFactor: 1
      }
    },
    {
      name: 'Desktop Secondary (1440x900)',
      use: {
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 1
      }
    },
    {
      name: 'Mobile Target (390x844)',
      use: {
        ...devices['iPhone 14'],
        viewport: { width: 390, height: 844 },
        hasTouch: true
      }
    },
    {
      name: 'Mobile Small (360x740)',
      use: {
        viewport: { width: 360, height: 740 },
        hasTouch: true
      }
    },
    {
      name: 'Tablet (768x1024)',
      use: {
        ...devices['iPad Mini'],
        viewport: { width: 768, height: 1024 },
        hasTouch: true
      }
    }
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 30000
  }
});
