import { test, expect } from '@playwright/test';

test.describe('Duration formatting in Description tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should format ISO 8601 durations correctly', async ({ page }) => {
    await page.click('a:has-text("Source")');

    const yamlWithDurations = `
sla: 1.0.0
context:
  id: duration-test
  type: plans
plans:
  premium:
    availability: 99.9%
    pricing:
      cost: 100
      currency: USD
      period: P30D
    x-maintenance-policy:
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
    
    await page.click('a:has-text("Description")');
    
    const description = page.locator('.policy-description');
    await expect(description).toContainText('30 days');
    await expect(description).toContainText('7 days');
    await expect(description).toContainText('1 hour');
    await expect(description).toContainText('4 hours');
  });

  test('should format complex durations with multiple parts', async ({ page }) => {
    await page.click('a:has-text("Source")');

    const yamlWithComplexDuration = `
sla: 1.0.0
context:
  id: complex-duration-test
  type: plans
plans:
  test:
    availability: 99%
    pricing:
      cost: 0
      currency: USD
      period: P1DT2H30M15S
`;

    await page.evaluate((yaml) => {
      window.app.setYamlContent(yaml);
    }, yamlWithComplexDuration);
    
    await page.click('a:has-text("Description")');
    
    // P1DT2H30M15S -> 1 day, 2 hours, 30 minutes and 15 seconds
    await expect(page.locator('.policy-description')).toContainText('1 day, 2 hours, 30 minutes and 15 seconds');
  });

  test('should format durations in guarantees', async ({ page }) => {
    await page.click('a:has-text("Source")');

    const yamlWithGuarantees = `
sla: 1.0.0
context:
  id: guarantees-test
  type: plans
plans:
  standard:
    availability: 99%
    guarantees:
      - metric: response-time
        limit: PT10S
`;

    await page.evaluate((yaml) => {
      window.app.setYamlContent(yaml);
    }, yamlWithGuarantees);
    
    await page.click('a:has-text("Description")');
    await expect(page.locator('.policy-description')).toContainText('response-time: 10 seconds');
  });
});
