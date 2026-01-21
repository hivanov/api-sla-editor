import { test, expect } from '@playwright/test';

test.describe('Availability Tiers', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Add a metric so it can be selected in AvailabilityEditor
    await page.fill('.metrics-editor-component input[placeholder="New metric name"]', 'uptime');
    await page.click('.metrics-editor-component button:has-text("Add Metric")');
    const metricCard = page.locator('.metrics-editor-component .card:has-text("uptime")');
    await metricCard.locator('.col-md-6:has(label:has-text("Type")) select').selectOption('number');
  });

  test('should update availability percentage and downtime when a common tier is selected', async ({ page }) => {
    // 1. Add a plan to reveal AvailabilityEditor
    await page.fill('.plans-editor-component input[placeholder="New plan name"]', 'Test Plan');
    await page.click('.plans-editor-component button:has-text("Add Plan")');
    
    const basicPlanCard = page.locator('.plans-editor-component .plan-item:has-text("Test Plan")');
    const availEditor = basicPlanCard.locator('.availability-editor-component');

    // Select metric first
    await availEditor.locator('.select-avail-metric').selectOption('uptime');
    
    // Fill expression (PrometheusMeasurementEditor is used)
    const promQLEditor = availEditor.locator('.prometheus-measurement-editor');
    // It might be in raw mode or builder mode. Let's ensure it's raw for simple fill if needed, 
    // but the editor usually has a textarea for raw PromQL.
    const rawSwitch = promQLEditor.locator('.check-raw-promql'); 
    if (!(await rawSwitch.isChecked())) {
        await rawSwitch.click();
    }
    await promQLEditor.locator('textarea').fill('uptime == 1');
    
    // 2. Select a tier (99.9%) - this is the default mode
    await availEditor.locator('.btn-mode-switch[data-mode="tier"]').click();
    const tierSelect = availEditor.locator('.select-avail-tier');
    await tierSelect.selectOption('99.9');
    
    // 3. Switch to Manual mode to verify percentage input
    await availEditor.locator('.btn-mode-switch[data-mode="manual"]').click();
    const percentageInput = availEditor.locator('.input-avail-percentage');
    await expect(percentageInput).toHaveValue('99.9');
    
    // 4. Switch to Uptime mode to verify downtime calculations
    await availEditor.locator('.btn-mode-switch[data-mode="downtime"]').click();
    
    // For 99.9% yearly, it should be:
    // Days: 0, Hours: 8, Mins: 45, Secs: 56, Ms: 952
    // Calculation: 365.2425 * 24 * 60 * 60 * 1000 * 0.001 = 31556856 * 0.001 = 31556.856 seconds
    // 31556.856 / 3600 = 8.76579333... hours
    // 8 hours
    // 0.76579333 * 60 = 45.9476 mins
    // 45 mins
    // 0.9476 * 60 = 56.856 secs
    // 56 secs
    // 856 ms (wait, my manual calculation says 856, let's see what the code does)
    // The code uses 365.2425 days for a year.
    
    await expect(availEditor.locator('.input-downtime-days')).toHaveValue('0');
    await expect(availEditor.locator('.input-downtime-hours')).toHaveValue('8');
    await expect(availEditor.locator('.input-downtime-mins')).toHaveValue('45');
    
    // 5. Change period to Daily and check downtime
    const periodSelect = availEditor.locator('.select-downtime-period');
    await periodSelect.selectOption('day');
    
    // 99.9% of 24h = 24 * 3600 * 0.001 = 86.4 seconds = 1m 26s 400ms
    await expect(availEditor.locator('.input-downtime-days')).toHaveValue('0');
    await expect(availEditor.locator('.input-downtime-hours')).toHaveValue('0');
    await expect(availEditor.locator('.input-downtime-mins')).toHaveValue('1');
    await expect(availEditor.locator('.input-downtime-secs')).toHaveValue('26');
    await expect(availEditor.locator('.input-downtime-ms')).toHaveValue('400');
  });

  test('should reflect current percentage in tier dropdown if it matches', async ({ page }) => {
    await page.fill('.plans-editor-component input[placeholder="New plan name"]', 'Test Plan');
    await page.click('.plans-editor-component button:has-text("Add Plan")');
    
    const basicPlanCard = page.locator('.plans-editor-component .plan-item:has-text("Test Plan")');
    const availEditor = basicPlanCard.locator('.availability-editor-component');

    // Select metric
    await availEditor.locator('.select-avail-metric').selectOption('uptime');
    
    // Switch to Manual mode
    await availEditor.locator('.btn-mode-switch[data-mode="manual"]').click();
    const percentageInput = availEditor.locator('.input-avail-percentage');

    // Manually set to 99.99
    await percentageInput.fill('99.99');
    
    // Switch to Tiers mode
    await availEditor.locator('.btn-mode-switch[data-mode="tier"]').click();
    const tierSelect = availEditor.locator('.select-avail-tier');
    await expect(tierSelect).toHaveValue('99.99');

    // Switch back to Manual and set to something non-standard
    await availEditor.locator('.btn-mode-switch[data-mode="manual"]').click();
    await percentageInput.fill('99.98');
    
    // Switch to Tiers mode
    await availEditor.locator('.btn-mode-switch[data-mode="tier"]').click();
    await expect(tierSelect).toHaveValue('');
  });

  test('should calculate availability via Deployment Calculator', async ({ page }) => {
    await page.fill('.plans-editor-component input[placeholder="New plan name"]', 'Deployment Plan');
    await page.click('.plans-editor-component button:has-text("Add Plan")');
    
    const planCard = page.locator('.plans-editor-component .plan-item:has-text("Deployment Plan")');
    const availEditor = planCard.locator('.availability-editor-component');

    // Select metric
    await availEditor.locator('.select-avail-metric').selectOption('uptime');
    
    // Switch to Deployments mode
    await availEditor.locator('.btn-mode-switch[data-mode="deployment"]').click();
    
    // Set 4 deployments per week
    await availEditor.locator('.select-deployment-period').selectOption('week');
    await availEditor.locator('.input-deployment-count').fill('4');
    
    // Set 15 mins per deployment
    // Clear the field first to avoid issues with default values if they interfere
    await availEditor.locator('.input-deployment-mins').fill('15');
    
    // Total downtime = 4 * 15 = 60 mins per week
    // Week = 7 * 24 * 60 = 10080 mins
    // Availability = (1 - 60/10080) * 100 = 99.404761905% (to 9 decimal places in code)
    
    // Use regex for flexible matching of whitespace or slightly different formatting
    await expect(availEditor.locator('.deployment-info')).toContainText(/1h/);
    
    // Switch to Manual to check percentage
    await availEditor.locator('.btn-mode-switch[data-mode="manual"]').click();
    // Use a looser check or exact string if we are sure
    await expect(availEditor.locator('.input-avail-percentage')).toHaveValue('99.404761905');
  });
});