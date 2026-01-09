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
    
    // 2. Select a tier (99.9%) - this is the default mode
    const tierSelect = availEditor.locator('.tier-select');
    await tierSelect.selectOption('99.9');
    
    // 3. Switch to Manual mode to verify percentage input
    await availEditor.locator('.nav-link:has-text("Manual Entry")').click();
    const percentageInput = availEditor.locator('input[type="number"]');
    await expect(percentageInput).toHaveValue('99.9');
    
    // 4. Switch to Uptime mode to verify downtime calculations
    await availEditor.locator('.nav-link:has-text("Downtime Duration")').click();
    
    // For 99.9% yearly, it should be:
    // Days: 0, Hours: 8, Mins: 45, Secs: 56, Ms: 952
    
    const downtimeInputs = availEditor.locator('input[type="number"]');
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
    
    // Switch to Manual mode
    await availEditor.locator('.nav-link:has-text("Manual Entry")').click();
    const percentageInput = availEditor.locator('input[type="number"]');

    // Manually set to 99.99
    await percentageInput.fill('99.99');
    
    // Switch to Tiers mode
    await availEditor.locator('.nav-link:has-text("Standard Tiers")').click();
    const tierSelect = availEditor.locator('.tier-select');
    await expect(tierSelect).toHaveValue('99.99');

    // Switch back to Manual and set to something non-standard
    await availEditor.locator('.nav-link:has-text("Manual Entry")').click();
    await percentageInput.fill('99.98');
    
    // Switch to Tiers mode
    await availEditor.locator('.nav-link:has-text("Standard Tiers")').click();
    await expect(tierSelect).toHaveValue('');
  });

  test('should calculate availability via Deployment Calculator', async ({ page }) => {
    await page.fill('.plans-editor-component input[placeholder="New plan name"]', 'Deployment Plan');
    await page.click('.plans-editor-component button:has-text("Add Plan")');
    
    const planCard = page.locator('.plans-editor-component .plan-item:has-text("Deployment Plan")');
    const availEditor = planCard.locator('.availability-editor-component');
    
    // Switch to Deployments mode
    await availEditor.locator('.nav-link:has-text("Deployment Calculator")').click();
    
    // Set 4 deployments per week
    await availEditor.locator('.deployment-period-select').selectOption('week');
    await availEditor.locator('input[type="number"]').first().fill('4');
    
    // Set 15 mins per deployment
    await availEditor.locator('.deployment-mins').fill('15');
    
    // Total downtime = 4 * 15 = 60 mins per week
    // Week = 7 * 24 * 60 = 10080 mins
    // Availability = (1 - 60/10080) * 100 = 99.404761905%
    
    await expect(availEditor.locator('.deployment-info')).toContainText('1h');
    
    // Switch to Manual to check percentage
    await availEditor.locator('.nav-link:has-text("Manual Entry")').click();
    await expect(availEditor.locator('input[type="number"]')).toHaveValue('99.404761905');
  });
});