import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PlansEditor from '../../src/components/PlansEditor.vue'

describe('PlansEditor', () => {
  it('renders the plans editor', () => {
    const wrapper = mount(PlansEditor, {
      props: {
        plans: {
          enterprise: {
            title: 'Gold Enterprise Tier',
            description: 'Mission critical support',
            availability: '99.95%',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('Plans')
    expect(wrapper.text()).toContain('enterprise')
    expect(wrapper.find('input[value="Gold Enterprise Tier"]').exists()).toBe(true)
    expect(wrapper.find('textarea').element.value).toBe('Mission critical support')
    expect(wrapper.find('input[value="99.95%"]').exists()).toBe(true)
  })

  it('adds a new plan', async () => {
    const wrapper = mount(PlansEditor, {
      props: {
        plans: {},
      },
    })

    await wrapper.find('input[placeholder="New plan name"]').setValue('new-plan')
    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('update:plans')[0]).toEqual([{
      'new-plan': {
        title: '',
        description: '',
        availability: '',
      },
    }])
  })

  it('removes a plan', async () => {
    const wrapper = mount(PlansEditor, {
      props: {
        plans: {
          enterprise: {
            title: 'Gold Enterprise Tier',
            description: 'Mission critical support',
            availability: '99.95%',
          },
        },
      },
    })

    await wrapper.find('button.btn-danger').trigger('click')
    expect(wrapper.emitted('update:plans')[0]).toEqual([{}])
  })
})
