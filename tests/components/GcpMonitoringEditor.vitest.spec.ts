import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import GcpMonitoringEditor from '../../src/components/GcpMonitoringEditor.vue';

describe('GcpMonitoringEditor', () => {
  it('renders correctly', () => {
    const wrapper = mount(GcpMonitoringEditor, {
      props: {
        gcpMonitoring: { projectId: 'my-project', channels: [] },
        errors: {}
      }
    });
    expect(wrapper.find('input[placeholder="e.g. my-gcp-project-id"]').element.value).toBe('my-project');
  });

  it('updates project ID', async () => {
    const wrapper = mount(GcpMonitoringEditor, {
      props: {
        gcpMonitoring: { projectId: '', channels: [] },
        errors: {}
      }
    });
    
    await wrapper.find('input[placeholder="e.g. my-gcp-project-id"]').setValue('new-project');
    expect(wrapper.emitted('update:gcpMonitoring')[0][0]).toEqual({
      projectId: 'new-project',
      channels: []
    });
  });

  it('adds and updates notification channels', async () => {
    const wrapper = mount(GcpMonitoringEditor, {
      props: {
        gcpMonitoring: { projectId: '', channels: [] },
        errors: {}
      }
    });

    await wrapper.find('button.btn-primary').trigger('click');
    
    const updateEvent = wrapper.emitted('update:gcpMonitoring')[0][0];
    expect(updateEvent.channels).toHaveLength(1);
    expect(updateEvent.channels[0]).toEqual({ type: '', labels: {} });
  });

  it('removes notification channels', async () => {
    const wrapper = mount(GcpMonitoringEditor, {
      props: {
        gcpMonitoring: { 
           projectId: '', 
           channels: [{ displayName: 'Test', type: 'email', labels: {} }] 
        },
        errors: {}
      }
    });

    await wrapper.find('button.btn-outline-danger').trigger('click');
    expect(wrapper.emitted('update:gcpMonitoring')[0][0].channels).toHaveLength(0);
  });
});
