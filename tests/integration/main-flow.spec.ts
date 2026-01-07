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

    await expect(page.locator('.col-md-4 .card .card-body .alert-danger').first()).toBeVisible();
  });

  test('should generate a valid SLA document from scratch via GUI', async ({ page }) => {
    // 1. Ensure initial state is valid
    await expect(page.locator('.col-md-4 .card .card-body .alert-success')).toBeVisible();

    // 2. Fill in ContextEditor data
    await page.fill('input#context-id', 'test-sla-id');
    await page.waitForLoadState('networkidle');

    // 3. Fill in MetricsEditor data
    await page.fill('.metrics-editor-component input[placeholder="New metric name"]', 'response-time');
    await page.click('.metrics-editor-component button:has-text("Add Metric")');
    await page.waitForLoadState('networkidle');
    
    // Locate and fill the properties of the newly added metric
    await page.locator('.metrics-editor-component .card:has-text("response-time") input[placeholder="Type"]').fill('gauge');
    await page.locator('.metrics-editor-component .card:has-text("response-time") input[placeholder="Unit"]').fill('ms');
    await page.locator('.metrics-editor-component .card:has-text("response-time") textarea[placeholder="Description"]').fill('Average response time');
    await page.waitForLoadState('networkidle');

    // 4. Fill in PlansEditor data
    await page.fill('.plans-editor-component input[placeholder="New plan name"]', 'Basic Plan');
    await page.click('.plans-editor-component button:has-text("Add Plan")');
    await page.waitForLoadState('networkidle');
    
    // Locate and fill the properties of the newly added plan
    const basicPlanCard = page.locator('.plans-editor-component .plan-item:has-text("Basic Plan")');
    await basicPlanCard.locator('input[placeholder="Plan Title"]').fill('Basic Plan');
    await basicPlanCard.locator('textarea[placeholder="Plan Description"]').fill('A basic service plan.');
    await basicPlanCard.locator('input[placeholder="Plan Availability"]').fill('99.9%'); // Adding an availability
    await page.waitForLoadState('networkidle');

    // Add a guarantee to the plan
    await basicPlanCard.locator('button:has-text("Add Guarantee")').click();
    await page.waitForLoadState('networkidle');
    
    await basicPlanCard.locator('input[placeholder="Metric Name"]').fill('response-time');
    await basicPlanCard.locator('input[placeholder="Limit"]').fill('P0DT0H5M0S'); // 5 minutes
    await page.waitForLoadState('networkidle');

    // 5. Verify validation success
    await page.waitForTimeout(500); // Give Vue time to react and re-validate
    await expect(page.locator('.col-md-4 .card .card-body .alert-success')).toBeVisible();

    // 6. Switch to Source and verify generated YAML
    await page.click('a:has-text("Source")');
    await expect(page.locator('.ace_content')).toContainText('sla: 1.0.0');
    await expect(page.locator('.ace_content')).toContainText('id: test-sla-id');
    await expect(page.locator('.ace_content')).toContainText('response-time');
    await expect(page.locator('.ace_content')).toContainText('title: Basic Plan');
    await expect(page.locator('.ace_content')).toContainText('limit: P0DT0H5M0S');
  });
});
