import { test, expect } from '@playwright/test';

test.describe('Comprehensive Validation Errors', () => {
  const planName = 'ErrorPlan';

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('.btn-tab-gui');
    
    // Add a metric
    await page.fill('.metrics-editor-component input[placeholder="New metric name"]', 'latency');
    await page.click('.metrics-editor-component button:has-text("Add Metric")');
    const latencyCard = page.locator('.metrics-editor-component [data-metric-name="latency"]');
    await latencyCard.locator('.col-md-6:has(label:has-text("Type")) select').selectOption('number');

    // Add a plan
    await page.fill('.plans-editor-component input[placeholder="New plan name"]', planName);
    await page.click('.plans-editor-component button:has-text("Add Plan")');
    const plan = page.locator(`.plan-item:has-text("${planName}")`);
    await plan.locator('.availability-editor-component select.metric-selector').selectOption('latency');
  });

  test('should show validation errors in PricingEditor', async ({ page }) => {
    const plan = page.locator(`.plan-item:has-text("${planName}")`);
    const pricing = plan.locator('.pricing-editor-component');
    
    // Invalid duration
    const pricingPeriodInput = pricing.locator('.pricing-period-container .duration-editor input[placeholder="e.g. P1DT4H"]');
    await pricingPeriodInput.fill('invalid');
    await pricingPeriodInput.dispatchEvent('input');
    
    await expect(async () => {
        await expect(pricingPeriodInput).toHaveClass(/is-invalid/);
    }).toPass();
  });

  test('should show validation errors in ServiceCreditsEditor', async ({ page }) => {
    const plan = page.locator(`.plan-item:has-text("${planName}")`);
    const credits = plan.locator('.service-credits-editor-component');
    
    // Invalid claim window
    const claimWindowInput = credits.locator('.duration-editor input[placeholder="e.g. P1DT4H"]');
    await claimWindowInput.fill('invalid');
    await claimWindowInput.dispatchEvent('input');
    
    await expect(async () => {
        await expect(claimWindowInput).toHaveClass(/is-invalid/);
    }).toPass();
  });

  test('should show validation errors in MaintenancePolicyEditor', async ({ page }) => {
    const plan = page.locator(`.plan-item:has-text("${planName}")`);
    const maintenance = plan.locator('.maintenance-policy-editor-component');
    
    // Invalid notice
    const standardNoticeInput = maintenance.locator('.duration-editor input[placeholder="e.g. P1DT4H"]').first();
    await standardNoticeInput.fill('invalid');
    await standardNoticeInput.dispatchEvent('input');
    
    await expect(async () => {
        await expect(standardNoticeInput).toHaveClass(/is-invalid/);
    }).toPass();
  });

  test('should show validation errors in LifecyclePolicyEditor', async ({ page }) => {
    const plan = page.locator(`.plan-item:has-text("${planName}")`);
    const lifecycle = plan.locator('.lifecycle-policy-editor-component');
    
    // Invalid notice period
    const noticePeriodInput = lifecycle.locator('.duration-editor input[placeholder="e.g. P1DT4H"]').nth(1);
    await noticePeriodInput.fill('invalid');
    await noticePeriodInput.dispatchEvent('input');
    
    await expect(async () => {
        await expect(noticePeriodInput).toHaveClass(/is-invalid/);
    }).toPass();
  });

  test('should show validation errors in GuaranteesEditor', async ({ page }) => {
    await page.click('.card-header:has-text("Plans")');
    const plan = page.locator('.plan-item:has-text("ErrorPlan")');
    const guarantees = plan.locator('.guarantees-editor-component');
    
    await guarantees.locator('button:has-text("Add Guarantee")').click();
    
    // Invalid measurement (empty)
    await expect(guarantees.locator('.invalid-feedback')).not.toBeVisible();
    
    // Trigger error by entering invalid promql
    const measurementTextArea = guarantees.locator('textarea');
    // If it is in GUI mode, we might need to toggle to raw or just leave it empty if there's a required check.
    // The PrometheusMeasurementEditor has validation for PromQL.
    
    const toggle = guarantees.locator('input.check-raw-promql');
    await toggle.click();
    await guarantees.locator('textarea').fill('invalid promql (((');
    
    await expect(guarantees.locator('.invalid-feedback')).toBeVisible();
    await expect(guarantees.locator('.invalid-feedback')).toContainText('mismatched input');
  });

  test('should show validation errors in SLO Guarantees', async ({ page }) => {
    // 1. Add a metric 'up'
    const metricsEditor = page.locator('.metrics-editor-component');
    await metricsEditor.locator('input[placeholder="New metric name"]').fill('up');
    await metricsEditor.locator('button:has-text("Add Metric")').click();
    const upCard = page.locator('.metrics-editor-component [data-metric-name="up"]');
    await upCard.locator('.col-md-6:has(label:has-text("Type")) select').selectOption('number');

    // 2. Locate the SLO editor for ErrorPlan
    const plan = page.locator(`.plan-item:has-text("${planName}")`);
    const sloEditor = plan.locator('.service-level-objectives-editor-component').first();

    // 3. Set invalid SLO Guarantee
    await sloEditor.locator('button:has-text("Add SLO")').click();
    await sloEditor.locator('button:has-text("Add SLO Guarantee")').click();
    
    // Invalid PromQL
    const sloMeasurementInput = sloEditor.locator('.prometheus-measurement-editor textarea');
    // We need to switch to raw mode to enter explicitly invalid PromQL that isn't auto-fixed
    await sloEditor.locator('.check-raw-promql').click();
    await sloMeasurementInput.fill('up ((( invalid');
    
    // Switch to Source to trigger validation
    await page.click('.btn-tab-source');
    
    await expect(async () => {
        const errorRows = page.locator('.validation-card table tbody tr');
        await expect(errorRows).toContainText(['Invalid PromQL']);
    }).toPass();
  });
});