import { test, expect } from '@playwright/test';

test.describe('Main flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load and validate the default SLA', async ({ page }) => {
    await expect(page.locator('#app')).toBeVisible();
  });

  test('should switch between GUI and source editor', async ({ page }) => {
    await page.click('a:has-text("Source")');
    await expect(page.locator('.ace_editor')).toBeVisible();

    await page.click('a:has-text("GUI")');
    await expect(page.locator('input#context-id')).toBeVisible();
  });

  test('should edit in GUI and verify in source', async ({ page }) => {
    await page.click('a:has-text("GUI")');
    await page.fill('input#context-id', 'new-id');

    await page.click('a:has-text("Source")');
    await expect(page.locator('.ace_content')).toContainText('new-id');
  });

  test('should edit in source and verify in GUI', async ({ page }) => {
    await page.click('a:has-text("Source")');

    await page.evaluate((yamlString) => {
      window.app.setYamlContent(yamlString);
    }, 'sla: 1.0.0\ncontext:\n  id: source-id\n  type: plans\nmetrics: {}\nplans: {}');
    
    await page.click('a:has-text("GUI")');
    
    await expect(page.locator('input#context-id')).toHaveValue('source-id');
  });

  test('should load an example', async ({ page }) => {
    await page.selectOption('select', 'support-mon-fri');

    // Wait for the Ace Editor content to update (after programmatic set)
    await page.waitForFunction(
      (expectedText) => {
        const editor = ace.edit(document.querySelector('.ace_editor'));
        return editor.getValue().includes(expectedText);
      },
      'support-mon-fri'
    );
  });

  test('should show validation errors', async ({ page }) => {
    await page.click('a:has-text("Source")');

    await page.evaluate(() => {
      const editor = ace.edit(document.querySelector('.ace_editor'));
      editor.setValue('invalid yaml');
      editor._emit('change');
    });
    await page.waitForTimeout(500); // Give Vue time to react

    await expect(page.locator('.col-md-4 .card .card-body .alert-danger').first()).toBeVisible();
  });
});
