import { describe, it, expect } from 'vitest';
import { toPromQL, ensurePromQLBoolean, validatePromQL } from '../../src/utils/formatters';

describe('PromQL Generation Utilities', () => {
  describe('toPromQL', () => {
    it('handles simple metrics', () => {
      expect(toPromQL('up')).toBe('up');
      expect(toPromQL('  response_time  ')).toBe('response_time');
    });

    it('canonicalizes comparison operators', () => {
      expect(toPromQL('up == 1')).toBe('up == 1');
      expect(toPromQL('response_time >= 200')).toBe('response_time >= 200');
    });

    it('handles complex expressions with metrics', () => {
      expect(toPromQL('sum(rate(http_requests_total[5m]))')).toBe('sum(rate(http_requests_total[5m]))');
    });
  });

  describe('ensurePromQLBoolean', () => {
    it('adds bool to comparison operators', () => {
      expect(ensurePromQLBoolean('up == 1')).toBe('up == bool 1');
      expect(ensurePromQLBoolean('response_time < 200')).toBe('response_time < bool 200');
      expect(ensurePromQLBoolean('errors != 0')).toBe('errors != bool 0');
    });

    it('does not add bool if already present', () => {
      expect(ensurePromQLBoolean('up == bool 1')).toBe('up == bool 1');
    });

    it('handles simple metrics (no operator)', () => {
      expect(ensurePromQLBoolean('up')).toBe('up');
    });

    it('handles expressions with subqueries', () => {
      expect(ensurePromQLBoolean('(up == 1)[5m:]')).toBe('(up == bool 1)[5m:]');
    });

    it('handles empty or whitespace strings', () => {
      expect(ensurePromQLBoolean('')).toBe('');
      expect(ensurePromQLBoolean('   ')).toBe('');
    });

    it('handles multiple operators (though not explicitly supported by structured editor)', () => {
      // It should still try to add bool to all found operators
      expect(ensurePromQLBoolean('up == 1 or response_time > 200')).toBe('up == bool 1 or response_time > bool 200');
    });
  });

  describe('validatePromQL', () => {
    const metrics = { up: {}, http_requests_total: {}, cpu_usage: {} };

    it('validates correct simple expressions', () => {
      expect(validatePromQL('up == 1', metrics).valid).toBe(true);
      expect(validatePromQL('up{job="test"} == 1', metrics).valid).toBe(true);
    });

    it('validates expressions with functions', () => {
      expect(validatePromQL('sum(up)', metrics).valid).toBe(true);
      expect(validatePromQL('rate(http_requests_total[5m])', metrics).valid).toBe(true);
    });

    it('detects undefined metrics including previously common ones like "up"', () => {
      const res = validatePromQL('unknown_metric == 1', metrics);
      expect(res.valid).toBe(false);
      expect(res.error).toContain('Metric "unknown_metric" is not defined');

      const resUp = validatePromQL('up == 1', { cpu_usage: {} });
      expect(resUp.valid).toBe(false);
      expect(resUp.error).toContain('Metric "up" is not defined');
    });

    it('detects unbalanced characters', () => {
      expect(validatePromQL('sum(up', metrics).valid).toBe(false);
      expect(validatePromQL('up}', metrics).valid).toBe(false);
      expect(validatePromQL('rate(up[5m)', metrics).valid).toBe(false);
    });

    it('detects single = for comparison', () => {
      const res = validatePromQL('up = 1', metrics);
      expect(res.valid).toBe(false);
      expect(res.error).toContain('Use "==" for equality comparison');
    });

    it('allows single = inside label selectors', () => {
      expect(validatePromQL('up{job="test"} == 1', metrics).valid).toBe(true);
    });

    it('detects missing range vectors for rate-like functions', () => {
      const res = validatePromQL('rate(http_requests_total)', metrics);
      expect(res.valid).toBe(false);
      expect(res.error).toContain('requires a range vector');
    });

    it('handles complex valid expressions', () => {
      expect(validatePromQL('sum by (job) (rate(http_requests_total[5m])) > 10', metrics).valid).toBe(true);
      expect(validatePromQL('100 * (1 - avg(irate(cpu_usage[5m])))', metrics).valid).toBe(true);
    });
  });
});