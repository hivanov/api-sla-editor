import { test, expect } from '@playwright/test';

test.describe('Comprehensive Validation Errors', () => {
  const planName = 'ErrorPlan';

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('a:has-text("GUI")');
    
    // Add a metric
    await page.fill('.metrics-editor-component input[placeholder="New metric name"]', 'latency');
    await page.click('.metrics-editor-component button:has-text("Add Metric")');

    // Add a plan
    await page.fill('.plans-editor-component input[placeholder="New plan name"]', planName);
    await page.click('.plans-editor-component button:has-text("Add Plan")');
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
    
    const toggle = guarantees.locator('input#raw-promql-toggle');
    await toggle.click();
    await guarantees.locator('textarea').fill('invalid promql (((');
    
    await expect(guarantees.locator('.invalid-feedback')).toBeVisible();
    await expect(guarantees.locator('.invalid-feedback')).toContainText('mismatched input');
  });

  test('should show validation errors in SLO Guarantees', async ({ page }) => {
    const plan = page.locator(`.plan-item:has-text("${planName}")`);
    const slo = plan.locator('.service-level-objectives-editor-component').first();
    
    await slo.locator('button:has-text("Add SLO")').click();
    await slo.locator('button:has-text("Add SLO Guarantee")').click();
    
    // Switch to legacy mode
    await slo.locator('label', { hasText: 'Simple Duration (Legacy)' }).click();
    
    // Invalid duration
    const sloDurationInput = slo.locator('.duration-editor input[placeholder="e.g. P1DT4H"]');
    await sloDurationInput.fill('invalid');
    await sloDurationInput.dispatchEvent('input');
    
    await expect(async () => {
        await expect(sloDurationInput).toHaveClass(/is-invalid/);
    }).toPass();
  });
});