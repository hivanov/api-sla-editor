import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import HelpPage from '../../src/components/HelpPage.vue';

describe('HelpPage', () => {
  it('renders correctly', () => {
    const wrapper = mount(HelpPage);
    expect(wrapper.find('h2').text()).toBe('SLA Editor Help');
    expect(wrapper.findAll('.accordion-item').length).toBeGreaterThan(0);
  });

  it('renders markdown in detailed explanation', () => {
    const wrapper = mount(HelpPage);
    // Find first accordion body (it might be hidden but v-html is in DOM)
    const markdownBody = wrapper.find('.markdown-body');
    expect(markdownBody.exists()).toBe(true);
    
    // Check if markdown was rendered (e.g. bold tags for **Plan**)
    // We look at the data to see what we expect
    const firstItem = wrapper.vm.helpItems[0];
    if (firstItem.detail.includes('**')) {
        expect(markdownBody.html()).toContain('<strong>');
    }
  });

  it('emits close event when button is clicked', async () => {
    const wrapper = mount(HelpPage);
    await wrapper.find('button.btn-primary').trigger('click');
    expect(wrapper.emitted()).toHaveProperty('close');
  });
});
