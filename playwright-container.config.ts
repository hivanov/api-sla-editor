import { defineConfig } from '@playwright/test';
import { devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/integration',
  snapshotDir: './tests/__snapshots__',
  timeout: 120 * 1000,
  fullyParallel: true,
  forbidOnly: true,
  workers: 1,
  reporter: [['html', { open: 'never' }]],
  use: {
    /* Use the environment variable BASE_URL or default to localhost:80 */
    baseURL: process.env.BASE_URL || 'http://localhost:80',
    viewport: { width: 1280, height: 720 },
    trace: 'on-first-retry',
  },
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
      },
    },
  ],
  /* Inject window.Playwright before each test */
  globalSetup: undefined,
  /* We can use a test-level before-each but let's try to put it in the config if possible. 
     Actually, Playwright doesn't have a 'global init script' in the config easily without a project-level 'use'. 
  */
  /* No webServer here, we assume the app is already running */
});
