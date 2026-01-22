import { describe, it, expect } from 'vitest';
import { helpItems } from '../../src/utils/help-examples';
import { validatePromQL } from '../../src/utils/formatters';

describe('Help Page PromQL Examples Validation', () => {
  helpItems.forEach(item => {
    if (item.promql) {
      it(`should have a valid PromQL expression for "${item.title}"`, () => {
        const res = validatePromQL(item.promql);
        if (!res.valid) {
          console.error(`Invalid PromQL in help item "${item.title}": ${item.promql}\nError: ${res.error}`);
        }
        expect(res.valid).toBe(true);
      });
    }
  });
});
