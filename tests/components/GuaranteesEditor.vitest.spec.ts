import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GuaranteesEditor from '../../src/components/GuaranteesEditor.vue'

describe('GuaranteesEditor', () => {
  it('renders correctly with guarantees in legacy mode', () => {
    const wrapper = mount(GuaranteesEditor, {
      props: {
        guarantees: [{ metric: 'uptime', limit: '99.9%' }],
        metrics: { uptime: { type: 'number' } }
      },
    })
    expect(wrapper.text()).toContain('Guarantees')
    expect(wrapper.find('select.form-select').element.value).toBe('uptime')
    
    // In legacy mode, only one duration input (limit) should be visible
    const durationInputs = wrapper.findAll('input[placeholder="e.g. P1DT4H"]')
    expect(durationInputs.length).toBe(1)
    expect(durationInputs[0].element.value).toBe('99.9%')
    
    // Verify legacy radio is checked
    const legacyRadio = wrapper.find('input[type="radio"][id^="mode-legacy"]')
    expect(legacyRadio.element.checked).toBe(true)
  })

  it('renders correctly with guarantees in structured mode', () => {
    const wrapper = mount(GuaranteesEditor, {
      props: {
        guarantees: [{ metric: 'latency', operator: '<', value: '100ms' }],
        metrics: { latency: { type: 'number' } }
      },
    })
    
    // In structured mode, we expect operator/value inputs and period input
    const operatorSelect = wrapper.findAll('select.form-select')[1] // 0 is metric, 1 is operator
    expect(operatorSelect.element.value).toBe('<')
    
    const valueInput = wrapper.find('input[placeholder="e.g. 5 or 6 and 12"]')
    expect(valueInput.element.value).toBe('100ms')
    
    // Verify structured radio is checked
    const structuredRadio = wrapper.find('input[type="radio"][id^="mode-structured"]')
    expect(structuredRadio.element.checked).toBe(true)
  })

  it('adds a guarantee', async () => {
    const wrapper = mount(GuaranteesEditor, {
      props: { guarantees: [], metrics: { uptime: { type: 'number' } } },
    })
    await wrapper.find('button.btn-secondary').trigger('click')
    expect(wrapper.emitted('update:guarantees')[0][0]).toEqual([{ metric: '' }])
  })

  it('switches mode', async () => {
    const wrapper = mount(GuaranteesEditor, {
      props: { 
        guarantees: [{ metric: 'uptime', limit: '99.9%' }],
        metrics: { uptime: { type: 'number' } }
      },
    })

    // Switch to structured
    const structuredRadio = wrapper.find('input[type="radio"][id^="mode-structured"]')
    await structuredRadio.setValue(true) // trigger change
    
    // Should emit update with limit removed
    const emitted = wrapper.emitted('update:guarantees')[0][0][0]
    expect(emitted.limit).toBeUndefined()
    expect(emitted.metric).toBe('uptime')
    
    // And logically operator/value/period are now undefined (cleared/not present yet)
  })

  it('updates a guarantee', async () => {
    const wrapper = mount(GuaranteesEditor, {
      props: { 
        guarantees: [{ metric: '', limit: '' }],
        metrics: { latency: { type: 'integer' } }
      },
    })
    await wrapper.find('select.form-select').setValue('latency')
    expect(wrapper.emitted('update:guarantees')[0][0]).toEqual([{ metric: 'latency', limit: '' }])
  })

  it('removes a guarantee', async () => {
    const wrapper = mount(GuaranteesEditor, {
      props: { 
        guarantees: [{ metric: 'uptime', limit: '99.9' }],
        metrics: { uptime: { type: 'number' } }
      },
    })
    await wrapper.find('button.btn-outline-danger').trigger('click')
    expect(wrapper.emitted('update:guarantees')[0][0]).toEqual([])
  })

  it('displays validation errors for specific guarantees', () => {
    const wrapper = mount(GuaranteesEditor, {
      props: {
        guarantees: [{ metric: '', limit: 'invalid' }],
        metrics: { uptime: { type: 'number' } },
        path: '/plans/gold/guarantees',
        errors: {
          '/plans/gold/guarantees/0/metric': ['Metric is required'],
          '/plans/gold/guarantees/0/limit': ['Invalid duration format']
        }
      },
    })

    const metricSelect = wrapper.find('select.form-select')
    expect(metricSelect.classes()).toContain('is-invalid')
    
    // In legacy mode, only 1 duration input (limit)
    const durationInput = wrapper.find('input[placeholder="e.g. P1DT4H"]')
    expect(durationInput.classes()).toContain('is-invalid')
    
    expect(wrapper.text()).toContain('Metric is required')
    expect(wrapper.text()).toContain('Invalid duration format')
  })
})
