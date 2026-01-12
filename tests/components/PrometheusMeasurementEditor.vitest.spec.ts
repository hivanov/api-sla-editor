import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import PrometheusMeasurementEditor from '../../src/components/PrometheusMeasurementEditor.vue';

describe('PrometheusMeasurementEditor', () => {
  const metrics = {
    requests: { type: 'integer' },
    latency: { type: 'number' }
  };

  it('renders correctly with default values', () => {
    const wrapper = mount(PrometheusMeasurementEditor, {
      props: {
        modelValue: '',
        metrics
      }
    });
    expect(wrapper.find('select').exists()).toBe(true);
    // Default function is avg_over_time
    expect(wrapper.find('select').element.value).toBe('avg_over_time');
  });

  it('parses a PromQL-like string correctly', async () => {
    const wrapper = mount(PrometheusMeasurementEditor, {
      props: {
        modelValue: 'max_over_time(latency[10m]) >= 500',
        metrics
      }
    });
    
    const state = wrapper.vm.state;
    expect(state.func).toBe('max_over_time');
    expect(state.metric).toBe('latency');
    expect(state.windowValue).toBe('10');
    expect(state.windowUnit).toBe('m');
    expect(state.operator).toBe('>=');
    expect(state.value).toBe('500');
  });

  it('parses quantile_over_time correctly', async () => {
    const wrapper = mount(PrometheusMeasurementEditor, {
      props: {
        modelValue: 'quantile_over_time(0.95, requests[1h]) < 100',
        metrics
      }
    });
    
    const state = wrapper.vm.state;
    expect(state.func).toBe('quantile_over_time');
    expect(state.quantile).toBe('0.95');
    expect(state.metric).toBe('requests');
    expect(state.windowValue).toBe('1');
    expect(state.windowUnit).toBe('h');
  });

  it('parses histogram_quantile correctly', async () => {
    const wrapper = mount(PrometheusMeasurementEditor, {
      props: {
        modelValue: 'histogram_quantile(0.99, sum by (le) (rate(latency[5m]))) < 200',
        metrics
      }
    });
    
    const state = wrapper.vm.state;
    expect(state.func).toBe('histogram_quantile');
    expect(state.quantile).toBe('0.99');
    expect(state.metric).toBe('latency');
    expect(state.windowValue).toBe('5');
    expect(state.windowUnit).toBe('m');
  });

  it('emits updated string when fields change', async () => {
    const wrapper = mount(PrometheusMeasurementEditor, {
      props: {
        modelValue: '',
        metrics
      }
    });

    await wrapper.find('select.form-select-sm').setValue('sum_over_time');
    // The metric select is the second one if quantile is hidden
    const selects = wrapper.findAll('select');
    await selects[1].setValue('requests');
    
    const inputs = wrapper.findAll('input');
    await inputs[0].setValue('15'); // windowValue
    
    await wrapper.find('input[placeholder*="e.g. 15"]').setValue('1000');

    const emitted = wrapper.emitted('update:modelValue');
    expect(emitted).toBeTruthy();
    // last emitted value should be the formatted string
    const lastEmitted = emitted[emitted.length - 1][0];
    expect(lastEmitted).toContain('sum_over_time(requests[15m])');
    expect(lastEmitted).toContain('1000');
  });
});
