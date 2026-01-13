import { test, expect } from '@playwright/test';

test.describe('Markdown Rendering in Description Tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should render Markdown in Plan Description', async ({ page }) => {
    // 1. Create a Plan
    await page.fill('.plans-editor-component input[placeholder="New plan name"]', 'Markdown Plan');
    await page.click('.plans-editor-component button:has-text("Add Plan")');
    
    const planCard = page.locator('.plans-editor-component .plan-item:has-text("Markdown Plan")');
    
    // 2. Set Markdown Description
    // Find the Markdown editor for description
    const descEditor = planCard.locator('.markdown-editor').first();
    await descEditor.locator('textarea').fill('### Plan Header\n**Plan Bold**\n- Item 1');

    // 3. Verify in Description Tab
    await page.click('a:has-text("Description")');
    
    const descriptionTab = page.locator('.policy-description');
    await expect(descriptionTab.locator('h3:has-text("Plan Header")')).toBeVisible();
    await expect(descriptionTab.locator('strong:has-text("Plan Bold")')).toBeVisible();
    await expect(descriptionTab.locator('ul li:has-text("Item 1")')).toBeVisible();
  });

  test('should render Markdown in SLA Exclusions', async ({ page }) => {
    // 1. Create a Plan
    await page.fill('.plans-editor-component input[placeholder="New plan name"]', 'Exclusion Plan');
    await page.click('.plans-editor-component button:has-text("Add Plan")');
    
    const planCard = page.locator('.plans-editor-component .plan-item:has-text("Exclusion Plan")');
    
    // 2. Add a Text Exclusion
    const addBtn = planCard.locator('button:has-text("Add Exclusion")');
    await addBtn.click();
    
    const exclusionsComp = planCard.locator('.exclusions-editor-component');
    
    // Wait for the new exclusion UI to appear
    const typeSelect = exclusionsComp.locator('select.form-select-sm').first();
    await expect(typeSelect).toBeVisible();
    
    // Switch to text mode (though addExclusion defaults to it, let's be explicit)
    await typeSelect.selectOption('text');
    
    const exclusionEditor = exclusionsComp.locator('.markdown-editor').first();
    await expect(exclusionEditor).toBeVisible();
    await exclusionEditor.locator('textarea').fill('Exclusion with **bold**');

    // 3. Verify in Description Tab
    await page.click('a:has-text("Description")');
    
    const descriptionTab = page.locator('.policy-description');
    // Exclusions are rendered as list items
    await expect(descriptionTab.locator('li:has-text("Exclusion with") strong:has-text("bold")')).toBeVisible();
  });

  test('should render Markdown in Currency Description', async ({ page }) => {
    // 1. Add a Custom Currency
    await page.click('button:has-text("Add Custom Currency")');
    const currencyCard = page.locator('.currency-editor-component .card').first();
    await currencyCard.locator('input[placeholder="SKU"]').fill('TOKEN');
    
    const descEditor = currencyCard.locator('.markdown-editor').first();
    await descEditor.locator('textarea').fill('Token used for **AI** services');

    // 2. Verify in Description Tab
    await page.click('a:has-text("Description")');
    
    const descriptionTab = page.locator('.policy-description');
    await expect(descriptionTab.locator('h2:has-text("Currencies")')).toBeVisible();
    await expect(descriptionTab.locator('li:has-text("TOKEN") strong:has-text("AI")')).toBeVisible();
  });
});
