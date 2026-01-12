import { test, expect } from '@playwright/test';

test.describe('SLO Guarantees Editor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should allow selecting defined metrics in SLO guarantees', async ({ page }) => {
    // 1. Define a metric
    const metricsEditor = page.locator('.metrics-editor-component');
    await metricsEditor.locator('input[placeholder="New metric name"]').fill('test-metric');
    await metricsEditor.locator('button:has-text("Add Metric")').click();

    // 2. Add a Plan
    const plansEditor = page.locator('.plans-editor-component');
    await plansEditor.locator('input[placeholder="New plan name"]').fill('Standard');
    await plansEditor.locator('button:has-text("Add Plan")').click();

    const standardPlan = plansEditor.locator('.card', { hasText: 'Standard' }).first();
    const supportPolicyEditor = standardPlan.locator('.support-policy-editor-component');
    
    // 4. Add SLO
    await supportPolicyEditor.locator('button:has-text("Add SLO")').click();

    // 5. Add SLO Guarantee
    await supportPolicyEditor.locator('button:has-text("Add SLO Guarantee")').click();

    // Switch to Structured mode
    const structuredRadio = supportPolicyEditor.locator('label', { hasText: 'Structured' }).first();
    await structuredRadio.click();

    // 6. Verify Metric Dropdown
    const metricSelect = supportPolicyEditor.locator('select.form-select', { hasText: 'test-metric' }).first();
    await expect(metricSelect).toBeVisible();
    await metricSelect.selectOption('test-metric');
    
    // 7. Verify Operator select
    const operatorSelect = supportPolicyEditor.locator('select.form-select', { hasText: 'None' }).first();
    await expect(operatorSelect).toBeVisible();

    // 8. Switch to Legacy Mode
    const legacyRadio = supportPolicyEditor.locator('label', { hasText: 'Simple Duration (Legacy)' }).first();
    await legacyRadio.click();

    // Operator select should be hidden
    await expect(operatorSelect).toBeHidden();

    const durationInput = supportPolicyEditor.locator('input[placeholder="e.g. P1DT4H"]').first();
    await expect(durationInput).toBeVisible();
    await durationInput.fill('P1D');
  });

  test('should allow adding SLOs directly at the Plan level', async ({ page }) => {
    // 1. Define a metric
    const metricsEditor = page.locator('.metrics-editor-component');
    await metricsEditor.locator('input[placeholder="New metric name"]').fill('plan-metric');
    await metricsEditor.locator('button:has-text("Add Metric")').click();

    // 2. Add a Plan
    const plansEditor = page.locator('.plans-editor-component');
    await plansEditor.locator('input[placeholder="New plan name"]').fill('Premium');
    await plansEditor.locator('button:has-text("Add Plan")').click();

    const premiumPlan = plansEditor.locator('.card', { hasText: 'Premium' }).first();
    const planSloEditor = premiumPlan.locator('.service-level-objectives-editor-component').first();
    await expect(planSloEditor).toBeVisible();

    // 4. Add SLO
    await planSloEditor.locator('button:has-text("Add SLO")').click();
    await planSloEditor.locator('input[placeholder="e.g., High"]').fill('P1');
    await planSloEditor.locator('input[placeholder="e.g., Incident Resolution"]').fill('Response Time Objective');

    // 5. Add SLO Guarantee
    await planSloEditor.locator('button:has-text("Add SLO Guarantee")').click();
    
    // Switch to Structured mode
    await planSloEditor.locator('label', { hasText: 'Structured' }).first().click();

    const metricSelect = planSloEditor.locator('select.form-select').first();
    await metricSelect.selectOption('plan-metric');
    
    // 6. Verify Value
    const valueInput = planSloEditor.locator('input[placeholder="Value"]').first();
    await valueInput.fill('200ms');

    // 7. Check source/YAML
    await page.click('a:has-text("Source")');
    const aceEditor = page.locator('.ace_content');
    await expect(aceEditor).toContainText('serviceLevelObjectives:');
    await expect(aceEditor).toContainText('priority: P1');
    await expect(aceEditor).toContainText('name: Response Time Objective');
  });

  test('should hide redundant controls in measurement mode', async ({ page }) => {
    // Add Plan
    await page.fill('.plans-editor-component input[placeholder="New plan name"]', 'MeasurePlan');
    await page.click('.plans-editor-component button:has-text("Add Plan")');
    
    const plan = page.locator('.plan-item:has-text("MeasurePlan")');
    const sloEditor = plan.locator('.service-level-objectives-editor-component').first();
    
    await sloEditor.locator('button:has-text("Add SLO")').click();
    await sloEditor.locator('button:has-text("Add SLO Guarantee")').click();
    
    // Default is measurement mode
    await expect(sloEditor.locator('.prometheus-measurement-editor')).toBeVisible();
    
    // REDUNDANT controls should be HIDDEN
    // 1. Metric select (replaced by the one inside PrometheusMeasurementEditor)
    // 2. Operator/Value (replaced by the one inside PrometheusMeasurementEditor)
    // 3. Period (contained in the PromQL string)
    
    // Check that there is no "Metric" label outside the measurement editor within this guarantee item
    const guaranteeItem = sloEditor.locator('.slo-guarantee-item').first();
    // The labels in ServiceLevelObjectivesEditor don't have 'small' class, while those in PrometheusMeasurementEditor do.
    await expect(guaranteeItem.locator('label.form-label:not(.small)', { hasText: /^Metric$/ })).toBeHidden();
    await expect(guaranteeItem.locator('label.form-label:not(.small)', { hasText: 'Operator' })).toBeHidden();
    await expect(guaranteeItem.locator('label.form-label:not(.small)', { hasText: 'Period' })).toBeHidden();
  });
});