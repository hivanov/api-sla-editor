import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PricingEditor from '../../src/components/PricingEditor.vue'

describe('PricingEditor', () => {
  it('renders the pricing editor', () => {
    const wrapper = mount(PricingEditor, {
      props: {
        pricing: { cost: 100, currency: 'USD', period: 'P1M' },
      },
    })

    expect(wrapper.text()).toContain('Pricing')
    expect(wrapper.find('input[placeholder="Cost"]').element.value).toBe('100')
    expect(wrapper.find('input[placeholder="Currency"]').element.value).toBe('USD')
    expect(wrapper.find('input[placeholder="e.g. P1DT4H"]').element.value).toBe('P1M')
  })

  it('emits update event on cost input and converts to number', async () => {
    const wrapper = mount(PricingEditor, {
      props: {
        pricing: { cost: 100, currency: 'USD', period: 'P1M' },
      },
    })

    await wrapper.find('input[placeholder="Cost"]').setValue('200')
    expect(wrapper.emitted('update:pricing')[0][0]).toEqual({ cost: 200, currency: 'USD', period: 'P1M' })
  })

  it('constrains negative cost input to 0', async () => {
    const wrapper = mount(PricingEditor, {
      props: {
        pricing: { cost: 100, currency: 'USD', period: 'P1M' },
      },
    })

    await wrapper.find('input[placeholder="Cost"]').setValue('-50')
    expect(wrapper.emitted('update:pricing')[0][0]).toEqual({ cost: 0, currency: 'USD', period: 'P1M' })
  })

  it('emits update event on currency input', async () => {
    const wrapper = mount(PricingEditor, {
      props: {
        pricing: { cost: 100, currency: 'USD', period: 'P1M' },
      },
    })

    await wrapper.find('input[placeholder="Currency"]').setValue('EUR')
    expect(wrapper.emitted('update:pricing')[0][0]).toEqual({ cost: 100, currency: 'EUR', period: 'P1M' })
  })

  it('emits update event on period input', async () => {
    const wrapper = mount(PricingEditor, {
      props: {
        pricing: { cost: 100, currency: 'USD', period: 'P1M' },
      },
    })

    await wrapper.find('input[placeholder="e.g. P1DT4H"]').setValue('P3M')
    expect(wrapper.emitted('update:pricing')[0][0]).toEqual({ cost: 100, currency: 'USD', period: 'P3M' })
  })

  it('renders correctly with empty pricing object', () => {
    const wrapper = mount(PricingEditor, {
      props: {
        pricing: {},
      },
    })

    expect(wrapper.text()).toContain('Pricing')
    expect(wrapper.find('input[placeholder="Cost"]').element.value).toBe('')
    expect(wrapper.find('input[placeholder="Currency"]').element.value).toBe('')
    expect(wrapper.find('input[placeholder="e.g. P1DT4H"]').element.value).toBe('')
  })

  it('provides available currencies in datalist', () => {
    const availableCurrencies = [
      { code: 'USD', name: 'US Dollar' },
      { code: 'EUR', name: 'Euro' },
      { code: 'CPU', name: 'Compute Unit', isCustom: true }
    ]
    const wrapper = mount(PricingEditor, {
      props: {
        pricing: { cost: 100, currency: 'USD', period: 'P1M' },
        path: '/plans/gold/pricing'
      },
      global: {
        provide: {
          availableCurrencies
        }
      }
    })

    const datalist = wrapper.find('datalist')
    expect(datalist.exists()).toBe(true)
    const options = datalist.findAll('option')
    expect(options.length).toBe(3)
    expect(options[0].attributes('value')).toBe('USD')
    expect(options[1].attributes('value')).toBe('EUR')
    expect(options[2].attributes('value')).toBe('CPU')
  })
})
