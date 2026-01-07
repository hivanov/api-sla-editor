import { test, expect } from '@playwright/test';

test.describe('New Plan Synchronization', () => {
  test('should reflect adding a new plan in the source code', async ({ page }) => {
    await page.goto('/');
    
    // Given I am in the GUI tab
    await page.click('a:has-text("GUI")');

    // When I type "new plan" in "new plan name" control
    await page.fill('.plans-editor-component input[placeholder="New plan name"]', 'new plan');

    // And I click "Add plan" button
    await page.click('.plans-editor-component button:has-text("Add Plan")');

    // And I switch to the Source tab
    await page.click('a:has-text("Source")');

    // Then the source code should reflect my changes.
    const editorValue = await page.evaluate(() => {
      const editor = ace.edit(document.querySelector('.ace_editor'));
      return editor.getValue();
    });

    expect(editorValue).toContain('new plan:');
  });
});
