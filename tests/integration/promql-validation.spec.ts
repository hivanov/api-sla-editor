import { test, expect } from '@playwright/test';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { validatePromQL } from '../../src/utils/formatters';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe('PromQL Expression Validation in Examples', () => {
  const examplesDir = path.join(__dirname, '../../src/assets/examples');
  const exampleFiles = fs.readdirSync(examplesDir).filter(f => f.endsWith('.yaml'));
  
  const allFiles = [
    ...exampleFiles.map(f => path.join(examplesDir, f)),
    path.join(__dirname, '../../src/assets/example.yaml')
  ];

  for (const filePath of allFiles) {
    const fileName = path.basename(filePath);
    
    test(`example "${fileName}" should have valid PromQL and defined metrics`, async () => {
      const content = fs.readFileSync(filePath, 'utf8');
      const doc = yaml.load(content) as any;
      
      if (!doc || typeof doc !== 'object') return;

      const metrics = doc.metrics || {};

      if (doc.metrics) {
        for (const [metricName, metric] of Object.entries(doc.metrics)) {
          const m = metric as any;
          if (m.monitoringId) {
            // Validate syntax ONLY for monitoringId (don't pass metrics object)
            const res = validatePromQL(m.monitoringId);
            if (!res.valid) {
              throw new Error(`Invalid PromQL in metric "${metricName}" monitoringId: ${res.error}`);
            }
          }
        }
      }

      if (doc.plans) {
        for (const [planName, plan] of Object.entries(doc.plans)) {
          const p = plan as any;
          if (p.availability && p.availability.expression) {
            const res = validatePromQL(p.availability.expression, metrics);
            if (!res.valid) {
              throw new Error(`Invalid PromQL in plan "${planName}" availability expression: ${res.error}`);
            }
          }
          if (p.guarantees) {
            for (const [index, guarantee] of p.guarantees.entries()) {
              const g = guarantee as any;
              if (g.measurement) {
                const res = validatePromQL(g.measurement, metrics);
                if (!res.valid) {
                  throw new Error(`Invalid PromQL in plan "${planName}" guarantee[${index}] measurement: ${res.error}`);
                }
              }
            }
          }
        }
      }
    });
  }
});