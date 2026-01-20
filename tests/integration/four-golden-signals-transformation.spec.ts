import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe('Four Golden Signals Transformation', () => {
  const slaYaml = fs.readFileSync(path.resolve(__dirname, '../../src/assets/examples/four-golden-signals.yaml'), 'utf8');

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Set the YAML content in the editor
    await page.evaluate((yaml) => {
      if (window.setYamlContent) {
        window.setYamlContent(yaml);
      }
    }, slaYaml);
  });

  test('should transform to valid GCP Terraform', async ({ page }) => {
    // Open Transform dropdown
    await page.getByRole('button', { name: 'Transform' }).first().click();
    
    // Click Generate Terraform (GCP)
    await page.getByRole('link', { name: 'Generate Terraform (GCP)' }).click();
    
    // Wait for the generator view to be visible
    await expect(page.locator('h4:has-text("GCP Terraform Generator")')).toBeVisible();
    
    // Fill project ID using placeholder
    await page.fill('input[placeholder="e.g. my-gcp-project-id"]', 'my-test-project');
    
    // Click Generate
    await page.click('button:has-text("Generate")');
    
    // Check Ace Editor content
    await page.waitForFunction(() => {
      const editorElement = document.querySelector('.ace-editor-container');
      if (!editorElement) return false;
      const editor = ace.edit(editorElement);
      return editor && editor.getValue().length > 0;
    });

    const tfCode = await page.evaluate(() => {
      const editor = ace.edit(document.querySelector('.ace-editor-container'));
      return editor.getValue();
    });

    // Verify it contains the metrics
    expect(tfCode).toContain('resource "google_monitoring_metric_descriptor" "metric_latency"');
    expect(tfCode).toContain('resource "google_monitoring_metric_descriptor" "metric_traffic"');
    expect(tfCode).toContain('resource "google_monitoring_metric_descriptor" "metric_errors"');
    
    expect(tfCode).toContain('resource "google_monitoring_alert_policy" "alert_standard_direct_0"');
    expect(tfCode).toContain('type = "custom.googleapis.com/api/latency"');
  });

  test('should transform to valid Azure Bicep', async ({ page }) => {
    // Open Transform dropdown
    await page.getByRole('button', { name: 'Transform' }).first().click();
    
    // Click Generate Bicep (Azure)
    await page.getByRole('link', { name: 'Generate Bicep (Azure)' }).click();
    
    // Wait for the generator view to be visible
    await expect(page.locator('h4:has-text("Azure Bicep Generator")')).toBeVisible();
    
    // Fill Azure Config using placeholders
    await page.fill('input[placeholder="e.g. /subscriptions/.../resourceGroups/..."]', '/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Compute/virtualMachines/vm-id');
    await page.fill('input[placeholder="e.g. eastus"]', 'westeurope');
    
    // Click Generate
    await page.click('button:has-text("Generate")');
    
    // Check Ace Editor content
    await page.waitForFunction(() => {
      const editorElement = document.querySelector('.ace-editor-container');
      if (!editorElement) return false;
      const editor = ace.edit(editorElement);
      return editor && editor.getValue().length > 0;
    });

    const bicepCode = await page.evaluate(() => {
      const editor = ace.edit(document.querySelector('.ace-editor-container'));
      return editor.getValue();
    });

    // Verify it contains the metrics
    expect(bicepCode).toContain('resource alert_standard_direct_0 \'Microsoft.Insights/metricalerts@2018-03-01\'');
    expect(bicepCode).toContain("metricName: 'custom.googleapis.com/api/latency'");
  });
});
