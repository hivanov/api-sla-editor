import { test, expect } from '@playwright/test';

test.describe('Error Handling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display squiggly underlines in Source editor on error', async ({ page }) => {
    await page.click('.btn-tab-source');

    await page.evaluate(() => {
      const editor = ace.edit(document.querySelector('.ace_editor'));
      editor.setValue('sla: 1.0.0\ncontext:\n  id: test\n  type: invalid-type');
      editor._emit('change');
    });
    
    // Check for squiggly marker
    await expect(async () => {
        const marker = page.locator('.error-squiggly').first();
        await expect(marker).toBeVisible();
    }).toPass();
  });

  test('should display error list below editor', async ({ page }) => {
    await page.click('.btn-tab-source');

    await page.evaluate(() => {
      const editor = ace.edit(document.querySelector('.ace_editor'));
      editor.setValue('sla: 1.0.0\ncontext:\n  id: test\n  type: invalid-type');
      editor._emit('change');
    });
    
    const errorList = page.locator('.validation-card');
    await expect(errorList).toBeVisible();
    await expect(errorList).toContainText('Must be one of: plans, agreements');
  });

  test('should jump to error line and switch tab when clicking error in list', async ({ page }) => {
    await page.click('.btn-tab-source');

    await page.evaluate(() => {
      const editor = ace.edit(document.querySelector('.ace_editor'));
      editor.setValue('sla: 1.0.0\n' + '\n'.repeat(20) + 'context:\n  id: test\n  type: invalid-type');
      editor._emit('change');
    });
    
    // Switch to GUI
    await page.click('.btn-tab-gui');
    await expect(page.locator('input#context-id')).toBeVisible();

    // Click the error in the table (which is visible in both tabs)
    await page.click('.validation-card table tbody tr');
    
    // Should have switched to Source tab
    await expect(page.locator('.ace_editor')).toBeVisible();
    
    // Verify cursor moved from the start
    await expect(async () => {
        const cursorPosition = await page.evaluate(() => ace.edit(document.querySelector('.ace_editor')).getCursorPosition());
        expect(cursorPosition.row).toBeGreaterThan(0);
    }).toPass();
  });

  test('should show error in GUI for ContextEditor', async ({ page }) => {
    await page.click('.btn-tab-source');

    await page.evaluate(() => {
      const editor = ace.edit(document.querySelector('.ace_editor'));
      editor.setValue('sla: 1.0.0\ncontext:\n  id: \n  type: plans');
      editor._emit('change');
    });
    
    await page.click('.btn-tab-gui');

    const idInput = page.locator('input#context-id');
    await expect(idInput).toHaveClass(/is-invalid/);
  });

  test('should show error in GUI for MetricsEditor', async ({ page }) => {
    await page.click('.btn-tab-source');

    await page.evaluate(() => {
      const editor = ace.edit(document.querySelector('.ace_editor'));
      editor.setValue('sla: 1.0.0\ncontext:\n  id: test\n  type: plans\nmetrics:\n  uptime:\n    type: \n    unit: percentage\n    description: test');
      editor._emit('change');
    });
    
    await page.click('.btn-tab-gui');

    const typeSelect = page.locator('.metrics-editor-component select').first();
    await expect(typeSelect).toHaveClass(/is-invalid/);
  });

  test('should show error in GUI for PlansEditor (Pricing Cost)', async ({ page }) => {
    await page.click('.btn-tab-source');

    await page.evaluate(() => {
      const editor = ace.edit(document.querySelector('.ace_editor'));
      // Using invalid value for cost (should be number)
      // Note: js-yaml might parse it as string if not a number
      editor.setValue('sla: 1.0.0\ncontext:\n  id: test\n  type: plans\nplans:\n  gold:\n    pricing:\n      cost: "invalid"');
      editor._emit('change');
    });
    
    await page.click('.btn-tab-gui');

    const costInput = page.locator('.pricing-editor-component input[placeholder="Cost"]');
    await expect(costInput).toHaveClass(/is-invalid/);
  });
});