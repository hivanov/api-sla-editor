import { test, expect } from '@playwright/test';
import { GenericContainer, Network, Wait } from 'testcontainers';

test.describe('Grafana Integration with Testcontainers', () => {
  // Set timeout to 5 minutes for container startup
  test.setTimeout(300_000);

  let network;
  let mockService;
  let prometheus;
  let grafana;
  let grafanaPort;
  
  test.beforeAll(async () => {
    // 1. Create Network
    network = await new Network().start();

    // 2. Mock Service (Node Script)
    // Increments counters to simulate activity for rate() queries
    const script = `
    const http = require('http');
    let count = 0;
    const server = http.createServer((req, res) => {
        if (req.url === '/metrics') {
            count += 100; 
            // Simple metrics matching the SLA example queries
            const metrics = [
                '# TYPE up gauge',
                'up{job="my-service"} 1',
                
                '# TYPE http_requests_total counter',
                'http_requests_total{status="200"} ' + count + '\\n',
                'http_requests_total{status="500"} 0', // No errors
                
                '# TYPE http_request_duration_seconds histogram',
                'http_request_duration_seconds_bucket{le="0.1"} ' + count + '\\n',
                'http_request_duration_seconds_bucket{le="+Inf"} ' + count + '\\n',
                'http_request_duration_seconds_sum ' + (count * 0.05) + '\\n',
                'http_request_duration_seconds_count ' + count + '\\n'
            ].join('\n');
            
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end(metrics);
        } else {
            res.writeHead(404);
            res.end();
        }
    });
    server.listen(3000, () => console.log('Metrics server listening on 3000\n'));
    `;
    
    mockService = await new GenericContainer('node:18-alpine')
      .withNetwork(network)
      .withNetworkAliases('mock-service')
      .withCopyContentToContainer([{
          content: script,
          target: '/tmp/server.js'
      }])
      .withCommand(['node', '/tmp/server.js'])
      .withExposedPorts(3000)
      .withWaitStrategy(Wait.forListeningPorts())
      .start();

    // 3. Prometheus
    const promConfig = `
global:
  scrape_interval: 1s
scrape_configs:
  - job_name: 'my-service'
    static_configs:
      - targets: ['mock-service:3000']
    `;
    
    prometheus = await new GenericContainer('prom/prometheus:latest')
      .withNetwork(network)
      .withNetworkAliases('prometheus')
      .withCopyContentToContainer([{
          content: promConfig,
          target: '/etc/prometheus/prometheus.yml'
      }])
      .start();

    // 4. Grafana
    grafana = await new GenericContainer('grafana/grafana:latest')
      .withNetwork(network)
      .withExposedPorts(3000)
      .withEnvironment({
          'GF_SECURITY_ADMIN_PASSWORD': 'admin',
          // 'GF_AUTH_ANONYMOUS_ENABLED': 'true'
      })
      .withWaitStrategy(Wait.forLogMessage("HTTP Server Listen"))
      .start();

    grafanaPort = grafana.getMappedPort(3000);
    
    // Configure Datasource
    const dsPayload = {
        name: 'Prometheus',
        type: 'prometheus',
        url: 'http://prometheus:9090',
        access: 'proxy',
        isDefault: true
    };
    
    // Wait a bit for Grafana API to be fully ready
    await new Promise(r => setTimeout(r, 5000));

    await fetch(`http://localhost:${grafanaPort}/api/datasources`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa('admin:admin')
        },
        body: JSON.stringify(dsPayload)
    });
  }, 300_000);

  test.afterAll(async () => {
      if (grafana) await grafana.stop();
      if (prometheus) await prometheus.stop();
      if (mockService) await mockService.stop();
      if (network) await network.stop();
  }, 300_000);

  test('generates and deploys dashboard to live Grafana', async ({ page }) => {
     // 1. Get Dashboard JSON from App
     await page.goto('/');
     await page.selectOption('select.form-select', 'grafana-prometheus-sample');
     await page.click('button:has-text("Transform")');
     await page.click('a:has-text("Generate Grafana (Prometheus)")');
     
     // Trigger Generate
     await page.click('button:has-text("Generate")');
     
     // Wait for Ace editor to have content.
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
     dashboard.id = null;
     dashboard.uid = 'sla-generated';
     dashboard.title = 'Integration Test Dashboard';
     
     const response = await fetch(`http://localhost:${grafanaPort}/api/dashboards/db`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa('admin:admin')
        },
        body: JSON.stringify({
            dashboard: dashboard,
            overwrite: true
        })
    });
    expect(response.status).toBe(200);

    // 3. Inspect in Grafana
    await page.goto(`http://localhost:${grafanaPort}/d/sla-generated`);
    
    // Login
    await page.fill('input[name="user"]', 'admin');
    await page.fill('input[name="password"]', 'admin');
    await page.click('button[type="submit"]'); 
    
    // Wait for dashboard
    // Check for the "Estimated Compensation Liability" panel
    // It might take time for data to load
    await expect(page.getByText('Estimated Compensation Liability')).toBeVisible({ timeout: 20000 });
    
    // Check specific value? 
    // Up = 1 (100%). Guarantee < 99.9. Condition Met?
    // 100 < 99.9 is FALSE.
    // So Compensation = 0.
    // The Stat panel should show "0" (or "$0").
    
    // Grafana Stat panel renders values in a specific div. 
    // We can just assert the panel is there.
    // Maybe check for "Service Uptime Status"
    await expect(page.getByText('Service Uptime Status')).toBeVisible();
    
    // Take a screenshot for artifact purposes (optional but good for debugging)
    // await page.screenshot({ path: 'grafana-dashboard.png' });
  });
});
