import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ContextEditor from '../../src/components/ContextEditor.vue'

describe('ContextEditor', () => {
  it('renders the context editor', () => {
    const wrapper = mount(ContextEditor, {
      props: {
        context: { id: 'test-id', type: 'plans' },
      },
    })

    expect(wrapper.find('input#context-id').element.value).toBe('test-id')
    expect((wrapper.find('input#type-plans').element as HTMLInputElement).checked).toBe(true)
    expect((wrapper.find('input#type-agreements').element as HTMLInputElement).checked).toBe(false)
  })

  it('emits update event on ID input', async () => {
    const wrapper = mount(ContextEditor, {
      props: {
        context: { id: 'test-id', type: 'plans' },
      },
    })

    await wrapper.find('input#context-id').setValue('new-id')
    expect(wrapper.emitted('update:context')[0]).toEqual([{ id: 'new-id', type: 'plans' }])
  })

  it('emits update event on Type input', async () => {
    const wrapper = mount(ContextEditor, {
      props: {
        context: { id: 'test-id', type: 'plans' },
      },
    })

    await wrapper.find('input#type-agreements').trigger('change')
    expect(wrapper.emitted('update:context')[0]).toEqual([{ id: 'test-id', type: 'agreements' }])
  })

  it('renders correctly with an empty context', () => {
    const wrapper = mount(ContextEditor, {
      props: {
        context: {},
      },
    })

    expect(wrapper.find('input#context-id').element.value).toBe('')
    expect((wrapper.find('input#type-plans').element as HTMLInputElement).checked).toBe(false)
    expect((wrapper.find('input#type-agreements').element as HTMLInputElement).checked).toBe(false)
  })

  it('displays validation errors correctly', () => {
    const wrapper = mount(ContextEditor, {
      props: {
        context: { id: '', type: '' },
        errors: {
          '/context/id': ['ID is required'],
          '/context/type': ['Type must be one of plans, agreements']
        }
      },
    })

    const idInput = wrapper.find('input#context-id')
    expect(idInput.classes()).toContain('is-invalid')
    expect(wrapper.find('.invalid-feedback').text()).toContain('ID is required')

    const typePlans = wrapper.find('input#type-plans')
    expect(typePlans.classes()).toContain('is-invalid')
    const typeAgreements = wrapper.find('input#type-agreements')
    expect(typeAgreements.classes()).toContain('is-invalid')
    
    // Find all invalid-feedbacks and check if one contains the type error
    const feedbacks = wrapper.findAll('.invalid-feedback')
    expect(feedbacks.some(f => f.text().includes('Type must be one of plans, agreements'))).toBe(true)
  })
})