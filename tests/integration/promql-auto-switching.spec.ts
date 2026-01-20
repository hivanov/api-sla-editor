import { test, expect } from '@playwright/test';

test.describe('PromQL Auto-Switching Robustness', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('text=GUI');
  });

  test('should automatically switch to Raw mode for complex expressions from Source', async ({ page }) => {
    // 1. Setup a simple metric and plan
    await page.locator('#metrics-editor input[placeholder="New metric name"]').fill('m1');
    await page.locator('#metrics-editor button:has-text("Add Metric")').click();
    
    await page.locator('#plans-editor input[placeholder="New plan name"]').fill('P1');
    await page.locator('#plans-editor button:has-text("Add Plan")').click();
    
    const planCard = page.locator('.plan-item', { hasText: 'P1' });
    await expect(planCard).toBeVisible();
    await planCard.locator('button:has-text("Add Guarantee")').click();
    
    // Initial state: GUI mode (select visible)
    await expect(planCard.locator('.guarantees-editor-component select').first()).toBeVisible();
    
    // 2. Switch to Source and inject a complex PromQL
    await page.click('text=Source');
    await page.waitForTimeout(500);
    
    const complexPromQL = 'sum(rate(m1[5m])) / sum(rate(m1[30m])) > 0.5';
    
    await page.evaluate((newVal) => {
        // @ts-ignore
        window.setYamlContent(`sla: 1.0.0
context: { id: test }
metrics:
  m1: { type: number }
plans:
  P1:
    availability: { metric: m1, target: "99%", expression: "m1 > 0" }
    guarantees:
      - measurement: "${newVal}"
`);
    }, complexPromQL);
    
    // 3. Switch back to GUI
    await page.click('text=GUI');
    
    // Should be in Raw mode (textarea visible)
    const textarea = planCard.locator('.guarantees-editor-component textarea');
    await expect(textarea).toBeVisible();
    await expect(textarea).toHaveValue(complexPromQL);
    
    // Checkbox should be checked and disabled
    const toggle = planCard.locator('.guarantees-editor-component #raw-promql-toggle');
    await expect(toggle).toBeChecked();
    await expect(toggle).toBeDisabled();
    
    // 4. Switch back to simple PromQL via Source
    await page.click('text=Source');
    await page.waitForTimeout(500);
    
    const simplePromQL = 'avg_over_time(m1[1m]) > 10';
    await page.evaluate((newVal) => {
        // @ts-ignore
        window.setYamlContent(`sla: 1.0.0
context: { id: test }
metrics:
  m1: { type: number }
plans:
  P1:
    availability: { metric: m1, target: "99%", expression: "m1 > 0" }
    guarantees:
      - measurement: "${newVal}"
`);
    }, simplePromQL);
    
    await page.click('text=GUI');
    
    // Should be back in GUI mode (select visible)
    await expect(planCard.locator('.guarantees-editor-component select').first()).toBeVisible();
    await expect(planCard.locator('.guarantees-editor-component input[placeholder*="e.g. 15"]')).toHaveValue('10');
  });

  test('should show validation errors for unused metrics', async ({ page }) => {
    await page.click('text=Source');
    await page.evaluate(() => {
        // @ts-ignore
        window.setYamlContent(`sla: 1.0.0
context: { id: test }
metrics:
  used_metric: { type: number }
  unused_metric: { type: number }
plans:
  P1:
    availability: { metric: used_metric, target: "99%", expression: "used_metric > 0" }
`);
    });
    
    await page.click('text=GUI');
    
    const validationBadge = page.locator('header .badge');
    await expect(validationBadge).toContainText('1 Errors');
    
    const errorList = page.locator('.error-list-container');
    await expect(errorList).toContainText("Metric 'unused_metric' is defined but not referenced");
    
    // Fix it by adding a guarantee using it via Source to avoid UI issues
    await page.click('text=Source');
    await page.waitForTimeout(500);
    await page.evaluate(() => {
        // @ts-ignore
        window.setYamlContent(`sla: 1.0.0
context: { id: test }
metrics:
  used_metric: { type: number }
  unused_metric: { type: number }
plans:
  P1:
    availability: { metric: used_metric, target: "99%", expression: "used_metric > 0" }
    guarantees:
      - measurement: "avg_over_time(unused_metric[1m]) > 5"
`);
    });
    
    await page.click('text=GUI');
    await expect(validationBadge).toHaveText('Valid');
  });
});
