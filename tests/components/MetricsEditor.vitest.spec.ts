import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MetricsEditor from '../../src/components/MetricsEditor.vue'

describe('MetricsEditor', () => {
  it('renders the metrics editor', () => {
    const wrapper = mount(MetricsEditor, {
      props: {
        metrics: {
          uptime: {
            type: 'availability',
            unit: 'percentage',
            description: 'Uptime',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('Metrics')
    expect(wrapper.text()).toContain('uptime')
    expect(wrapper.find('input[value="availability"]').exists()).toBe(true)
    expect(wrapper.find('input[value="percentage"]').exists()).toBe(true)
    expect(wrapper.find('textarea').element.value).toBe('Uptime')
  })

  it('adds a new metric', async () => {
    const wrapper = mount(MetricsEditor, {
      props: {
        metrics: {},
      },
    })

    await wrapper.find('input[placeholder="New metric name"]').setValue('new-metric')
    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('update:metrics')[0]).toEqual([{
      'new-metric': {
        type: '',
        unit: '',
        description: '',
      },
    }])
  })

  it('removes a metric', async () => {
    const wrapper = mount(MetricsEditor, {
      props: {
        metrics: {
          uptime: {
            type: 'availability',
            unit: 'percentage',
            description: 'Uptime',
          },
        },
      },
    })

    await wrapper.find('button.btn-danger').trigger('click')
    expect(wrapper.emitted('update:metrics')[0]).toEqual([{}])
  })
})
