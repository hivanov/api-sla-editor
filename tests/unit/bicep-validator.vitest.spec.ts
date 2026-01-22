import { describe, it, expect } from 'vitest';
import { validateBicep } from '../../src/utils/bicep/validator';

describe('BicepValidator', () => {
  it('should validate correct bicep code', () => {
    const code = `
targetScope = 'subscription'
param location string = 'global'
resource myGroup 'Microsoft.Insights/actionGroups@2023-01-01' = {
  name: 'my-ag'
  location: 'Global'
}
`;
    const result = validateBicep(code);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should return errors for invalid bicep code', () => {
    const code = `
resource myGroup 'Microsoft.Insights/actionGroups@2023-01-01' = {
  name 'missing-colon'
}
`;
    const result = validateBicep(code);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    // Error message might vary but should indicate a syntax issue
    expect(result.errors[0].message.toLowerCase()).toMatch(/missing|mismatched/);
  });

  it('should handle unterminated strings', () => {
    const code = "param p string = 'unterminated";
    const result = validateBicep(code);
    expect(result.valid).toBe(false);
    // ANTLR might report this in different ways depending on lexer/parser
    expect(result.errors.length).toBeGreaterThan(0);
  });
});
