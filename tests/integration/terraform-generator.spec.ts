import { test, expect } from '@playwright/test';

test.describe('Terraform Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should show error when Project ID is missing', async ({ page }) => {
    // Navigate to Terraform Generator
    await page.click('button:has-text("Transform")');
    await page.click('a:has-text("Generate Terraform (GCP)")');

    // Expect Generate button to be disabled initially
    await expect(page.locator('button:has-text("Generate")')).toBeDisabled();
  });

  test('should generate terraform with valid configuration', async ({ page }) => {
    // 1. Configure a Metric with GCP mapping (flattened)
    await page.click('.card-header:has-text("Metrics")');
    // Add a new metric "cpu_load"
    await page.fill('input[placeholder="New metric name"]', 'cpu_load');
    await page.click('button:has-text("Add Metric")');
    
    // Configure cpu_load
    const metricCard = page.locator('.metrics-editor-component .card').filter({ hasText: 'cpu_load' });
    await metricCard.locator('input[placeholder*="compute.googleapis.com"]').fill('compute.googleapis.com/instance/cpu/utilization');
    await metricCard.locator('input[placeholder*="gce_instance"]').fill('gce_instance');
    // Set Kind (optional but good to test)
    await metricCard.locator('select').filter({ hasText: 'Select Kind' }).selectOption('GAUGE');
    // Set Description (Markdown)
    await metricCard.locator('textarea[placeholder*="Markdown"]').fill('Tracks CPU load');

    // 2. Configure a Plan
    await page.click('.card-header:has-text("Plans")');
    await page.fill('input[placeholder="New plan name"]', 'Gold');
    await page.click('button:has-text("Add Plan")');
    
    const planCard = page.locator('.plans-editor-component .card').filter({ hasText: 'Gold' });
    
    // 3. Configure Guarantee using this metric
    await planCard.getByRole('button', { name: 'Add Guarantee' }).click();
    const guaranteeRow = planCard.locator('.guarantees-editor-component .card.mb-2').first();
    // Switch to Structured mode first
    await guaranteeRow.locator('label:has-text("Structured")').click();
    
    await guaranteeRow.locator('select').first().selectOption('cpu_load'); // Select Metric
    await guaranteeRow.locator('select').nth(1).selectOption('<'); // Operator
    await guaranteeRow.locator('input[type="text"]').last().fill('80'); // Value

    // 4. Configure Support Policy (Contact Points) for Notification Channels
    await planCard.getByRole('button', { name: 'Add Contact Point' }).click();
    const contactPoint = planCard.locator('.support-policy-editor-component').locator('.card').filter({ hasText: 'Contact Point #1' });
    await contactPoint.getByRole('button', { name: 'Add Channel' }).click();
    
    // Select the channel card properly
    const channelCard = contactPoint.locator('.channel-item').first();
    await channelCard.locator('select').selectOption('email'); // Type
    await channelCard.locator('input[placeholder*="mailto"]').fill('mailto://ops@example.com');

    // 5. Navigate to Terraform Generator
    await page.click('button:has-text("Transform")');
    await page.click('a:has-text("Generate Terraform (GCP)")');

    // 6. Configure GCP Project ID in the generator view
    await page.fill('input[placeholder="e.g. my-gcp-project-id"]', 'test-project-id');

    // 7. Click Generate
    await page.click('button:has-text("Generate")');

    // 7. Verify Output
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
  project = "test-project-id"
}

resource "google_monitoring_notification_channel" "channel_1" {
  display_name = "ops@example.com"
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
    condition_threshold {
      filter     = "resource.type = \\"gce_instance\\" AND metric.type = \\"compute.googleapis.com/instance/cpu/utilization\\""
      duration   = "0s"
      comparison = "COMPARISON_GT"
      threshold_value = 0
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

    const normalize = (s: string) => s.split('\n').map(line => line.trimEnd()).join('\n').trim();
    
    expect(normalize(tf)).toBe(normalize(expectedTf));
  });

  test('should navigate back to editor and preserve active tab', async ({ page }) => {
    const navigateToTerraform = async () => {
      await page.waitForTimeout(300);
      await page.click('nav.d-md-flex .dropdown-toggle:has-text("Transform")');
      // Use evaluate to click the item directly in the browser
      await page.evaluate(() => {
        const items = Array.from(document.querySelectorAll('.dropdown-item'));
        const gcpItem = items.find(el => el.textContent.includes('Generate Terraform (GCP)'));
        if (gcpItem) gcpItem.click();
      });
      await expect(page.locator('h4:has-text("GCP Terraform Generator")')).toBeVisible();
    };

    // 1. Start in GUI tab
    await page.click('a.nav-link:has-text("GUI")');
    await expect(page.locator('#context-editor')).toBeVisible();

    // 2. Go to Terraform Generator
    await navigateToTerraform();

    // 3. Click Back to Editor
    await page.click('button:has-text("Back to Editor")');
    
    // 4. Verify back in Editor and GUI tab is active
    await expect(page.locator('a.nav-link.active')).toHaveText('GUI');
    await expect(page.locator('#context-editor')).toBeVisible();

    // 5. Switch to Description tab
    await page.click('a.nav-link:has-text("Description")');
    await expect(page.locator('.policy-description')).toBeVisible();

    // 6. Go to Terraform Generator
    await navigateToTerraform();

    // 7. Click Back to Editor
    await page.click('button:has-text("Back to Editor")');

    // 8. Verify back in Editor and Description tab is active
    await expect(page.locator('a.nav-link.active')).toHaveText('Description');
    await expect(page.locator('.policy-description')).toBeVisible();

    // 9. Switch to Source tab
    await page.click('a.nav-link:has-text("Source")');
    await expect(page.locator('.ace_editor')).toBeVisible();

    // 10. Go to Terraform Generator
    await navigateToTerraform();

    // 11. Click Back to Editor
    await page.click('button:has-text("Back to Editor")');

    // 12. Verify back in Editor and Source tab is active
    await expect(page.locator('a.nav-link.active')).toHaveText('Source');
    await expect(page.locator('.ace_editor')).toBeVisible();
  });
});