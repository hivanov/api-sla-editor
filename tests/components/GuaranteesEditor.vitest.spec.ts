import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GuaranteesEditor from '../../src/components/GuaranteesEditor.vue'

describe('GuaranteesEditor', () => {
  it('renders correctly with guarantees', () => {
    const wrapper = mount(GuaranteesEditor, {
      props: {
        guarantees: [{ metric: 'uptime', limit: '99.9%' }],
        metrics: { uptime: { type: 'number' } }
      },
    })
    expect(wrapper.text()).toContain('Guarantees')
    expect(wrapper.find('select.form-select').element.value).toBe('uptime')
    expect(wrapper.find('input[placeholder="e.g. P1DT4H"]').element.value).toBe('99.9%')
  })

  it('adds a guarantee', async () => {
    const wrapper = mount(GuaranteesEditor, {
      props: { guarantees: [], metrics: { uptime: { type: 'number' } } },
    })
    await wrapper.find('button.btn-secondary').trigger('click')
    expect(wrapper.emitted('update:guarantees')[0][0]).toEqual([{ metric: '', limit: '' }])
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
    await wrapper.find('button.btn-danger').trigger('click')
    expect(wrapper.emitted('update:guarantees')[0][0]).toEqual([])
  })

  it('handles null guarantees prop', () => {
    const wrapper = mount(GuaranteesEditor, {
      props: { guarantees: null, metrics: {} },
    })
    expect(wrapper.findAll('.card.mb-2').length).toBe(0)
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
    
    const durationInput = wrapper.find('input[placeholder="e.g. P1DT4H"]')
    expect(durationInput.classes()).toContain('is-invalid')
    
    expect(wrapper.text()).toContain('Metric is required')
    expect(wrapper.text()).toContain('Invalid duration format')
  })
})
