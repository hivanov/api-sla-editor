import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GuaranteesEditor from '../../src/components/GuaranteesEditor.vue'

describe('GuaranteesEditor', () => {
  it('renders correctly with guarantees', () => {
    const wrapper = mount(GuaranteesEditor, {
      props: {
        guarantees: [{ measurement: 'avg_over_time(uptime[5m]) > 0.99' }],
        metrics: { uptime: { type: 'number' } }
      },
    })
    expect(wrapper.text()).toContain('Guarantees')
    expect(wrapper.findComponent({ name: 'PrometheusMeasurementEditor' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'PrometheusMeasurementEditor' }).props('modelValue')).toBe('avg_over_time(uptime[5m]) > 0.99')
  })

  it('adds a guarantee', async () => {
    const wrapper = mount(GuaranteesEditor, {
      props: { guarantees: [], metrics: { uptime: { type: 'number' } } },
    })
    await wrapper.find('button.btn-secondary').trigger('click')
    expect(wrapper.emitted('update:guarantees')[0][0]).toEqual([{ measurement: '' }])
  })

  it('updates a guarantee', async () => {
    const wrapper = mount(GuaranteesEditor, {
      props: { 
        guarantees: [{ measurement: '' }],
        metrics: { latency: { type: 'integer' } }
      },
    })
    const prometheusEditor = wrapper.findComponent({ name: 'PrometheusMeasurementEditor' })
    await prometheusEditor.vm.$emit('update:modelValue', 'avg_over_time(latency[5m]) < 100')
    
    expect(wrapper.emitted('update:guarantees')[0][0]).toEqual([{ measurement: 'avg_over_time(latency[5m]) < 100' }])
  })

  it('removes a guarantee', async () => {
    const wrapper = mount(GuaranteesEditor, {
      props: { 
        guarantees: [{ measurement: 'up > 0' }],
        metrics: { uptime: { type: 'number' } }
      },
    })
    await wrapper.find('button.btn-outline-danger').trigger('click')
    expect(wrapper.emitted('update:guarantees')[0][0]).toEqual([])
  })

  it('displays validation errors for measurement', () => {
    const wrapper = mount(GuaranteesEditor, {
      props: {
        guarantees: [{ measurement: 'invalid' }],
        metrics: { uptime: { type: 'number' } },
        path: '/plans/gold/guarantees',
        errors: {
          '/plans/gold/guarantees/0/measurement': ['Invalid measurement']
        }
      },
    })

    expect(wrapper.text()).toContain('Invalid measurement')
    const prometheusEditor = wrapper.findComponent({ name: 'PrometheusMeasurementEditor' })
    expect(prometheusEditor.props('errors')).toEqual({
      '/plans/gold/guarantees/0/measurement': ['Invalid measurement']
    })
  })
})