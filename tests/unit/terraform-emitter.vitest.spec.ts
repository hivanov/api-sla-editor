import { describe, it, expect } from 'vitest';
import { emitTerraform } from '../../src/utils/terraform/emitter';
import type { TerraformFile, TerraformResource } from '../../src/utils/terraform/ast';

describe('Terraform Emitter', () => {
  it('should emit a simple provider', () => {
    const file: TerraformFile = {
      type: 'File',
      blocks: [
        {
          type: 'Provider',
          name: 'google',
          body: [
            {
              type: 'Argument',
              identifier: 'project',
              expression: { type: 'Literal', value: 'my-project' }
            }
          ]
        } as any
      ]
    };
    const output = emitTerraform(file);
    expect(output).toContain('provider "google" {');
    expect(output).toContain('project = "my-project"');
  });

  it('should emit a resource with nested blocks', () => {
    const resource: TerraformResource = {
      type: 'Resource',
      resourceType: 'google_monitoring_alert_policy',
      name: 'my_policy',
      body: [
        {
          type: 'Argument',
          identifier: 'display_name',
          expression: { type: 'Literal', value: 'My Policy' }
        },
        {
          type: 'Block',
          blockType: 'conditions',
          labels: [],
          body: [
            {
              type: 'Block',
              blockType: 'condition_threshold',
              labels: [],
              body: [
                {
                  type: 'Argument',
                  identifier: 'filter',
                  expression: { type: 'Literal', value: 'metric.type = "custom.googleapis.com/my_metric"' }
                }
              ]
            }
          ]
        }
      ]
    };
    const output = emitTerraform(resource);
    expect(output).toContain('resource "google_monitoring_alert_policy" "my_policy" {');
    expect(output).toContain('display_name = "My Policy"');
    expect(output).toContain('conditions {');
    expect(output).toContain('condition_threshold {');
    expect(output).toContain('filter = "metric.type = \\"custom.googleapis.com/my_metric\\""');
  });

  it('should emit multiline strings using heredoc', () => {
    const arg = {
      type: 'Argument',
      identifier: 'query',
      expression: { type: 'Literal', value: `avg_over_time(
  my_metric[5m]
) > 0.9` }
    } as any;
    const output = emitTerraform(arg);
    expect(output).toContain('query = <<-EOF');
    expect(output).toContain('avg_over_time(');
    expect(output).toContain('EOF');
  });

  it('should emit lists and maps', () => {
    const resource: TerraformResource = {
      type: 'Resource',
      resourceType: 'test_resource',
      name: 'test',
      body: [
        {
          type: 'Argument',
          identifier: 'my_list',
          expression: {
            type: 'List',
            elements: [
              { type: 'Literal', value: 'a' },
              { type: 'Literal', value: 'b' }
            ]
          }
        },
        {
          type: 'Argument',
          identifier: 'my_map',
          expression: {
            type: 'Map',
            entries: [
              {
                type: 'Argument',
                identifier: 'key',
                expression: { type: 'Literal', value: 'value' }
              }
            ]
          }
        }
      ]
    };
    const output = emitTerraform(resource);
    expect(output).toContain('my_list = ["a", "b"]');
    expect(output).toContain('my_map = {');
    expect(output).toContain('key = "value"');
  });
});
