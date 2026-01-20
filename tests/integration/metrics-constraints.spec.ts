import { test, expect } from '@playwright/test';

test.describe('Metrics constraints', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should show validation error for invalid metric type in source', async ({ page }) => {
    await page.click('a:has-text("Source")');

    await page.evaluate(() => {
      const editor = ace.edit(document.querySelector('.ace_editor'));
      editor.setValue(`sla: 1.0.0
context:
  id: test-id
  type: plans
metrics:
  invalid_metric:
    type: invalid-type
    unit: ms
plans:
  p:
    availability:
      metric: invalid_metric
      target: "99%"
      expression: "invalid_metric > 0"`);
      editor._emit('change');
    });

    await page.click('a:has-text("GUI")');
    
    // Check if the error is displayed in the GUI
    const errorFeedback = page.locator('.metrics-editor-component .invalid-feedback');
    await expect(errorFeedback).toBeVisible();
    await expect(errorFeedback).toContainText('Must be one of: boolean, integer, number, string');

    // Check if the error is displayed in the validation card
    await expect(page.locator('.validation-card table tbody tr').filter({ hasText: 'metrics/invalid_metric/type' })).toBeVisible();
  });

  test('comprehensive sync: invalid source -> gui error -> fix in gui -> valid source', async ({ page }) => {
    // 1. Set invalid metric type in Source
    await page.click('a:has-text("Source")');
    await page.evaluate(() => {
      const editor = ace.edit(document.querySelector('.ace_editor'));
      editor.setValue(`sla: 1.0.0
context:
  id: sync-test
  type: plans
metrics:
  test_metric:
    type: forbidden-type
plans:
  p:
    availability:
      metric: test_metric
      target: "99%"
      expression: "test_metric > 0"
`);
      editor._emit('change');
    });

    // 2. Verify error in validation table (linked to Source)
    await expect(page.locator('.validation-card')).toContainText('Must be one of');
    
    // 3. Verify Ace Editor has error annotation
    const hasAnnotation = await page.evaluate(() => {
      const editor = ace.edit(document.querySelector('.ace_editor'));
      return editor.session.getAnnotations().some(a => a.type === 'error');
    });
    expect(hasAnnotation).toBe(true);

    // 4. Switch to GUI and verify error display
    await page.click('a:has-text("GUI")');
    const metricCard = page.locator('.metrics-editor-component .card:has-text("test_metric")');
    const typeSelect = metricCard.locator('.col-md-6:has(label:has-text("Type")) select');
    await expect(typeSelect).toHaveClass(/is-invalid/);
    await expect(metricCard.locator('.invalid-feedback').first()).toBeVisible();

    // 5. Fix the error in GUI
    await typeSelect.selectOption('string');
    await expect(page.locator('.validation-card .badge.bg-success')).toBeVisible({ timeout: 15000 });

    // 6. Switch back to Source and verify it's now valid
    await page.click('a:has-text("Source")');
    
    // Wait for editor to update
    await page.waitForFunction(() => {
        const el = document.querySelector('.ace_editor');
        if (!el) return false;
        const editor = ace.edit(el);
        return editor.getValue().includes('type: string');
    });

    const editorValue = await page.evaluate(() => {
      return ace.edit(document.querySelector('.ace_editor')).getValue();
    });
    expect(editorValue).toContain('type: string');
    expect(editorValue).not.toContain('forbidden-type');

    const hasAnnotationAfterFix = await page.evaluate(() => {
      const editor = ace.edit(document.querySelector('.ace_editor'));
      return editor.session.getAnnotations().length === 0;
    });
    expect(hasAnnotationAfterFix).toBe(true);
  });

  test('should allow selecting valid metric types in GUI', async ({ page }) => {
    await page.fill('.metrics-editor-component input[placeholder="New metric name"]', 'valid_metric');
    await page.click('.metrics-editor-component button:has-text("Add Metric")');

    const metricCard = page.locator('.metrics-editor-component .card:has-text("valid_metric")');
    const typeSelect = metricCard.locator('.col-md-6:has(label:has-text("Type")) select');
    
    await typeSelect.selectOption('integer');
    await expect(typeSelect).toHaveValue('integer');

    const unitSelect = metricCard.locator('.col-md-6:has(label:has-text("Unit")) select');
    await unitSelect.selectOption('requests');
    await expect(unitSelect).toHaveValue('requests');

    // To be valid, it must be referenced
    await page.fill('.plans-editor-component input[placeholder="New plan name"]', 'P');
    await page.click('.plans-editor-component button:has-text("Add Plan")');
    const pCard = page.locator('.plans-editor-component .plan-item:has-text("P")');
    await pCard.locator('.availability-editor-component select.metric-selector').selectOption('valid_metric');
    await pCard.locator('.availability-editor-component textarea').fill('valid_metric > 0');

    // Verify it's valid
    await expect(page.locator('.validation-card .badge.bg-success')).toBeVisible({ timeout: 15000 });
  });
});
