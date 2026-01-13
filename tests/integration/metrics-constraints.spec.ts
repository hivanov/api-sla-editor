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
  invalid-metric:
    type: invalid-type
    unit: ms
plans: {}`);
      editor._emit('change');
    });

    await page.click('a:has-text("GUI")');
    
    // Check if the error is displayed in the GUI
    const errorFeedback = page.locator('.metrics-editor-component .invalid-feedback');
    await expect(errorFeedback).toBeVisible();
    await expect(errorFeedback).toContainText('Must be one of: boolean, integer, number, string');

    // Check if the error is displayed in the validation card
    await expect(page.locator('.validation-card table tbody tr')).toContainText('metrics/invalid-metric/type');
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
  test-metric:
    type: forbidden-type
plans: {}`);
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
    const metricCard = page.locator('.metrics-editor-component .card:has-text("test-metric")');
    // Targeting "Type" select specifically
    const typeSelect = metricCard.locator('.col-md-6:has(label:has-text("Type")) select');
    await expect(typeSelect).toHaveClass(/is-invalid/);
    await expect(metricCard.locator('.invalid-feedback').first()).toBeVisible();

    // 5. Fix the error in GUI
    await typeSelect.selectOption('string');
    await expect(page.locator('.validation-card .badge.bg-success')).toBeVisible();

    // 6. Switch back to Source and verify it's now valid
    await page.click('a:has-text("Source")');
    const editorValue = await page.evaluate(() => {
      return ace.edit(document.querySelector('.ace_editor')).getValue();
    });
    expect(editorValue).toContain('type: string');
    expect(editorValue).not.toContain('forbidden-type');

    const hasAnnotationAfterFix = await page.evaluate(() => {
      const editor = ace.edit(document.querySelector('.ace_editor'));
      return editor.session.getAnnotations().length > 0;
    });
    expect(hasAnnotationAfterFix).toBe(false);
  });

  test('should allow selecting valid metric types in GUI', async ({ page }) => {
    await page.fill('.metrics-editor-component input[placeholder="New metric name"]', 'valid-metric');
    await page.click('.metrics-editor-component button:has-text("Add Metric")');

    const metricCard = page.locator('.metrics-editor-component .card:has-text("valid-metric")');
    const typeSelect = metricCard.locator('.col-md-6:has(label:has-text("Type")) select');
    
    await typeSelect.selectOption('integer');
    await expect(typeSelect).toHaveValue('integer');

    const unitSelect = metricCard.locator('.col-md-6:has(label:has-text("Unit")) select');
    await unitSelect.selectOption('requests');
    await expect(unitSelect).toHaveValue('requests');

    // Verify it's valid
    await expect(page.locator('.validation-card .badge.bg-success')).toBeVisible();
  });
});
