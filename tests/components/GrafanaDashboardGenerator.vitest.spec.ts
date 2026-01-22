import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import GrafanaDashboardGenerator from '../../src/components/GrafanaDashboardGenerator.vue';

// Mock Ace
vi.mock('ace-builds', () => ({
  default: {
    edit: () => ({
      setTheme: vi.fn(),
      session: {
        setMode: vi.fn(),
        setValue: vi.fn(),
        on: vi.fn(),
      },
      setReadOnly: vi.fn(),
      setValue: vi.fn(),
      getValue: vi.fn(),
    }),
    require: () => ({ Range: vi.fn() }),
  }
}));
vi.mock('ace-builds/src-noconflict/mode-json', () => ({}));
vi.mock('ace-builds/src-noconflict/mode-yaml', () => ({}));
vi.mock('ace-builds/src-noconflict/theme-monokai', () => ({}));

describe('GrafanaDashboardGenerator', () => {
  const sampleSla = {
    sla: '1.0.0',
    metrics: {
      uptime: { monitoringId: 'up', unit: 'percent', description: 'Uptime' }
    },
    plans: {
      standard: {
        name: 'Standard',
        availability: { target: '99.9%', metric: 'uptime', expression: 'up == 1' },
        guarantees: [
          { measurement: 'uptime >= 99.9' }
        ]
      }
    }
  };

  it('renders correctly', () => {
    const wrapper = mount(GrafanaDashboardGenerator, {
      props: { sla: sampleSla }
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('h4').text()).toContain('Grafana Dashboard Generator');
  });

  it('generates dashboard JSON on mount', async () => {
    const wrapper = mount(GrafanaDashboardGenerator, {
      props: { sla: sampleSla }
    });
    
    // Trigger generation logic is called on mount
    const json = wrapper.vm.generatedCode;
    expect(json).toContain('"title": "SLA Dashboard"');
    // Default datasource name
    expect(json).toContain('"uid": "Prometheus"');
    
    const dashboard = JSON.parse(json);
    expect(dashboard.panels.length).toBeGreaterThan(1); 
    // Should have Availability Panel
    const avPanel = dashboard.panels.find(p => p.title.includes('Service Availability Status'));
    expect(avPanel).toBeDefined();
    expect(avPanel.targets[0].expr).toBe('avg_over_time((up == bool 1)[1h:]) * 100');
  });

  it('generates alert rules correctly', async () => {
    const wrapper = mount(GrafanaDashboardGenerator, {
      props: { sla: sampleSla }
    });

    wrapper.vm.activeTab = 'alerts';
    await wrapper.vm.$nextTick();

    const yaml = wrapper.vm.generatedCode;
    expect(yaml).toContain('alert: SlaBreach_uptime');
    // For regular guarantees, it still uses inversion and toPromQL
    expect(yaml).toContain('expr: up < 99.9'); 
  });

  it('generates availability alert correctly', async () => {
    const wrapper = mount(GrafanaDashboardGenerator, {
      props: { sla: sampleSla }
    });

    wrapper.vm.activeTab = 'alerts';
    await wrapper.vm.$nextTick();

    const yaml = wrapper.vm.generatedCode;
    expect(yaml).toContain('alert: SlaBreach_standard_Availability');
    expect(yaml).toContain('expr: avg_over_time((up == bool 1)[5m:]) * 100 < 99.9');
  });

  it('generates thresholds correctly', () => {
    const wrapper = mount(GrafanaDashboardGenerator, {
      props: { sla: sampleSla }
    });

    const json = wrapper.vm.generatedCode;
    const dashboard = JSON.parse(json);
    // Find the guarantee panel (Status)
    const statusPanel = dashboard.panels.find(p => p.title === 'Uptime Status');
    const thresholds = statusPanel.fieldConfig.defaults.thresholds.steps;
    
    // >= 99.9
    // Red (null), Green (99.9)
    expect(thresholds).toEqual([
      { value: null, color: 'red' },
      { value: 99.9, color: 'green' }
    ]);
  });

  it('generates warning thresholds for lower-is-better', async () => {
    const slaLowBetter = {
      ...sampleSla,
      plans: {
        standard: {
          guarantees: [
            { measurement: 'uptime < 200' }
          ]
        }
      }
    };
    
    const wrapper = mount(GrafanaDashboardGenerator, {
      props: { sla: slaLowBetter }
    });

    const json = wrapper.vm.generatedCode;
    const dashboard = JSON.parse(json);
     const statusPanel = dashboard.panels.find(p => p.title === 'Uptime Status');
    const thresholds = statusPanel.fieldConfig.defaults.thresholds.steps;
    
    // < 200
    // Green (null), Yellow (150), Red (200)
    expect(thresholds).toEqual([
      { value: null, color: 'green' },
      { value: 150, color: 'orange' },
      { value: 200, color: 'red' }
    ]);
  });

  it('generates compensation panel correctly', () => {
    const slaWithCredits = {
        ...sampleSla,
        plans: {
            standard: {
                guarantees: [],
                'serviceCredits': {
                    currency: 'USD',
                    claimWindow: 'P1M',
                    tiers: [
                        {
                            condition: { metric: 'uptime', operator: '<', value: '99.9', floor: '99.0' },
                            compensation: 10
                        },
                        {
                            condition: { metric: 'uptime', operator: '<', value: '99.0' },
                            compensation: 25
                        }
                    ]
                }
            }
        }
    };

    const wrapper = mount(GrafanaDashboardGenerator, {
        props: { sla: slaWithCredits }
    });

    const json = wrapper.vm.generatedCode;
    const dashboard = JSON.parse(json);
    
    // Should have text panel + compensation stat panel
    const compPanel = dashboard.panels.find(p => p.title === 'Estimated Compensation Liability');
    expect(compPanel).toBeDefined();
    
    const expr = compPanel.targets[0].expr;
    // Tier 1: up < 99.9 (floor 99.0) -> (up < bool 99.9) * (up >= bool 99.0) * 10
    expect(expr).toContain('((up < bool 99.9) * (up >= bool 99.0)) * 10');
    // Tier 2: up < 99.0 -> (up < bool 99.0) * 25
    expect(expr).toContain('(up < bool 99.0) * 25');
  });

  it('generates contact points in alert yaml', async () => {
      const slaWithContacts = {
          ...sampleSla,
          plans: {
              standard: {
                  guarantees: [],
                  'supportPolicy': {
                      contactPoints: [
                          {
                              contactType: 'DevOps',
                              channels: [
                                  { type: 'email', url: 'mailto:devops@example.com' }
                              ]
                          }
                      ]
                  }
              }
          }
      };

      const wrapper = mount(GrafanaDashboardGenerator, {
          props: { sla: slaWithContacts }
      });

      wrapper.vm.activeTab = 'alerts';
      await wrapper.vm.$nextTick();
      
      const yaml = wrapper.vm.generatedCode;
      expect(yaml).toContain('contactPoints:');
      expect(yaml).toContain('name: DevOps (email)');
      expect(yaml).toContain('addresses: devops@example.com');
      expect(yaml).toContain('policies:');
      expect(yaml).toContain('receiver: DevOps (email)');
  });
});
