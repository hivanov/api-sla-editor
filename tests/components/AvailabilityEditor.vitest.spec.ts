import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AvailabilityEditor from '../../src/components/AvailabilityEditor.vue'

describe('AvailabilityEditor', () => {
  it('renders correctly with default availability', () => {
    const wrapper = mount(AvailabilityEditor, {
      props: { availability: '99.9%' }
    })
    expect(wrapper.find('input[type="number"]').element.value).toBe('99.9')
  })

  it('updates availability when percentage input changes', async () => {
    const wrapper = mount(AvailabilityEditor, {
      props: { availability: '100%' }
    })
    const input = wrapper.find('input[type="number"]')
    await input.setValue('99.5')
    expect(wrapper.emitted('update:availability')[0][0]).toBe('99.5%')
  })

  it('constrains negative downtime input to 0', async () => {
    const wrapper = mount(AvailabilityEditor, {
      props: { availability: '100%' },
    })
    // Set days to -1
    const daysInput = wrapper.findAll('input[type="number"]')[1] // 0 is percentage, 1 is days
    await daysInput.setValue(-1)
    
    // Initial was 100%, and -1 day clamped to 0 still results in 100%
    // Even if it emits, it should be 100%
    if (wrapper.emitted('update:availability')) {
      expect(wrapper.emitted('update:availability')[0][0]).toBe('100%')
    }
    
    // Let's try setting it to something positive first, then negative.
    await daysInput.setValue(1)
    const emittedCount = wrapper.emitted('update:availability').length
    expect(wrapper.emitted('update:availability')[emittedCount - 1][0]).not.toBe('100%')
    
    await daysInput.setValue(-1)
    // Last emission should be 100% (or very close to it if clamped to 0)
    const lastEmitted = wrapper.emitted('update:availability').slice(-1)[0][0]
    expect(lastEmitted).toBe('100%')
  })

  it('constrains negative availability percentage input to 0', async () => {
    const wrapper = mount(AvailabilityEditor, {
      props: { availability: '99.9%' }
    })
    const input = wrapper.find('input[type="number"]') // removed .first()
    await input.setValue('-10')
    // Currently updateAvailability just errors if num <= 0.
    // Let's see if we should test for error visibility or just that it doesn't emit a negative value.
    expect(wrapper.text()).toContain('Availability must be > 0% and <= 100%')
    // It should NOT have emitted an update with -10%
    const emissions = wrapper.emitted('update:availability') || []
    emissions.forEach(e => {
      expect(parseFloat(e[0])).toBeGreaterThan(0)
    })
  })

  it('calculates downtime based on percentage', async () => {
    // 99.9% availability on a 24h day means 0.001 * 24 * 60 = 1.44 mins = 1 min 26.4 sec
    // 0.1% of 86,400,000 ms = 86,400 ms = 86.4 seconds = 1 min 26 sec 400 ms
    const wrapper = mount(AvailabilityEditor, {
      props: { availability: '99.9%' }
    })
    
    // Select daily
    await wrapper.find('.period-select').setValue('day')
    
    // Check downtime inputs
    const inputs = wrapper.findAll('input[type="number"]')
    // Order: Percentage, Days, Hours, Mins, Secs, Ms
    expect(inputs.at(3).element.value).toBe('1')   // Mins
    expect(inputs.at(4).element.value).toBe('26')  // Secs
    expect(inputs.at(5).element.value).toBe('400') // Ms
  })

  it('calculates percentage based on downtime', async () => {
    const wrapper = mount(AvailabilityEditor, {
      props: { availability: '100%' }
    })
    
    await wrapper.find('.period-select').setValue('day')
    const inputs = wrapper.findAll('input[type="number"]')
    
    // Set downtime to 1 hour (out of 24) -> 1/24 = 0.041666... -> 95.8333...%
    await inputs.at(2).setValue('1') // Hours
    
    const emitted = wrapper.emitted('update:availability')
    const lastEmitted = emitted[emitted.length - 1][0]
    expect(lastEmitted).toContain('95.833333333%')
  })

  it('validates percentage range (positive/negative tests)', async () => {
    const wrapper = mount(AvailabilityEditor, {
      props: { availability: '100%' }
    })
    const input = wrapper.find('input[type="number"]')

    // Valid
    await input.setValue('99')
    expect(wrapper.text()).not.toContain('Availability must be > 0% and <= 100%')

    // Too high
    await input.setValue('101')
    expect(wrapper.text()).toContain('Availability must be > 0% and <= 100%')

    // Too low
    await input.setValue('0')
    expect(wrapper.text()).toContain('Availability must be > 0% and <= 100%')
    
    await input.setValue('-1')
    expect(wrapper.text()).toContain('Availability must be > 0% and <= 100%')
  })

  it('handles 1ms precision', async () => {
    // 1ms downtime in a year (31,556,952,000 ms)
    // Percentage = (1 - 1/31,556,952,000) * 100
    // = 99.999999996831...
    const wrapper = mount(AvailabilityEditor, {
      props: { availability: '100%' }
    })
    
    await wrapper.find('.period-select').setValue('year')
    const inputs = wrapper.findAll('input[type="number"]')
    
    await inputs.at(5).setValue('1') // 1ms
    
    const emitted = wrapper.emitted('update:availability')
    const lastEmitted = emitted[emitted.length - 1][0]
    // 99.999999997% (approx depending on float precision but should be close)
    expect(parseFloat(lastEmitted)).toBeLessThan(100)
    expect(parseFloat(lastEmitted)).toBeGreaterThan(99.99999999)
  })

  it('updates availability when a common tier is selected', async () => {
    const wrapper = mount(AvailabilityEditor, {
      props: { availability: '100%' }
    })
    
    await wrapper.find('.tier-select').setValue('99.9')
    expect(wrapper.emitted('update:availability')[0][0]).toBe('99.9%')
    
    // Check if percentage input is updated
    expect(wrapper.find('input[type="number"]').element.value).toBe('99.9')
  })
})
