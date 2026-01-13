import { test, expect } from '@playwright/test';

test.describe('GCP Complex Sample Transformation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the complex GCP sample and generate valid terraform', async ({ page }) => {
    // 1. Load the example
    await page.selectOption('select.form-select', 'gcp-monitoring-complex');
    
    // Verify it's loaded by checking a value in the GUI
    await page.click('.card-header:has-text("GCP Monitoring")');
    const projectIdInput = page.locator('input[placeholder*="e.g. my-gcp-project-id"]');
    await expect(projectIdInput).toHaveValue('production-data-platform');

    // 2. Generate Terraform
    await page.click('nav.d-md-flex .dropdown-toggle:has-text("Transform")');
    await page.evaluate(() => {
        const items = Array.from(document.querySelectorAll('.dropdown-item'));
        const gcpItem = items.find(el => el.textContent.includes('Generate Terraform (GCP)'));
        if (gcpItem) gcpItem.click();
    });
    await page.click('button:has-text("Generate")');

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
  project = "production-data-platform"
}

resource "google_monitoring_metric_descriptor" "metric_request_latency" {
  description = "Ninetieth percentile response time for API requests"
  display_name = "request_latency"
  type = "custom.googleapis.com/api/request_latency"
  metric_kind = "GAUGE"
  value_type = "DOUBLE"
  unit = "ms"
}

resource "google_monitoring_metric_descriptor" "metric_error_rate" {
  description = "Rate of 5xx responses"
  display_name = "error_rate"
  type = "custom.googleapis.com/api/error_rate"
  metric_kind = "GAUGE"
  value_type = "DOUBLE"
  unit = "percent"
}

resource "google_monitoring_notification_channel" "channel_1" {
  display_name = "SRE On-Call"
  type         = "email"
  labels = {
    "email_address" = "sre-alerts@example.com"
  }
}

resource "google_monitoring_notification_channel" "channel_2" {
  display_name = "SRE On-Call"
  type         = "sms"
  labels = {
    "number" = "+15550123456"
  }
}

resource "google_monitoring_notification_channel" "channel_3" {
  display_name = "DevOps Support"
  type         = "email"
  labels = {
    "email_address" = "support@example.com"
  }
}

resource "google_monitoring_alert_policy" "alert_gold_direct_0" {
  display_name = "SLA Breach: Gold - direct - cpu_utilization"
  combiner     = "OR"
  conditions {
    display_name = "cpu_utilization breach"
    condition_threshold {
      filter     = "resource.type = \\"gce_instance\\" AND metric.type = \\"compute.googleapis.com/instance/cpu/utilization\\""
      duration   = "300s"
      comparison = "COMPARISON_GT"
      threshold_value = 80
      aggregations {
        alignment_period   = "60s"
        per_series_aligner = "ALIGN_MEAN"
      }
    }
  }
  notification_channels = [
    google_monitoring_notification_channel.channel_1.name,
    google_monitoring_notification_channel.channel_2.name,
    google_monitoring_notification_channel.channel_3.name,
  ]
}

resource "google_monitoring_alert_policy" "alert_gold_slo_latency_performance_0_0" {
  display_name = "SLA Breach: Gold - slo_Latency Performance - request_latency"
  combiner     = "OR"
  conditions {
    display_name = "request_latency breach"
    condition_threshold {
      filter     = "resource.type = \\"global\\" AND metric.type = \\"custom.googleapis.com/api/request_latency\\""
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
    google_monitoring_notification_channel.channel_2.name,
    google_monitoring_notification_channel.channel_3.name,
  ]
}

resource "google_monitoring_alert_policy" "alert_gold_support_slo_incident_response_support_slo_0_0" {
  display_name = "SLA Breach: Gold - support_slo_Incident Response - error_rate"
  combiner     = "OR"
  conditions {
    display_name = "error_rate breach"
    condition_threshold {
      filter     = "resource.type = \\"global\\" AND metric.type = \\"custom.googleapis.com/api/error_rate\\""
      duration   = "60s"
      comparison = "COMPARISON_GT"
      threshold_value = 0.1
      aggregations {
        alignment_period   = "60s"
        per_series_aligner = "ALIGN_MEAN"
      }
    }
  }
  notification_channels = [
    google_monitoring_notification_channel.channel_1.name,
    google_monitoring_notification_channel.channel_2.name,
    google_monitoring_notification_channel.channel_3.name,
  ]
}

resource "google_monitoring_alert_policy" "alert_silver_direct_0" {
  display_name = "SLA Breach: Silver - direct - cpu_utilization"
  combiner     = "OR"
  conditions {
    display_name = "cpu_utilization breach"
    condition_threshold {
      filter     = "resource.type = \\"gce_instance\\" AND metric.type = \\"compute.googleapis.com/instance/cpu/utilization\\""
      duration   = "900s"
      comparison = "COMPARISON_GT"
      threshold_value = 90
      aggregations {
        alignment_period   = "60s"
        per_series_aligner = "ALIGN_MEAN"
      }
    }
  }
  notification_channels = [
    google_monitoring_notification_channel.channel_1.name,
    google_monitoring_notification_channel.channel_2.name,
    google_monitoring_notification_channel.channel_3.name,
  ]
}

resource "google_monitoring_alert_policy" "alert_silver_slo_latency_performance_0_0" {
  display_name = "SLA Breach: Silver - slo_Latency Performance - request_latency"
  combiner     = "OR"
  conditions {
    display_name = "request_latency breach"
    condition_threshold {
      filter     = "resource.type = \\"global\\" AND metric.type = \\"custom.googleapis.com/api/request_latency\\""
      duration   = "300s"
      comparison = "COMPARISON_GT"
      threshold_value = 500
      aggregations {
        alignment_period   = "60s"
        per_series_aligner = "ALIGN_MEAN"
      }
    }
  }
  notification_channels = [
    google_monitoring_notification_channel.channel_1.name,
    google_monitoring_notification_channel.channel_2.name,
    google_monitoring_notification_channel.channel_3.name,
  ]
}

`;

    const normalize = (s: string) => s.split('\n').map(line => line.trimEnd()).join('\n').trim();
    
    expect(normalize(tf)).toBe(normalize(expectedTf));
  });
});
