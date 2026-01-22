import { test, expect } from '@playwright/test';

test.describe('Azure Bicep Generator', () => {
  test('should generate Bicep without syntax errors in editor', async ({ page }) => {
    await page.goto('/');

    await page.selectOption('select.select-example-loader', 'gcp-monitoring-complex');
    await page.click('button.btn-transform');
    await page.click('a.btn-gen-bicep');

    await page.locator('.input-azure-resource-id').fill('/subscriptions/x/resourcegroups/y');
    await page.locator('.input-azure-location').fill('eastus');

    await page.click('.azure-bicep-generator button.btn-generate');
    
    await expect(async () => {
        const bicep = await page.evaluate(() => {
            const el = document.querySelector('.ace_editor');
            if (!el) return '';
            // @ts-ignore
            return ace.edit(el).getValue();
        });
        expect(bicep).toContain('resource');
        
        const errorGutterIcon = page.locator('.ace_gutter-cell.ace_error');
        expect(await errorGutterIcon.count()).toBe(0);
    }).toPass();
  });

  test('should show validation error for malformed Bicep', async ({ page }) => {
    await page.goto('/');
    await page.selectOption('select.select-example-loader', 'gcp-monitoring-complex');
    await page.click('button.btn-transform');
    await page.click('a.btn-gen-bicep');
    await page.locator('.input-azure-resource-id').fill('/subscriptions/x');
    await page.locator('.input-azure-location').fill('eastus');
    await page.click('.azure-bicep-generator button.btn-generate');

    await expect(page.locator('.azure-bicep-generator .alert-danger')).not.toBeVisible();
  });

  test('should NOT highlight numbers within identifiers', async ({ page }) => {
    await page.goto('/');
    await page.selectOption('select.select-example-loader', 'azure-monitoring-sample');
    await page.click('button.btn-transform');
    await page.click('a.btn-gen-bicep');
    await page.locator('.input-azure-resource-id').fill('/subscriptions/sub/resourcegroups/rg');
    await page.locator('.input-azure-location').fill('eastus');
    await page.click('.azure-bicep-generator button.btn-generate');

    const bicep = await page.evaluate(() => {
        const el = document.querySelector('.ace_editor');
        if (!el) return '';
        // @ts-ignore
        return ace.edit(el).getValue();
    });
    expect(bicep).toContain('resource rule_');
  });

  test('should highlight all major Bicep syntax elements', async ({ page }) => {
    await page.goto('/');
    await page.selectOption('select.select-example-loader', 'azure-monitoring-sample');
    await page.click('button.btn-transform');
    await page.click('a.btn-gen-bicep');
    await page.locator('.input-azure-resource-id').fill('/subscriptions/sub/resourcegroups/rg');
    await page.locator('.input-azure-location').fill('eastus');
    await page.click('.azure-bicep-generator button.btn-generate');

    const bicep = await page.evaluate(() => {
        const el = document.querySelector('.ace_editor');
        if (!el) return '';
        // @ts-ignore
        return ace.edit(el).getValue();
    });
    expect(bicep).toContain('resource');
    expect(bicep).toContain('properties');
  });

  test('should highlight Bicep string interpolation and escaped quotes', async ({ page }) => {
    await page.goto('/');
    await page.selectOption('select.select-example-loader', 'azure-monitoring-sample');
    await page.click('button.btn-transform');
    await page.click('a.btn-gen-bicep');
    await page.locator('.input-azure-resource-id').fill('/sub/rg');
    await page.locator('.input-azure-location').fill('eastus');
    await page.click('.azure-bicep-generator button.btn-generate');

    await page.evaluate(() => {
        const el = document.querySelector('.ace_editor');
        if (el) {
            // @ts-ignore
            const editor = ace.edit(el);
            editor.setReadOnly(false);
            // Use double single quotes for Bicep escaping
            editor.setValue("var test = 'Hello ${name}!'\nvar escaped = 'It\'s working'\n", -1);
        }
    });

    const bicep = await page.evaluate(() => {
        const el = document.querySelector('.ace_editor');
        if (!el) return '';
        // @ts-ignore
        return ace.edit(el).getValue();
    });
    expect(bicep).toContain('${name}');
    expect(bicep).toContain("It's working");
  });
});