import { test, expect } from '@playwright/test';

test.describe('Description Tab PromQL Rendering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the app to be ready
    await expect(page.locator('header h1')).toContainText('SLA Editor', { timeout: 10000 });
  });

  test('should show both human-readable and technical PromQL in description', async ({ page }) => {
    // 1. Load an example with complex PromQL
    const select = page.locator('select').first();
    await select.selectOption('four-golden-signals');

    // 2. Switch to Description tab
    await page.click('.btn-tab-description');

    // 3. Verify Availability (might be multiple plans, just check first)
    const availabilitySection = page.locator('.markdown-body h4', { hasText: 'Availability' }).first();
    await expect(availabilitySection).toBeVisible();
    
    // Check for human-readable part (handled by formatPrometheusMeasurement)
    // Use case-insensitive match to handle capitalization
    await expect(page.locator('.markdown-body')).toContainText('Metric: uptime', { ignoreCase: true });
    await expect(page.locator('.markdown-body')).toContainText('Condition: The average of uptime over 1 minute is greater than 0.99', { ignoreCase: true });
    await expect(page.locator('.markdown-body')).toContainText('The technical monitoring configuration for this availability requirement is:');
    await expect(page.locator('.markdown-body blockquote').filter({ hasText: 'avg_over_time(uptime[1m]) > 0.99' }).first()).toBeVisible();

    // 4. Verify Guarantees
    const guaranteesSection = page.locator('.markdown-body h4', { hasText: 'Guarantees' }).first();
    await expect(guaranteesSection).toBeVisible();
    await expect(page.locator('.markdown-body')).toContainText('latency: the average of latency over 1 minute is less than 1000', { ignoreCase: true });
    await expect(page.locator('.markdown-body')).toContainText('The technical monitoring configuration for this guarantee is:');
    await expect(page.locator('.markdown-body blockquote').filter({ hasText: 'avg_over_time(latency[1m]) < 1000' }).first()).toBeVisible();

    // 5. Verify SLOs
    await expect(page.locator('.markdown-body')).toContainText('saturation: the average of saturation over 5 minutes is less than 90', { ignoreCase: true });
    await expect(page.locator('.markdown-body')).toContainText('The technical monitoring configuration for this objective is:');
    await expect(page.locator('.markdown-body blockquote').filter({ hasText: 'avg_over_time(saturation[5m]) < 90' }).first()).toBeVisible();
  });

  test('should show both for Grafana/Prometheus complex expressions', async ({ page }) => {
    const select = page.locator('select').first();
    await select.selectOption('grafana-prometheus-sample');
    await page.click('.btn-tab-description');

    // Check availability
    await expect(page.locator('.markdown-body')).toContainText('Metric: up', { ignoreCase: true });
    await expect(page.locator('.markdown-body')).toContainText('Condition: The average of up over 1 minute is greater than 0.99', { ignoreCase: true });
    await expect(page.locator('.markdown-body')).toContainText("The technical monitoring configuration for this availability requirement is:");
    await expect(page.locator('.markdown-body blockquote').filter({ hasText: "avg_over_time(up{job='my-service'}[1m]) > 0.99" }).first()).toBeVisible();

    // Check histogram_quantile guarantee
    await expect(page.locator('.markdown-body')).toContainText('http_request_duration_seconds_bucket: the 95th percentile of http_request_duration_seconds_bucket over 5 minutes', { ignoreCase: true });
    await expect(page.locator('.markdown-body')).toContainText('The technical monitoring configuration for this guarantee is:');
    await expect(page.locator('.markdown-body blockquote').filter({ hasText: 'histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le)) < 0.2' }).first()).toBeVisible();
  });
});
