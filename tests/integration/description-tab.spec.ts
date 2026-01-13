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
    await page.locator('.currency-editor-component textarea[placeholder*="Markdown"]').fill('Test Unit');
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

  test('should reflect holiday calendar names in description', async ({ page }) => {
    await page.click('text=GUI');
    
    // Add Plan
    await page.fill('input[placeholder="New plan name"]', 'Gold');
    await page.click('button:has-text("Add Plan")');

    // Add Holiday Source
    await page.click('button:has-text("Add Holiday Source")');
    const holidaySource = page.locator('.holiday-source-item').first();
    await holidaySource.locator('select').selectOption('ical');
    
    const input = holidaySource.locator('input[placeholder="https://example.com/holidays.ics"]');
    await input.fill('https://calendar.google.com/calendar/ical/de.by%23holiday%40group.v.calendar.google.com/public/basic.ics');
    await input.dispatchEvent('input');

    // Go to Description tab
    await page.click('text=Description');
    
    const description = page.locator('.policy-description');
    await expect(description).toContainText('Germany: Bavaria Holidays');
    await expect(description).toContainText('(from feed: https://calendar.google.com/calendar/ical/de.by%23holiday%40group.v.calendar.google.com/public/basic.ics)');
  });

  test('should reflect human-readable prometheus measurements in description', async ({ page }) => {
    await page.click('text=GUI');
    
    // 1. Define a metric
    await page.fill('.metrics-editor-component input[placeholder="New metric name"]', 'latency');
    await page.click('.metrics-editor-component button:has-text("Add Metric")');

    // 2. Add a Plan
    await page.fill('input[placeholder="New plan name"]', 'Gold');
    await page.click('button:has-text("Add Plan")');
    const goldPlan = page.locator('.plan-item:has-text("Gold")');

    // 3. Add a Quota (Measurement mode by default)
    await goldPlan.locator('.quotas-editor-component button:has-text("Add Quota")').click();
    const quotaEditor = goldPlan.locator('.quotas-editor-component .prometheus-measurement-editor');
    await quotaEditor.locator('select').first().selectOption('quantile_over_time');
    await quotaEditor.locator('input[type="number"]').first().fill('0.99');
    await quotaEditor.locator('select').nth(1).selectOption('latency');
    await quotaEditor.locator('input[type="number"]').nth(1).fill('5');
    await quotaEditor.locator('input[type="text"]').fill('15');

    // 4. Add an Exclusion
    await goldPlan.locator('.exclusions-editor-component button:has-text("Add Exclusion")').click();
    
    // Switch to Metric mode
    await goldPlan.locator('.exclusions-editor-component .d-flex.align-items-center select').last().selectOption('metric');

    const exclEditor = goldPlan.locator('.exclusions-editor-component .prometheus-measurement-editor');
    await exclEditor.locator('select').nth(1).selectOption('latency');
    await exclEditor.locator('input[type="number"]').first().fill('10');
    await exclEditor.locator('select').nth(3).selectOption('between');
    await exclEditor.locator('input[type="text"]').fill('5 and 10');

    // 5. Go to Description tab
    await page.click('text=Description');
    
    const description = page.locator('.policy-description');
    // Verify Quota rendering
    await expect(description).toContainText('The 99th percentile of latency over 5 minutes is less than 15');
    // Verify Exclusion rendering
    await expect(description).toContainText('The average of latency over 10 minutes is between 5 and 10');
  });
});
