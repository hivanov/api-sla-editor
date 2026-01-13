import { test, expect } from '@playwright/test';

test.describe('Markdown Editor Formatting', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Add a metric to access the Markdown editor
    await page.fill('.metrics-editor-component input[placeholder="New metric name"]', 'test-metric');
    await page.click('.metrics-editor-component button:has-text("Add Metric")');
  });

  test('should apply bold formatting', async ({ page }) => {
    const textarea = page.locator('.metrics-editor-component textarea[placeholder*="Markdown"]');
    await textarea.fill('bold text');
    await textarea.selectText();
    
    await page.click('button[title="Bold"]');
    await expect(textarea).toHaveValue('**bold text**');
    
    // Check preview
    await page.click('a.nav-link:has-text("Preview")');
    await expect(page.locator('.markdown-preview strong')).toHaveText('bold text');
  });

  test('should apply italic formatting', async ({ page }) => {
    const textarea = page.locator('.metrics-editor-component textarea[placeholder*="Markdown"]');
    await textarea.fill('italic text');
    await textarea.selectText();
    
    await page.click('button[title="Italic"]');
    await expect(textarea).toHaveValue('*italic text*');
    
    // Check preview
    await page.click('a.nav-link:has-text("Preview")');
    await expect(page.locator('.markdown-preview em')).toHaveText('italic text');
  });

  test('should apply heading formatting', async ({ page }) => {
    const textarea = page.locator('.metrics-editor-component textarea[placeholder*="Markdown"]');
    await textarea.fill('Heading');
    await textarea.selectText();
    
    await page.click('button[title="Heading"]');
    await expect(textarea).toHaveValue('### Heading');
    
    // Check preview
    await page.click('a.nav-link:has-text("Preview")');
    await expect(page.locator('.markdown-preview h3')).toHaveText('Heading');
  });

  test('should apply list formatting', async ({ page }) => {
    const textarea = page.locator('.metrics-editor-component textarea[placeholder*="Markdown"]');
    await textarea.fill('Item 1');
    await textarea.selectText();
    
    await page.click('button[title="List"]');
    await expect(textarea).toHaveValue('\n- Item 1');
    
    // Check preview
    await page.click('a.nav-link:has-text("Preview")');
    await expect(page.locator('.markdown-preview ul li')).toHaveText('Item 1');
  });

  test('should apply code formatting', async ({ page }) => {
    const textarea = page.locator('.metrics-editor-component textarea[placeholder*="Markdown"]');
    await textarea.fill('code snippet');
    await textarea.selectText();
    
    await page.click('button[title="Code"]');
    await expect(textarea).toHaveValue('`code snippet`');
    
    // Check preview
    await page.click('a.nav-link:has-text("Preview")');
    await expect(page.locator('.markdown-preview code')).toHaveText('code snippet');
  });

  test('should apply link formatting', async ({ page }) => {
    const textarea = page.locator('.metrics-editor-component textarea[placeholder*="Markdown"]');
    await textarea.fill('Google');
    await textarea.selectText();
    
    await page.click('button[title="Link"]');
    await expect(textarea).toHaveValue('[Google](https://)');
    
    // Check preview
    await page.click('a.nav-link:has-text("Preview")');
    await expect(page.locator('.markdown-preview a')).toHaveAttribute('href', 'https://');
    await expect(page.locator('.markdown-preview a')).toHaveText('Google');
  });

  test('should apply table formatting', async ({ page }) => {
    const textarea = page.locator('.metrics-editor-component textarea[placeholder*="Markdown"]');
    
    await page.click('button[title="Table"]');
    const val = await textarea.inputValue();
    expect(val).toContain('| Header 1 | Header 2 |');
    expect(val).toContain('| -------- | -------- |');
    expect(val).toContain('| Cell 1   | Cell 2   |');
    
    // Check preview
    await page.click('a.nav-link:has-text("Preview")');
    await expect(page.locator('.markdown-preview table')).toBeVisible();
    await expect(page.locator('.markdown-preview th').first()).toHaveText('Header 1');
    await expect(page.locator('.markdown-preview td').first()).toHaveText('Cell 1');
  });
});
