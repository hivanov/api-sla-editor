import { test, expect } from '@playwright/test';

test.describe('Terraform Generator - Examples Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  const getEditorValue = async (page) => {
    return await page.evaluate(() => {
        const el = document.querySelector('.ace_editor');
        if (!el) return '';
        // @ts-ignore
        const editor = ace.edit(el);
        return editor.getValue();
    });
  };

  const normalize = (s: string) => s.split('\n').map(line => line.trimEnd()).join('\n').trim();

  test('should generate correct Terraform for Four Golden Signals example', async ({ page }) => {
    // Load example
    await page.locator('.select-example-loader').selectOption('four-golden-signals');
    
    // Navigate to Terraform Generator
    await page.click('button:has-text("Transform")');
    await page.click('a:has-text("Generate Terraform (GCP)")');

    // Fill GCP configuration
    await page.locator('.input-gcp-project-id').fill('golden-signals-project');

    // Click Generate
    await page.click('.terraform-generator button:has-text("Generate")');

    const tf = await getEditorValue(page);
    
    // Verify some key resources exist in the output
    expect(tf).toContain('provider "google"');
    expect(tf).toContain('project = "golden-signals-project"');
    
    // Should have metric descriptors for custom metrics
    expect(tf).toContain('resource "google_monitoring_metric_descriptor" "metric_uptime"');
    expect(tf).toContain('type = "custom.googleapis.com/api/uptime"');
    
    // Should have alert policies for plans
    expect(tf).toContain('resource "google_monitoring_alert_policy" "alert_standard_direct_0"');
    expect(tf).toContain('resource "google_monitoring_alert_policy" "alert_premium_direct_0"');
    
    // Verify it uses PromQL for complex ones
    expect(tf).toContain('condition_prometheus_query_language');
  });

  test('should generate correct Terraform for GCP Monitoring Complex example', async ({ page }) => {
    // Load example
    await page.locator('.select-example-loader').selectOption('gcp-monitoring-complex');
    
    // Navigate to Terraform Generator
    await page.click('button:has-text("Transform")');
    await page.click('a:has-text("Generate Terraform (GCP)")');

    // Fill GCP configuration
    await page.locator('.input-gcp-project-id').fill('complex-gcp-project');

    // Click Generate
    await page.click('.terraform-generator button:has-text("Generate")');

    const tf = await getEditorValue(page);
    
    expect(tf).toContain('provider "google"');
    expect(tf).toContain('project = "complex-gcp-project"');
    
    // Should have notification channels
    expect(tf).toContain('resource "google_monitoring_notification_channel" "channel_1"');
    expect(tf).toContain('type = "email"');
    expect(tf).toContain('email_address = "sre-alerts@example.com"');
    
    expect(tf).toContain('resource "google_monitoring_notification_channel" "channel_2"');
    expect(tf).toContain('type = "sms"'); // tel: becomes sms in our current logic
    
    // Should have alert policies
    expect(tf).toContain('resource "google_monitoring_alert_policy" "alert_gold_direct_0"');
    expect(tf).toContain('resource "google_monitoring_alert_policy" "alert_gold_slo_latency_performance_0_0"');
    expect(tf).toContain('resource "google_monitoring_alert_policy" "alert_gold_support_slo_incident_response_support_slo_0_0"');
  });
});
