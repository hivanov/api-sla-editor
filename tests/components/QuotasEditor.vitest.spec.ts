import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import QuotasEditor from '../../src/components/QuotasEditor.vue'

describe('QuotasEditor', () => {
  it('renders the quotas editor with existing quotas', () => {
    const wrapper = mount(QuotasEditor, {
      props: {
        quotas: { 'max-connections': '100', 'rate-limit': '10req/s' },
      },
    })

    expect(wrapper.text()).toContain('Quotas')
    expect(wrapper.text()).toContain('max-connections')
    expect(wrapper.find('input[value="100"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('rate-limit')
    expect(wrapper.find('input[value="10req/s"]').exists()).toBe(true)
  })

  it('adds a new quota', async () => {
    const wrapper = mount(QuotasEditor, {
      props: {
        quotas: { 'existing-quota': '50' },
        metrics: { 'new-quota': { type: 'integer' } }
      },
    })

    await wrapper.find('select.form-select').setValue('new-quota')
    await wrapper.find('input[placeholder="New quota value"]').setValue('200')
    await wrapper.find('button.btn-primary').trigger('click')

    expect(wrapper.emitted('update:quotas')[0][0]).toEqual({
      'existing-quota': '50',
      'new-quota': '200',
    })
  })

  it('updates an existing quota value', async () => {
    const wrapper = mount(QuotasEditor, {
      props: {
        quotas: { 'max-connections': '100' },
      },
    })

    await wrapper.find('input[value="100"]').setValue('150')
    expect(wrapper.emitted('update:quotas')[0][0]).toEqual({ 'max-connections': '150' })
  })

  it('removes a quota', async () => {
    const wrapper = mount(QuotasEditor, {
      props: {
        quotas: { 'max-connections': '100', 'rate-limit': '10req/s' },
      },
    })

    await wrapper.findAll('button.btn-danger')[0].trigger('click') // Click remove for 'max-connections'
    expect(wrapper.emitted('update:quotas')[0][0]).toEqual({ 'rate-limit': '10req/s' })
  })

  it('renders correctly with an empty quotas object', () => {
    const wrapper = mount(QuotasEditor, {
      props: {
        quotas: {},
      },
    })

    expect(wrapper.text()).toContain('Quotas')
    expect(wrapper.findAll('.input-group.mb-2').length).toBe(0) // No existing quotas rendered
  })
})
