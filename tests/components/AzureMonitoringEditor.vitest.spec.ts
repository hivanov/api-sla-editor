import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import AzureMonitoringEditor from '../../src/components/AzureMonitoringEditor.vue';

describe('AzureMonitoringEditor', () => {
  it('renders correctly', () => {
    const wrapper = mount(AzureMonitoringEditor, {
      props: {
        modelValue: { resourceId: '/sub/123', location: 'westus' },
        errors: {}
      }
    });
    expect(wrapper.find('input[placeholder*="/subscriptions/"]').element.value).toBe('/sub/123');
    expect(wrapper.find('input[placeholder*="eastus"]').element.value).toBe('westus');
  });

  it('updates fields', async () => {
    const wrapper = mount(AzureMonitoringEditor, {
      props: {
        modelValue: { resourceId: '', location: '' },
        errors: {}
      }
    });
    
    await wrapper.find('input[placeholder*="/subscriptions/"]').setValue('/sub/new');
    expect(wrapper.emitted('update:modelValue')[0][0]).toEqual({
      resourceId: '/sub/new',
      location: ''
    });

    await wrapper.find('input[placeholder*="eastus"]').setValue('ukwest');
    expect(wrapper.emitted('update:modelValue')[1][0]).toEqual({
      resourceId: '',
      location: 'ukwest'
    });
  });
});
