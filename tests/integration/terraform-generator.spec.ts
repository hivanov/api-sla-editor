import { test, expect } from '@playwright/test';

test.describe('Terraform Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have Generate button disabled when configuration is missing', async ({ page }) => {
    // Navigate to Terraform Generator
    await page.click('button:has-text("Transform")');
    await page.click('a:has-text("Generate Terraform (GCP)")');

    // Expect Generate button to be disabled initially
    await expect(page.locator('.terraform-generator button:has-text("Generate")')).toBeDisabled();
  });

  test('should generate terraform with valid configuration', async ({ page }) => {
    // 1. Configure a Metric and a Plan first (needed for alerts)
    await page.click('.card-header:has-text("Metrics")');
    await page.fill('input[placeholder="New metric name"]', 'cpu_load');
    await page.click('button:has-text("Add Metric")');
    const metricCard = page.locator('.metrics-editor-component .card').filter({ hasText: 'cpu_load' });
    await metricCard.locator('.input-metric-monitoring-id').fill('compute.googleapis.com/instance/cpu/utilization');
    await metricCard.locator('.input-metric-resource-type').fill('gce_instance');

    await page.click('.card-header:has-text("Plans")');
    await page.fill('input[placeholder="New plan name"]', 'Gold');
    await page.click('button:has-text("Add Plan")');
    const planCard = page.locator('[data-plan-name="Gold"]');
    await planCard.getByRole('button', { name: 'Add Guarantee' }).click();
    const guaranteeRow = planCard.locator('.guarantees-editor-component .card.mb-2').first();
    await guaranteeRow.locator('select.metric-select').selectOption('cpu_load');
    await guaranteeRow.locator('.input-promql-value').fill('0.8');

    // Add notification channel
    await planCard.locator('button:has-text("Add Contact Point")').click();
    const cp = planCard.locator('.support-policy-editor-component .card').filter({ hasText: 'Contact Point #' }).first();
    await cp.locator('.input-contact-type').fill('SLA Ops');
    await cp.locator('button:has-text("Add Channel")').click();
    await cp.locator('.select-channel-type').selectOption('email');
    await cp.locator('.input-channel-url').fill('mailto:ops@example.com');

    // 2. Navigate to Terraform Generator
    await page.click('button:has-text("Transform")');
    await page.click('a:has-text("Generate Terraform (GCP)")');

    // 3. Fill GCP configuration in the generator view
    await page.locator('.input-gcp-project-id').fill('my-test-project');

    // 4. Click Generate
    await page.click('.terraform-generator button:has-text("Generate")');

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

    const tf = await getEditorValue();

    const expectedTf = `provider "google" {
  project = "my-test-project"
}

resource "google_monitoring_notification_channel" "channel_1" {
  display_name = "SLA Ops"
  type         = "email"
  labels = {
    "email_address" = "ops@example.com"
  }
}

resource "google_monitoring_alert_policy" "alert_gold_direct_0" {
  display_name = "SLA Breach: Gold - direct - cpu_load"
  combiner     = "OR"
  conditions {
    display_name = "cpu_load breach"
    condition_prometheus_query_language {
      query = "avg_over_time(compute.googleapis.com/instance/cpu/utilization[5m]) < 0.8"
      duration = "5m"
    }
  }
  notification_channels = [
    google_monitoring_notification_channel.channel_1.name,
  ]
}
`;

    const normalize = (s: string) => s.split('\n').map(line => line.trimEnd()).join('\n').trim();
    
    expect(normalize(tf)).toBe(normalize(expectedTf));
  });

  test('should navigate back to editor and preserve active tab', async ({ page }) => {
    await page.click('button:has-text("Transform")');
    await page.click('a:has-text("Generate Terraform (GCP)")');
    await page.click('.terraform-generator button:has-text("Back to Editor")');
    
    // Should be back on the Plans tab
    await expect(page.locator('.plans-editor-component')).toBeVisible();
  });
});