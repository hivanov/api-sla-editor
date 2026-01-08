import { test, expect } from '@playwright/test';

test.describe('Description tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should switch to description tab and show rendered content', async ({ page }) => {
    await page.click('a:has-text("Description")');
    await expect(page.locator('.policy-description')).toBeVisible();
    await expect(page.locator('.policy-description h1')).toContainText('SLA Policy Description');
  });

  test('should update description when SLA changes in GUI', async ({ page }) => {
    await page.fill('input#context-id', 'test-description-id');
    
    await page.click('a:has-text("Description")');
    await expect(page.locator('.policy-description')).toContainText('Policy ID: test-description-id');
    
    await page.click('a:has-text("GUI")');
    await page.fill('input#context-id', 'updated-id');
    
    await page.click('a:has-text("Description")');
    await expect(page.locator('.policy-description')).toContainText('Policy ID: updated-id');
  });

  test('should show plan details in description', async ({ page }) => {
    await page.selectOption('select', 'support-mon-fri');
    
    await page.click('a:has-text("Description")');
    await expect(page.locator('.policy-description')).toContainText('enterprise');
    await expect(page.locator('.policy-description')).toContainText('Support Policy');
    await expect(page.locator('.policy-description')).toContainText('09:00 - 17:00');
  });

  test('should show metrics and quotas in description', async ({ page }) => {
    await page.selectOption('select', 'metrics-100-concurrent-connections');
    
    await page.click('a:has-text("Description")');
    await expect(page.locator('.policy-description')).toContainText('Quotas');
    await expect(page.locator('.policy-description')).toContainText('Number of concurrent connections for all APIs.');
    await expect(page.locator('.policy-description')).toContainText('Maximum 100');
  });
});