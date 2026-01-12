import { test, expect } from '@playwright/test';

test.describe('Editor Persistence', () => {
  test.setTimeout(60000);
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should preserve source editor when returning from Help', async ({ page }) => {
    // 1. Go to Source tab
    await page.click('a:has-text("Source")', { timeout: 30000 });
    await expect(page.locator('.ace_editor')).toBeVisible();

    // 2. Go to Help
    await page.click('button:has-text("Help")');
    await expect(page.locator('h2:has-text("SLA Editor Help")')).toBeVisible();
    await expect(page.locator('.ace_editor')).not.toBeVisible();

    // 3. Go back to Editor
    await page.click('button:has-text("Back to Editor")');
    
    // 4. Source tab should still be active and editor visible
    await expect(page.locator('a:has-text("Source")')).toHaveClass(/active/);
    await expect(page.locator('.ace_editor')).toBeVisible();
    
    // 5. Verify it's still functional by typing something
    await page.evaluate(() => {
        const editor = ace.edit(document.querySelector('.ace_editor'));
        editor.setValue('persistence-test: true', -1);
    });
    
    await expect(page.locator('.ace_content')).toContainText('persistence-test: true');
  });

  test('should preserve source editor when returning from Tutorial', async ({ page }) => {
    // 1. Go to Source tab
    await page.click('a:has-text("Source")', { timeout: 30000 });
    await expect(page.locator('.ace_editor')).toBeVisible();

    // 2. Go to Tutorial
    await page.click('button:has-text("Tutorial")');
    await expect(page.locator('h2:has-text("SLA Editor Tutorial")')).toBeVisible();

    // 3. Go back to Editor
    await page.click('button:has-text("Back to Editor")');
    
    // 4. Source tab should still be active and editor visible
    await expect(page.locator('a:has-text("Source")')).toHaveClass(/active/);
    await expect(page.locator('.ace_editor')).toBeVisible();
  });
});
