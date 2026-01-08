import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import PolicyDescription from '../../src/components/PolicyDescription.vue';

describe('PolicyDescription.vue', () => {
  it('renders summary information', () => {
    const sla = {
      sla: '1.0.0',
      context: { id: 'test-id', type: 'plans' },
      plans: {}
    };
    const wrapper = mount(PolicyDescription, {
      props: { sla }
    });
    
    expect(wrapper.text()).toContain('Policy ID: test-id');
    expect(wrapper.text()).toContain('SLA Version: 1.0.0');
    expect(wrapper.text()).toContain('Type: Plans');
  });

  it('renders plans correctly', () => {
    const sla = {
      sla: '1.0.0',
      context: { id: 'test-id', type: 'plans' },
      plans: {
        basic: {
          title: 'Basic Plan',
          description: 'A simple plan',
          availability: '99%'
        }
      }
    };
    const wrapper = mount(PolicyDescription, {
      props: { sla }
    });
    
    expect(wrapper.text()).toContain('Basic Plan');
    expect(wrapper.text()).toContain('A simple plan');
    expect(wrapper.text()).toContain('Guaranteed uptime: 99%');
  });

  it('handles empty plans gracefully', () => {
    const sla = {
      sla: '1.0.0',
      context: { id: 'test-id', type: 'plans' },
      plans: {}
    };
    const wrapper = mount(PolicyDescription, {
      props: { sla }
    });
    
    expect(wrapper.text()).toContain('No plans defined in this SLA.');
  });

  it('filters out empty plan names', () => {
    const sla = {
      sla: '1.0.0',
      context: { id: 'test-id', type: 'plans' },
      plans: {
        '': { availability: '99%' },
        'valid': { availability: '95%' }
      }
    };
    const wrapper = mount(PolicyDescription, {
      props: { sla }
    });
    
    expect(wrapper.text()).toContain('valid');
    expect(wrapper.text()).toContain('Total Plans: 1');
  });
});
