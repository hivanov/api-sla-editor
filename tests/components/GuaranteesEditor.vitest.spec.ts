import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GuaranteesEditor from '../../src/components/GuaranteesEditor.vue'

describe('GuaranteesEditor', () => {
  it('renders correctly with guarantees', () => {
    const wrapper = mount(GuaranteesEditor, {
      props: {
        guarantees: [{ metric: 'uptime', limit: '99.9%' }],
      },
    })
    expect(wrapper.text()).toContain('Guarantees')
    expect(wrapper.find('input[placeholder="Metric Name"]').element.value).toBe('uptime')
    expect(wrapper.find('input[placeholder="Limit"]').element.value).toBe('99.9%')
  })

  it('adds a guarantee', async () => {
    const wrapper = mount(GuaranteesEditor, {
      props: { guarantees: [] },
    })
    await wrapper.find('button.btn-secondary').trigger('click')
    expect(wrapper.emitted('update:guarantees')[0][0]).toEqual([{ metric: '', limit: '' }])
  })

  it('updates a guarantee', async () => {
    const wrapper = mount(GuaranteesEditor, {
      props: { guarantees: [{ metric: '', limit: '' }] },
    })
    await wrapper.find('input[placeholder="Metric Name"]').setValue('latency')
    expect(wrapper.emitted('update:guarantees')[0][0]).toEqual([{ metric: 'latency', limit: '' }])
  })

  it('removes a guarantee', async () => {
    const wrapper = mount(GuaranteesEditor, {
      props: { guarantees: [{ metric: 'uptime', limit: '99.9' }] },
    })
    await wrapper.find('button.btn-danger').trigger('click')
    expect(wrapper.emitted('update:guarantees')[0][0]).toEqual([])
  })

  it('handles null guarantees prop', () => {
    const wrapper = mount(GuaranteesEditor, {
      props: { guarantees: null },
    })
    expect(wrapper.findAll('.card.mb-2').length).toBe(0)
  })
})
