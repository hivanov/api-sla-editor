import { test, expect } from '@playwright/test';

test.describe('Structured guarantees', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should render complex numeric guarantees', async ({ page }) => {
    await page.click('.btn-tab-source');

    const yamlWithComplexGuarantees = `
sla: 1.0.0
context:
  id: complex-guarantees-test
  type: plans
metrics:
  up:
    type: number
plans:
  standard:
    availability:
      metric: uptime
      target: 99.9%
      expression: up == 1
    guarantees:
      - measurement: "avg_over_time(requests_count[1h]) > 5"
      - measurement: "avg_over_time(error_rate[1d]) <= 12"
      - measurement: "avg_over_time(latency[1m]) < 200"
`;

    await page.evaluate((yaml) => {
      window.app.setYamlContent(yaml);
    }, yamlWithComplexGuarantees);
    
    await page.click('.btn-tab-description');
    
    const description = page.locator('.policy-description');
    await expect(description).toContainText('requests_count: The average of requests_count over 1 hour is greater than 5');
    await expect(description).toContainText('error_rate: The average of error_rate over 1 day is at most 12');
    await expect(description).toContainText('latency: The average of latency over 1 minute is less than 200');
  });

  test('should render boolean guarantees', async ({ page }) => {
    await page.click('.btn-tab-source');

    const yamlWithBooleanGuarantees = `
sla: 1.0.0
context:
  id: boolean-guarantees-test
  type: plans
metrics:
  up:
    type: number
plans:
  standard:
    availability:
      metric: uptime
      target: 99.9%
      expression: up == 1
    guarantees:
      - measurement: "secure_connection == true"
`;

    await page.evaluate((yaml) => {
      window.app.setYamlContent(yaml);
    }, yamlWithBooleanGuarantees);
    
    await page.click('.btn-tab-description');
    
    const description = page.locator('.policy-description');
    await expect(description).toContainText('secure_connection: Secure_connection is equal to true');
  });

  test('should render structured SLO guarantees in support policy', async ({ page }) => {
    await page.click('.btn-tab-source');

    const yamlWithSloGuarantees = `
sla: 1.0.0
context:
  id: slo-guarantees-test
  type: plans
metrics:
  up:
    type: number
plans:
  standard:
    availability:
      metric: uptime
      target: 99.9%
      expression: up == 1
    supportPolicy:
      serviceLevelObjectives:
        - name: Incident Response
          guarantees:
            - measurement: "avg_over_time(response_time[15m]) < 1"
            - measurement: "avg_over_time(ticket_count[1d]) <= 10"
`;

    await page.evaluate((yaml) => {
      window.app.setYamlContent(yaml);
    }, yamlWithSloGuarantees);
    
    await page.click('.btn-tab-description');
    
    const description = page.locator('.policy-description');
    await expect(description).toContainText('response_time: The average of response_time over 15 minutes is less than 1');
    await expect(description).toContainText('ticket_count: The average of ticket_count over 1 day is at most 10');
  });
});
