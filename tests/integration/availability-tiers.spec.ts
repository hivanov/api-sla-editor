import { test, expect } from '@playwright/test';

test.describe('Availability Tiers', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should update availability percentage and downtime when a common tier is selected', async ({ page }) => {
    // 1. Add a plan to reveal AvailabilityEditor
    await page.fill('.plans-editor-component input[placeholder="New plan name"]', 'Test Plan');
    await page.click('.plans-editor-component button:has-text("Add Plan")');
    
    const basicPlanCard = page.locator('.plans-editor-component .plan-item:has-text("Test Plan")');
    const availEditor = basicPlanCard.locator('.availability-editor-component');
    
    // 2. Select a tier (99.9%)
    const tierSelect = availEditor.locator('.tier-select');
    await tierSelect.selectOption('99.9');
    
    // 3. Verify percentage input is updated
    const percentageInput = availEditor.locator('input[type="number"]').first();
    await expect(percentageInput).toHaveValue('99.9');
    
    // 4. Verify downtime calculations (default period is Yearly)
    // For 99.9% yearly, it should be:
    // 365.2425 days * 0.001 = 0.3652425 days
    // 0.3652425 days = 8 hours + 0.76582 days = 8 hours + 45.9... minutes
    // In our component:
    // Days: 0, Hours: 8, Mins: 45, Secs: 56, Ms: 952
    
    const downtimeInputs = availEditor.locator('.row.g-2 input[type="number"]');
    await expect(downtimeInputs.nth(0)).toHaveValue('0'); // Days
    await expect(downtimeInputs.nth(1)).toHaveValue('8'); // Hours
    await expect(downtimeInputs.nth(2)).toHaveValue('45'); // Mins
    
    // 5. Change period to Daily and check downtime
    const periodSelect = availEditor.locator('.period-select');
    await periodSelect.selectOption('day');
    
    // 99.9% of 24h = 1m 26.4s = 1m 26s 400ms
    await expect(downtimeInputs.nth(0)).toHaveValue('0'); // Days
    await expect(downtimeInputs.nth(1)).toHaveValue('0'); // Hours
    await expect(downtimeInputs.nth(2)).toHaveValue('1'); // Mins
    await expect(downtimeInputs.nth(3)).toHaveValue('26'); // Secs
    await expect(downtimeInputs.nth(4)).toHaveValue('400'); // Ms
  });

  test('should reflect current percentage in tier dropdown if it matches', async ({ page }) => {
    await page.fill('.plans-editor-component input[placeholder="New plan name"]', 'Test Plan');
    await page.click('.plans-editor-component button:has-text("Add Plan")');
    
    const basicPlanCard = page.locator('.plans-editor-component .plan-item:has-text("Test Plan")');
    const availEditor = basicPlanCard.locator('.availability-editor-component');
    const tierSelect = availEditor.locator('.tier-select');
    const percentageInput = availEditor.locator('input[type="number"]').first();

    // Manually set to 99.99
    await percentageInput.fill('99.99');
    await expect(tierSelect).toHaveValue('99.99');

    // Manually set to something non-standard
    await percentageInput.fill('99.98');
    await expect(tierSelect).toHaveValue('');
  });
});
