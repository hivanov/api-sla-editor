import { test, expect } from '@playwright/test';

test.describe('Prometheus-like Measurements', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Add a metric first
    await page.click('.btn-tab-gui');
    await page.fill('.metrics-editor-component input[placeholder="New metric name"]', 'latency');
    await page.click('.metrics-editor-component button:has-text("Add Metric")');
    
    // Add a plan
    await page.fill('.plans-editor-component input[placeholder="New plan name"]', 'Gold Plan');
    await page.click('.plans-editor-component button:has-text("Add Plan")');
  });

  test('should define a quantile measurement', async ({ page }) => {
    const goldPlan = page.locator('.plans-editor-component .plan-item:has-text("Gold Plan")');
    await goldPlan.locator('.quotas-editor-component button:has-text("Add Quota")').click();
    
    const quotaEditor = goldPlan.locator('.quotas-editor-component .prometheus-measurement-editor');
    
    // Select Quantile (Percentile)
    await quotaEditor.locator('.select-promql-func').selectOption('quantile_over_time');
    
    // Fill quantile
    await quotaEditor.locator('.input-promql-quantile').fill('0.99');
    
    // Select metric
    await quotaEditor.locator('.select-promql-metric').selectOption('latency');
    
    // Set window
    await quotaEditor.locator('.input-promql-window-value').fill('6');
    await quotaEditor.locator('.select-promql-window-unit').selectOption('h');
    
    // Set operator and value
    await quotaEditor.locator('.select-promql-operator').selectOption('<');
    await quotaEditor.locator('.input-promql-value').fill('15');
    
    await page.click('.btn-tab-source');
    const editorValue = await page.evaluate(() => {
      const editor = ace.edit(document.querySelector('.ace_editor'));
      return editor.getValue();
    });
    
    expect(editorValue).toContain('quantile_over_time(0.99, latency[6h]) < 15');
  });

  test('should define an avg measurement with >= operator', async ({ page }) => {
    const goldPlan = page.locator('.plans-editor-component .plan-item:has-text("Gold Plan")');
    await goldPlan.locator('.exclusions-editor-component button:has-text("Add Exclusion")').click();
    
    // Switch to Metric mode
    await goldPlan.locator('.exclusions-editor-component select').first().selectOption('metric');
    
    const exclEditor = goldPlan.locator('.exclusions-editor-component .prometheus-measurement-editor');
    
    // Default is avg_over_time
    await exclEditor.locator('.select-promql-metric').selectOption('latency');
    await exclEditor.locator('.input-promql-window-value').fill('4');
    await exclEditor.locator('.select-promql-window-unit').selectOption('m');
    
    await exclEditor.locator('.select-promql-operator').selectOption('>=');
    await exclEditor.locator('.input-promql-value').fill('15');
    
    await page.click('.btn-tab-source');
    const editorValue = await page.evaluate(() => {
      const el = document.querySelector('.ace_editor');
      if (!el) return '';
      // @ts-ignore
      const editor = ace.edit(el);
      return editor.getValue();
    });
    
    expect(editorValue).toContain('avg_over_time(latency[4m]) >= 15');
  });

  test('should define a histogram quantile', async ({ page }) => {
    const goldPlan = page.locator('.plans-editor-component .plan-item:has-text("Gold Plan")');
    await goldPlan.locator('.quotas-editor-component button:has-text("Add Quota")').click();
    
    const quotaEditor = goldPlan.locator('.quotas-editor-component .prometheus-measurement-editor');
    
    await quotaEditor.locator('.select-promql-func').selectOption('histogram_quantile');
    await quotaEditor.locator('.input-promql-quantile').fill('0.95');
    await quotaEditor.locator('.select-promql-metric').selectOption('latency');
    
    await page.click('.btn-tab-source');
    const editorValue = await page.evaluate(() => {
      const el = document.querySelector('.ace_editor');
      if (!el) return '';
      // @ts-ignore
      const editor = ace.edit(el);
      return editor.getValue();
    });
    
    expect(editorValue).toContain('histogram_quantile(0.95, sum by (le) (rate(latency[5m])))');
  });
});
