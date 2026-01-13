import { test, expect } from '@playwright/test';

test.describe('New Fields Verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should reflect new metric fields in Source and Description tabs', async ({ page }) => {
    // 1. Create a metric
    await page.fill('.metrics-editor-component input[placeholder="New metric name"]', 'test-metric');
    await page.click('.metrics-editor-component button:has-text("Add Metric")');
    
    const metricCard = page.locator('.metrics-editor-component .card:has-text("test-metric")');
    
    // 2. Set new fields
    await metricCard.locator('input[placeholder*="compute.googleapis.com"]').fill('gcp.id');
    await metricCard.locator('input[placeholder*="gce_instance"]').fill('gce_instance');
    await metricCard.locator('select').filter({ hasText: 'Select Kind' }).selectOption('DELTA');
    
    // 3. Set Markdown Description
    await metricCard.locator('textarea[placeholder*="Markdown"]').fill('**Bold Description**');

    // 4. Verify Source
    await page.click('a:has-text("Source")');
    const editorValue = await page.evaluate(() => {
      return ace.edit(document.querySelector('.ace_editor')).getValue();
    });
    
    expect(editorValue).toContain('test-metric:');
    expect(editorValue).toContain('monitoringId: gcp.id');
    expect(editorValue).toContain('resourceType: gce_instance');
    expect(editorValue).toContain('metricKind: DELTA');
    expect(editorValue).toContain('description: \'**Bold Description**\''); // YAML format

    // 5. Verify Description
    await page.click('a:has-text("Description")');
    
    const descriptionTab = page.locator('.policy-description');
    await expect(descriptionTab.locator('h2:has-text("Metrics Definitions")')).toBeVisible();
    await expect(descriptionTab.locator('h3:has-text("test-metric")')).toBeVisible();
    
    // Check rendered markdown
    await expect(descriptionTab.locator('strong:has-text("Bold Description")')).toBeVisible();
    
    // Check fields
    await expect(descriptionTab).toContainText('Monitoring ID: gcp.id');
    await expect(descriptionTab).toContainText('Resource Type: gce_instance');
    await expect(descriptionTab).toContainText('Kind: DELTA');
  });
});
