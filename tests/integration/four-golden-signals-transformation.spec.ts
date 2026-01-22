import { test, expect } from '@playwright/test';

test.describe('Four Golden Signals Transformation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load four-golden-signals example', async ({ page }) => {
    await page.selectOption('select', 'four-golden-signals');
    await expect(page.locator('.context-editor-component input').first()).toHaveValue('four-golden-signals-api');
  });

  test('should transform to valid GCP Terraform', async ({ page }) => {
    await page.selectOption('select', 'four-golden-signals');
    await page.click('button:has-text("Transform")');
    await page.click('a:has-text("Generate Terraform (GCP)")');

    await page.fill('input[placeholder*="my-gcp-project-id"]', 'test-project');
    await page.click('button:has-text("Generate")');

    const getTfValue = async () => {
        return await page.evaluate(() => {
            const el = document.querySelector('.ace_editor');
            if (!el) return '';
            // @ts-ignore
            const editor = ace.edit(el);
            return editor.getValue();
        });
    };

    const tf = await getTfValue();
    expect(tf).toContain('provider "google"');
    expect(tf).toContain('project = "test-project"');
    
    // Golden signals use PromQL (avg_over_time), so they should use condition_prometheus_query_language
    expect(tf).toContain('condition_prometheus_query_language');
    expect(tf).toContain('query = "avg_over_time(custom.googleapis.com/api/latency[1m]) < 1000"');
  });

  test('should transform to valid Azure Bicep', async ({ page }) => {
    await page.selectOption('select', 'four-golden-signals');
    await page.click('button:has-text("Transform")');
    await page.click('a:has-text("Generate Bicep (Azure)")');

    await page.locator('.input-azure-resource-id').fill('/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Compute/virtualMachines/vm-id');
    await page.locator('.input-azure-location').fill('westeurope');
    await page.click('.azure-bicep-generator button:has-text("Generate")');

    const getBicepValue = async () => {
        return await page.evaluate(() => {
            const el = document.querySelector('.ace_editor');
            if (!el) return '';
            // @ts-ignore
            const editor = ace.edit(el);
            return editor.getValue();
        });
    };

    const bicepCode = await getBicepValue();
    expect(bicepCode).toContain('// Azure Bicep Monitoring Template generated from SLA');
    
    // Rule Group for PromQL
    expect(bicepCode).toContain("resource rule_standard_direct_0 'Microsoft.AlertsManagement/prometheusRuleGroups@2023-03-01'");
    expect(bicepCode).toContain("expression: 'avg_over_time(custom.googleapis.com/api/latency[1m]) < 1000'");
  });
});