import { test, expect } from '@playwright/test';

test.describe('Terraform Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should show error when Project ID is missing', async ({ page }) => {
    // Navigate to Terraform Generator
    await page.click('button:has-text("Transform")');
    await page.click('a:has-text("Generate Terraform (GCP)")');

    // Click Generate
    await page.click('button:has-text("Generate")');

    // Expect error
    await expect(page.locator('.alert-warning')).toContainText('GCP Project ID is not configured');
    await expect(page.locator('button:has-text("Generate")')).toBeDisabled();
  });

  test('should generate terraform with valid configuration', async ({ page }) => {
    // 1. Configure GCP Project ID
    await page.click('.card-header:has-text("GCP Monitoring")');
    await page.fill('input[placeholder="e.g. my-gcp-project-id"]', 'test-project-id');

    // 2. Add a Notification Channel
    await page.click('button:has-text("Add Notification Channel")');
    await page.getByPlaceholder('Label Key (e.g. email_address)').fill('email_address');
    await page.click('button:has-text("Add Label")');
    
    // Find the label row where the first input has value 'email_address'
    // Then fill the second input (value)
    const labelRow = page.locator('.gcp-monitoring-editor-component .d-flex.gap-2').filter({ has: page.locator('input[value="email_address"]') });
    await labelRow.locator('input:not([readonly])').fill('test@example.com');
    
    // Let's rely on indices or placeholders better
    const channelCard = page.locator('.gcp-monitoring-editor-component .card').first();
    await channelCard.locator('input').nth(0).fill('DevOps Team'); // Display Name
    await channelCard.locator('select').selectOption('email'); // Type
    
    // 3. Configure a Metric with GCP mapping
    await page.click('.card-header:has-text("Metrics")');
    // Add a new metric "cpu_load"
    await page.fill('input[placeholder="New metric name"]', 'cpu_load');
    await page.click('button:has-text("Add Metric")');
    
    // Configure cpu_load
    const metricCard = page.locator('.metrics-editor-component .card').filter({ hasText: 'cpu_load' });
    await metricCard.locator('input[placeholder*="compute.googleapis.com"]').fill('compute.googleapis.com/instance/cpu/utilization');
    await metricCard.locator('input[placeholder*="gce_instance"]').fill('gce_instance');

    // 4. Configure a Plan with Guarantee using this metric
    await page.click('.card-header:has-text("Plans")');
    await page.fill('input[placeholder="New plan name"]', 'Gold');
    await page.click('button:has-text("Add Plan")');
    
    const planCard = page.locator('.plans-editor-component .card').filter({ hasText: 'Gold' });
    await planCard.getByRole('button', { name: 'Add Guarantee' }).click();
    
    // Configure Guarantee
    const guaranteeRow = planCard.locator('.guarantees-editor-component .card.mb-2').first();
    // Switch to Structured mode first
    await guaranteeRow.locator('label:has-text("Structured")').click();
    
    await guaranteeRow.locator('select').first().selectOption('cpu_load'); // Select Metric
    await guaranteeRow.locator('select').nth(1).selectOption('<'); // Operator
    await guaranteeRow.locator('input[type="text"]').last().fill('80'); // Value

    // 5. Generate Terraform
    await page.click('button:has-text("Transform")');
    await page.click('a:has-text("Generate Terraform (GCP)")');
    await page.click('button:has-text("Generate")');

    // 6. Verify Output
    const editor = page.locator('.ace_content');
    await expect(editor).toContainText('provider "google"');
    await expect(editor).toContainText('project = "test-project-id"');
    await expect(editor).toContainText('resource "google_monitoring_notification_channel"');
    await expect(editor).toContainText('display_name = "DevOps Team"');
    await expect(editor).toContainText('resource "google_monitoring_alert_policy"');
    await expect(editor).toContainText('filter     = "resource.type = \"gce_instance\" AND metric.type = \"compute.googleapis.com/instance/cpu/utilization\""');
    await expect(editor).toContainText('comparison = "COMPARISON_GT"'); // < 80 means alert if > 80
  });
});
