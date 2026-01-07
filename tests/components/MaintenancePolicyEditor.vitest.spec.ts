import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MaintenancePolicyEditor from '../../src/components/MaintenancePolicyEditor.vue'

describe('MaintenancePolicyEditor', () => {
  it('renders correctly', () => {
    const wrapper = mount(MaintenancePolicyEditor, {
      props: {
        maintenancePolicy: { countsAsDowntime: true, minimumNotice: { standard: 'P7D' } },
      },
    })
    expect(wrapper.text()).toContain('Maintenance Policy')
    expect(wrapper.find('#countsAsDowntime').element.checked).toBe(true)
  })

  it('updates countsAsDowntime', async () => {
    const wrapper = mount(MaintenancePolicyEditor, {
      props: { maintenancePolicy: { countsAsDowntime: false } },
    })
    await wrapper.find('#countsAsDowntime').setValue(true)
    expect(wrapper.emitted('update:maintenancePolicy')[0][0].countsAsDowntime).toBe(true)
  })

  it('adds a window', async () => {
    const wrapper = mount(MaintenancePolicyEditor, {
      props: { maintenancePolicy: {} },
    })
    // The first secondary button is "Add Window", the second is "Add Source"
    await wrapper.findAll('button.btn-secondary')[0].trigger('click')
    expect(wrapper.emitted('update:maintenancePolicy')[0][0].windows.length).toBe(1)
  })

  it('adds a source', async () => {
    const wrapper = mount(MaintenancePolicyEditor, {
      props: { maintenancePolicy: {} },
    })
    // The second secondary button is "Add Source"
    await wrapper.findAll('button.btn-secondary')[1].trigger('click')
    expect(wrapper.emitted('update:maintenancePolicy')[0][0].sources.length).toBe(1)
    expect(wrapper.emitted('update:maintenancePolicy')[0][0].sources[0].type).toBe('ical')
  })

  it('updates a source', async () => {
    const maintenancePolicy = {
      sources: [{ type: 'ical', calendarUrl: '', description: '' }]
    }
    const wrapper = mount(MaintenancePolicyEditor, {
      props: { maintenancePolicy },
    })
    const urlInput = wrapper.find('input[placeholder="https://example.com/maintenance.ics"]')
    await urlInput.setValue('https://example.com/test.ics')
    
    const emitted = wrapper.emitted('update:maintenancePolicy')
    expect(emitted[0][0].sources[0].calendarUrl).toBe('https://example.com/test.ics')
  })

  it('handles null maintenancePolicy prop', () => {
    const wrapper = mount(MaintenancePolicyEditor, {
      props: { maintenancePolicy: null },
    })
    expect(wrapper.find('#countsAsDowntime').exists()).toBe(true)
  })
})
