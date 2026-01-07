import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RRuleEditor from '../../src/components/RRuleEditor.vue'

describe('RRuleEditor', () => {
  it('renders correctly with empty value', () => {
    const wrapper = mount(RRuleEditor, {
      props: {
        modelValue: '',
      },
    })
    expect(wrapper.find('input[type="text"]').element.value).toBe('')
    // Default state should be WEEKLY frequency
    expect(wrapper.find('select').element.value).toBe('WEEKLY')
  })

  it('parses initial modelValue', () => {
    const wrapper = mount(RRuleEditor, {
      props: {
        modelValue: 'FREQ=DAILY;INTERVAL=2',
      },
    })
    expect(wrapper.find('select').element.value).toBe('DAILY')
    expect(wrapper.find('input[type="number"]').element.value).toBe('2')
  })

  it('updates modelValue when frequency changes', async () => {
    const wrapper = mount(RRuleEditor, {
      props: {
        modelValue: 'FREQ=DAILY',
      },
    })
    await wrapper.find('select').setValue('WEEKLY')
    expect(wrapper.emitted('update:modelValue')[0][0]).toContain('FREQ=WEEKLY')
  })

  it('updates modelValue when days change in WEEKLY', async () => {
    const wrapper = mount(RRuleEditor, {
      props: {
        modelValue: 'FREQ=WEEKLY',
      },
    })
    // Find Monday button (should be the first button in the "Repeat on" section)
    const mondayBtn = wrapper.findAll('button').find(b => b.text() === 'Mon')
    await mondayBtn.trigger('click')
    expect(wrapper.emitted('update:modelValue')[0][0]).toContain('BYDAY=MO')
  })

  it('updates GUI when modelValue changes externally', async () => {
    const wrapper = mount(RRuleEditor, {
      props: {
        modelValue: 'FREQ=DAILY',
      },
    })
    await wrapper.setProps({ modelValue: 'FREQ=WEEKLY;BYDAY=MO' })
    expect(wrapper.find('select').element.value).toBe('WEEKLY')
    const mondayBtn = wrapper.findAll('button').find(b => b.text() === 'Mon')
    expect(mondayBtn.classes()).toContain('btn-primary')
  })

  it('handles manual text input', async () => {
    const wrapper = mount(RRuleEditor, {
      props: {
        modelValue: 'FREQ=DAILY',
      },
    })
    const input = wrapper.find('input[type="text"]')
    await input.setValue('FREQ=MONTHLY;BYMONTHDAY=15')
    expect(wrapper.emitted('update:modelValue')[0][0]).toBe('FREQ=MONTHLY;BYMONTHDAY=15')
    // Check if GUI updated
    expect(wrapper.find('select').element.value).toBe('MONTHLY')
  })
})
