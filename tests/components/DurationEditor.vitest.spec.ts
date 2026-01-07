import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DurationEditor from '../../src/components/DurationEditor.vue'

describe('DurationEditor', () => {
  it('renders correctly with modelValue', () => {
    const wrapper = mount(DurationEditor, {
      props: {
        modelValue: 'P1DT4H',
        label: 'Test Duration'
      }
    })
    expect(wrapper.find('label.fw-bold').text()).toBe('Test Duration')
    expect(wrapper.find('input[type="text"]').element.value).toBe('P1DT4H')
    const inputs = wrapper.findAll('input[type="number"]')
    expect(inputs[0].element.value).toBe('1') // Days
    expect(inputs[1].element.value).toBe('4') // Hours
  })

  it('updates modelValue when numeric inputs change', async () => {
    const wrapper = mount(DurationEditor, {
      props: { modelValue: 'P1D' }
    })
    const inputs = wrapper.findAll('input[type="number"]')
    await inputs[1].setValue(5) // Set Hours to 5
    expect(wrapper.emitted('update:modelValue')[0][0]).toBe('P1DT5H')
  })

  it('constrains negative numeric inputs to 0', async () => {
    const wrapper = mount(DurationEditor, {
      props: { modelValue: 'P1D' }
    })
    const inputs = wrapper.findAll('input[type="number"]')
    await inputs[0].setValue(-5) // Try setting Days to -5
    expect(wrapper.emitted('update:modelValue')[0][0]).toBe('') 
  })

  it('handles negative days by clamping to 0', async () => {
    const wrapper = mount(DurationEditor, {
      props: { modelValue: 'P1D' }
    })
    const inputs = wrapper.findAll('input[type="number"]')
    await inputs[0].setValue(-1)
    expect(wrapper.emitted('update:modelValue')[0][0]).toBe('')
  })

  it('handles negative hours by clamping to 0', async () => {
    const wrapper = mount(DurationEditor, {
      props: { modelValue: 'PT2H' }
    })
    const inputs = wrapper.findAll('input[type="number"]')
    await inputs[1].setValue(-10)
    expect(wrapper.emitted('update:modelValue')[0][0]).toBe('')
  })

  it('updates numeric parts when manual text input changes', async () => {
    const wrapper = mount(DurationEditor, {
      props: { modelValue: 'P1D' }
    })
    await wrapper.setProps({ modelValue: 'P2DT5H' })
    const inputs = wrapper.findAll('input[type="number"]')
    expect(inputs[0].element.value).toBe('2')
    expect(inputs[1].element.value).toBe('5')
  })
})
