import { describe, it, expect } from 'vitest';
import { generateGcpAlertPolicy, generateAzureBicepAlert, isComplexPromQL } from '../../src/utils/transformers';

describe('Transformers', () => {
  describe('isComplexPromQL', () => {
    it('returns false for simple metric name', () => {
      expect(isComplexPromQL('http_requests_total')).toBe(false);
      expect(isComplexPromQL('cpu_usage')).toBe(false);
    });

    it('returns true for vector selector with labels', () => {
      expect(isComplexPromQL('http_requests_total{status="500"}')).toBe(true);
    });

    it('returns true for function calls', () => {
      expect(isComplexPromQL('rate(http_requests_total[5m])')).toBe(true);
    });

    it('returns true for binary expressions', () => {
      expect(isComplexPromQL('up == 1')).toBe(true);
    });
  });

  describe('generateGcpAlertPolicy', () => {
    it('generates standard condition_threshold for simple metric', () => {
      const opts = {
        planName: 'Gold',
        source: 'direct',
        index: 0,
        metricName: 'Uptime',
        expression: 'compute.googleapis.com/instance/uptime',
        operator: '>=',
        threshold: 0.99,
        resourceType: 'gce_instance'
      };
      const result = generateGcpAlertPolicy(opts);
      expect(result).toContain('condition_threshold');
      expect(result).toContain('filter = "resource.type = \\"gce_instance\\" AND metric.type = \\"compute.googleapis.com/instance/uptime\\""');
      expect(result).toContain('comparison = "COMPARISON_LT"'); // Violated if < 0.99
    });

    it('generates condition_prometheus_query_language for complex PromQL', () => {
      const opts = {
        planName: 'Gold',
        source: 'slo',
        index: 1,
        metricName: 'SuccessRate',
        expression: 'sum(rate(http_requests_total{status!~"5.."}[5m])) / sum(rate(http_requests_total[5m]))',
        operator: '>',
        threshold: 0.99
      };
      const result = generateGcpAlertPolicy(opts);
      expect(result).toContain('condition_prometheus_query_language');
      // Should invert operator > to <= for violation check
      expect(result).toContain('query = "sum(rate(http_requests_total{status!~\\"5..\\"}[5m])) / sum(rate(http_requests_total[5m])) <= 0.99"');
    });

    it('handles PromQL which is already boolean', () => {
      const opts = {
        planName: 'Silver',
        source: 'direct',
        index: 2,
        metricName: 'Down',
        expression: 'up == 0',
      };
      const result = generateGcpAlertPolicy(opts);
      expect(result).toContain('condition_prometheus_query_language');
      expect(result).toContain('query = "up == 0"');
    });
  });

  describe('generateAzureBicepAlert', () => {
    it('generates metricalerts for simple metric', () => {
      const opts = {
        planName: 'Gold',
        source: 'direct',
        index: 0,
        metricName: 'CPU',
        expression: 'Percentage CPU',
        operator: '<',
        threshold: 80,
        location: 'eastus',
        scope: 'resource_id'
      };
      const result = generateAzureBicepAlert(opts);
      expect(result).toContain('Microsoft.Insights/metricalerts');
      expect(result).toContain("metricName: 'Percentage CPU'");
      expect(result).toContain("operator: 'GreaterThanOrEqual'"); // Violation
    });

    it('generates prometheusRuleGroups for complex PromQL', () => {
      const opts = {
        planName: 'Gold',
        source: 'slo',
        index: 1,
        metricName: 'ErrorRate',
        expression: 'rate(errors[5m])',
        operator: '<',
        threshold: 10,
        location: 'eastus',
        scope: 'workspace_id'
      };
      const result = generateAzureBicepAlert(opts);
      expect(result).toContain('Microsoft.AlertsManagement/prometheusRuleGroups');
      expect(result).toContain("alert: 'SlaBreach_ErrorRate'");
      // Violation: rate >= 10
      expect(result).toContain("expression: 'rate(errors[5m]) >= 10'");
    });
  });
});
