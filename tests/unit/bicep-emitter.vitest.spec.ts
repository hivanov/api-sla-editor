import { describe, it, expect } from 'vitest';
import { BicepEmitter } from '../../src/utils/bicep/emitter';
import type { BicepStatement } from '../../src/utils/bicep/ast';

describe('BicepEmitter', () => {
  const emitter = new BicepEmitter();

  it('should emit a simple parameter', () => {
    const statements: BicepStatement[] = [
      {
        type: 'Parameter',
        name: 'location',
        parameterType: 'string',
        defaultValue: { type: 'Literal', value: 'global' }
      }
    ];
    const output = emitter.emit(statements);
    expect(output).toBe("param location string = 'global'");
  });

  it('should emit a resource with an object body', () => {
    const statements: BicepStatement[] = [
      {
        type: 'Resource',
        name: 'myGroup',
        resourceType: 'Microsoft.Insights/actionGroups@2023-01-01',
        body: {
          type: 'Object',
          properties: [
            { name: 'name', value: { type: 'Literal', value: 'my-ag' } },
            { name: 'location', value: { type: 'Literal', value: 'Global' } }
          ]
        }
      }
    ];
    const output = emitter.emit(statements);
    expect(output).toContain("resource myGroup 'Microsoft.Insights/actionGroups@2023-01-01' = {");
    expect(output).toContain("  name: 'my-ag'");
    expect(output).toContain("  location: 'Global'");
  });

  it('should handle nested objects and arrays', () => {
    const statements: BicepStatement[] = [
      {
        type: 'Variable',
        name: 'config',
        value: {
          type: 'Object',
          properties: [
            {
              name: 'items',
              value: {
                type: 'Array',
                items: [
                  { type: 'Literal', value: 1 },
                  { type: 'Literal', value: 2 }
                ]
              }
            }
          ]
        }
      }
    ];
    const output = emitter.emit(statements);
    expect(output).toContain("var config = {");
    expect(output).toContain("  items: [");
    expect(output).toContain("    1");
    expect(output).toContain("    2");
  });

  it('should emit member expressions correctly', () => {
    const statements: BicepStatement[] = [
      {
        type: 'Output',
        name: 'id',
        outputType: 'string',
        value: {
          type: 'MemberExpression',
          object: { type: 'Identifier', name: 'myRes' },
          property: 'id'
        }
      }
    ];
    const output = emitter.emit(statements);
    expect(output).toBe("output id string = myRes.id");
  });

  it('should emit interpolated strings', () => {
    const statements: BicepStatement[] = [
      {
        type: 'Variable',
        name: 'msg',
        value: {
          type: 'StringLiteral',
          value: 'Hello world',
          segments: [
            'Hello ',
            { type: 'Identifier', name: 'name' },
            '!'
          ]
        }
      }
    ];
    const output = emitter.emit(statements);
    expect(output).toBe("var msg = 'Hello ${name}!'");
  });
});
