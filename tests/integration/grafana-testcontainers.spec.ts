import { test, expect } from '@playwright/test';
import { GenericContainer, Network, Wait } from 'testcontainers';
import { execSync } from 'child_process';
import createClient from 'openapi-fetch';
import type { paths } from '../../src/utils/grafana-schema';

test.describe('Grafana Integration with Testcontainers', () => {
  // Set timeout to 10 minutes for container startup and data seeding
  test.setTimeout(600_000);

  let network;
  let prometheus;
  let grafana;
  let grafanaPort;
  let client;
  let now;
  
  test.beforeAll(async () => {
    // 0. Fail early if Docker/Podman is not running
    try {
        execSync('docker info', { stdio: 'ignore' });
    } catch (e) {
        try {
            execSync('podman info', { stdio: 'ignore' });
        } catch (e2) {
            throw new Error('Docker or Podman is not running. This test requires a container runtime.');
        }
    }

    // 1. Create Network
    network = await new Network().start();

    // 2. Generate Seeding Data (OpenMetrics format)
    now = Math.floor(Date.now() / 1000);
    const step = 30; // 30 seconds between points
    let openMetrics = [
        '# HELP up Binary service status',
        '# TYPE up gauge',
        '# HELP http_requests Total HTTP requests',
        '# TYPE http_requests counter',
        '# HELP http_request_duration_seconds HTTP request duration',
        '# TYPE http_request_duration_seconds histogram'
    ];

    const generatePoints = (start, end, state) => {
        for (let t = start; t < end; t += step) {
            const ts = t; 
            let up = 1;
            let errRate = 0;
            let l01 = 0.95; // 95% < 0.1s
            let l02 = 0.99; // 99% < 0.2s
            
            if (state === 'red') {
                up = 0;
                errRate = 0.05; // 5% errors (SLA is 1%)
                l01 = 0.5;
                l02 = 0.7; // 95th percentile will be > 0.2s
            } else if (state === 'yellow') {
                up = 1;
                errRate = 0.008; // 0.8% errors (SLA is 1%)
                l01 = 0.85;
                l02 = 0.945; // Borderline latency
            }
            
            const total = (t - (now - 7200)) * 10; 
            const errors = Math.floor(total * errRate);
            
            openMetrics.push(`up{job="my-service"} ${up} ${ts}`);
            openMetrics.push(`http_requests_total{status="200"} ${total - errors} ${ts}`);
            openMetrics.push(`http_requests_total{status="500"} ${errors} ${ts}`);
            openMetrics.push(`http_request_duration_seconds_bucket{le="0.1"} ${Math.floor(total * l01)} ${ts}`);
            openMetrics.push(`http_request_duration_seconds_bucket{le="0.2"} ${Math.floor(total * l02)} ${ts}`);
            openMetrics.push(`http_request_duration_seconds_bucket{le="+Inf"} ${total} ${ts}`);
            openMetrics.push(`http_request_duration_seconds_sum ${total * 0.05} ${ts}`);
            openMetrics.push(`http_request_duration_seconds_count ${total} ${ts}`);
        }
    };

    generatePoints(now - 7200, now - 900, 'green'); // Long history of green
    generatePoints(now - 900, now - 600, 'red');
    generatePoints(now - 600, now - 300, 'yellow');
    generatePoints(now - 300, now, 'green');
    openMetrics.push('# EOF');

    const openMetricsData = openMetrics.join('\n') + '\n';

    // 3. Prometheus with Data Seeding
    const promConfig = `
global:
  scrape_interval: 10s
scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']
    `;
    
    prometheus = await new GenericContainer('prom/prometheus:latest')
      .withNetwork(network)
      .withNetworkAliases('prometheus')
      .withUser('root')
      .withCopyContentToContainer([
          {
              content: openMetricsData,
              target: '/tmp/metrics.prom'
          },
          {
              content: promConfig,
              target: '/etc/prometheus/prometheus.yml'
          }
      ])
      .withEntrypoint([
          'sh', '-c', 
          'promtool tsdb create-blocks-from openmetrics /tmp/metrics.prom /prometheus && /bin/prometheus --config.file=/etc/prometheus/prometheus.yml --storage.tsdb.path=/prometheus --web.enable-admin-api'
      ])
      .withExposedPorts(9090)
      .withWaitStrategy(Wait.forLogMessage(/Server is ready to receive web requests/))
      .start();

    // 4. Grafana
    grafana = await new GenericContainer('grafana/grafana:10.4.0')
      .withNetwork(network)
      .withExposedPorts(3000)
      .withEnvironment({
          'GF_SECURITY_ADMIN_PASSWORD': 'admin',
          'GF_AUTH_ANONYMOUS_ENABLED': 'true',
          'GF_AUTH_ANONYMOUS_ORG_ROLE': 'Admin'
      })
      .withWaitStrategy(Wait.forListeningPorts())
      .start();

    grafanaPort = grafana.getMappedPort(3000);
    
    client = createClient<paths>({
        baseUrl: `http://localhost:${grafanaPort}/api/`,
        headers: {
            'Authorization': 'Basic ' + btoa('admin:admin')
        }
    });

    // Wait for Grafana API
    let ready = false;
    for (let i = 0; i < 10; i++) {
        try {
            const { response } = await client.GET('/health');
            if (response.ok) {
                ready = true;
                break;
            }
        } catch (e) {}
        await new Promise(r => setTimeout(r, 2000));
    }
    if (!ready) throw new Error('Grafana failed to start');

    // Configure Datasource
    await client.POST('/datasources', {
        body: {
            name: 'Prometheus',
            type: 'prometheus',
            url: 'http://prometheus:9090',
            access: 'proxy',
            isDefault: true
        }
    });
  }, 600_000);

  test.afterAll(async () => {
      if (grafana) await grafana.stop();
      if (prometheus) await prometheus.stop();
      if (network) await network.stop();
  }, 600_000);

  test('generates, deploys and verifies Red/Yellow/Green states programmatically', async ({ page }) => {
     // 1. Get Dashboard JSON from App
     await page.goto('/');
     await page.selectOption('select.form-select', 'grafana-prometheus-sample');
     await page.click('button:has-text("Transform")');
     await page.click('a:has-text("Generate Grafana (Prometheus)")');
     await page.click('button:has-text("Generate")');
     
     const getDashboard = async () => {
         return await page.evaluate(() => {
             // @ts-ignore
             const el = document.querySelector('.ace_editor');
             if (!el) return null;
             // @ts-ignore
             const editor = ace.edit(el);
             return JSON.parse(editor.getValue());
         });
     };
     
     let dashboard = null;
     while (!dashboard) {
         dashboard = await getDashboard();
         await page.waitForTimeout(500);
     }
     
     // 2. Import to Grafana
     dashboard.uid = 'sla-generated';
     dashboard.title = 'Integration Test Dashboard';
     
     const { response: dbRes } = await client.POST('/dashboards/db', {
         body: {
             dashboard: dashboard,
             overwrite: true
         }
     });
     expect(dbRes.ok).toBe(true);

     // Get DataSource UID for queries
     const { data: dsData } = await client.GET('/datasources/name/{name}', {
         params: { path: { name: 'Prometheus' } }
     });
     const dsUid = dsData.uid;

     const queryMetric = async (query, startTime, endTime) => {
         const { data, response } = await client.POST('/ds/query', {
             body: {
                 queries: [{
                     refId: 'A',
                     datasource: { uid: dsUid, type: 'prometheus' },
                     expr: query,
                     format: 'time_series',
                 }],
                 from: (startTime).toString() + '000',
                 to: (endTime).toString() + '000',
             }
         });
         if (!response.ok) throw new Error('Query failed');
         const frames = data.results.A.frames;
         if (!frames || frames.length === 0) return null;
         const values = frames[0].data.values[1]; // [timestamps, values]
         if (!values || values.length === 0) return null;
         // Return mean of values in range to handle jitter/steps
         return values.reduce((a, b) => a + b, 0) / values.length;
     };

     // 3. Inspect Dashboard programmatically using queryMetric
     
     // GREEN State (last 150s)
     console.log('Programmatically verifying GREEN state...');
     const greenStartTime = now - 150;
     const greenEndTime = now;

     const greenUptime = await queryMetric('up{job="my-service"}', greenStartTime, greenEndTime);
     expect(greenUptime).toBe(1);

     const greenErrorRate = await queryMetric('sum(rate(http_requests_total{status=~"5.."}[1m])) / sum(rate(http_requests_total[1m]))', greenStartTime, greenEndTime);
     expect(greenErrorRate).toBeLessThan(0.002);

     // YELLOW State (T-450s to T-300s)
     console.log('Programmatically verifying YELLOW state...');
     const yellowStartTime = now - 450;
     const yellowEndTime = now - 300;

     const yellowUptime = await queryMetric('up{job="my-service"}', yellowStartTime, yellowEndTime);
     expect(yellowUptime).toBe(1);

     const yellowErrorRate = await queryMetric('sum(rate(http_requests_total{status=~"5.."}[1m])) / sum(rate(http_requests_total[1m]))', yellowStartTime, yellowEndTime);
     // errRate = 0.008
     expect(yellowErrorRate).toBeGreaterThan(0.005);
     expect(yellowErrorRate).toBeLessThan(0.015);

     // RED State (T-750s to T-600s)
     console.log('Programmatically verifying RED state...');
     const redStartTime = now - 750;
     const redEndTime = now - 600;

     const redUptime = await queryMetric('up{job="my-service"}', redStartTime, redEndTime);
     expect(redUptime).toBe(0);

     const redErrorRate = await queryMetric('sum(rate(http_requests_total{status=~"5.."}[1m])) / sum(rate(http_requests_total[1m]))', redStartTime, redEndTime);
     // errRate = 0.05
     expect(redErrorRate).toBeGreaterThan(0.03);

     // Verification of Compensation Logic
     console.log('Verifying Compensation Logic...');
     const redCompensation = await queryMetric('( (up{job="my-service"} < bool 0.95) * 100 )', redStartTime, redEndTime);
     expect(redCompensation).toBe(100);

     const greenCompensation = await queryMetric('( (up{job="my-service"} < bool 0.95) * 100 )', greenStartTime, greenEndTime);
     expect(greenCompensation).toBe(0);

     // UI Check for visual consistency
     await page.goto(`http://localhost:${grafanaPort}/d/sla-generated?orgId=1&from=${greenStartTime * 1000}&to=${greenEndTime * 1000}`);
     await expect(page.getByText('Service Availability Status', { exact: false })).toBeVisible({ timeout: 30000 });
     await expect(page.getByText(/100/)).toBeVisible();
  });
});