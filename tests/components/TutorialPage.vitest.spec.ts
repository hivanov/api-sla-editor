import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TutorialPage from '../../src/components/TutorialPage.vue';

describe('TutorialPage', () => {
  it('renders correctly', () => {
    const wrapper = mount(TutorialPage);
    expect(wrapper.find('h2').text()).toBe('SLA Editor Tutorial');
  });

  it('includes the Pet Store API example', () => {
    const wrapper = mount(TutorialPage);
    expect(wrapper.text()).toContain('Pet Store API');
    expect(wrapper.text()).toContain('Free Tier');
    expect(wrapper.text()).toContain('Pro Tier');
    expect(wrapper.text()).toContain('Advanced Policies (Support & Lifecycle)');
    expect(wrapper.text()).toContain('Data Retention');
    expect(wrapper.text()).toContain('Source tab');
  });

  it('emits close event when button is clicked', async () => {
    const wrapper = mount(TutorialPage);
    await wrapper.find('button.btn-primary').trigger('click');
    expect(wrapper.emitted()).toHaveProperty('close');
  });
});
