import { test, expect } from '@playwright/test';

test.describe('Grafana Dashboard Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should generate dashboard and alert rules from example', async ({ page }) => {
    // 1. Load Example
    await page.selectOption('select.form-select', 'grafana-prometheus-sample');
    
    // 2. Navigate to Grafana Generator
    await page.click('button:has-text("Transform")');
    await page.click('a:has-text("Generate Grafana (Prometheus)")');

    // 3. Verify Initial State
    await expect(page.locator('h4')).toContainText('Grafana Dashboard Generator');
    await expect(page.locator('input[placeholder="e.g. Prometheus"]')).toHaveValue('Prometheus');
    await expect(page.locator('input[placeholder="SLA Dashboard"]')).toHaveValue('SLA Dashboard');

    // 4. Click Generate (it might be auto-generated, but clicking ensures update)
    await page.click('button:has-text("Generate")');

    // 5. Verify Dashboard JSON Output
    const getEditorValue = async () => {
        return await page.evaluate(() => {
            const el = document.querySelector('.ace_editor');
            if (!el) return '';
            // @ts-ignore
            const editor = ace.edit(el);
            return editor.getValue();
        });
    };

    const dashboardJson = await getEditorValue();
    const dashboard = JSON.parse(dashboardJson);

    expect(dashboard.title).toBe('SLA Dashboard');
    expect(dashboard.panels.length).toBeGreaterThan(0);
    
    // Check for specific panels
    // In current generator, title is: `${planName} Service Availability Status (${metric.description || metricName})`
    // For standard plan: "standard Service Availability Status (Binary service status (1 for up, 0 for down))"
    const uptimePanel = dashboard.panels.find((p: any) => p.title.includes('Availability Status'));
    expect(uptimePanel).toBeDefined();
    expect(uptimePanel.targets[0].expr).toContain('avg_over_time');
    expect(uptimePanel.targets[0].expr).toContain('up');
    expect(uptimePanel.fieldConfig.defaults.thresholds.steps).toEqual([
       { value: null, color: 'red' },
       { value: 99.9, color: 'green' }
    ]);

    // Guarantees panels titles are `${metric.description || g.metric} Status`
    // Since we use measurement, let's see what panels are generated.
    // Actually generator only generates panels for g.metric if it exists.
    // If g.measurement is used, it's not currently generating a panel for it in Status section.
    // Wait, let's check GrafanaDashboardGenerator.vue again.

    // Check Compensation Policy Panel
    const compPanel = dashboard.panels.find((p: any) => p.title === 'Compensation Policy');
    expect(compPanel).toBeDefined();
    expect(compPanel.content).toContain('| up < 0.999 (Floor: 0.99) | 10 |');

    // Check Estimated Compensation Liability Panel
    const liabilityPanel = dashboard.panels.find((p: any) => p.title === 'Estimated Compensation Liability');
    expect(liabilityPanel).toBeDefined();
    expect(liabilityPanel.targets[0].expr).toContain('* 10');
    expect(liabilityPanel.targets[0].expr).toContain('bool 0.999');

    // 6. Switch to Alert Rules tab
    await page.click('a:has-text("Alert Rules & Contact Points (YAML)")');
    await page.waitForTimeout(100); // Wait for tab switch and editor update

    const alertYaml = await getEditorValue();
    expect(alertYaml).toContain('groups:');
    expect(alertYaml).toContain('contactPoints:');
    expect(alertYaml).toContain('name: DevOps Team (email)');
    expect(alertYaml).toContain('addresses: devops@example.com');
    // For availability alert, name is `SlaBreach_${planName}_Availability`
    expect(alertYaml).toContain('alert: SlaBreach_standard_Availability');
    // Flexible check for quotes
    expect(alertYaml).toMatch(/expr: >-\s+avg_over_time\(\(avg_over_time\(up\{job=[\\\"]+my-service[\\\"]+\}\[1m\]\) > bool\s+0\.99\)\[5m:\]\) \* 100 < 99\.9/);
  });

  test('should navigate back to editor', async ({ page }) => {
     await page.click('button:has-text("Transform")');
     await page.click('a:has-text("Generate Grafana (Prometheus)")');
     await page.click('button:has-text("Back to Editor")');
     await expect(page.locator('#context-editor')).toBeVisible();
  });
});