import { defineConfig } from '@playwright/test';
import { devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/integration',
  testMatch: '**/grafana-testcontainers.spec.ts',
  /* Maximum time one test can run for. */
  timeout: 600 * 1000,
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Reporter to use. */
  reporter: [['html', { open: 'never' }]],
  /* Shared settings for all the projects below. */
  use: {
    baseURL: 'http://localhost:5173',
    viewport: { width: 1280, height: 720 },
    trace: 'on-first-retry',
    actionTimeout: 2000,
  },

  expect: {
    timeout: 10000,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
