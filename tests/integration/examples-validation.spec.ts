import { test, expect } from '@playwright/test';

test.describe('Examples Validation', () => {
  const examples = [
    'support-mon-fri',
    'availability-1-week-downtime',
    'metrics-100-concurrent-connections',
    'gcp-monitoring-complex',
    'azure-monitoring-sample',
    'four-golden-signals',
    'grafana-prometheus-sample',
  ];

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  for (const exampleName of examples) {
    test(`example "${exampleName}" should be valid`, async ({ page }) => {
      // Find the example selector (it's a select element in the sidebar on desktop)
      const selectElement = page.locator('select.form-select');
      await selectElement.selectOption(exampleName);

      // Check the validation badge in the header
      const validationBadge = page.locator('header .badge');
      await expect(validationBadge).toHaveText('Valid');
      await expect(validationBadge).toHaveClass(/bg-success/);

      // Also check the error list card at the bottom
      const errorListCard = page.locator('.validation-card');
      await expect(errorListCard.locator('.badge')).toHaveText('Valid');
      await expect(errorListCard.locator('.text-success')).toContainText('Validation successful!');
    });
  }
});
