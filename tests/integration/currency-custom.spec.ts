import { test, expect } from '@playwright/test';

test.describe('Custom Currencies', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should allow adding and using custom currency', async ({ page }) => {
    // 1. Go to GUI and find Currencies section
    await page.click('text=GUI');
    await expect(page.locator('text=Currencies')).toBeVisible();

    await page.click('text=Add Custom Currency');
    
    // Fill details
    const codeInput = page.locator('.currency-editor-component input[placeholder="SKU"]');
    await codeInput.fill('SKU');
    const descInput = page.locator('.currency-editor-component input[placeholder="Description"]');
    await descInput.fill('Stock Keeping Unit');

    // 2. Add a Plan
    await page.click('text=Add Plan');
    const planNameInput = page.locator('input[placeholder="New plan name"]');
    await planNameInput.fill('Inventory Plan');
    await page.click('button:has-text("Add Plan")');

    // 3. Check Pricing Currency Dropdown
    const planItem = page.locator('.plan-item:has-text("Inventory Plan")');
    const pricingEditor = planItem.locator('.pricing-editor-component');
    const currencyInput = pricingEditor.locator('input[placeholder="Currency"]');
    
    // Focus and check datalist
    await currencyInput.click();
    await currencyInput.fill('SKU');
    
    // Verify it's in the YAML
    await page.click('text=Source');
    const aceEditor = page.locator('.ace_content');
    await expect(aceEditor).toContainText('customCurrencies:');
    await expect(aceEditor).toContainText('code: SKU');
    await expect(aceEditor).toContainText('currency: SKU');
  });

  test('should allow custom conversion', async ({ page }) => {
      await page.click('text=GUI');
      await expect(page.locator('text=Currencies')).toBeVisible();
      await page.click('text=Add Custom Currency');
      const codeInput = page.locator('.currency-editor-component input[placeholder="SKU"]');
      await codeInput.fill('CREDIT');

      const rateInput = page.locator('.currency-editor-component input[type="number"]');
      await rateInput.fill('0.5');
      
      const baseInput = page.locator('.currency-editor-component input[placeholder="USD"]');
      await baseInput.fill('EUR');

      await page.click('text=Source');
      const aceEditor = page.locator('.ace_content');
      await expect(aceEditor).toContainText('conversion:');
      await expect(aceEditor).toContainText('rate: 0.5');
      await expect(aceEditor).toContainText('baseCurrency: EUR');
  });
});
