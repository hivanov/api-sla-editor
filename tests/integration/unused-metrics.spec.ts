import { test, expect } from '@playwright/test';

test.describe('Unused Metrics Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should show error when a metric is defined but not used', async ({ page }) => {
    // Navigate to Source tab
    await page.click('text=Source');

    // Set YAML with an unused metric
    const yaml = `
sla: 1.0.0
context:
  id: unused-metric-test
  type: plans
metrics:
  used_metric:
    type: number
    description: "Used metric"
  unused_metric:
    type: number
    description: "Unused metric"
plans:
  base:
    availability:
      metric: used_metric
      target: "99.9%"
      expression: "used_metric > 0"
`;
    
    await page.evaluate((content) => {
      window.setYamlContent(content);
    }, yaml);

    // Check for validation error
    const validationBadge = page.locator('header .badge');
    await expect(validationBadge).toContainText('1 Error');

    const errorList = page.locator('.error-list-container');
    await expect(errorList).toContainText("Metric 'unused_metric' is defined but not referenced anywhere in the specification.");
  });

  test('should be valid when all metrics are used in various places', async ({ page }) => {
    await page.click('text=Source');

    // used in: availability, guarantees, SLOs, quotas
    const yaml = `
sla: 1.0.0
context:
  id: all-metrics-used
  type: plans
metrics:
  m_avail: { type: number }
  m_guar: { type: number }
  m_slo: { type: number }
  m_quota: { type: number }
plans:
  premium:
    availability:
      metric: m_avail
      target: "99.9%"
      expression: "m_avail > 0"
    guarantees:
      - metric: m_guar
        operator: ">"
        value: "10"
    serviceLevelObjectives:
      - name: "SLO"
        guarantees:
          - metric: m_slo
            operator: ">"
            value: "5"
    quotas:
      m_quota:
        max: 100
`;
    
    await page.evaluate((content) => {
      window.setYamlContent(content);
    }, yaml);

    const validationBadge = page.locator('header .badge');
    await expect(validationBadge).toHaveText('Valid');
  });

  test('should recognize metrics used in PromQL expressions', async ({ page }) => {
    await page.click('text=Source');

    const yaml = `
sla: 1.0.0
context:
  id: promql-metric-usage
  type: plans
metrics:
  metric_in_expr: { type: number }
plans:
  base:
    availability:
      metric: metric_in_expr
      target: "99.9%"
      expression: "avg_over_time(metric_in_expr[5m]) > 0"
`;
    
    await page.evaluate((content) => {
      window.setYamlContent(content);
    }, yaml);

    const validationBadge = page.locator('header .badge');
    await expect(validationBadge).toHaveText('Valid');
  });
});
