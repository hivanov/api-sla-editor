import { test, expect } from '@playwright/test';

test.describe('Numeric Constraints', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Add a plan to reveal all editors
    await page.fill('.plans-editor-component input[placeholder="New plan name"]', 'Constraint Plan');
    await page.click('.plans-editor-component button:has-text("Add Plan")');
  });

  test('should not allow negative cost in PricingEditor', async ({ page }) => {
    const planCard = page.locator('.plan-item:has-text("Constraint Plan")');
    const costInput = planCard.locator('.pricing-editor-component input[placeholder="Cost"]');
    
    await costInput.fill('-100');
    // It should be constrained to 0 in the GUI state, which reflects in the Source tab
    await page.click('a:has-text("Source")');
    const editorValue = await page.evaluate(() => {
      const editor = ace.edit(document.querySelector('.ace_editor'));
      return editor.getValue();
    });
    expect(editorValue).toContain('cost: 0');
  });

  test('should not allow negative compensation in ServiceCreditsEditor', async ({ page }) => {
    const planCard = page.locator('.plan-item:has-text("Constraint Plan")');
    await planCard.locator('.service-credits-editor-component button:has-text("Add Tier")').click();
    
    const compInput = planCard.locator('.service-credits-editor-component input[placeholder="5"]');
    await compInput.fill('-50');

    await page.click('a:has-text("Source")');
    const editorValue = await page.evaluate(() => {
      const editor = ace.edit(document.querySelector('.ace_editor'));
      return editor.getValue();
    });
    expect(editorValue).toContain('compensation: 0');
  });

  test('should not allow negative duration values in DurationEditor', async ({ page }) => {
    const planCard = page.locator('.plan-item:has-text("Constraint Plan")');
    const durationEditor = planCard.locator('.pricing-editor-component .duration-editor');
    
    // Fill "Days" with -5
    const daysInput = durationEditor.locator('input[type="number"]').first();
    await daysInput.fill('-5');

    await page.click('a:has-text("Source")');
    const editorValue = await page.evaluate(() => {
      const editor = ace.edit(document.querySelector('.ace_editor'));
      return editor.getValue();
    });
    // If constrained to 0, and others are 0, it should be empty or default P
    // In our component, formatDuration returns '' if all are 0.
    expect(editorValue).not.toContain('period: P-5D');
  });

  test('should not allow negative downtime in AvailabilityEditor', async ({ page }) => {
    const planCard = page.locator('.plan-item:has-text("Constraint Plan")');
    const availEditor = planCard.locator('.availability-editor-component');
    
    // First set some positive downtime to move away from 100%
    const hoursInput = availEditor.locator('.row.g-2 input[type="number"]').nth(1);
    await hoursInput.fill('10');
    
    await page.click('a:has-text("Source")');
    let editorValue = await page.evaluate(() => {
      const editor = ace.edit(document.querySelector('.ace_editor'));
      return editor.getValue();
    });
    expect(editorValue).not.toContain('availability: 100%');

    // Now set negative hours
    await page.click('a:has-text("GUI")');
    await hoursInput.fill('-10');
    
    await page.click('a:has-text("Source")');
    editorValue = await page.evaluate(() => {
      const editor = ace.edit(document.querySelector('.ace_editor'));
      return editor.getValue();
    });
    expect(editorValue).toContain('availability: 100%');
  });
});
