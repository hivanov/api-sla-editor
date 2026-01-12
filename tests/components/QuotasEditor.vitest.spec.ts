import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import QuotasEditor from '../../src/components/QuotasEditor.vue'
import PrometheusMeasurementEditor from '../../src/components/PrometheusMeasurementEditor.vue'

describe('QuotasEditor', () => {
  it('renders the quotas editor with existing quotas', () => {
    const wrapper = mount(QuotasEditor, {
      props: {
        quotas: { 'q1': 'avg_over_time(requests[5m]) < 100' },
        metrics: { requests: { type: 'integer' } }
      },
    })

    expect(wrapper.text()).toContain('Quotas')
    expect(wrapper.findComponent(PrometheusMeasurementEditor).exists()).toBe(true)
    expect(wrapper.findComponent(PrometheusMeasurementEditor).props('modelValue')).toBe('avg_over_time(requests[5m]) < 100')
  })

  it('adds a new quota', async () => {
    const wrapper = mount(QuotasEditor, {
      props: {
        quotas: {},
        metrics: { requests: { type: 'integer' } }
      },
    })

    await wrapper.find('button.btn-secondary').trigger('click')

    const emitted = wrapper.emitted('update:quotas');
    expect(emitted).toBeTruthy();
    const updatedQuotas = emitted[0][0];
    const keys = Object.keys(updatedQuotas);
    expect(keys.length).toBe(1);
    expect(updatedQuotas[keys[0]]).toBe('');
  })

  it('updates an existing quota value', async () => {
    const wrapper = mount(QuotasEditor, {
      props: {
        quotas: { 'q1': 'avg_over_time(requests[5m]) < 100' },
      },
    })

    const editor = wrapper.findComponent(PrometheusMeasurementEditor)
    await editor.vm.$emit('update:modelValue', 'avg_over_time(requests[5m]) < 200')
    
    expect(wrapper.emitted('update:quotas')[0][0]).toEqual({ 'q1': 'avg_over_time(requests[5m]) < 200' })
  })

  it('removes a quota', async () => {
    const wrapper = mount(QuotasEditor, {
      props: {
        quotas: { 'q1': 'avg_over_time(requests[5m]) < 100' },
      },
    })

    await wrapper.find('button.btn-outline-danger').trigger('click')
    expect(wrapper.emitted('update:quotas')[0][0]).toEqual({})
  })

  it('renders correctly with an empty quotas object', () => {
    const wrapper = mount(QuotasEditor, {
      props: {
        quotas: {},
      },
    })

    expect(wrapper.text()).toContain('Quotas')
    expect(wrapper.findAllComponents(PrometheusMeasurementEditor).length).toBe(0)
  })
})
