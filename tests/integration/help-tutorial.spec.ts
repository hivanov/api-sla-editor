import { test, expect } from '@playwright/test';

test.describe('Help and Tutorial Pages', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display Help and Tutorial buttons in header', async ({ page }) => {
    await expect(page.locator('button:has-text("Tutorial")')).toBeVisible();
    await expect(page.locator('button:has-text("Help")')).toBeVisible();
  });

  test('should navigate to Tutorial page and back', async ({ page }) => {
    // Initial state: Editor visible
    await expect(page.locator('h1:has-text("SLA Editor")')).toBeVisible();
    await expect(page.locator('.card-header ul.nav-tabs')).toBeVisible(); // Tab navigation in editor

    // Click Tutorial
    await page.click('button:has-text("Tutorial")');

    // Verify Tutorial content
    await expect(page.locator('h2:has-text("SLA Editor Tutorial")')).toBeVisible();
    await expect(page.locator('h3:has-text("Why do we need SLAs?")')).toBeVisible();
    
    // Editor should be hidden
    await expect(page.locator('.card-header ul.nav-tabs')).not.toBeVisible();

    // Click Back to Editor
    await page.click('button:has-text("Back to Editor")');

    // Verify Editor visible again
    await expect(page.locator('.card-header ul.nav-tabs')).toBeVisible();
  });

  test('should navigate to Help page and back', async ({ page }) => {
    // Click Help
    await page.click('button:has-text("Help")');

    // Verify Help content
    await expect(page.locator('h2:has-text("SLA Editor Help")')).toBeVisible();
    await expect(page.locator('button:has-text("Plan vs. Agreement")')).toBeVisible();

    // Test Accordion
    await page.click('button:has-text("Plan vs. Agreement")');
    // Wait for animation or state change if needed, but 'show' class is standard bootstrap
    await expect(page.locator('.accordion-collapse.collapse.show')).toBeVisible();
    await expect(page.locator('.accordion-collapse.collapse.show')).toContainText("A 'Plan' is a template");

    // Editor should be hidden
    await expect(page.locator('.card-header ul.nav-tabs')).not.toBeVisible();

    // Click Back to Editor
    await page.click('button:has-text("Back to Editor")');

    // Verify Editor visible again
    await expect(page.locator('.card-header ul.nav-tabs')).toBeVisible();
  });

  test('should use title to navigate back to editor', async ({ page }) => {
    await page.click('button:has-text("Help")');
    await expect(page.locator('h2:has-text("SLA Editor Help")')).toBeVisible();

    // Click the main title
    await page.click('h1:has-text("SLA Editor")');
    
    // Verify Editor visible again
    await expect(page.locator('.card-header ul.nav-tabs')).toBeVisible();
  });
});
