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

    // 3. Navigate to Support Policy
    // Support Policy Editor is nested inside the plan item in Plans Editor
    // The newly added plan "Standard" will be rendered.
    const standardPlan = plansEditor.locator('.card', { hasText: 'Standard' }).first();
    const supportPolicyEditor = standardPlan.locator('.support-policy-editor-component');
    
    // 4. Add SLO
    // Scroll if needed automatically by Playwright
    await supportPolicyEditor.locator('button:has-text("Add SLO")').click();

    // 5. Add SLO Guarantee
    await supportPolicyEditor.locator('button:has-text("Add SLO Guarantee")').click();

    // 6. Verify Metric Dropdown
    const metricSelect = supportPolicyEditor.locator('select.form-select', { hasText: 'test-metric' }).first();
    
    await expect(metricSelect).toBeVisible();
    await metricSelect.selectOption('test-metric');
    
    // Verify selection
    await expect(metricSelect).toHaveValue('test-metric');

    // 7. Verify Default Mode (Structured)
    // Operator select should be visible
    const operatorSelect = supportPolicyEditor.locator('select.form-select', { hasText: 'None' }).first();
    await expect(operatorSelect).toBeVisible();

    // 8. Switch to Legacy Mode
    const legacyRadio = supportPolicyEditor.locator('label', { hasText: 'Simple Duration (Legacy)' }).first();
    await legacyRadio.click();

    // Operator select should be hidden
    await expect(operatorSelect).toBeHidden();

    // Duration editor (legacy) should be visible (it has label "Duration" inside DurationEditor but we can check for input)
    // Since there are multiple DurationEditors, we need to be careful.
    // In legacy mode, only one duration editor is visible.
    // In structured mode, "Period" was visible.
    
    // Let's just check that we can type in the visible duration input
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
    
    // 3. Find SLO Editor at Plan level (should be outside x-support-policy)
    // We can look for the SLO editor that is a direct child of the plan card body, 
    // or just look for the text.
    const planSloEditor = premiumPlan.locator('.service-level-objectives-editor-component').first();
    await expect(planSloEditor).toBeVisible();

    // 4. Add SLO
    await planSloEditor.locator('button:has-text("Add SLO")').click();
    await planSloEditor.locator('input[placeholder="e.g., High"]').fill('P1');
    await planSloEditor.locator('input[placeholder="e.g., Incident Resolution"]').fill('Response Time Objective');

    // 5. Add SLO Guarantee
    await planSloEditor.locator('button:has-text("Add SLO Guarantee")').click();
    
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
});
