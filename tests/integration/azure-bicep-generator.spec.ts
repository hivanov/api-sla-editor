import { test, expect } from '@playwright/test';

test.describe('Azure Bicep Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should show error when Resource ID is missing', async ({ page }) => {
    // Navigate to Bicep Generator
    await page.click('button:has-text("Transform")');
    await page.click('a:has-text("Generate Bicep (Azure)")');

    // Click Generate
    await page.click('button:has-text("Generate")');

    // Expect error
    await expect(page.locator('.alert-warning')).toContainText('Azure Resource ID is not configured');
    await expect(page.locator('button:has-text("Generate")')).toBeDisabled();
  });

  test('should generate bicep with valid configuration', async ({ page }) => {
    // 1. Load the Azure Monitoring Sample
    await page.selectOption('select', 'azure-monitoring-sample');

    // 2. Navigate to Bicep Generator
    await page.click('button:has-text("Transform")');
    await page.click('a:has-text("Generate Bicep (Azure)")');

    // 3. Click Generate
    await page.click('button:has-text("Generate")');

    // 4. Verify Output
    const getEditorValue = async () => {
        return await page.evaluate(() => {
            const el = document.querySelector('.ace_editor');
            if (!el) return '';
            // @ts-ignore
            const editor = ace.edit(el);
            return editor.getValue();
        });
    };

    const bicep = await getEditorValue();

    // Verify some key elements of the Bicep file
    expect(bicep).toContain("resource ag_Support_Team 'Microsoft.Insights/actionGroups@2023-01-01'");
    expect(bicep).toContain("emailAddress: 'support@example.com'");
    expect(bicep).toContain("resource alert_gold_direct_0 'Microsoft.Insights/metricalerts@2018-03-01'");
    expect(bicep).toContain("metricName: 'Percentage CPU'");
    expect(bicep).toContain("operator: 'GreaterThanOrEqual'");
    expect(bicep).toContain("threshold: 80");
    expect(bicep).toContain("actionGroupId: ag_Support_Team.id");
  });

  test('should load azure-monitoring-sample without validation errors', async ({ page }) => {
    // 1. Load the Azure Monitoring Sample
    await page.selectOption('select', 'azure-monitoring-sample');

    // 2. Check validation badge
    const badge = page.locator('header .badge');
    await expect(badge).toBeVisible();
    await expect(badge).toHaveText('Valid');
    await expect(page.locator('.validation-card .text-success')).toContainText('Validation successful');
  });
});
