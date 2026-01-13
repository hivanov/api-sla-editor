import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import GcpMonitoringEditor from '../../src/components/GcpMonitoringEditor.vue';

describe('GcpMonitoringEditor', () => {
  it('renders correctly', () => {
    const wrapper = mount(GcpMonitoringEditor, {
      props: {
        gcpMonitoring: { projectId: 'my-project' },
        errors: {}
      }
    });
    expect(wrapper.find('input[placeholder="e.g. my-gcp-project-id"]').element.value).toBe('my-project');
  });

  it('updates project ID', async () => {
    const wrapper = mount(GcpMonitoringEditor, {
      props: {
        gcpMonitoring: { projectId: '' },
        errors: {}
      }
    });
    
    await wrapper.find('input[placeholder="e.g. my-gcp-project-id"]').setValue('new-project');
    expect(wrapper.emitted('update:gcpMonitoring')[0][0]).toEqual({
      projectId: 'new-project'
    });
  });
});