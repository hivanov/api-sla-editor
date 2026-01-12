import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LifecyclePolicyEditor from '../../src/components/LifecyclePolicyEditor.vue'

describe('LifecyclePolicyEditor', () => {
  it('renders correctly', () => {
    const wrapper = mount(LifecyclePolicyEditor, {
      props: {
        lifecyclePolicy: { autoRenewal: true, minimumTerm: 'P1Y' },
      },
    })
    expect(wrapper.text()).toContain('Lifecycle Policy')
    expect(wrapper.find('#autoRenewal').element.checked).toBe(true)
  })

  it('updates autoRenewal', async () => {
    const wrapper = mount(LifecyclePolicyEditor, {
      props: { lifecyclePolicy: { autoRenewal: false } },
    })
    await wrapper.find('#autoRenewal').setValue(true)
    expect(wrapper.emitted('update:lifecyclePolicy')[0][0].autoRenewal).toBe(true)
  })

  it('handles null lifecyclePolicy prop', () => {
    const wrapper = mount(LifecyclePolicyEditor, {
      props: { lifecyclePolicy: null },
    })
    expect(wrapper.find('#autoRenewal').exists()).toBe(true)
  })

  it('displays validation errors', () => {
    const wrapper = mount(LifecyclePolicyEditor, {
      props: {
        lifecyclePolicy: { 
          minimumTerm: 'invalid', 
          noticePeriod: 'invalid',
          dataRetention: { afterTermination: 'invalid' }
        },
        errors: {
          '/plans/gold/x-lifecycle-policy/minimumTerm': ['Invalid term'],
          '/plans/gold/x-lifecycle-policy/noticePeriod': ['Invalid notice period'],
          '/plans/gold/x-lifecycle-policy/dataRetention/afterTermination': ['Invalid retention']
        },
        path: '/plans/gold/x-lifecycle-policy'
      },
    })

    const durationInputs = wrapper.findAll('input[placeholder="e.g. P1DT4H"]')
    expect(durationInputs[0].classes()).toContain('is-invalid') // minimumTerm
    expect(durationInputs[1].classes()).toContain('is-invalid') // noticePeriod
    expect(durationInputs[2].classes()).toContain('is-invalid') // dataRetention
    
    expect(wrapper.text()).toContain('Invalid term')
    expect(wrapper.text()).toContain('Invalid notice period')
    expect(wrapper.text()).toContain('Invalid retention')
  })
})
