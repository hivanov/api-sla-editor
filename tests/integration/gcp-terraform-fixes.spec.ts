import { test, expect } from '@playwright/test';

test.describe('GCP Terraform Generator Comprehensive Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should generate a correctly-formed terraform file for google alerting', async ({ page }) => {
    // 1. Configure GCP Project ID
    await page.click('.card-header:has-text("GCP Monitoring")');
    await page.fill('input[placeholder="e.g. my-gcp-project-id"]', 'complex-test-project');

    // 2. Configure Metric with GCP mapping
    await page.click('.card-header:has-text("Metrics")');
    await page.fill('input[placeholder="New metric name"]', 'request_latency');
    await page.click('button:has-text("Add Metric")');
    const metricCard = page.locator('.metrics-editor-component .card').filter({ hasText: 'request_latency' });
    await metricCard.locator('select').first().selectOption('number');
    await metricCard.locator('select').nth(1).selectOption('ms');
    await metricCard.locator('input[placeholder*="compute.googleapis.com"]').fill('custom.googleapis.com/latency');
    await metricCard.locator('input[placeholder*="gce_instance"]').fill('global');
    await metricCard.locator('textarea[placeholder*="Markdown"]').fill('Measures request latency');

    // 3. Configure a Plan with Support Policy and SLOs
    await page.click('.card-header:has-text("Plans")');
    await page.fill('input[placeholder="New plan name"]', 'Platinum');
    await page.click('button:has-text("Add Plan")');
    const planCard = page.locator('.plans-editor-component .card').filter({ hasText: 'Platinum' });
    
    // Configure Support Policy Contact Point
    await planCard.getByRole('button', { name: 'Add Contact Point' }).click();
    const contactPoint = planCard.locator('.support-policy-editor-component').locator('.card').filter({ hasText: 'Contact Point #1' });
    await contactPoint.locator('input[placeholder*="Technical Support"]').fill('Reliability Team');
    
    // Add Email Channel
    await contactPoint.getByRole('button', { name: 'Add Channel' }).click();
    const channelCard = contactPoint.locator('.channel-item').first();
    await channelCard.locator('select').selectOption('email');
    await channelCard.locator('input[placeholder*="mailto"]').fill('mailto://reliability@example.com');

    // Add SLO to Plan
    await planCard.getByRole('button', { name: 'Add SLO', exact: true }).first().click();
    const sloEditor = planCard.locator('.service-level-objectives-editor-component').first();
    await sloEditor.getByRole('button', { name: 'Add SLO Guarantee' }).click();
    const sloGuarantee = sloEditor.locator('.slo-guarantee-item').first();
    await sloGuarantee.locator('label:has-text("Structured")').click();
    await sloGuarantee.locator('select').first().selectOption('request_latency');
    await sloGuarantee.locator('select').nth(1).selectOption('<');
    await sloGuarantee.locator('input[placeholder="Value"]').fill('200');

    // 4. Generate Terraform
    await page.click('nav.d-md-flex .dropdown-toggle:has-text("Transform")');
    await page.evaluate(() => {
        const items = Array.from(document.querySelectorAll('.dropdown-item'));
        const gcpItem = items.find(el => el.textContent.includes('Generate Terraform (GCP)'));
        if (gcpItem) gcpItem.click();
    });
    await page.click('button:has-text("Generate")');

    // 5. Verify Entire Output
    const getEditorValue = async () => {
        return await page.evaluate(() => {
            const el = document.querySelector('.ace_editor');
            if (!el) return '';
            // @ts-ignore
            const editor = ace.edit(el);
            return editor.getValue();
        });
    };

    const tf = await getEditorValue();

    const expectedTf = `provider "google" {
  project = "complex-test-project"
}

resource "google_monitoring_metric_descriptor" "metric_request_latency" {
  description = "Measures request latency"
  display_name = "request_latency"
  type = "custom.googleapis.com/latency"
  metric_kind = "GAUGE"
  value_type = "DOUBLE"
  unit = "ms"
}

resource "google_monitoring_notification_channel" "channel_1" {
  display_name = "Reliability Team"
  type         = "email"
  labels = {
    "email_address" = "reliability@example.com"
  }
}

resource "google_monitoring_alert_policy" "alert_platinum_slo_0_0_0" {
  display_name = "SLA Breach: Platinum - slo_0 - request_latency"
  combiner     = "OR"
  conditions {
    display_name = "request_latency breach"
    condition_threshold {
      filter     = "resource.type = \\\"global\\\" AND metric.type = \\\"custom.googleapis.com/latency\\\""
      duration   = "60s"
      comparison = "COMPARISON_GT"
      threshold_value = 200
      aggregations {
        alignment_period   = "60s"
        per_series_aligner = "ALIGN_MEAN"
      }
    }
  }
  notification_channels = [
    google_monitoring_notification_channel.channel_1.name,
  ]
}

`;

    // Normalizing whitespace for comparison to avoid brittle failures due to trailing spaces or newlines
    const normalize = (s: string) => s.split('\n').map(line => line.trimEnd()).join('\n').trim();
    
    expect(normalize(tf)).toBe(normalize(expectedTf));
  });
});