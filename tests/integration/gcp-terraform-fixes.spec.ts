import { test, expect } from '@playwright/test';

test.describe('GCP Terraform Generator Comprehensive Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should generate a correctly-formed terraform file for google alerting', async ({ page }) => {
    // 1. Setup a complex SLA structure
    await page.click('.card-header:has-text("Context")');
    await page.locator('.input-context-id').fill('test-sla');

    await page.click('.card-header:has-text("Metrics")');
    await page.fill('input[placeholder="New metric name"]', 'request_latency');
    await page.click('button:has-text("Add Metric")');
    const metricCard = page.locator('.metrics-editor-component .card').filter({ hasText: 'request_latency' });
    await metricCard.locator('.input-metric-monitoring-id').fill('custom.googleapis.com/latency');
    await metricCard.locator('.input-metric-resource-type').fill('global');

    await page.click('.card-header:has-text("Plans")');
    await page.fill('input[placeholder="New plan name"]', 'Platinum');
    await page.click('button:has-text("Add Plan")');
    const planCard = page.locator('[data-plan-name="Platinum"]');
    
    // Add an SLO with a guarantee (Plan level)
    await planCard.locator('.service-level-objectives-editor-component button:has-text("Add SLO")').first().click();
    const sloCard = planCard.locator('.slo-item').first();
    await sloCard.getByRole('button', { name: 'Add SLO Guarantee' }).click();
    const guaranteeRow = sloCard.locator('.slo-guarantee-item').first();
    await guaranteeRow.locator('select.metric-select').selectOption('request_latency');
    await guaranteeRow.locator('.input-promql-value').fill('200');
    
    // Setup Support Policy Contact Point
    await planCard.locator('.support-policy-editor-component button:has-text("Add Contact Point")').click();
    const cp = planCard.locator('.support-policy-editor-component .card').filter({ hasText: 'Contact Point #' }).first();
    await cp.locator('.input-contact-type').fill('Cloud SRE');
    await cp.locator('button:has-text("Add Channel")').click();
    await cp.locator('.select-channel-type').selectOption('email');
    await cp.locator('.input-channel-url').fill('mailto:sre@example.com');

    // 2. Navigate to Generator
    await page.click('button:has-text("Transform")');
    await page.click('a:has-text("Generate Terraform (GCP)")');
    await page.locator('.input-gcp-project-id').fill('my-awesome-project');
    await page.click('.terraform-generator button:has-text("Generate")');

    // 3. Verify Output
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
  project = "my-awesome-project"
}

resource "google_monitoring_metric_descriptor" "metric_request_latency" {
  description = "request_latency"
  display_name = "request_latency"
  type = "custom.googleapis.com/latency"
  metric_kind = "GAUGE"
  value_type = "DOUBLE"
}

resource "google_monitoring_notification_channel" "channel_1" {
  display_name = "Cloud SRE"
  type = "email"
  labels = {
    email_address = "sre@example.com"
  }
}

resource "google_monitoring_alert_policy" "alert_platinum_slo_0_0_0" {
  display_name = "SLA Breach: Platinum - slo_0 - request_latency"
  combiner = "OR"
  conditions {
    display_name = "request_latency breach"
    condition_prometheus_query_language {
      query = "avg_over_time(custom.googleapis.com/latency[5m]) < 200"
      duration = "5m"
    }
  }
  notification_channels = [google_monitoring_notification_channel.channel_1.name]
}
`;

    const normalize = (s: string) => s.split('\n').map(line => line.trimEnd()).join('\n').trim();
    
    expect(normalize(tf)).toBe(normalize(expectedTf));
  });
});
