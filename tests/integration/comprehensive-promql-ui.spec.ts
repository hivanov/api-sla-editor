import { test, expect } from '@playwright/test';

test.describe('Comprehensive PromQL UI Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should show PromQL validation errors in Source, GUI, and Result Table', async ({ page }) => {
    test.setTimeout(30000);
    // 1. Go to Source and enter invalid YAML with PromQL errors
    await page.click('a:has-text("Source")');

    const invalidSla = `
sla: 1.0.0
context:
  id: promql-test
  type: plans
metrics:
  defined_metric:
    type: number
plans:
  Gold:
    availability:
      target: 99.9%
      metric: defined_metric
      expression: "undefined_metric == 1"
    guarantees:
      - measurement: "invalid promql syntax ((("
`;

    await page.evaluate((content) => {
      const editor = ace.edit(document.querySelector('.ace_editor'));
      editor.setValue(content, -1);
    }, invalidSla);

    // 2. Verify errors in Result Table at the bottom
    const validationTable = page.locator('.validation-card table tbody');
    await expect(async () => {
        await expect(validationTable).toContainText('Invalid PromQL: Metric "undefined_metric" is not defined');
        await expect(validationTable).toContainText('mismatched input');
    }).toPass();

    // 3. Verify errors in GUI
    await page.click('a:has-text("GUI")');
    
    // Find Gold plan
    const goldPlan = page.locator('.plan-item:has-text("Gold")');
    await expect(goldPlan).toBeVisible();

    // Check availability expression error
    const availEditor = goldPlan.locator('.availability-editor-component');
    // We need to make sure the availability editor is in expression mode to see the error
    const toggle = availEditor.locator('input#raw-promql-toggle');
    if (!(await toggle.isChecked())) {
        await toggle.click();
    }
    const availTextArea = availEditor.locator('textarea');
    await expect(availTextArea).toHaveClass(/is-invalid/);
    await expect(availEditor.locator('.invalid-feedback')).toBeVisible();
    await expect(availEditor.locator('.invalid-feedback')).toContainText('Metric "undefined_metric" is not defined');

    // Check guarantee measurement error
    const guaranteeEditor = goldPlan.locator('.guarantees-editor-component');
    await expect(guaranteeEditor.locator('.invalid-feedback')).toContainText('mismatched input');

    // 4. Verify annotations/markers in Ace Editor (back to Source)
    await page.click('a:has-text("Source")');
    
    // Wait for Ace to be ready and have annotations
    await expect(async () => {
        const annotations = await page.evaluate(() => {
            const el = document.querySelector('.ace_editor');
            if (!el) return [];
            // @ts-ignore
            const editor = ace.edit(el);
            return editor.getSession().getAnnotations();
        });
        if (annotations.length < 2) {
             throw new Error(`Expected at least 2 annotations, found ${annotations.length}`);
        }
    }).toPass({ timeout: 500 });
  });

  test('should clear errors when PromQL is fixed', async ({ page }) => {
    await page.click('a:has-text("Source")');

    const invalidSla = `
sla: 1.0.0
context:
  id: promql-test
  type: plans
metrics:
  up:
    type: number
plans:
  Gold:
    availability:
      target: 99.9%
      metric: up
      expression: "undefined_metric == 1"
`;

    await page.evaluate((content) => {
      const editor = ace.edit(document.querySelector('.ace_editor'));
      editor.setValue(content, -1);
    }, invalidSla);

    await expect(page.locator('.validation-card table tbody')).toContainText('undefined_metric');

    // Fix it
    const validSla = invalidSla.replace('undefined_metric', 'up');
    await page.evaluate((content) => {
      const editor = ace.edit(document.querySelector('.ace_editor'));
      editor.setValue(content, -1);
    }, validSla);

    await expect(page.locator('.validation-card .badge.bg-success')).toBeVisible();
    await expect(page.locator('.ace_gutter-cell.ace_error')).toHaveCount(0);
  });

  test('should show validation success for correct SLA with PromQL', async ({ page }) => {
    await page.click('a:has-text("Source")');

    const validSla = `
sla: 1.0.0
context:
  id: happy-path
  type: plans
metrics:
  up:
    type: number
    description: "Service status"
plans:
  Gold:
    availability:
      target: 99.9%
      metric: up
      expression: "up == 1"
    guarantees:
      - measurement: "avg_over_time(up[5m]) == 1"
`;

    await page.evaluate((content) => {
      const editor = ace.edit(document.querySelector('.ace_editor'));
      editor.setValue(content, -1);
    }, validSla);

    await expect(page.locator('.validation-card .badge.bg-success')).toBeVisible();
    await expect(page.locator('.validation-card')).toContainText('Validation successful!');
    
    // Check GUI as well
    await page.click('a:has-text("GUI")');
    const goldPlan = page.locator('.plan-item:has-text("Gold")');
    const availEditor = goldPlan.locator('.availability-editor-component');
    
    // Switch to Raw PromQL to see the expression
    const toggle = availEditor.locator('input#raw-promql-toggle');
    if (!(await toggle.isChecked())) {
        await toggle.click();
    }
    await expect(availEditor.locator('textarea')).toHaveValue('up == 1');
    await expect(availEditor.locator('.invalid-feedback')).not.toBeVisible();
  });
});
