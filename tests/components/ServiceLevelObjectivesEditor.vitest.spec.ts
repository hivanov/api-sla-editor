import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ServiceLevelObjectivesEditor from '../../src/components/ServiceLevelObjectivesEditor.vue'

describe('ServiceLevelObjectivesEditor', () => {
  const defaultProps = {
    modelValue: [],
    metrics: { Uptime: { type: 'number' }, Latency: { type: 'number' } },
    errors: {},
    path: '/plans/gold/serviceLevelObjectives'
  }

  it('renders correctly', () => {
    const wrapper = mount(ServiceLevelObjectivesEditor, {
      props: { ...defaultProps }
    })
    expect(wrapper.text()).toContain('Service Level Objectives (SLOs)')
    expect(wrapper.find('.add-slo-btn').exists()).toBe(true)
  })

  it('adds a new SLO', async () => {
    const wrapper = mount(ServiceLevelObjectivesEditor, {
      props: { ...defaultProps }
    })
    await wrapper.find('.add-slo-btn').trigger('click')
    expect(wrapper.emitted('update:modelValue')[0][0]).toEqual([{ priority: '', name: '', guarantees: [] }])
  })

  it('updates an existing SLO', async () => {
    const wrapper = mount(ServiceLevelObjectivesEditor, {
      props: { 
        ...defaultProps,
        modelValue: [{ priority: 'High', name: 'Incident Resolution', guarantees: [] }]
      }
    })
    const priorityInput = wrapper.find('input[placeholder="e.g., High"]')
    await priorityInput.setValue('Critical')
    expect(wrapper.emitted('update:modelValue')[0][0][0].priority).toBe('Critical')

    const nameInput = wrapper.find('input[placeholder="e.g., Incident Resolution"]')
    await nameInput.setValue('Bug Fix Time')
    expect(wrapper.emitted('update:modelValue')[1][0][0].name).toBe('Bug Fix Time')
  })

  it('removes an SLO', async () => {
    const wrapper = mount(ServiceLevelObjectivesEditor, {
      props: { 
        ...defaultProps,
        modelValue: [{ priority: 'High', name: 'Incident Resolution', guarantees: [] }]
      }
    })
    await wrapper.find('.btn-danger').trigger('click')
    expect(wrapper.emitted('update:modelValue')[0][0].length).toBe(0)
  })

  it('adds a new SLO guarantee', async () => {
    const wrapper = mount(ServiceLevelObjectivesEditor, {
      props: { 
        ...defaultProps,
        modelValue: [{ priority: 'High', name: 'Incident Resolution', guarantees: [] }]
      }
    })
    await wrapper.find('.btn-secondary.btn-sm').trigger('click') // The only secondary btn inside the card is "Add SLO Guarantee"
    expect(wrapper.emitted('update:modelValue')[0][0][0].guarantees.length).toBe(1)
    expect(wrapper.emitted('update:modelValue')[0][0][0].guarantees[0]).toEqual({ metric: '' })
  })

  it('updates an existing SLO guarantee', async () => {
    const wrapper = mount(ServiceLevelObjectivesEditor, {
      props: { 
        ...defaultProps,
        modelValue: [{ priority: 'High', name: 'Incident Resolution', guarantees: [{ metric: 'Uptime', duration: 'PT1H' }] }]
      }
    })
    
    // Update metric
    await wrapper.find('select.form-select').setValue('Latency')
    expect(wrapper.emitted('update:modelValue')[0][0][0].guarantees[0].metric).toBe('Latency')

    // Switch to structured mode and check emission
    const structuredRadio = wrapper.find('input[type="radio"][id^="slo-mode-structured"]')
    await structuredRadio.setValue()
    
    const emitted = wrapper.emitted('update:modelValue')[1][0][0].guarantees[0]
    expect(emitted.duration).toBeUndefined()
  })

  it('displays validation errors', () => {
    const wrapper = mount(ServiceLevelObjectivesEditor, {
      props: {
        ...defaultProps,
        modelValue: [{ priority: '', name: '', guarantees: [{ metric: '' }] }],
        errors: {
          '/plans/gold/serviceLevelObjectives/0/priority': ['Priority is required'],
          '/plans/gold/serviceLevelObjectives/0/guarantees/0/metric': ['Metric is required']
        }
      }
    })
    expect(wrapper.text()).toContain('Priority is required')
    expect(wrapper.text()).toContain('Metric is required')
    expect(wrapper.find('.is-invalid').exists()).toBe(true)
  })
})
