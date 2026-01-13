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
    
    const editorValue = await page.evaluate(() => {
      const editor = ace.edit(document.querySelector('.ace_editor'));
      return editor.getValue();
    });

    expect(editorValue).toContain('customCurrencies:');
    expect(editorValue).toContain('code: SKU');
    expect(editorValue).toContain('currency: SKU');
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
      const editorValue = await page.evaluate(() => {
        const editor = ace.edit(document.querySelector('.ace_editor'));
        return editor.getValue();
      });

      expect(editorValue).toContain('conversion:');
      expect(editorValue).toContain('rate: 0.5');
      expect(editorValue).toContain('baseCurrency: EUR');
  });

  test('should show validation error for negative conversion rate', async ({ page }) => {
    await page.click('text=GUI');
    await page.click('text=Add Custom Currency');
    
    const rateInput = page.locator('.currency-editor-component input[type="number"]');
    await rateInput.fill('-1.5');
    
    // Wait for validation to trigger (it happens on change/watch)
    await expect(page.locator('.currency-editor-component .invalid-feedback')).toBeVisible();
    await expect(page.locator('.currency-editor-component .invalid-feedback')).toContainText('Value must be at least 0');
    
    // Check that it's also in the global error list at the bottom
    await expect(page.locator('.validation-card')).toContainText('Value must be at least 0');
  });

  test('should allow choosing a standard currency (e.g. EUR)', async ({ page }) => {
    await page.click('text=GUI');
    
    // Add a Plan
    await page.click('text=Add Plan');
    await page.locator('input[placeholder="New plan name"]').fill('Euro Plan');
    await page.click('button:has-text("Add Plan")');

    const pricingEditor = page.locator('.plan-item:has-text("Euro Plan")').locator('.pricing-editor-component');
    const currencyInput = pricingEditor.locator('input[placeholder="Currency"]');
    
    await currencyInput.fill('EUR');
    
    await page.click('text=Source');
    await expect(page.locator('.ace_content')).toContainText('currency: EUR');
  });

  test('should allow using custom currency in service credits', async ({ page }) => {
    await page.click('text=GUI');
    
    // Add custom currency
    await page.click('text=Add Custom Currency');
    await page.locator('.currency-editor-component input[placeholder="SKU"]').fill('TOKEN');
    
    // Add a Plan
    await page.click('text=Add Plan');
    await page.locator('input[placeholder="New plan name"]').fill('Credit Plan');
    await page.click('button:has-text("Add Plan")');

    const creditEditor = page.locator('.plan-item:has-text("Credit Plan")').locator('.service-credits-editor-component');
    const currencyInput = creditEditor.locator('input[placeholder="Currency"]');
    
    await currencyInput.fill('TOKEN');
    
    await page.click('text=Source');
    await expect(page.locator('.ace_content')).toContainText('x-service-credits:');
    await expect(page.locator('.ace_content')).toContainText('currency: TOKEN');
  });
});
