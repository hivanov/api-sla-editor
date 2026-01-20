import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AvailabilityEditor from '../../src/components/AvailabilityEditor.vue'

describe('AvailabilityEditor', () => {
  const metrics = {
    uptime: { description: 'Uptime' },
    latency: { description: 'Latency' }
  };

  it('renders correctly with default availability (Tier mode)', () => {
    const wrapper = mount(AvailabilityEditor, {
      props: { availability: '99.9%', metrics }
    })
    // In Tier mode, it should show the select with 99.9 selected
    expect(wrapper.find('.tier-select').element.value).toBe('99.9')
  })

  it('updates availability target and keeps metric when percentage input changes (Manual Entry mode)', async () => {
    const wrapper = mount(AvailabilityEditor, {
      props: { availability: { target: '100%', metric: 'uptime', expression: '' }, metrics }
    })
    // Switch to Manual Entry mode
    await wrapper.find('.nav-pills .nav-item:nth-child(2) button').trigger('click')
    
    const input = wrapper.find('.manual-percentage-input');
    await input.setValue('99.5')
    
    const emitted = wrapper.emitted('update:availability');
    expect(emitted).toBeTruthy();
    const lastEmit = emitted[emitted.length - 1][0];
    expect(lastEmit.target).toBe('99.5%');
    expect(lastEmit.metric).toBe('uptime');
    expect(lastEmit.expression).toContain('uptime');
  })

  it('updates metric when metric selector changes', async () => {
    const wrapper = mount(AvailabilityEditor, {
      props: { availability: { target: '99.9%', metric: 'uptime', expression: '' }, metrics }
    });

    const select = wrapper.find('.metric-selector');
    await select.setValue('latency');

    const emitted = wrapper.emitted('update:availability');
    expect(emitted).toBeTruthy();
    const lastEmit = emitted[emitted.length - 1][0];
    expect(lastEmit.target).toBe('99.9%');
    expect(lastEmit.metric).toBe('latency');
    expect(lastEmit.expression).toContain('latency');
  });

  it('updates expression when expression input changes', async () => {
    const wrapper = mount(AvailabilityEditor, {
      props: { availability: { target: '99.9%', metric: 'uptime', expression: 'up == 0' }, metrics }
    });

    // It should be in Raw mode because 'up == 0' doesn't contain '_over_time'
    expect(wrapper.find('textarea').exists()).toBe(true);
    
    const textarea = wrapper.find('textarea');
    await textarea.setValue('up == 1');

    const emitted = wrapper.emitted('update:availability');
    expect(emitted).toBeTruthy();
    const lastEmit = emitted[emitted.length - 1][0];
    expect(lastEmit).toEqual({ target: '99.9%', metric: 'uptime', expression: 'up == 1' });
  });

  it('constrains negative downtime input to 0 (Downtime Duration mode)', async () => {
    const wrapper = mount(AvailabilityEditor, {
      props: { availability: { target: '100%', metric: 'uptime', expression: '' }, metrics },
    })
    // Switch to Downtime Duration mode
    await wrapper.find('.nav-pills .nav-item:nth-child(3) button').trigger('click')

    const daysInput = wrapper.find('.downtime-days')
    await daysInput.setValue(-1)
    
    if (wrapper.emitted('update:availability')) {
      const lastEmitted = wrapper.emitted('update:availability').slice(-1)[0][0]
      expect(lastEmitted.target).toBe('100%')
    }
  })

  it('constrains negative availability percentage input to 0 (Manual Entry mode)', async () => {
    const wrapper = mount(AvailabilityEditor, {
      props: { availability: { target: '99.9%', metric: 'uptime', expression: '' }, metrics }
    })
    // Switch to Manual Entry mode
    await wrapper.find('.nav-pills .nav-item:nth-child(2) button').trigger('click')

    const input = wrapper.find('.manual-percentage-input')
    await input.setValue('-10')
    expect(wrapper.text()).toContain('Availability must be > 0% and <= 100%')
    const emissions = wrapper.emitted('update:availability') || []
    emissions.forEach(e => {
      expect(parseFloat(e[0].target)).toBeGreaterThan(0)
    })
  })

  it('calculates downtime based on percentage (Downtime Duration mode)', async () => {
    const wrapper = mount(AvailabilityEditor, {
      props: { availability: { target: '99.9%', metric: 'uptime', expression: '' }, metrics }
    })
    // Switch to Downtime Duration mode
    await wrapper.find('.nav-pills .nav-item:nth-child(3) button').trigger('click')
    
    // Select daily
    await wrapper.find('.period-select').setValue('day')
    
    expect(wrapper.find('.downtime-mins').element.value).toBe('1')
    expect(wrapper.find('.downtime-secs').element.value).toBe('26')
    expect(wrapper.find('.downtime-ms').element.value).toBe('400')
  })

  it('calculates percentage based on downtime (Downtime Duration mode)', async () => {
    const wrapper = mount(AvailabilityEditor, {
      props: { availability: { target: '100%', metric: 'uptime', expression: '' }, metrics }
    })
    // Switch to Downtime Duration mode
    await wrapper.find('.nav-pills .nav-item:nth-child(3) button').trigger('click')
    
    await wrapper.find('.period-select').setValue('day')
    await wrapper.find('.downtime-hours').setValue('1')
    
    const emitted = wrapper.emitted('update:availability')
    const lastEmitted = emitted[emitted.length - 1][0]
    expect(lastEmitted.target).toContain('95.833333333%')
  })

  it('calculates availability via Deployment Calculator', async ({ page }) => {
    const wrapper = mount(AvailabilityEditor, {
      props: { availability: { target: '100%', metric: 'uptime', expression: '' }, metrics }
    })
    // Switch to Deployment Calculator mode
    await wrapper.find('.nav-pills .nav-item:nth-child(4) button').trigger('click')
    
    await wrapper.find('.deployment-count').setValue(2)
    await wrapper.find('.deployment-mins').setValue(30)
    
    const emitted = wrapper.emitted('update:availability')
    const lastEmitted = emitted[emitted.length - 1][0]
    expect(lastEmitted.target).toBe('99.702380952%')
  })

  it('handles 1ms precision (Downtime Duration mode)', async () => {
    const wrapper = mount(AvailabilityEditor, {
      props: { availability: { target: '100%', metric: 'uptime', expression: '' }, metrics }
    })
    // Switch to Downtime Duration mode
    await wrapper.find('.nav-pills .nav-item:nth-child(3) button').trigger('click')
    
    await wrapper.find('.period-select').setValue('year')
    await wrapper.find('.downtime-ms').setValue('1')
    
    const emitted = wrapper.emitted('update:availability')
    const lastEmitted = emitted[emitted.length - 1][0]
    expect(parseFloat(lastEmitted.target)).toBeLessThan(100)
    expect(parseFloat(lastEmitted.target)).toBeGreaterThan(99.99999999)
  })

  it('updates availability when a common tier is selected', async () => {
    const wrapper = mount(AvailabilityEditor, {
      props: { availability: { target: '100%', metric: 'uptime', expression: '' }, metrics }
    })
    
    await wrapper.find('.tier-select').setValue('99.9')
    const emitted = wrapper.emitted('update:availability');
    expect(emitted[emitted.length - 1][0].target).toBe('99.9%')
  })

  it('syncs availability metric to PrometheusMeasurementEditor and disables its selector', async () => {
    const wrapper = mount(AvailabilityEditor, {
      props: { availability: { target: '100%', metric: 'uptime', expression: 'avg_over_time(uptime[5m]) < 1' }, metrics }
    })
    
    // It should be in structured mode because expression contains '_over_time'
    expect(wrapper.findComponent({ name: 'PrometheusMeasurementEditor' }).exists()).toBe(true);
    
    const promEditor = wrapper.findComponent({ name: 'PrometheusMeasurementEditor' });
    const metricSelect = promEditor.find('.metric-select');
    
    expect(metricSelect.element.value).toBe('uptime');
    expect(metricSelect.element.disabled).toBe(true);
    
    // Change availability metric
    await wrapper.find('.metric-selector').setValue('latency');
    
    // Expression should update to use latency
    const emitted = wrapper.emitted('update:availability');
    const lastEmit = emitted[emitted.length - 1][0];
    expect(lastEmit.metric).toBe('latency');
    expect(lastEmit.expression).toContain('latency');
    expect(metricSelect.element.value).toBe('latency');
  });
})