import { test, expect } from '@playwright/test';

test.describe('Description Tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should reflect custom currencies in description', async ({ page }) => {
    await page.click('text=GUI');
    
    // Add custom currency
    await page.click('text=Add Custom Currency');
    await page.locator('.currency-editor-component input[placeholder="SKU"]').fill('UNIT');
    await page.locator('.currency-editor-component input[placeholder="Description"]').fill('Test Unit');
    await page.locator('.currency-editor-component input[type="number"]').fill('5');
    await page.locator('.currency-editor-component input[placeholder="USD"]').fill('EUR');

    // Add Plan and use currency
    await page.click('text=Add Plan');
    await page.locator('input[placeholder="New plan name"]').fill('Test Plan');
    await page.click('button:has-text("Add Plan")');
    
    const planItem = page.locator('.plan-item:has-text("Test Plan")');
    await planItem.locator('input[placeholder="Plan Title"]').fill('Human Readable Plan');
    await planItem.locator('input[placeholder="Cost"]').fill('10');
    await planItem.locator('.pricing-editor-component input[placeholder="Currency"]').fill('UNIT');

    // Go to Description tab
    await page.click('text=Description');
    
    const description = page.locator('.policy-description');
    await expect(description).toContainText('Currencies');
    await expect(description).toContainText('UNIT: Test Unit (1 UNIT = 5 EUR)');
    await expect(description).toContainText('Cost: 10 UNIT');
    await expect(description).toContainText('(Equivalent to 50.00 EUR)');
  });
});
