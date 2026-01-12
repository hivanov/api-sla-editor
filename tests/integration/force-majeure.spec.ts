import { test, expect } from '@playwright/test';

test.describe('Force Majeure Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should add standard force majeure exclusions and reflect in Source/Description', async ({ page }) => {
    // 1. Setup a Basic Plan
    await page.fill('.plans-editor-component input[placeholder="New plan name"]', 'Basic Plan');
    await page.click('.plans-editor-component button:has-text("Add Plan")');
    await page.waitForLoadState('networkidle');

    // 2. Expand the plan (it should be expanded by default on creation, but let's be safe if logic changes)
    const planCard = page.locator('.plans-editor-component .plan-item:has-text("Basic Plan")');
    await expect(planCard).toBeVisible();

    // 2b. Make the plan valid (fill required fields)
    const availEditor = planCard.locator('.availability-editor-component');
    await availEditor.locator('.nav-link:has-text("Manual Entry")').click();
    await availEditor.locator('input[type="number"]').first().fill('99.9');

    await planCard.locator('.pricing-editor-component input[placeholder="Cost"]').fill('10');
    await planCard.locator('.pricing-editor-component input[placeholder="Currency"]').fill('EUR');
    await planCard.locator('.pricing-editor-component input[placeholder="e.g. P1DT4H"]').fill('P30D');
    
    // 3. Locate Exclusions Editor
    const exclusionsEditor = planCard.locator('.exclusions-editor-component');
    await expect(exclusionsEditor).toBeVisible();

    // 4. Click "Add Standard Force Majeure"
    await exclusionsEditor.locator('button:has-text("Add Standard Force Majeure")').click();
    
    // 5. Verify exclusions are added in GUI
    // We expect 6 standard exclusions
    const exclusions = exclusionsEditor.locator('textarea');
    await expect(exclusions).toHaveCount(6);

    // Verify content of first and last
    await expect(exclusions.first()).toHaveValue('Natural disasters (e.g., fire, flood, earthquake, hurricane)');
    await expect(exclusions.last()).toHaveValue('Failures of infrastructure (transportation, utilities, communications) outside provider control');

    // Verify Type Selectors are set to "Text"
    const typeSelectors = exclusionsEditor.locator('select.form-select-sm');
    // Note: there might be other selects in the card, so verify context
    // Actually, the type selector is specifically:
    // select.form-select.form-select-sm[style="width: auto;"]
    // Let's rely on value being 'text' for the textareas we see.
    // The select is previous sibling of remove button's parent or in the header row
    // Let's just check one explicitly
    const firstTypeSelector = exclusionsEditor.locator('.d-flex.align-items-center select').first();
    await expect(firstTypeSelector).toHaveValue('text');

    // 5b. Verify SLA is still valid
    await expect(page.locator('.validation-card .badge.bg-success')).toBeVisible();

    // 6. Verify in Source Tab (YAML)
    await page.click('a:has-text("Source")');
    
    const yamlContent = await page.evaluate(() => {
      const editor = ace.edit(document.querySelector('.ace_editor'));
      return editor.getValue();
    });

    expect(yamlContent).toContain('x-sla-exclusions:');
    expect(yamlContent).toContain('- Natural disasters (e.g., fire, flood, earthquake, hurricane)');
    expect(yamlContent).toContain('- War, terrorism, riots, or civil unrest');
    
    // 7. Verify in Description Tab
    await page.click('a:has-text("Description")');
    const descriptionContent = page.locator('.markdown-body');
    await expect(descriptionContent).toContainText('Natural disasters (e.g., fire, flood, earthquake, hurricane)');
    await expect(descriptionContent).toContainText('Failures of infrastructure (transportation, utilities, communications) outside provider control');
  });

  test('should handle mixed Text and Metric exclusions', async ({ page }) => {
    // 1. Setup a Basic Plan
    await page.fill('.plans-editor-component input[placeholder="New plan name"]', 'Mixed Plan');
    await page.click('.plans-editor-component button:has-text("Add Plan")');
    
    const planCard = page.locator('.plans-editor-component .plan-item:has-text("Mixed Plan")');
    const exclusionsEditor = planCard.locator('.exclusions-editor-component');

    // 2. Add Standard Force Majeure (Text)
    await exclusionsEditor.locator('button:has-text("Add Standard Force Majeure")').click();

    // 3. Add Manual Exclusion (Metric)
    await exclusionsEditor.locator('button:has-text("Add Exclusion")').click();
    // Switch to Metric mode manually as default is now Text
    await exclusionsEditor.locator('.d-flex.align-items-center select').last().selectOption('metric');
    
    // The new exclusion is empty, so defaults to metric or text depending on logic
    // We implemented default empty -> Metric to preserve old behavior
    // But wait, our implementation says:
    // if (!str) return true; // Default empty to metric
    // So it should be Metric.
    
    const lastExclusionIndex = 6; // 0-5 are standard
    const lastExclusionContainer = exclusionsEditor.locator('.card-body > div.mb-3').nth(lastExclusionIndex);
    
    // Check if PromQL editor is visible
    await expect(lastExclusionContainer.locator('.prometheus-measurement-editor')).toBeVisible();
    
    // Fill it with some PromQL data
    const metricEditor = lastExclusionContainer.locator('.prometheus-measurement-editor');
    // We skip selecting a metric since none are defined, defaulting to empty metric string
    await metricEditor.locator('input[type="text"]').fill('99.9');
    
    // 4. Verify YAML contains both
    await page.click('a:has-text("Source")');
    const yamlContent = await page.evaluate(() => {
      const editor = ace.edit(document.querySelector('.ace_editor'));
      return editor.getValue();
    });

    expect(yamlContent).toContain('Natural disasters');
    // The PromQL editor defaults: avg_over_time([5m]) < 99.9 (or similar depending on defaults)
    expect(yamlContent).toContain('avg_over_time'); 
    expect(yamlContent).toContain('99.9');
  });

  test('should support adding custom text description via button', async ({ page }) => {
    // 1. Setup a Plan
    await page.fill('.plans-editor-component input[placeholder="New plan name"]', 'Custom Text Plan');
    await page.click('.plans-editor-component button:has-text("Add Plan")');
    
    const planCard = page.locator('.plans-editor-component .plan-item:has-text("Custom Text Plan")');
    const exclusionsEditor = planCard.locator('.exclusions-editor-component');

    // 2. Click "Add Description" (renamed to Add Exclusion)
    await exclusionsEditor.locator('button:has-text("Add Exclusion")').click();

    // 3. Verify it's a textarea
    const textarea = exclusionsEditor.locator('textarea').first();
    await expect(textarea).toBeVisible();
    await expect(exclusionsEditor.locator('.prometheus-measurement-editor')).not.toBeVisible();

    // 4. Verify Selector is Text
    const selector = exclusionsEditor.locator('select.form-select-sm').first();
    await expect(selector).toHaveValue('text');

    // 5. Fill Text
    await textarea.fill('Meteor strike');

    // 6. Verify in Source
    await page.click('a:has-text("Source")');
    const yamlContent = await page.evaluate(() => {
      const editor = ace.edit(document.querySelector('.ace_editor'));
      return editor.getValue();
    });

    expect(yamlContent).toContain('Meteor strike');
  });
});
