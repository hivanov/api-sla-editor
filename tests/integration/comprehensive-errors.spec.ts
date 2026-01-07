import { test, expect } from '@playwright/test';

test.describe('Comprehensive Error Handling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  const setSource = async (page, content) => {
    await page.click('a:has-text("Source")');
    await page.evaluate((val) => {
      const editor = ace.edit(document.querySelector('.ace_editor'));
      editor.setValue(val, -1);
      editor._emit('change');
    }, content);
    
    // Just wait for Vue to sync and validate
    await page.waitForTimeout(1500);

    await page.click('a:has-text("GUI")');
  };

  test('should show friendly errors for numeric fields with invalid values', async ({ page }) => {
    await setSource(page, `
sla: 1.0.0
context:
  id: test
  type: plans
plans:
  gold:
    availability: "99%"
    pricing:
      cost: "aaa"
      currency: USD
      period: P1D
`);
    const costInput = page.locator('.pricing-editor-component input[placeholder="Cost"]');
    await expect(costInput).toHaveClass(/is-invalid/);
    await expect(page.locator('.pricing-editor-component .invalid-feedback').first()).toContainText('Value must be a number');
  });

  test('should show friendly errors for missing required fields', async ({ page }) => {
    await setSource(page, `
sla: 1.0.0
context:
  type: plans
`);
    const idInput = page.locator('input#context-id');
    await expect(idInput).toHaveClass(/is-invalid/);
    await expect(page.locator('.context-editor-component .invalid-feedback').first()).toContainText("Field 'id' is required");
  });

  test('should show friendly errors for invalid ISO 8601 periods in lifecycle policy', async ({ page }) => {
    await setSource(page, `
sla: 1.0.0
context:
  id: test
  type: plans
plans:
  gold:
    availability: "99%"
    x-lifecycle-policy:
      minimumTerm: "INVALID"
`);
    const periodInput = page.locator('.lifecycle-policy-editor-component .duration-editor input[type="text"]').first();
    await expect(periodInput).toHaveClass(/is-invalid/);
    await expect(page.locator('.lifecycle-policy-editor-component .duration-editor .invalid-feedback').first()).toContainText('Invalid duration format');
  });

  test('should show friendly errors for invalid URLs (missing //)', async ({ page }) => {
    await setSource(page, `
sla: 1.0.0
context:
  id: test
  type: plans
plans:
  gold:
    availability: "99%"
    x-support-policy:
      contactPoints:
        - contactType: support
          channels:
            - type: phone
              url: "tel:123456"
`);
    const urlInput = page.locator('.support-policy-editor-component input[placeholder="https://... or mailto:..."]');
    await expect(urlInput).toHaveClass(/is-invalid/);
    await expect(page.locator('.support-policy-editor-component .invalid-feedback').first()).toContainText('URL must start with http://, https://, mailto://, or tel://');
  });

  test('should show friendly errors for invalid support hours (HH:mm)', async ({ page }) => {
    await setSource(page, `
sla: 1.0.0
context:
  id: test
  type: plans
plans:
  gold:
    availability: "99%"
    x-support-policy:
      hoursAvailable:
        - dayOfWeek: ["Monday"]
          opens: "9:0"
          closes: "17:00"
`);
    const opensInput = page.locator('.support-policy-editor-component input[placeholder="HH:mm"]').first();
    await expect(opensInput).toHaveClass(/is-invalid/);
    await expect(page.locator('.support-policy-editor-component .invalid-feedback').first()).toContainText('Time must be in HH:mm format');
  });

  test('should show friendly errors for invalid availability percentage (format)', async ({ page }) => {
    await setSource(page, `
sla: 1.0.0
context:
  id: test
  type: plans
plans:
  gold:
    availability: "not-a-percentage"
`);
    const availInput = page.locator('.availability-editor-component input[placeholder="e.g. 99.9"]');
    await expect(availInput).toHaveClass(/is-invalid/);
    await expect(page.locator('.availability-editor-component .invalid-feedback')).toContainText('Availability must be a percentage');
  });

  test('should show friendly errors for missing required channel properties', async ({ page }) => {
    await setSource(page, `
sla: 1.0.0
context:
  id: test
  type: plans
plans:
  gold:
    availability: "99%"
    x-support-policy:
      contactPoints:
        - contactType: support
          channels:
            - type: web
`);
    // URL is required for channel
    const channelCard = page.locator('.support-policy-editor-component .channel-item').first();
    await expect(channelCard).toContainText("Field 'url' is required");
  });

  test('should show friendly errors for invalid RRULE format', async ({ page }) => {
    await setSource(page, `
sla: 1.0.0
context:
  id: test
  type: plans
plans:
  gold:
    availability: "99%"
    x-maintenance-policy:
      windows:
        - type: routine
          rrule: "INVALID-RRULE"
          duration: P1D
`);
    const rruleInput = page.locator('.maintenance-policy-editor-component .rrule-editor input[type="text"]').first();
    await expect(rruleInput).toHaveClass(/is-invalid/);
    await expect(page.locator('.maintenance-policy-editor-component .rrule-editor .invalid-feedback').first()).toContainText('Invalid RRULE format');
  });
});