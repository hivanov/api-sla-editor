import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AvailabilityEditor from '../../src/components/AvailabilityEditor.vue'

describe('AvailabilityEditor', () => {
  it('renders correctly with default availability (Tier mode)', () => {
    const wrapper = mount(AvailabilityEditor, {
      props: { availability: '99.9%' }
    })
    // In Tier mode, it should show the select with 99.9 selected
    expect(wrapper.find('.tier-select').element.value).toBe('99.9')
  })

  it('updates availability when percentage input changes (Manual Entry mode)', async () => {
    const wrapper = mount(AvailabilityEditor, {
      props: { availability: '100%' }
    })
    // Switch to Manual Entry mode
    await wrapper.findAll('.nav-link')[1].trigger('click')
    
    const input = wrapper.find('input[type="number"]')
    await input.setValue('99.5')
    expect(wrapper.emitted('update:availability')[0][0]).toBe('99.5%')
  })

  it('constrains negative downtime input to 0 (Downtime Duration mode)', async () => {
    const wrapper = mount(AvailabilityEditor, {
      props: { availability: '100%' },
    })
    // Switch to Downtime Duration mode
    await wrapper.findAll('.nav-link')[2].trigger('click')

    // Set days to -1
    const daysInput = wrapper.find('.period-select').element.parentElement.parentElement.querySelectorAll('input[type="number"]')[0]
    
    // We need to wrap it or use wrapper.find again with a specific selector
    const daysWrapper = wrapper.findAll('input[type="number"]')[0]
    await daysWrapper.setValue(-1)
    
    // Initial was 100%, and -1 day clamped to 0 still results in 100%
    if (wrapper.emitted('update:availability')) {
      const lastEmitted = wrapper.emitted('update:availability').slice(-1)[0][0]
      expect(lastEmitted).toBe('100%')
    }
    
    await daysWrapper.setValue(1)
    const emittedCount = wrapper.emitted('update:availability').length
    expect(wrapper.emitted('update:availability')[emittedCount - 1][0]).not.toBe('100%')
    
    await daysWrapper.setValue(-1)
    const lastEmittedFinal = wrapper.emitted('update:availability').slice(-1)[0][0]
    expect(lastEmittedFinal).toBe('100%')
  })

  it('constrains negative availability percentage input to 0 (Manual Entry mode)', async () => {
    const wrapper = mount(AvailabilityEditor, {
      props: { availability: '99.9%' }
    })
    // Switch to Manual Entry mode
    await wrapper.findAll('.nav-link')[1].trigger('click')

    const input = wrapper.find('input[type="number"]')
    await input.setValue('-10')
    expect(wrapper.text()).toContain('Availability must be > 0% and <= 100%')
    const emissions = wrapper.emitted('update:availability') || []
    emissions.forEach(e => {
      expect(parseFloat(e[0])).toBeGreaterThan(0)
    })
  })

  it('calculates downtime based on percentage (Downtime Duration mode)', async () => {
    const wrapper = mount(AvailabilityEditor, {
      props: { availability: '99.9%' }
    })
    // Switch to Downtime Duration mode
    await wrapper.findAll('.nav-link')[2].trigger('click')
    
    // Select daily
    await wrapper.find('.period-select').setValue('day')
    
    // Check downtime inputs
    const inputs = wrapper.findAll('input[type="number"]')
    // Order: Days, Hours, Mins, Secs, Ms
    expect(inputs.at(2).element.value).toBe('1')   // Mins
    expect(inputs.at(3).element.value).toBe('26')  // Secs
    expect(inputs.at(4).element.value).toBe('400') // Ms
  })

  it('calculates percentage based on downtime (Downtime Duration mode)', async () => {
    const wrapper = mount(AvailabilityEditor, {
      props: { availability: '100%' }
    })
    // Switch to Downtime Duration mode
    await wrapper.findAll('.nav-link')[2].trigger('click')
    
    await wrapper.find('.period-select').setValue('day')
    const inputs = wrapper.findAll('input[type="number"]')
    
    // Set downtime to 1 hour (out of 24) -> 1/24 = 0.041666... -> 95.8333...%
    await inputs.at(1).setValue('1') // Hours
    
    const emitted = wrapper.emitted('update:availability')
    const lastEmitted = emitted[emitted.length - 1][0]
    expect(lastEmitted).toContain('95.833333333%')
  })

  it('calculates availability via Deployment Calculator', async () => {
    const wrapper = mount(AvailabilityEditor, {
      props: { availability: '100%' }
    })
    // Switch to Deployment Calculator mode
    await wrapper.findAll('.nav-link')[3].trigger('click')
    
    // Default is 1 deployment per bi-weekly of 15 mins
    // Bi-weekly = 14 * 24 * 60 = 20160 mins
    // 15 / 20160 = 0.000744...
    // Availability = (1 - 15/20160) * 100 = 99.925595...%
    
    const infoText = wrapper.find('.deployment-info').text()
    expect(infoText).toContain('15m')
    
    // Change to 2 deployments of 30 mins each
    await wrapper.find('input.form-control').setValue(2) // Count
    await wrapper.find('.deployment-mins').setValue(30)
    
    // Total downtime = 60 mins per 14 days
    // 60 / 20160 = 0.002976...
    // Availability = (1 - 60/20160) * 100 = 99.702380952%
    
    const emitted = wrapper.emitted('update:availability')
    const lastEmitted = emitted[emitted.length - 1][0]
    expect(lastEmitted).toBe('99.702380952%')
    expect(wrapper.find('.deployment-info').text()).toContain('1h')
  })

  it('handles 1ms precision (Downtime Duration mode)', async () => {
    const wrapper = mount(AvailabilityEditor, {
      props: { availability: '100%' }
    })
    // Switch to Downtime Duration mode
    await wrapper.findAll('.nav-link')[2].trigger('click')
    
    await wrapper.find('.period-select').setValue('year')
    const inputs = wrapper.findAll('input[type="number"]')
    
    await inputs.at(4).setValue('1') // 1ms
    
    const emitted = wrapper.emitted('update:availability')
    const lastEmitted = emitted[emitted.length - 1][0]
    expect(parseFloat(lastEmitted)).toBeLessThan(100)
    expect(parseFloat(lastEmitted)).toBeGreaterThan(99.99999999)
  })

  it('updates availability when a common tier is selected', async () => {
    const wrapper = mount(AvailabilityEditor, {
      props: { availability: '100%' }
    })
    
    await wrapper.find('.tier-select').setValue('99.9')
    expect(wrapper.emitted('update:availability')[0][0]).toBe('99.9%')
    
    // Switch to manual to check the percentage input
    await wrapper.findAll('.nav-link')[1].trigger('click')
    expect(wrapper.find('input[type="number"]').element.value).toBe('99.9')
  })
})