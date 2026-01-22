import { test, expect } from '@playwright/test';

test.describe('SLO Guarantees Editor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should allow adding SLO guarantees in measurement mode', async ({ page }) => {
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

    // 6. Verify Prometheus Measurement Editor is visible
    const prometheusEditor = supportPolicyEditor.locator('.prometheus-measurement-editor').first();
    await expect(prometheusEditor).toBeVisible();

    // 7. Configure guarantee in measurement mode
    await prometheusEditor.locator('select.metric-select').selectOption('test-metric');
    await prometheusEditor.locator('.input-promql-value').fill('1');

    // 8. Verify the generated expression
    const preview = prometheusEditor.locator('code').first();
    await expect(preview).toContainText('avg_over_time(test-metric[5m]) < 1');
  });

  test('should allow adding SLOs directly at the Plan level', async ({ page }) => {
    // 1. Define a metric
    const metricsEditor = page.locator('.metrics-editor-component');
    await metricsEditor.locator('.input-new-metric-name').fill('plan-metric');
    await metricsEditor.locator('.btn-add-metric').click();

    // 2. Add a Plan
    const plansEditor = page.locator('.plans-editor-component');
    await plansEditor.locator('.input-new-plan-name').fill('Premium');
    await plansEditor.locator('.btn-add-plan').click();

    const premiumPlan = plansEditor.locator('.card', { hasText: 'Premium' }).first();
    const planSloEditor = premiumPlan.locator('.service-level-objectives-editor-component').first();
    await expect(planSloEditor).toBeVisible();

    // 4. Add SLO
    await planSloEditor.locator('.btn-add-slo').click();
    await planSloEditor.locator('.input-slo-priority').fill('P1');
    await planSloEditor.locator('.input-slo-name').fill('Response Time Objective');

    // 5. Add SLO Guarantee
    await planSloEditor.locator('.btn-add-slo-guarantee').click();
    
    const prometheusEditor = planSloEditor.locator('.prometheus-measurement-editor').first();
    await expect(prometheusEditor).toBeVisible();

    await prometheusEditor.locator('select.metric-select').selectOption('plan-metric');
    await prometheusEditor.locator('.input-promql-value').fill('200');

    // 7. Check source/YAML
    await page.click('.btn-tab-source');
    
    // Wait for Ace to update - use a function that checks for the content
    let yaml = '';
    await expect(async () => {
        yaml = await page.evaluate(() => {
            const el = document.querySelector('.ace_editor');
            if (!el) return '';
            // @ts-ignore
            const editor = ace.edit(el);
            return editor.getValue();
        });
        expect(yaml).toContain('serviceLevelObjectives:');
    }).toPass();

    expect(yaml).toContain('priority: P1');
    expect(yaml).toContain('name: Response Time Objective');
    expect(yaml).toContain('measurement: avg_over_time(plan-metric[5m]) < 200');
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