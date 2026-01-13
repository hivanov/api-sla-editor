import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import MarkdownEditor from '../../src/components/MarkdownEditor.vue';

describe('MarkdownEditor', () => {
  it('renders textarea in write mode by default', () => {
    const wrapper = mount(MarkdownEditor, {
      props: {
        modelValue: '# Hello',
        placeholder: 'Enter text'
      }
    });
    const textarea = wrapper.find('textarea');
    expect(textarea.exists()).toBe(true);
    expect(textarea.element.value).toBe('# Hello');
    expect(textarea.attributes('placeholder')).toBe('Enter text');
    expect(wrapper.find('.markdown-preview').exists()).toBe(false);
  });

  it('emits update:modelValue when typing', async () => {
    const wrapper = mount(MarkdownEditor, {
      props: {
        modelValue: ''
      }
    });
    const textarea = wrapper.find('textarea');
    await textarea.setValue('New content');
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['New content']);
  });

  it('switches to preview mode and renders markdown', async () => {
    const wrapper = mount(MarkdownEditor, {
      props: {
        modelValue: '# Header\n**Bold**'
      }
    });
    
    // Click Preview tab
    await wrapper.find('a.nav-link:not(.active)').trigger('click');
    
    expect(wrapper.find('textarea').exists()).toBe(false);
    const preview = wrapper.find('.markdown-preview');
    expect(preview.exists()).toBe(true);
    expect(preview.html()).toContain('<h1>Header</h1>');
    expect(preview.html()).toContain('<strong>Bold</strong>');
  });

  it('switches back to write mode', async () => {
    const wrapper = mount(MarkdownEditor, {
      props: { modelValue: '' }
    });
    
    // Switch to preview
    await wrapper.findAll('a.nav-link')[1].trigger('click');
    expect(wrapper.vm.preview).toBe(true);

    // Switch to write
    await wrapper.findAll('a.nav-link')[0].trigger('click');
    expect(wrapper.vm.preview).toBe(false);
    expect(wrapper.find('textarea').exists()).toBe(true);
  });

  it('applies bold formatting', async () => {
    const wrapper = mount(MarkdownEditor, {
      props: { modelValue: 'hello world' }
    });
    
    const textarea = wrapper.find('textarea').element;
    textarea.setSelectionRange(0, 5); // Select 'hello'
    
    await wrapper.find('button[title="Bold"]').trigger('click');
    
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['**hello** world']);
  });

  it('applies italic formatting', async () => {
    const wrapper = mount(MarkdownEditor, {
      props: { modelValue: 'hello world' }
    });
    
    const textarea = wrapper.find('textarea').element;
    textarea.setSelectionRange(6, 11); // Select 'world'
    
    await wrapper.find('button[title="Italic"]').trigger('click');
    
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['hello *world*']);
  });
});
