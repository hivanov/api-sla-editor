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
    expect(wrapper.emitted('update:modelValue')[0][0][0].guarantees[0]).toEqual({ measurement: '' })
  })

  it('updates an existing SLO guarantee (switching modes)', async () => {
    const wrapper = mount(ServiceLevelObjectivesEditor, {
      props: { 
        ...defaultProps,
        modelValue: [{ priority: 'High', name: 'Incident Resolution', guarantees: [{ metric: 'Uptime', duration: 'PT1H' }] }]
      }
    })
    
    // Default mode for existing might be legacy if duration is present
    expect(wrapper.vm.getSloGuaranteeMode(wrapper.props('modelValue')[0].guarantees[0])).toBe('legacy')

    // Switch to structured mode
    const structuredRadio = wrapper.find('input[type="radio"][id^="slo-mode-structured"]')
    await structuredRadio.setValue()
    
    let emitted = wrapper.emitted('update:modelValue')[0][0][0].guarantees[0]
    expect(emitted.duration).toBeUndefined()
    expect(emitted.metric).toBe('Uptime')

    // Switch to measurement mode
    const measurementRadio = wrapper.find('input[type="radio"][id^="slo-mode-measurement"]')
    await measurementRadio.setValue()
    
    emitted = wrapper.emitted('update:modelValue')[1][0][0].guarantees[0]
    expect(emitted.metric).toBeUndefined()
    expect(emitted.measurement).toBe('')
  })

  it('updates a metric in structured mode', async () => {
    const wrapper = mount(ServiceLevelObjectivesEditor, {
      props: { 
        ...defaultProps,
        modelValue: [{ priority: 'High', name: 'IR', guarantees: [{ metric: 'Uptime', operator: '>', value: '99%' }] }]
      }
    })
    
    await wrapper.find('select.form-select').setValue('Latency')
    expect(wrapper.emitted('update:modelValue')[0][0][0].guarantees[0].metric).toBe('Latency')
  })

  it('hides Period and Operator controls in measurement mode', async () => {
    const wrapper = mount(ServiceLevelObjectivesEditor, {
      props: { 
        ...defaultProps,
        modelValue: [{ priority: 'H', name: 'N', guarantees: [{ measurement: 'avg_over_time(m[5m]) < 10' }] }]
      }
    })
    
    // We want to make sure the OUTER Period/Operator labels are not there.
    // PrometheusMeasurementEditor has its own Operator label, so we check for their absence in the parent scope.
    // The structured template uses <label class="form-label">Operator</label> and Period label.
    // We can check if those templates are NOT rendered.
    const structuredDiv = wrapper.find('.row.g-2'); // This is the div containing structured operator/value
    expect(structuredDiv.exists()).toBe(false);
    
    // Period is inside a DurationEditor, but we check if the label 'Period' exists outside of PrometheusMeasurementEditor
    const labels = wrapper.findAll('label');
    const periodLabel = labels.find(l => l.text() === 'Period');
    expect(periodLabel).toBeUndefined();
  })

  it('displays validation errors', () => {
    const wrapper = mount(ServiceLevelObjectivesEditor, {
      props: {
        ...defaultProps,
        modelValue: [{ priority: '', name: '', guarantees: [{ measurement: '' }] }],
        errors: {
          '/plans/gold/serviceLevelObjectives/0/priority': ['Priority is required'],
          '/plans/gold/serviceLevelObjectives/0/guarantees/0/measurement': ['Measurement is required']
        }
      }
    })
    expect(wrapper.text()).toContain('Priority is required')
    expect(wrapper.text()).toContain('Measurement is required')
    expect(wrapper.find('.is-invalid').exists()).toBe(true)
  })
})
