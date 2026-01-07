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
    await wrapper.find('button.btn-secondary').trigger('click')
    expect(wrapper.emitted('update:maintenancePolicy')[0][0].windows.length).toBe(1)
  })

  it('handles null maintenancePolicy prop', () => {
    const wrapper = mount(MaintenancePolicyEditor, {
      props: { maintenancePolicy: null },
    })
    expect(wrapper.find('#countsAsDowntime').exists()).toBe(true)
  })
})
