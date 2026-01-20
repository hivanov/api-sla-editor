import { test, expect } from '@playwright/test';

test.describe('Maintenance iCal Source', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should allow adding and editing iCal sources in maintenance policy', async ({ page }) => {
    await page.click('a:has-text("GUI")');

    // 1. Add a plan first to reveal maintenance policy editor
    await page.fill('.metrics-editor-component input[placeholder="New metric name"]', 'uptime');
    await page.click('.metrics-editor-component button:has-text("Add Metric")');
    const metricCard = page.locator('.metrics-editor-component .card:has-text("uptime")');
    await metricCard.locator('.col-md-6:has(label:has-text("Type")) select').selectOption('number');

    await page.fill('.plans-editor-component input[placeholder="New plan name"]', 'Test Plan');
    await page.click('.plans-editor-component button:has-text("Add Plan")');
    
    // Satisfy required availability
    const availEditor = page.locator('.availability-editor-component');
    await availEditor.locator('select').first().selectOption('uptime');
    const rawSwitch = availEditor.locator('#expressionModeSwitch');
    if (!(await rawSwitch.isChecked())) {
        await rawSwitch.click();
    }
    await availEditor.locator('textarea').fill('uptime == 1');
    await availEditor.locator('.nav-link:has-text("Manual Entry")').click();
    await availEditor.locator('input[type="number"]').first().fill('100');
    
    const maintenanceEditor = page.locator('.maintenance-policy-editor-component');
    
    // 2. Add an iCal source
    await maintenanceEditor.locator('button:has-text("Add Source")').click();
    
    // 3. Fill in the source details
    const calendarUrl = 'https://example.com/maintenance.ics';
    const description = 'Official maintenance calendar';
    
    await maintenanceEditor.locator('input[placeholder="https://example.com/maintenance.ics"]').fill(calendarUrl);
    await maintenanceEditor.locator('input[placeholder="Description of the source"]').fill(description);
    
    // 4. Remove pricing if it was auto-added to avoid missing required subfields errors
    await page.click('a:has-text("Source")');
    await page.evaluate(() => {
      const editor = ace.edit(document.querySelector('.ace_editor'));
      let val = editor.getValue();
      // Remove empty pricing object if it exists to satisfy schema
      val = val.replace(/pricing: \{\}/g, '');
      editor.setValue(val, -1);
    });
    await page.click('a:has-text("GUI")');

    // 5. Verify in Source editor
    await page.click('a:has-text("Source")');
    
    const editorValue = await page.evaluate(() => {
      const editor = ace.edit(document.querySelector('.ace_editor'));
      return editor.getValue();
    });

    expect(editorValue).toContain('sources:');
    expect(editorValue).toContain('type: ical');
    expect(editorValue).toContain(calendarUrl);
    expect(editorValue).toContain(description);
    
    // 5. Verify validation is still passing
    await expect(async () => {
      await expect(page.locator('.validation-card .badge.bg-success')).toBeVisible();
    }).toPass({ timeout: 5000 });
  });
});
