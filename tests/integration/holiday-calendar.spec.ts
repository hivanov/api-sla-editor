import { test, expect } from '@playwright/test';

test.describe('Holiday Calendar Search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should allow searching and selecting a holiday calendar', async ({ page }) => {
    // Add a plan first
    await page.fill('input[placeholder="New plan name"]', 'Gold');
    await page.click('button:has-text("Add Plan")');

    // Navigate to Support Policy
    await page.click('button:has-text("Add Holiday Source")');
    
    // Select iCal type
    const holidaySource = page.locator('.holiday-source-item').first();
    await holidaySource.locator('select').selectOption('ical');
    
    // Check if datalist exists and has options
    const input = holidaySource.locator('input[placeholder="https://example.com/holidays.ics"]');
    await expect(input).toBeVisible();
    
    const listId = await input.getAttribute('list');
    expect(listId).toBeDefined();
    
    // Type "Germany" in the input
    await input.fill('Germany');
    
    // Since it's a datalist, we can't easily "click" an option in Playwright without some tricks,
    // but we can verify the datalist content
    const datalist = page.locator(`datalist#${listId}`);
    const option = datalist.locator('option[value*="german.official"]');
    await expect(option).toBeAttached();
    
    // Set the value directly to simulate selection
    const url = await option.getAttribute('value');
    await input.fill(url!);
    await input.dispatchEvent('input');

    // Switch to Source tab to see YAML
    await page.click('a:has-text("Source")');

    // Verify YAML update
    const yamlEditor = page.locator('.ace_content');
    await expect(yamlEditor).toContainText('https://calendar.google.com/calendar/ical/en.german.official%23holiday%40group.v.calendar.google.com/public/basic.ics');
  });

  test('should show German states in the holiday list', async ({ page }) => {
    // Add a plan first
    await page.fill('input[placeholder="New plan name"]', 'Silver');
    await page.click('button:has-text("Add Plan")');

    await page.click('button:has-text("Add Holiday Source")');
    const holidaySource = page.locator('.holiday-source-item').first();
    await holidaySource.locator('select').selectOption('ical');
    
    const input = holidaySource.locator('input[placeholder="https://example.com/holidays.ics"]');
    const listId = await input.getAttribute('list');
    const datalist = page.locator(`datalist#${listId}`);
    
    const bavariaOption = datalist.locator('option:has-text("Germany: Bavaria Holidays")');
    await expect(bavariaOption).toBeAttached();
    const bavariaUrl = await bavariaOption.getAttribute('value');
    expect(bavariaUrl).toContain('de.by%23holiday');
  });
});
