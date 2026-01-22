import { describe, it, expect } from 'vitest';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

describe('Four Golden Signals SLA Validation', () => {
  const schema = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../src/spec/spec.json'), 'utf8'));
  const slaYaml = fs.readFileSync(path.resolve(__dirname, '../../src/assets/examples/four-golden-signals.yaml'), 'utf8');
  const slaData = yaml.load(slaYaml);

  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);

  it('should be valid according to the JSON schema', () => {
    const validate = ajv.compile(schema);
    const valid = validate(slaData);
    expect(valid).toBe(true);
  });

  it('should contain all four golden signals', () => {
    const metrics = slaData.metrics;
    expect(metrics).toHaveProperty('latency');
    expect(metrics).toHaveProperty('traffic');
    expect(metrics).toHaveProperty('errors');
    expect(metrics).toHaveProperty('saturation');
  });

  it('should have correct monitoring IDs for GCP', () => {
    expect(slaData.metrics.latency.monitoringId).toBe('custom.googleapis.com/api/latency');
    expect(slaData.metrics.traffic.monitoringId).toBe('custom.googleapis.com/api/traffic');
    expect(slaData.metrics.errors.monitoringId).toBe('custom.googleapis.com/api/error_rate');
    expect(slaData.metrics.saturation.monitoringId).toBe('compute.googleapis.com/instance/cpu/utilization');
  });

  it('should contain SLA conditions for all golden signals across plans', () => {
    // Check Standard Plan
    const standardPlan = slaData.plans.standard;
    expect(standardPlan.quotas.traffic).toContain('100');
    expect(standardPlan.guarantees.some(g => g.measurement.includes('latency'))).toBe(true);
    expect(standardPlan.guarantees.some(g => g.measurement.includes('errors'))).toBe(true);
    expect(standardPlan.serviceLevelObjectives.some(slo => slo.guarantees.some(g => g.measurement.includes('saturation')))).toBe(true);

    // Check Premium Plan
    const premiumPlan = slaData.plans.premium;
    expect(premiumPlan.pricing.cost).toBe(100);
    expect(premiumPlan.quotas.traffic).toContain('5000');
    
    const premiumGuarantees = premiumPlan.guarantees;
    expect(premiumGuarantees.some(g => g.measurement.includes('latency'))).toBe(true);
    expect(premiumGuarantees.some(g => g.measurement.includes('errors'))).toBe(true);
    expect(premiumGuarantees.some(g => g.measurement.includes('traffic'))).toBe(true);
    expect(premiumGuarantees.some(g => g.measurement.includes('saturation'))).toBe(true);
  });

  it('should fail validation if a required field is missing', () => {
    const invalidSla = JSON.parse(JSON.stringify(slaData));
    delete invalidSla.sla;
    const validate = ajv.compile(schema);
    const valid = validate(invalidSla);
    expect(valid).toBe(false);
    expect(validate.errors[0].keyword).toBe('required');
  });

  it('should fail validation if duration format is invalid', () => {
    const invalidSla = JSON.parse(JSON.stringify(slaData));
    invalidSla.plans.standard.pricing.period = 'InvalidDuration';
    const validate = ajv.compile(schema);
    const valid = validate(invalidSla);
    expect(valid).toBe(false);
    expect(validate.errors.some(e => e.keyword === 'pattern')).toBe(true);
  });
});