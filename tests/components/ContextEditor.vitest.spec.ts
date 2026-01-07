import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ContextEditor from '../../src/components/ContextEditor.vue'

describe('ContextEditor', () => {
  it('renders the context editor', () => {
    const wrapper = mount(ContextEditor, {
      props: {
        context: { id: 'test-id', type: 'test-type' },
      },
    })

    expect(wrapper.text()).toContain('Context')
    expect(wrapper.find('input#context-id').element.value).toBe('test-id')
    expect(wrapper.find('input#context-type').element.value).toBe('test-type')
  })

  it('emits update event on ID input', async () => {
    const wrapper = mount(ContextEditor, {
      props: {
        context: { id: 'test-id', type: 'test-type' },
      },
    })

    await wrapper.find('input#context-id').setValue('new-id')
    expect(wrapper.emitted('update:context')[0]).toEqual([{ id: 'new-id', type: 'test-type' }])
  })

  it('emits update event on Type input', async () => {
    const wrapper = mount(ContextEditor, {
      props: {
        context: { id: 'test-id', type: 'test-type' },
      },
    })

    await wrapper.find('input#context-type').setValue('agreements')
    expect(wrapper.emitted('update:context')[0]).toEqual([{ id: 'test-id', type: 'agreements' }])
  })

  it('renders correctly with an empty context', () => {
    const wrapper = mount(ContextEditor, {
      props: {
        context: {},
      },
    })

    expect(wrapper.text()).toContain('Context')
    expect(wrapper.find('input#context-id').element.value).toBe('')
    expect(wrapper.find('input#context-type').element.value).toBe('')
  })
})
