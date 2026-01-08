import { test, expect } from '@playwright/test';

test.describe('Responsiveness and Layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should use full screen height', async ({ page }) => {
    const appHeight = await page.evaluate(() => document.getElementById('app').offsetHeight);
    const viewportHeight = await page.evaluate(() => window.innerHeight);
    expect(appHeight).toBe(viewportHeight);
  });

  test('should show responsive switch on narrow screens', async ({ page }) => {
    // Set a narrow viewport
    await page.setViewportSize({ width: 400, height: 800 });
    
    // Check if ResponsiveWrappers show the switch
    const switches = page.locator('.form-switch');
    await expect(switches.first()).toBeVisible();
    
    // Toggle to text mode
    await switches.first().locator('input').check();
    
    // Check if Ace Editor appears in the wrapper
    const miniEditor = page.locator('.mini-ace-editor');
    await expect(miniEditor.first()).toBeVisible();
  });

  test('should hide responsive switch on wide screens', async ({ page }) => {
    // Set a wide viewport
    await page.setViewportSize({ width: 1200, height: 800 });
    
    // Check if ResponsiveWrappers hide the switch
    const switches = page.locator('.form-switch');
    await expect(switches.first()).not.toBeVisible();
  });

  test('should handle tab switching without resizing issues', async ({ page }) => {
    // Go to Source tab
    await page.click('a:has-text("Source")');
    
    // Check if Ace Editor is visible and has height
    const aceEditor = page.locator('.ace-editor-container');
    await expect(aceEditor).toBeVisible();
    const box = await aceEditor.boundingBox();
    expect(box.height).toBeGreaterThan(100);
    
    // Go back to GUI tab
    await page.click('a:has-text("GUI")');
    await expect(page.locator('text=Context')).toBeVisible();
  });
});
