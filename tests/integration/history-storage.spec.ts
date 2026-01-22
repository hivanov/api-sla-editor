import { test, expect } from '@playwright/test';

test.describe('SLA Storage and History', () => {
  test.beforeEach(async ({ page }) => {
    // Desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Disable animations for faster, more reliable tests
    await page.addInitScript(() => {
      const style = document.createElement('style');
      style.innerHTML = `
        *, *::before, *::after {
          transition: none !important;
          animation: none !important;
        }
      `;
      document.head.appendChild(style);
    });

    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  async function getEditorValue(page) {
    return await page.evaluate(() => {
      const el = document.querySelector('.ace_editor');
      if (!el) return '';
      // @ts-ignore
      const editor = ace.edit(el);
      return editor.getValue();
    });
  }

  async function openHistoryViaUI(page) {
    await page.click('.btn-settings-menu');
    const historyBtn = page.locator('.btn-view-history:visible');
    await expect(historyBtn).toBeVisible();
    await historyBtn.click({ force: true });
    await expect(page.locator('#historyModal')).toBeVisible();
  }

  test('should auto-save changes to localStorage', async ({ page }) => {
    await page.click('.btn-tab-source');
    
    const uniqueId = `save-id-${Date.now()}`;
    await page.evaluate((id) => {
      window.setYamlContent(`sla: 1.0.0\ncontext:\n  id: ${id}\n  type: plans\nmetrics: {}\nplans: {}`);
    }, uniqueId);
    
    // Wait for auto-save (debounce is 2s)
    await expect(async () => {
        const stored = await page.evaluate(() => localStorage.getItem('sla-editor-files'));
        expect(stored).toContain(uniqueId);
    }).toPass({ timeout: 5000 });

    // Refresh page
    await page.reload();

    // Check if it's restored
    await page.click('.btn-tab-source');
    await expect(async () => {
        const content = await getEditorValue(page);
        expect(content).toContain(uniqueId);
    }).toPass();
  });

  test('should save immediately on page reload (before debounce)', async ({ page }) => {
    await page.click('.btn-tab-source');
    
    const uniqueId = `immediate-save-${Date.now()}`;
    await page.evaluate((id) => {
      window.setYamlContent(`sla: 1.0.0\ncontext:\n  id: ${id}\n  type: plans\nmetrics: {}\nplans: {}`);
    }, uniqueId);
    
    // Reload immediately without waiting for debounce
    await page.reload();

    // Check if it's restored
    await page.click('.btn-tab-source');
    const content = await getEditorValue(page);
    expect(content).toContain(uniqueId);
  });

  test('should show confirmation modal when overwriting modified SLA (Source Mode)', async ({ page }) => {
    await page.selectOption('.select-example-loader', 'support-mon-fri');
    
    await page.click('.btn-tab-source');
    await page.evaluate(() => {
      const el = document.querySelector('.ace_editor');
      // @ts-ignore
      const editor = ace.edit(el);
      editor.setValue(editor.getValue().replace('id: support-mon-fri', 'id: modified-source-id'), -1);
      editor._emit('change');
    });

    // Try to load another example
    await page.selectOption('.select-example-loader', 'metrics-100-concurrent-connections');

    // Modal should appear
    const modal = page.locator('#confirmLoadModal');
    await expect(modal).toBeVisible();
    await expect(modal).toContainText('You have modified the current SLA');

    // Click Proceed
    await page.click('#confirmLoadModal .btn-primary');
    await expect(modal).toBeHidden();

    // Check if new example is loaded
    const content = await getEditorValue(page);
    expect(content).toContain('metrics');
    expect(content).not.toContain('modified-source-id');
  });

  test('should show confirmation modal when overwriting modified SLA (GUI Mode)', async ({ page }) => {
    await page.selectOption('.select-example-loader', 'support-mon-fri');
    
    // Modify it in GUI
    await page.click('.btn-tab-gui');
    await page.fill('input#context-id', 'gui-modified-id');
    
    // Wait for isDirty to become true (via normalized comparison)
    await expect(async () => {
        const isDirty = await page.evaluate(() => {
            // @ts-ignore
            return window.app.isDirty;
        });
        expect(isDirty).toBe(true);
    }).toPass();

    // Try to load another example
    await page.selectOption('.select-example-loader', 'metrics-100-concurrent-connections');

    // Modal should appear
    const modal = page.locator('#confirmLoadModal');
    await expect(modal).toBeVisible();

    // Click Proceed
    await page.click('#confirmLoadModal .btn-primary');
    await expect(modal).toBeHidden();

    // Check if new example is loaded
    await page.click('.btn-tab-source');
    const content = await getEditorValue(page);
    expect(content).toContain('metrics');
    expect(content).not.toContain('gui-modified-id');
  });

  test('should detect dirty state when modifying via GUI and reload', async ({ page }) => {
    await page.click('.btn-tab-gui');
    const uniqueId = `gui-save-${Date.now()}`;
    await page.fill('input#context-id', uniqueId);
    
    // Wait for sync to yamlContent
    await expect(async () => {
        const content = await getEditorValue(page);
        expect(content).toContain(uniqueId);
    }).toPass();
    
    await page.reload();
    
    await page.click('.btn-tab-source');
    const content = await getEditorValue(page);
    expect(content).toContain(uniqueId);
  });

  test('should NOT show confirmation modal if NOT modified between samples', async ({ page }) => {
    await page.selectOption('.select-example-loader', 'support-mon-fri');
    
    // Ensure NOT dirty
    await expect(async () => {
        const isDirty = await page.evaluate(() => {
            // @ts-ignore
            return window.app.isDirty;
        });
        expect(isDirty).toBe(false);
    }).toPass();
    
    await page.selectOption('.select-example-loader', 'metrics-100-concurrent-connections');

    const modal = page.locator('#confirmLoadModal');
    await expect(modal).toBeHidden();

    const content = await getEditorValue(page);
    expect(content).toContain('metrics');
  });

  test('should show history and allow restoration', async ({ page }) => {
    test.setTimeout(60000);
    
    await page.click('.btn-tab-source');
    const historyId = `history-test-${Date.now()}`;
    await page.evaluate((id) => {
      window.setYamlContent(`sla: 1.0.0\ncontext:\n  id: ${id}\n  type: plans\nmetrics: {}\nplans: {}`);
    }, historyId);
    
    // Wait for auto-save
    await expect(async () => {
        const stored = await page.evaluate(() => localStorage.getItem('sla-editor-files'));
        expect(stored).toContain(historyId);
    }).toPass();

    await openHistoryViaUI(page);
    await expect(page.locator('#historyModal td').first()).toContainText(historyId);

    // Close modal
    await page.click('#historyModal .btn-secondary');
    await expect(page.locator('#historyModal')).toBeHidden();
    
    // Load a different example to change current state
    await page.selectOption('.select-example-loader', 'support-mon-fri');
    
    // Open History again
    await openHistoryViaUI(page);
    
    // Restore historyId specifically
    const row = page.locator('#historyModal tr', { hasText: historyId });
    await row.locator('.btn-outline-primary').click();
    await expect(page.locator('#historyModal')).toBeHidden();
    
    // Check if restored
    await expect(async () => {
        const content = await getEditorValue(page);
        expect(content).toContain(historyId);
    }).toPass();
  });
});