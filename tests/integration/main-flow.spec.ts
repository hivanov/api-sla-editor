import { test, expect } from '@playwright/test';

test.describe('Main flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load and validate the default SLA', async ({ page }) => {
    await expect(page.locator('#app')).toBeVisible();
  });

  test('should switch between GUI and source editor', async ({ page }) => {
    await page.click('a:has-text("Source")');
    await expect(page.locator('.ace_editor')).toBeVisible();

    await page.click('a:has-text("GUI")');
    await expect(page.locator('input#context-id')).toBeVisible();
  });

  test('should edit in GUI and verify in source', async ({ page }) => {
    await page.click('a:has-text("GUI")');
    await page.fill('input#context-id', 'new-id');

    await page.click('a:has-text("Source")');
    await expect(page.locator('.ace_content')).toContainText('new-id');
  });

  test('should edit in source and verify in GUI', async ({ page }) => {
    await page.click('a:has-text("Source")');

    await page.evaluate((yamlString) => {
      window.app.setYamlContent(yamlString);
    }, 'sla: 1.0.0\ncontext:\n  id: source-id\n  type: plans\nmetrics: {}\nplans: {}');
    
    await page.click('a:has-text("GUI")');
    
    await expect(page.locator('input#context-id')).toHaveValue('source-id');
  });

  test('should load an example', async ({ page }) => {
    await page.selectOption('select', 'support-mon-fri');

    // Wait for the Ace Editor content to update (after programmatic set)
    await page.waitForFunction(
      (expectedText) => {
        const editor = ace.edit(document.querySelector('.ace_editor'));
        return editor.getValue().includes(expectedText);
      },
      'support-mon-fri'
    );
  });

  test('should show validation errors', async ({ page }) => {
    await page.click('a:has-text("Source")');

    await page.evaluate(() => {
      const editor = ace.edit(document.querySelector('.ace_editor'));
      editor.setValue('invalid yaml');
      editor._emit('change');
    });
    await page.waitForTimeout(500); // Give Vue time to react

    await expect(page.locator('.validation-card table tbody tr').first()).toBeVisible();
  });

  test('should generate a valid SLA document from scratch via GUI', async ({ page }) => {
    // 1. Ensure initial state is valid
    await expect(page.locator('.validation-card .badge.bg-success')).toBeVisible();

    // 2. Fill in ContextEditor data
    await page.fill('input#context-id', 'test-sla-id');
    await page.waitForLoadState('networkidle');

    // 3. Fill in MetricsEditor data
    await page.fill('.metrics-editor-component input[placeholder="New metric name"]', 'response-time');
    await page.click('.metrics-editor-component button:has-text("Add Metric")');
    await page.waitForLoadState('networkidle');

    await page.fill('.metrics-editor-component input[placeholder="New metric name"]', 'max-users');
    await page.click('.metrics-editor-component button:has-text("Add Metric")');
    await page.waitForLoadState('networkidle');
    
    // Locate and fill the properties of the newly added metrics
    const rtCard = page.locator('.metrics-editor-component .card:has-text("response-time")');
    // Use more robust selectors based on labels
    // The structure is roughly: 
    // <div class="col-md-6"><label>Type</label><select>...
    // <div class="col-md-6"><label>Unit</label><select>...
    
    // We can target the select that is a sibling or child of the label container
    await rtCard.locator('.col-md-6:has(label:has-text("Type")) select').selectOption('number');
    await rtCard.locator('.col-md-6:has(label:has-text("Unit")) select').selectOption('ms');
    
    // Description is now a markdown editor
    await rtCard.locator('textarea[placeholder*="Markdown"]').fill('Average response time');

    const muCard = page.locator('.metrics-editor-component .card:has-text("max-users")');
    await muCard.locator('.col-md-6:has(label:has-text("Type")) select').selectOption('integer');
    await muCard.locator('.col-md-6:has(label:has-text("Unit")) select').selectOption('items');
    await muCard.locator('textarea[placeholder*="Markdown"]').fill('Maximum concurrent users');
    
    await page.waitForLoadState('networkidle');

    // 4. Fill in PlansEditor data
    await page.fill('.plans-editor-component input[placeholder="New plan name"]', 'Basic Plan');
    await page.click('.plans-editor-component button:has-text("Add Plan")');
    await page.waitForLoadState('networkidle');
    
    // Locate and fill the properties of the newly added plan
    const basicPlanCard = page.locator('.plans-editor-component .plan-item:has-text("Basic Plan")');
    await basicPlanCard.locator('input[placeholder="Plan Title"]').fill('Basic Plan');
    await basicPlanCard.locator('textarea[placeholder*="Plan Description"]').fill('A basic service plan.');
    
    // Interact with AvailabilityEditor
    const availEditor = basicPlanCard.locator('.availability-editor-component');
    await availEditor.locator('.nav-link:has-text("Manual Entry")').click();
    await availEditor.locator('input[type="number"]').first().fill('99.9');
    await page.waitForLoadState('networkidle');

    // Interact with PricingEditor
    await basicPlanCard.locator('.pricing-editor-component input[placeholder="Cost"]').fill('120');
    await basicPlanCard.locator('.pricing-editor-component input[placeholder="Currency"]').fill('EUR');
    await basicPlanCard.locator('.pricing-editor-component input[placeholder="e.g. P1DT4H"]').fill('P30D');
    await page.waitForLoadState('networkidle');

    // Interact with QuotasEditor
    await basicPlanCard.locator('.quotas-editor-component button:has-text("Add Quota")').click();
    const quotaEditor = basicPlanCard.locator('.quotas-editor-component .prometheus-measurement-editor');
    await quotaEditor.locator('select').nth(1).selectOption('max-users'); // Metric select
    await quotaEditor.locator('input[type="text"]').fill('100'); // Value input
    await page.waitForLoadState('networkidle');
    
    // Add a guarantee to the plan
    await basicPlanCard.locator('button:has-text("Add Guarantee")').click();
    await page.waitForLoadState('networkidle');
    
    // Switch to Structured mode
    await basicPlanCard.locator('.guarantees-editor-component label', { hasText: 'Structured' }).first().click();
    
    await basicPlanCard.locator('.guarantees-editor-component select').first().selectOption('response-time');
    await basicPlanCard.locator('.guarantees-editor-component input[placeholder="e.g. P1DT4H"]').fill('P0DT0H5M0S'); // 5 minutes
    await page.waitForLoadState('networkidle');

    // Interact with SupportPolicyEditor - Contact Points
    const supportEditor = basicPlanCard.locator('.support-policy-editor-component');
    await supportEditor.locator('button:has-text("Add Contact Point")').click();
    await supportEditor.locator('button:has-text("Add Channel")').click();
    await supportEditor.locator('select').first().selectOption('email');
    // After selecting email, value should be 'mailto://'
    const urlInput = supportEditor.locator('input[placeholder="https://... or mailto:..."]');
    await urlInput.fill('mailto://support@example.com');
    await page.waitForLoadState('networkidle');

    // Interact with SupportPolicyEditor - Hours Available
    await supportEditor.locator('button:has-text("Add Hours")').click();
    await supportEditor.locator('button:has-text("Workdays")').click();
    await page.waitForLoadState('networkidle');

    // Interact with ServiceCreditsEditor
    await basicPlanCard.locator('.service-credits-editor-component input[placeholder="Currency"]').fill('EUR');
    await basicPlanCard.locator('.service-credits-editor-component button:has-text("Add Tier")').click();
    await basicPlanCard.locator('.service-credits-editor-component select').selectOption('response-time');
    await basicPlanCard.locator('.service-credits-editor-component input[placeholder="<"]').fill('>');
    await basicPlanCard.locator('.service-credits-editor-component input[placeholder="99.9"]').fill('99.5');
    await basicPlanCard.locator('.service-credits-editor-component input.compensation-input').fill('10');

    // Interact with MaintenancePolicyEditor
    await basicPlanCard.locator('.maintenance-policy-editor-component input#countsAsDowntime').check();
    await basicPlanCard.locator('.maintenance-policy-editor-component input[placeholder="e.g. P1DT4H"]').first().fill('P14D');

    // Interact with ExclusionsEditor
    await basicPlanCard.locator('.exclusions-editor-component button:has-text("Add Exclusion")').click();
    // Switch to Metric mode manually as default is now Text
    await basicPlanCard.locator('.exclusions-editor-component .d-flex.align-items-center select').last().selectOption('metric');
    
    const exclusionEditor = basicPlanCard.locator('.exclusions-editor-component .prometheus-measurement-editor');
    await exclusionEditor.locator('select').nth(1).selectOption('response-time');
    await exclusionEditor.locator('input[type="text"]').fill('500');
    // We don't verify "Force Majeure" anymore since it's now a PromQL string
    // await basicPlanCard.locator('.exclusions-editor-component input[placeholder="Exclusion description"]').fill('Force Majeure');

    // Interact with LifecyclePolicyEditor
    await basicPlanCard.locator('.lifecycle-policy-editor-component input#autoRenewal').check();
    await basicPlanCard.locator('.lifecycle-policy-editor-component input[placeholder="e.g. P1DT4H"]').first().fill('P60D');

    // 5. Verify validation success
    await expect(async () => {
      await expect(page.locator('.validation-card .badge.bg-success')).toBeVisible();
    }).toPass({ timeout: 5000 });

    // 6. Switch to Source and verify generated YAML
    await page.click('a:has-text("Source")');
    
    const editorValue = await page.evaluate(() => {
      const editor = ace.edit(document.querySelector('.ace_editor'));
      return editor.getValue();
    });

    expect(editorValue).toContain('sla: 1.0.0');
    expect(editorValue).toContain('id: test-sla-id');
    expect(editorValue).toContain('response-time');
    expect(editorValue).toContain('title: Basic Plan');
    expect(editorValue).toContain('availability: 99.9%');
    expect(editorValue).toContain('period: P0DT0H5M0S');
    expect(editorValue).toContain('cost: 120');
    expect(editorValue).toContain('currency: EUR');
    expect(editorValue).toContain('period: P30D');
    expect(editorValue).toContain('avg_over_time(max-users[5m]) < 100');
    expect(editorValue).toContain('mailto://support@example.com');
    expect(editorValue).toContain('dayOfWeek:');
    expect(editorValue).toContain('- Monday');
    expect(editorValue).toContain('- Tuesday');
    expect(editorValue).toContain('- Wednesday');
    expect(editorValue).toContain('- Thursday');
    expect(editorValue).toContain('- Friday');
    expect(editorValue).toContain('opens: \'09:00\'');
    expect(editorValue).toContain('closes: \'17:00\'');
    expect(editorValue).toContain('x-service-credits');
    expect(editorValue).toContain('x-maintenance-policy');
    expect(editorValue).toContain('x-sla-exclusions');
    expect(editorValue).toContain('x-lifecycle-policy');
    expect(editorValue).toContain('avg_over_time(response-time[5m]) < 500');
  });
});
