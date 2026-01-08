import { test, expect } from '@playwright/test';

test.describe('RRule formatting in Description tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should format RFC 5545 RRULEs correctly', async ({ page }) => {
    await page.click('a:has-text("Source")');

    const yamlWithRRule = `
sla: 1.0.0
context:
  id: rrule-test
  type: plans
plans:
  standard:
    availability: 99.9%
    x-maintenance-policy:
      windows:
        - type: weekly-patch
          rrule: FREQ=WEEKLY;BYDAY=MO
          duration: PT2H
        - type: monthly-backup
          rrule: FREQ=MONTHLY;BYMONTHDAY=1
          duration: PT4H
`;

    await page.evaluate((yaml) => {
      window.app.setYamlContent(yaml);
    }, yamlWithRRule);
    
    await page.click('a:has-text("Description")');
    
    const description = page.locator('.policy-description');
    // FREQ=WEEKLY;BYDAY=MO -> every week on Monday
    await expect(description).toContainText('every week on Monday');
    // FREQ=MONTHLY;BYMONTHDAY=1 -> every month on the 1st
    await expect(description).toContainText('every month on the 1st');
    
    await expect(description).toContainText('2 hours');
    await expect(description).toContainText('4 hours');
  });
});
