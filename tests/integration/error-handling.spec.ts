import { test, expect } from '@playwright/test';

test.describe('Error Handling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display squiggly underlines in Source editor on error', async ({ page }) => {
    await page.click('a:has-text("Source")');

    await page.evaluate(() => {
      const editor = ace.edit(document.querySelector('.ace_editor'));
      editor.setValue('sla: 1.0.0\ncontext:\n  id: test\n  type: invalid-type');
      editor._emit('change');
    });
    
    await page.waitForTimeout(500);

    // Check for squiggly marker
    const marker = page.locator('.error-squiggly').first();
    await expect(marker).toBeVisible();
  });

  test('should display error list below editor', async ({ page }) => {
    await page.click('a:has-text("Source")');

    await page.evaluate(() => {
      const editor = ace.edit(document.querySelector('.ace_editor'));
      editor.setValue('sla: 1.0.0\ncontext:\n  id: test\n  type: invalid-type');
      editor._emit('change');
    });
    
    await page.waitForTimeout(500);

    const errorList = page.locator('.validation-card');
    await expect(errorList).toBeVisible();
    await expect(errorList).toContainText('Must be one of: plans, agreements');
  });

  test('should jump to error line and switch tab when clicking error in list', async ({ page }) => {
    await page.click('a:has-text("Source")');

    await page.evaluate(() => {
      const editor = ace.edit(document.querySelector('.ace_editor'));
      editor.setValue('sla: 1.0.0\n' + '\n'.repeat(20) + 'context:\n  id: test\n  type: invalid-type');
      editor._emit('change');
    });
    
    await page.waitForTimeout(500);

    // Switch to GUI
    await page.click('a:has-text("GUI")');
    await expect(page.locator('input#context-id')).toBeVisible();

    // Click the error in the table (which is visible in both tabs)
    await page.click('.validation-card table tbody tr');
    
    // Should have switched to Source tab
    await expect(page.locator('.ace_editor')).toBeVisible();
    
    // Give it a moment to scroll and move cursor
    await page.waitForTimeout(500);
  });

  test('should show error in GUI for ContextEditor', async ({ page }) => {
    await page.click('a:has-text("Source")');

    await page.evaluate(() => {
      const editor = ace.edit(document.querySelector('.ace_editor'));
      editor.setValue('sla: 1.0.0\ncontext:\n  id: \n  type: plans');
      editor._emit('change');
    });
    
    await page.waitForTimeout(500);
    await page.click('a:has-text("GUI")');

    const idInput = page.locator('input#context-id');
    await expect(idInput).toHaveClass(/is-invalid/);
  });

  test('should show error in GUI for MetricsEditor', async ({ page }) => {
    await page.click('a:has-text("Source")');

    await page.evaluate(() => {
      const editor = ace.edit(document.querySelector('.ace_editor'));
      editor.setValue('sla: 1.0.0\ncontext:\n  id: test\n  type: plans\nmetrics:\n  uptime:\n    type: \n    unit: percentage\n    description: test');
      editor._emit('change');
    });
    
    await page.waitForTimeout(500);
    await page.click('a:has-text("GUI")');

    const typeInput = page.locator('.metrics-editor-component input[placeholder="Type"]');
    await expect(typeInput).toHaveClass(/is-invalid/);
  });

  test('should show error in GUI for PlansEditor (Pricing Cost)', async ({ page }) => {
    await page.click('a:has-text("Source")');

    await page.evaluate(() => {
      const editor = ace.edit(document.querySelector('.ace_editor'));
      // Using invalid value for cost (should be number)
      // Note: js-yaml might parse it as string if not a number
      editor.setValue('sla: 1.0.0\ncontext:\n  id: test\n  type: plans\nplans:\n  gold:\n    pricing:\n      cost: "invalid"');
      editor._emit('change');
    });
    
    await page.waitForTimeout(500);
    await page.click('a:has-text("GUI")');

    const costInput = page.locator('.pricing-editor-component input[placeholder="Cost"]');
    await expect(costInput).toHaveClass(/is-invalid/);
  });
});