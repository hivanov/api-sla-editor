import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ExclusionsEditor from '../../src/components/ExclusionsEditor.vue'
import PrometheusMeasurementEditor from '../../src/components/PrometheusMeasurementEditor.vue'

describe('ExclusionsEditor', () => {
  it('renders correctly', () => {
    const wrapper = mount(ExclusionsEditor, {
      props: {
        exclusions: ['avg_over_time(requests[5m]) < 100'],
        metrics: { requests: { type: 'integer' } }
      },
    })
    expect(wrapper.text()).toContain('SLA Exclusions')
    expect(wrapper.findComponent(PrometheusMeasurementEditor).exists()).toBe(true)
    expect(wrapper.findComponent(PrometheusMeasurementEditor).props('modelValue')).toBe('avg_over_time(requests[5m]) < 100')
  })

  it('adds an exclusion', async () => {
    const wrapper = mount(ExclusionsEditor, {
      props: { exclusions: [] },
    })
    await wrapper.find('button.btn-secondary').trigger('click')
    expect(wrapper.emitted('update:exclusions')[0][0]).toEqual([''])
  })

  it('handles null exclusions prop', () => {
    const wrapper = mount(ExclusionsEditor, {
      props: { exclusions: null },
    })
    expect(wrapper.findAllComponents(PrometheusMeasurementEditor).length).toBe(0)
  })
})
