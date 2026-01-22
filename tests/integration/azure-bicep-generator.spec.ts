import { test, expect } from '@playwright/test';

test.describe('Azure Bicep Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have Generate button disabled when configuration is missing', async ({ page }) => {
    // Navigate to Bicep Generator
    await page.click('button:has-text("Transform")');
    await page.click('a:has-text("Generate Bicep (Azure)")');

    // Expect Generate button to be disabled initially
    await expect(page.locator('.azure-bicep-generator button:has-text("Generate")')).toBeDisabled();
  });

  test('should generate bicep when configuration is provided in the generator view', async ({ page }) => {
    // 1. Configure a Metric and a Plan first (needed for alerts)
    await page.click('.card-header:has-text("Metrics")');
    await page.fill('input[placeholder="New metric name"]', 'cpu_util');
    await page.click('button:has-text("Add Metric")');
    const metricCard = page.locator('.metrics-editor-component .card').filter({ hasText: 'cpu_util' });
    await metricCard.locator('input[placeholder*="compute.googleapis.com"]').fill('percentage_cpu');

    await page.click('.card-header:has-text("Plans")');
    await page.fill('input[placeholder="New plan name"]', 'Basic');
    await page.click('button:has-text("Add Plan")');
    const planCard = page.locator('.plans-editor-component .card').filter({ hasText: 'Basic' });
    await planCard.getByRole('button', { name: 'Add Guarantee' }).click();
    const guaranteeRow = planCard.locator('.guarantees-editor-component .card.mb-2').first();
    // Configure metric and value in measurement mode (which is default)
    await guaranteeRow.locator('select.metric-select').selectOption('cpu_util');
    await guaranteeRow.locator('.input-promql-value').fill('90');

    // 2. Navigate to Bicep Generator
    await page.click('button:has-text("Transform")');
    await page.click('a:has-text("Generate Bicep (Azure)")');

    // 3. Fill Azure configuration in the generator view
    await page.locator('.input-azure-resource-id').fill('/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/test-vm');
    await page.locator('.input-azure-location').fill('westeurope');

    // 4. Click Generate
    await page.click('.azure-bicep-generator button:has-text("Generate")');

    // 5. Verify Output
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
    // 'cpu_util < 90' is PromQL, so it generates Rule Group
    expect(bicep).toContain("resource rule_basic_direct_0 'Microsoft.AlertsManagement/prometheusRuleGroups@2023-03-01'");
    expect(bicep).toContain("'/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/test-vm'");
  });

  test('should generate bicep with valid configuration from sample', async ({ page }) => {
    // 1. Load the Azure Monitoring Sample
    await page.selectOption('select', 'azure-monitoring-sample');

    // 2. Navigate to Bicep Generator
    await page.click('button:has-text("Transform")');
    await page.click('a:has-text("Generate Bicep (Azure)")');

    // Fill configuration
    await page.locator('.input-azure-resource-id').fill('/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/test-vm');
    await page.locator('.input-azure-location').fill('eastus');

    // 3. Click Generate
    await page.click('.azure-bicep-generator button:has-text("Generate")');

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

    expect(bicep).toContain("resource ag_Support_Team 'Microsoft.Insights/actionGroups@2023-01-01'");
    expect(bicep).toContain("emailAddress: 'support@example.com'");
    // Sample uses complex queries
    expect(bicep).toContain("resource rule_gold_direct_0 'Microsoft.AlertsManagement/prometheusRuleGroups@2023-03-01'");
    expect(bicep).toContain("expression: 'avg_over_time(percentage_cpu[5m]) < 80'");
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