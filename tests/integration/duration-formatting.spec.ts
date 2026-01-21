import { test, expect } from '@playwright/test';

test.describe('Duration formatting in Description tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should format ISO 8601 durations correctly', async ({ page }) => {
    await page.click('.btn-tab-source');

    const yamlWithDurations = `
sla: 1.0.0
context:
  id: duration-test
  type: plans
metrics:
  up:
    type: number
plans:
  premium:
    availability:
      metric: uptime
      target: 99.9%
      expression: up == 1
    pricing:
      cost: 100
      currency: USD
      period: P30D
    maintenancePolicy:
      minimumNotice:
        standard: P7D
        emergency: PT1H
      windows:
        - type: weekly
          duration: PT4H
          rrule: FREQ=WEEKLY;BYDAY=SU
`;

    await page.evaluate((yaml) => {
      window.app.setYamlContent(yaml);
    }, yamlWithDurations);
    
    await page.click('.btn-tab-description');
    
    const description = page.locator('.policy-description');
    await expect(description).toContainText('30 days');
    await expect(description).toContainText('7 days');
    await expect(description).toContainText('1 hour');
    await expect(description).toContainText('4 hours');
  });

  test('should format complex durations with multiple parts', async ({ page }) => {
    await page.click('.btn-tab-source');

    const yamlWithComplexDuration = `
sla: 1.0.0
context:
  id: complex-duration-test
  type: plans
metrics:
  up:
    type: number
plans:
  test:
    availability:
      metric: uptime
      target: 99%
      expression: up == 1
    pricing:
      cost: 0
      currency: USD
      period: P1DT2H30M15S
`;

    await page.evaluate((yaml) => {
      window.app.setYamlContent(yaml);
    }, yamlWithComplexDuration);
    
    await page.click('.btn-tab-description');
    
    // P1DT2H30M15S -> 1 day, 2 hours, 30 minutes and 15 seconds
    await expect(page.locator('.policy-description')).toContainText('1 day, 2 hours, 30 minutes and 15 seconds');
  });

  test('should format durations in guarantees', async ({ page }) => {
    await page.click('.btn-tab-source');

    const yamlWithGuarantees = `
sla: 1.0.0
context:
  id: guarantees-test
  type: plans
metrics:
  up:
    type: number
plans:
  standard:
    availability:
      metric: uptime
      target: 99%
      expression: up == 1
    guarantees:
      - measurement: "avg_over_time(response_time[10s]) < 1"
`;

    await page.evaluate((yaml) => {
      window.app.setYamlContent(yaml);
    }, yamlWithGuarantees);
    
    await page.click('.btn-tab-description');
    await expect(page.locator('.policy-description')).toContainText('response_time: The average of response_time over 10 seconds');
  });
});
