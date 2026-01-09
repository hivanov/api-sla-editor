import { test, expect } from '@playwright/test';

test.describe('Structured guarantees', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should render complex numeric guarantees', async ({ page }) => {
    await page.click('a:has-text("Source")');

    const yamlWithComplexGuarantees = `
sla: 1.0.0
context:
  id: complex-guarantees-test
  type: plans
plans:
  standard:
    availability: 99.9%
    guarantees:
      - metric: requests-count
        operator: ">"
        value: "5"
        period: PT1H
      - metric: error-rate
        operator: "between"
        value: "6 and 12"
        period: P1D
      - metric: latency
        operator: "avg"
        value: "200ms"
        period: PT1M
`;

    await page.evaluate((yaml) => {
      window.app.setYamlContent(yaml);
    }, yamlWithComplexGuarantees);
    
    await page.click('a:has-text("Description")');
    
    const description = page.locator('.policy-description');
    await expect(description).toContainText('requests-count: > 5 per 1 hour');
    await expect(description).toContainText('error-rate: Between 6 and 12 per 1 day');
    await expect(description).toContainText('latency: Average of 200ms per 1 minute');
  });

  test('should render boolean guarantees', async ({ page }) => {
    await page.click('a:has-text("Source")');

    const yamlWithBooleanGuarantees = `
sla: 1.0.0
context:
  id: boolean-guarantees-test
  type: plans
plans:
  standard:
    availability: 99.9%
    guarantees:
      - metric: secure-connection
        operator: "="
        value: "true"
`;

    await page.evaluate((yaml) => {
      window.app.setYamlContent(yaml);
    }, yamlWithBooleanGuarantees);
    
    await page.click('a:has-text("Description")');
    
    const description = page.locator('.policy-description');
    await expect(description).toContainText('secure-connection: = true');
  });

  test('should render structured SLO guarantees in support policy', async ({ page }) => {
    await page.click('a:has-text("Source")');

    const yamlWithSloGuarantees = `
sla: 1.0.0
context:
  id: slo-guarantees-test
  type: plans
plans:
  standard:
    availability: 99.9%
    x-support-policy:
      serviceLevelObjectives:
        - name: Incident Response
          guarantees:
            - metric: response-time
              operator: "<"
              value: "15m"
            - metric: ticket-count
              operator: "<="
              value: "10"
              period: P1D
`;

    await page.evaluate((yaml) => {
      window.app.setYamlContent(yaml);
    }, yamlWithSloGuarantees);
    
    await page.click('a:has-text("Description")');
    
    const description = page.locator('.policy-description');
    await expect(description).toContainText('response-time: < 15m');
    await expect(description).toContainText('ticket-count: <= 10 per 1 day');
  });
});
