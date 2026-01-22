import { test, expect } from '@playwright/test';

test.describe('Main flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load and validate the default SLA', async ({ page }) => {
    await expect(page.locator('#app')).toBeVisible();
  });

  test('should switch between GUI and source editor', async ({ page }) => {
    await page.click('.btn-tab-source');
    await expect(page.locator('.ace_editor')).toBeVisible();

    await page.click('.btn-tab-gui');
    await expect(page.locator('input#context-id')).toBeVisible();
  });

  test('should edit in GUI and verify in source', async ({ page }) => {
    await page.click('.btn-tab-gui');
    await page.fill('input#context-id', 'new-id');

    await page.click('.btn-tab-source');
    await expect(page.locator('.ace_content')).toContainText('new-id');
  });

  test('should edit in source and verify in GUI', async ({ page }) => {
    await page.click('.btn-tab-source');

    await page.evaluate((yamlString) => {
      window.setYamlContent(yamlString);
    }, 'sla: 1.0.0\ncontext:\n  id: source-id\n  type: plans\nmetrics: {}\nplans: {}');
    
    await page.click('.btn-tab-gui');
    
    await expect(page.locator('input#context-id')).toHaveValue('source-id');
  });

  test('should load an example', async ({ page }) => {
    await page.selectOption('select.select-example-loader', 'support-mon-fri');

    // Wait for the Ace Editor content to update (after programmatic set)
    await page.waitForFunction(
      (expectedText) => {
        const el = document.querySelector('.ace_editor');
        if (!el) return false;
        // @ts-ignore
        const editor = ace.edit(el);
        return editor.getValue().includes(expectedText);
      },
      'support-mon-fri'
    );
  });

  test('should show validation errors', async ({ page }) => {
    await page.click('.btn-tab-source');

    await page.evaluate(() => {
      const el = document.querySelector('.ace_editor');
      if (!el) return;
      // @ts-ignore
      const editor = ace.edit(el);
      editor.setValue('invalid yaml');
      editor._emit('change');
    });

    await expect(async () => {
        await expect(page.locator('.validation-card table tbody tr').first()).toBeVisible();
    }).toPass();
  });

  test('should generate a valid SLA document from scratch via GUI', async ({ page }) => {
    // 1. Ensure initial state is valid
    await expect(page.locator('.validation-card .badge.bg-success')).toBeVisible();

    // 2. Fill in ContextEditor data
    await page.fill('input#context-id', 'test-sla-id');

    // 3. Fill in MetricsEditor data
    const metricInput = page.locator('.metrics-editor-component input[placeholder="New metric name"]');
    const addMetricBtn = page.locator('.metrics-editor-component button:has-text("Add Metric")');

    await metricInput.fill('up');
    await addMetricBtn.click();
    
    // Locate and fill the properties of the newly added metric
    const upCard = page.locator('.metrics-editor-component [data-metric-name="up"]');
    await upCard.locator('.col-md-6:has(label:has-text("Type")) select').selectOption('integer');
    await upCard.locator('textarea[placeholder*="Markdown"]').fill('Service status');

    // 4. Fill in PlansEditor data
    await page.fill('.plans-editor-component input[placeholder="New plan name"]', 'Basic Plan');
    await page.click('.plans-editor-component button:has-text("Add Plan")');
    
    // Locate and fill the properties of the newly added plan
    const basicPlanCard = page.locator('.plans-editor-component [data-plan-name="Basic Plan"]');
    await basicPlanCard.locator('input[placeholder="Plan Title"]').fill('Basic Plan');
    
    // Interact with AvailabilityEditor
    const availEditor = basicPlanCard.locator('.availability-editor-component');
    await availEditor.locator('.select-avail-metric').selectOption('up'); 
    
    // Use manual entry for percentage to keep it simple
    await availEditor.locator('.btn-mode-switch[data-mode="manual"]').click();
    await availEditor.locator('.input-avail-percentage').fill('99.9');

    // Set expression manually in raw mode
    const promQLEditor = availEditor.locator('.prometheus-measurement-editor');
    const rawSwitch = promQLEditor.locator('.check-raw-promql'); 
    if (!(await rawSwitch.isChecked())) {
        await rawSwitch.click();
    }
    await promQLEditor.locator('textarea').fill('up == 1');

    // Switch to Source tab to trigger final YAML update and validation
    await page.click('.btn-tab-source');

    // 5. Verify validation success
    await expect(async () => {
        await expect(page.locator('.validation-card .badge.bg-success')).toBeVisible();
    }).toPass();

    // 6. Verify generated YAML content
    const editorValue = await page.evaluate(() => {
      const el = document.querySelector('.ace_editor');
      if (!el) return '';
      // @ts-ignore
      const editor = ace.edit(el);
      return editor.getValue();
    });

    expect(editorValue).toContain('sla: 1.0.0');
    expect(editorValue).toContain('id: test-sla-id');
    expect(editorValue).toContain('title: Basic Plan');
    expect(editorValue).toContain('metric: up');
    expect(editorValue).toContain('expression: up == 1');
    expect(editorValue).toContain('target: 99.9%');
  });
});
