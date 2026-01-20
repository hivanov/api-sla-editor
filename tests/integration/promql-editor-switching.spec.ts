import { test, expect } from '@playwright/test';

test.describe('Prometheus Measurement Editor Switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Ensure we are in GUI mode
    await page.click('text=GUI');

    // Add a metric first because SLOs usually need a metric
    const metricsWrapper = page.locator('#metrics-editor');
    await metricsWrapper.locator('input[placeholder="New metric name"]').fill('requests');
    await metricsWrapper.locator('button:has-text("Add Metric")').click();

    // Add a plan
    const plansWrapper = page.locator('#plans-editor');
    await plansWrapper.locator('input[placeholder="New plan name"]').fill('Gold');
    await plansWrapper.locator('button:has-text("Add Plan")').click();
    
    // Now SLOs should be visible within the Gold plan
    const planCard = page.locator('.plan-item', { hasText: 'Gold' });
    await planCard.locator('.service-level-objectives-editor-component').first().locator('button:has-text("Add SLO")').click();
    
    // Add SLO Guarantee
    await planCard.locator('.slo-item').first().locator('button:has-text("Add SLO Guarantee")').click();
  });

  test('should hide Raw PromQL toggle for non-representable expressions', async ({ page }) => {
    const sloGuarantee = page.locator('.slo-guarantee-item').first();
    const toggle = sloGuarantee.locator('#raw-promql-toggle');
    
    // 1. Initial state: Switch is visible
    await expect(toggle).toBeVisible();

    // 2. Switch to Raw mode
    await toggle.check();
    const textarea = sloGuarantee.locator('textarea');
    await expect(textarea).toBeVisible();

    // 3. Enter a non-representable expression
    await textarea.fill('requests_total / 10 > 5');
    
    // 4. Toggle should be disabled
    await expect(toggle).toBeDisabled();
    
    // 5. Enter a representable expression
    await textarea.fill('avg_over_time(requests[5m]) > 10');
    await expect(toggle).toBeEnabled();
    
    // 6. Switch back to Editor
    await toggle.uncheck();
    await expect(sloGuarantee.locator('select').first()).toBeVisible();
    
    // Verify values were synced back
    const valueInput = sloGuarantee.locator('input[placeholder*="e.g. 15"]');
    await expect(valueInput).toHaveValue('10');
  });

  test('should stay in Raw mode if expression becomes non-representable via source editor', async ({ page }) => {
    const sloGuarantee = page.locator('.slo-guarantee-item').first();
    const toggle = sloGuarantee.locator('#raw-promql-toggle');

    // Switch to Source tab
    await page.click('text=Source');
    // ... wait a bit for Ace to load
    await page.waitForTimeout(500);
    
    // Switch away and back to GUI
    await page.click('text=GUI');
    
    await toggle.check();
    await sloGuarantee.locator('textarea').fill('requests_total / 10 > 5');
    
    // Switch away and back to ensure it persists
    await page.click('text=Support Policy');
    await page.click('text=Plans');
    
    await expect(sloGuarantee.locator('textarea')).toHaveValue('requests_total / 10 > 5');
    await expect(toggle).toBeDisabled();
  });

  test('should fix validation for incomplete expressions in GUI mode', async ({ page }) => {
    const sloGuarantee = page.locator('.slo-guarantee-item').first();
    
    // In GUI mode
    await sloGuarantee.locator('.metric-select').selectOption('requests');
    const valueInput = sloGuarantee.locator('input[placeholder*="e.g. 15"]');
    await valueInput.fill(''); // Clear value
    
    // It should NOT show "Valid PromQL"
    const validLabel = sloGuarantee.locator('text=Valid PromQL');
    await expect(validLabel).not.toBeVisible();
    
    // It should show an error
    await expect(sloGuarantee.locator('.prometheus-measurement-editor')).toHaveClass(/border-danger/);
    
    // Fill value
    await valueInput.fill('100');
    await expect(validLabel).toBeVisible();
  });
});
