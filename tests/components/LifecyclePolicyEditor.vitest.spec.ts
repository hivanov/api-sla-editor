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
})
