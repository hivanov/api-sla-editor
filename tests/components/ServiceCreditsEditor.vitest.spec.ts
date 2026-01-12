import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ServiceCreditsEditor from '../../src/components/ServiceCreditsEditor.vue'

describe('ServiceCreditsEditor', () => {
  it('renders correctly', () => {
    const wrapper = mount(ServiceCreditsEditor, {
      props: {
        serviceCredits: { currency: 'USD', claimWindow: 'P30D', tiers: [] },
      },
    })
    expect(wrapper.text()).toContain('Service Credits')
    expect(wrapper.find('input[placeholder="Currency"]').element.value).toBe('USD')
  })

  it('adds a tier', async () => {
    const wrapper = mount(ServiceCreditsEditor, {
      props: { serviceCredits: {} },
    })
    await wrapper.find('button.btn-secondary').trigger('click')
    expect(wrapper.emitted('update:serviceCredits')[0][0].tiers.length).toBe(1)
  })

  it('updates a tier', async () => {
    const wrapper = mount(ServiceCreditsEditor, {
      props: {
        serviceCredits: { tiers: [{ condition: { metric: '' }, compensation: 0 }] },
        metrics: { availability: { type: 'number' } }
      },
    })
    await wrapper.find('select.form-select').setValue('availability')
    expect(wrapper.emitted('update:serviceCredits')[0][0].tiers[0].condition.metric).toBe('availability')
  })

  it('constrains negative compensation input to 0', async () => {
    const wrapper = mount(ServiceCreditsEditor, {
      props: {
        serviceCredits: { tiers: [{ condition: { metric: 'uptime' }, compensation: 10 }] },
        metrics: { uptime: { type: 'number' } }
      },
    })
    const input = wrapper.find('input.compensation-input')
    await input.setValue('-10')
    expect(wrapper.emitted('update:serviceCredits')).toBeTruthy()
    expect(wrapper.emitted('update:serviceCredits')[0][0].tiers[0].compensation).toBe(0)
  })

  it('handles null serviceCredits prop', () => {
    const wrapper = mount(ServiceCreditsEditor, {
      props: { serviceCredits: null, metrics: {} },
    })
    expect(wrapper.find('input[placeholder="Currency"]').exists()).toBe(true)
  })

  it('provides available currencies in datalist', () => {
    const availableCurrencies = [
      { code: 'USD', name: 'US Dollar' },
      { code: 'EUR', name: 'Euro' },
      { code: 'CPU', name: 'Compute Unit', isCustom: true }
    ]
    const wrapper = mount(ServiceCreditsEditor, {
      props: {
        serviceCredits: { currency: 'USD', claimWindow: 'P30D', tiers: [] },
        path: '/plans/gold/x-service-credits'
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

  it('displays validation errors', () => {
    const wrapper = mount(ServiceCreditsEditor, {
      props: {
        serviceCredits: { currency: '', claimWindow: 'invalid' },
        errors: {
          '/plans/gold/x-service-credits/currency': ['Currency is required'],
          '/plans/gold/x-service-credits/claimWindow': ['Invalid duration format']
        },
        path: '/plans/gold/x-service-credits'
      },
    })

    expect(wrapper.find('input[placeholder="Currency"]').classes()).toContain('is-invalid')
    expect(wrapper.find('input[placeholder="e.g. P1DT4H"]').classes()).toContain('is-invalid')
    
    expect(wrapper.text()).toContain('Currency is required')
    expect(wrapper.text()).toContain('Invalid duration format')
  })
})
