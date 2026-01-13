import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CurrencyEditor from '../../src/components/CurrencyEditor.vue'
import MarkdownEditor from '../../src/components/MarkdownEditor.vue'

describe('CurrencyEditor', () => {
  it('renders correctly with custom currencies', () => {
    const wrapper = mount(CurrencyEditor, {
      props: {
        customCurrencies: [{ code: 'CPU', description: 'Compute Units' }],
      },
    })
    expect(wrapper.text()).toContain('Custom Currency #1')
    expect(wrapper.find('input[placeholder="SKU"]').element.value).toBe('CPU')
    expect(wrapper.findComponent(MarkdownEditor).props('modelValue')).toBe('Compute Units')
  })

  it('adds a custom currency', async () => {
    const wrapper = mount(CurrencyEditor, {
      props: { customCurrencies: [] },
    })
    await wrapper.find('button.btn-secondary').trigger('click')
    expect(wrapper.emitted('update:custom-currencies')[0][0]).toEqual([{ code: '', description: '' }])
  })

  it('updates a custom currency', async () => {
    const wrapper = mount(CurrencyEditor, {
      props: { 
        customCurrencies: [{ code: '', description: '' }] 
      },
    })
    await wrapper.find('input[placeholder="SKU"]').setValue('SKU')
    expect(wrapper.emitted('update:custom-currencies')[0][0][0].code).toBe('SKU')
  })

  it('updates conversion rate', async () => {
    const wrapper = mount(CurrencyEditor, {
      props: { 
        customCurrencies: [{ code: 'SKU', description: 'desc' }] 
      },
    })
    const rateInput = wrapper.find('input[type="number"]')
    await rateInput.setValue('1.5')
    expect(wrapper.emitted('update:custom-currencies')[0][0][0].conversion.rate).toBe(1.5)
  })

  it('removes a custom currency', async () => {
    const wrapper = mount(CurrencyEditor, {
      props: { 
        customCurrencies: [{ code: 'SKU', description: 'desc' }] 
      },
    })
    await wrapper.find('button.btn-outline-danger').trigger('click')
    expect(wrapper.emitted('update:custom-currencies')[0][0]).toEqual([])
  })

  it('displays validation errors for negative conversion rate', () => {
    const wrapper = mount(CurrencyEditor, {
      props: {
        customCurrencies: [{ 
          code: 'CPU', 
          description: 'desc', 
          conversion: { rate: -1, baseCurrency: 'USD' } 
        }],
        errors: {
          '/customCurrencies/0/conversion/rate': ['Value must be at least 0']
        }
      },
    })
    const rateInput = wrapper.find('input[type="number"]')
    expect(rateInput.classes()).toContain('is-invalid')
    expect(wrapper.text()).toContain('Value must be at least 0')
  })
})
