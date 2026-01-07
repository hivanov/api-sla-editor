import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ExclusionsEditor from '../../src/components/ExclusionsEditor.vue'

describe('ExclusionsEditor', () => {
  it('renders correctly', () => {
    const wrapper = mount(ExclusionsEditor, {
      props: {
        exclusions: ['Network failure'],
      },
    })
    expect(wrapper.text()).toContain('SLA Exclusions')
    expect(wrapper.find('input[placeholder="Exclusion description"]').element.value).toBe('Network failure')
  })

  it('adds an exclusion', async () => {
    const wrapper = mount(ExclusionsEditor, {
      props: { exclusions: [] },
    })
    await wrapper.find('button.btn-secondary').trigger('click')
    expect(wrapper.emitted('update:exclusions')[0][0]).toEqual([''])
  })

  it('handles null exclusions prop', () => {
    const wrapper = mount(ExclusionsEditor, {
      props: { exclusions: null },
    })
    expect(wrapper.findAll('input').length).toBe(0)
  })
})
