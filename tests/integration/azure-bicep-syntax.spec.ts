import { test, expect } from '@playwright/test';

const examples = [
  'availability-1-week-downtime',
  'azure-monitoring-sample',
  'four-golden-signals',
  'gcp-monitoring-complex',
  'grafana-prometheus-sample',
  'metrics-100-concurrent-connections',
  'support-mon-fri'
];

test.describe('Azure Bicep Syntax for Examples', () => {
  for (const example of examples) {
    test(`should generate Bicep without errors for ${example}`, async ({ page }) => {
      await page.goto('/');
      
      // Load example
      await page.selectOption('select', example);

      // Navigate to Bicep Generator
      await page.click('button:has-text("Transform")');
      await page.click('a:has-text("Generate Bicep (Azure)")');

      // Fill required configuration
      await page.locator('.input-azure-resource-id').fill('/subscriptions/test/resourceGroups/test/providers/Microsoft.Compute/virtualMachines/test');
      await page.locator('.input-azure-location').fill('eastus');

      // Click Generate
      await page.click('.azure-bicep-generator button:has-text("Generate")');

      // Check for local errors in the generator UI
      const localErrors = page.locator('.azure-bicep-generator .alert-warning');
      const errorCount = await localErrors.count();
      if (errorCount > 0) {
          const text = await localErrors.textContent();
          console.warn(`Warning/Error generating ${example}: ${text}`);
      }

      // Check for validation errors in the Ace editor annotations (simulated by the generator's validation)
      const validationAlert = page.locator('.azure-bicep-generator .alert-danger');
      await expect(validationAlert).not.toBeVisible();

      // Verify some code was actually generated
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
      
      // If the example has metrics with monitoringId, it should generate resources.
      const hasMonitoringIds = await page.evaluate(() => {
          // @ts-ignore
          const sla = window.app.sla;
          if (!sla || !sla.metrics) return false;
          return Object.values(sla.metrics).some((m: any) => m.monitoringId);
      });

      if (hasMonitoringIds) {
          expect(bicep).toContain('resource ');
          expect(bicep.length).toBeGreaterThan(100);
      } else {
          expect(bicep).toContain('// Azure Bicep Monitoring Template');
      }
    });
  }
});
