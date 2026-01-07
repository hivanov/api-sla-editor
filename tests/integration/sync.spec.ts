import { test, expect } from '@playwright/test';

test.describe('GUI-Source Synchronization', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should reflect GUI changes in Source tab', async ({ page }) => {
    // 1. Go to GUI tab (default)
    await page.click('a:has-text("GUI")');

    // 2. Change a field in GUI
    await page.fill('input#context-id', 'sync-test-id');

    // 3. Switch to Source tab
    await page.click('a:has-text("Source")');

    // 4. Check if Ace Editor has the change
    const editorValue = await page.evaluate(() => {
      const editor = ace.edit(document.querySelector('.ace_editor'));
      return editor.getValue();
    });

    expect(editorValue).toContain('id: sync-test-id');
  });

  test('should reflect Source changes in GUI tab', async ({ page }) => {
    // 1. Switch to Source tab
    await page.click('a:has-text("Source")');

    // 2. Change content in Ace Editor
    await page.evaluate(() => {
      const editor = ace.edit(document.querySelector('.ace_editor'));
      editor.setValue('sla: 1.0.0\ncontext:\n  id: from-source\n  type: plans\nmetrics: {}\nplans: {}', -1);
    });

    // 3. Switch to GUI tab
    await page.click('a:has-text("GUI")');

    // 4. Check if GUI input has the change
    await expect(page.locator('input#context-id')).toHaveValue('from-source');
  });

  test('should reflect plan deletion from Source in GUI', async ({ page }) => {
    // 1. Add a plan in GUI
    await page.click('a:has-text("GUI")');
    await page.fill('.plans-editor-component input[placeholder="New plan name"]', 'plan-to-delete');
    await page.click('.plans-editor-component button:has-text("Add Plan")');
    
    await expect(page.locator('.plan-item:has-text("plan-to-delete")')).toBeVisible();

    // 2. Switch to Source and remove the plan
    await page.click('a:has-text("Source")');
    await page.evaluate(() => {
      const editor = ace.edit(document.querySelector('.ace_editor'));
      editor.setValue('sla: 1.0.0\ncontext:\n  id: test\n  type: plans\nmetrics: {}\nplans: {}', -1);
    });

    // 3. Switch back to GUI
    await page.click('a:has-text("GUI")');

    // 4. Check if plan is gone
    await expect(page.locator('.plan-item:has-text("plan-to-delete")')).not.toBeVisible();
  });

  test('should reflect deep changes (e.g. support policy) between tabs', async ({ page }) => {
    // 1. In GUI, add a plan and a support hour
    await page.click('a:has-text("GUI")');
    await page.fill('.plans-editor-component input[placeholder="New plan name"]', 'deep-plan');
    await page.click('.plans-editor-component button:has-text("Add Plan")');
    
    const planCard = page.locator('.plan-item:has-text("deep-plan")');
    await planCard.locator('button:has-text("Add Hours")').click();
    await planCard.locator('input[placeholder="HH:mm"]').first().fill('10:00');

    // 2. Switch to Source and verify
    await page.click('a:has-text("Source")');
    let editorValue = await page.evaluate(() => {
      const editor = ace.edit(document.querySelector('.ace_editor'));
      return editor.getValue();
    });
    expect(editorValue).toContain('opens: \'10:00\'');

    // 3. Change it in Source
    await page.evaluate(() => {
      const editor = ace.edit(document.querySelector('.ace_editor'));
      const val = editor.getValue().replace('opens: \'10:00\'', 'opens: \'11:00\'');
      editor.setValue(val, -1);
    });

    // 4. Switch back to GUI and verify
    await page.click('a:has-text("GUI")');
    await expect(planCard.locator('input[placeholder="HH:mm"]').first()).toHaveValue('11:00');
  });
});
