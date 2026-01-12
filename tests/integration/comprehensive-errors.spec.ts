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
    await page.waitForTimeout(500);
    
    await expect(pricingPeriodInput).toHaveClass(/is-invalid/);
  });

  test('should show validation errors in ServiceCreditsEditor', async ({ page }) => {
    const plan = page.locator(`.plan-item:has-text("${planName}")`);
    const credits = plan.locator('.service-credits-editor-component');
    
    // Invalid claim window
    const claimWindowInput = credits.locator('.duration-editor input[placeholder="e.g. P1DT4H"]');
    await claimWindowInput.fill('invalid');
    await claimWindowInput.dispatchEvent('input');
    await page.waitForTimeout(500);
    
    await expect(claimWindowInput).toHaveClass(/is-invalid/);
  });

  test('should show validation errors in MaintenancePolicyEditor', async ({ page }) => {
    const plan = page.locator(`.plan-item:has-text("${planName}")`);
    const maintenance = plan.locator('.maintenance-policy-editor-component');
    
    // Invalid notice
    const standardNoticeInput = maintenance.locator('.duration-editor input[placeholder="e.g. P1DT4H"]').first();
    await standardNoticeInput.fill('invalid');
    await standardNoticeInput.dispatchEvent('input');
    await page.waitForTimeout(500);
    
    await expect(standardNoticeInput).toHaveClass(/is-invalid/);
  });

  test('should show validation errors in LifecyclePolicyEditor', async ({ page }) => {
    const plan = page.locator(`.plan-item:has-text("${planName}")`);
    const lifecycle = plan.locator('.lifecycle-policy-editor-component');
    
    // Invalid notice period
    const noticePeriodInput = lifecycle.locator('.duration-editor input[placeholder="e.g. P1DT4H"]').nth(1);
    await noticePeriodInput.fill('invalid');
    await noticePeriodInput.dispatchEvent('input');
    await page.waitForTimeout(500);
    
    await expect(noticePeriodInput).toHaveClass(/is-invalid/);
  });

  test('should show validation errors in GuaranteesEditor', async ({ page }) => {
    const plan = page.locator(`.plan-item:has-text("${planName}")`);
    const guarantees = plan.locator('.guarantees-editor-component');
    
    await guarantees.locator('button:has-text("Add Guarantee")').click();
    
    // Switch to legacy mode
    await guarantees.locator('label', { hasText: 'Simple Limit (Legacy)' }).click();
    
    // Invalid limit
    const limitInput = guarantees.locator('.duration-editor input[placeholder="e.g. P1DT4H"]');
    await limitInput.fill('invalid');
    await limitInput.dispatchEvent('input');
    await page.waitForTimeout(500);
    
    await expect(limitInput).toHaveClass(/is-invalid/);
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
    await page.waitForTimeout(500);
    
    await expect(sloDurationInput).toHaveClass(/is-invalid/);
  });
});