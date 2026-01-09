import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SupportPolicyEditor from '../../src/components/SupportPolicyEditor.vue'

describe('SupportPolicyEditor', () => {
  // Helper to create a basic supportPolicy object for props
  const createBaseSupportPolicy = () => ({
    hoursAvailable: [],
    holidaySchedule: { sources: [] },
    serviceLevelObjectives: [],
  });

  it('renders the support policy editor', () => {
    const wrapper = mount(SupportPolicyEditor, {
      props: {
        supportPolicy: createBaseSupportPolicy(),
      },
    })
    expect(wrapper.text()).toContain('Support Policy')
    expect(wrapper.text()).toContain('Hours Available')
    expect(wrapper.text()).toContain('Holiday Schedule')
    expect(wrapper.text()).toContain('Service Level Objectives (SLOs)')
  })

  // Hours Available Tests
  it('adds new hours available', async () => {
    const wrapper = mount(SupportPolicyEditor, {
      props: { supportPolicy: createBaseSupportPolicy() },
    })
    await wrapper.findAll('button.btn-secondary.btn-sm').filter(w => w.text().includes("Add Hours"))[0].trigger('click')
    expect(wrapper.emitted('update:supportPolicy')[0][0].hoursAvailable.length).toBe(1)
    expect(wrapper.emitted('update:supportPolicy')[0][0].hoursAvailable[0]).toEqual({ dayOfWeek: [], opens: '', closes: '' })
  })

  it('updates existing hours available via checkboxes', async () => {
    const policy = {
      hoursAvailable: [{ dayOfWeek: ['Monday'], opens: '09:00', closes: '17:00' }],
      holidaySchedule: { sources: [] },
      serviceLevelObjectives: [],
    };
    const wrapper = mount(SupportPolicyEditor, { props: { supportPolicy: policy } })

    // Select Tuesday
    const tuesdayCheckbox = wrapper.find('input#day-0-Tuesday')
    await tuesdayCheckbox.setValue(true)
    expect(wrapper.emitted('update:supportPolicy')[0][0].hoursAvailable[0].dayOfWeek).toEqual(['Monday', 'Tuesday'])

    // Deselect Monday
    const mondayCheckbox = wrapper.find('input#day-0-Monday')
    await mondayCheckbox.setValue(false)
    expect(wrapper.emitted('update:supportPolicy')[1][0].hoursAvailable[0].dayOfWeek).toEqual(['Tuesday'])

    await wrapper.find('input[placeholder="HH:mm"]').setValue('10:00')
    expect(wrapper.emitted('update:supportPolicy')[2][0].hoursAvailable[0].opens).toBe('10:00')
  })

  it('applies Workdays preset', async () => {
    const policy = { hoursAvailable: [{ dayOfWeek: [], opens: '', closes: '' }] };
    const wrapper = mount(SupportPolicyEditor, { props: { supportPolicy: policy } })
    
    await wrapper.findAll('button.btn-outline-primary').filter(w => w.text().includes("Workdays"))[0].trigger('click')
    const updated = wrapper.emitted('update:supportPolicy')[0][0].hoursAvailable[0]
    expect(updated.dayOfWeek).toEqual(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'])
    expect(updated.opens).toBe('09:00')
    expect(updated.closes).toBe('17:00')
  })

  it('applies 24x7 preset', async () => {
    const policy = { hoursAvailable: [{ dayOfWeek: [], opens: '', closes: '' }] };
    const wrapper = mount(SupportPolicyEditor, { props: { supportPolicy: policy } })
    
    await wrapper.findAll('button.btn-outline-primary').filter(w => w.text().includes("24x7"))[0].trigger('click')
    const updated = wrapper.emitted('update:supportPolicy')[0][0].hoursAvailable[0]
    expect(updated.dayOfWeek).toEqual(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])
    expect(updated.opens).toBe('00:00')
    expect(updated.closes).toBe('23:59')
  })

  it('removes hours available', async () => {
    const policy = {
      hoursAvailable: [{ dayOfWeek: ['Monday'], opens: '09:00', closes: '17:00' }],
      holidaySchedule: { sources: [] },
      serviceLevelObjectives: [],
    };
    const wrapper = mount(SupportPolicyEditor, { props: { supportPolicy: policy } })

    // Find the remove button for hours available, it's the danger button inside the first card's header div
    await wrapper.findAll('.card-body .card.mb-2 .btn-danger.btn-sm').filter(w => w.text() === "Remove")[0].trigger('click') 
    expect(wrapper.emitted('update:supportPolicy')[0][0].hoursAvailable.length).toBe(0)
  })

  // Holiday Schedule Tests
  it('adds a new holiday source (region)', async () => {
    const wrapper = mount(SupportPolicyEditor, { props: { supportPolicy: createBaseSupportPolicy() } })
    await wrapper.findAll('button.btn-secondary.btn-sm').filter(w => w.text().includes("Add Holiday Source"))[0].trigger('click')
    expect(wrapper.emitted('update:supportPolicy')[0][0].holidaySchedule.sources.length).toBe(1)
    expect(wrapper.emitted('update:supportPolicy')[0][0].holidaySchedule.sources[0]).toEqual({ type: 'region' })

    await wrapper.find('input[placeholder="e.g., DE-BY"]').setValue('US-NY')
    expect(wrapper.emitted('update:supportPolicy')[1][0].holidaySchedule.sources[0].regionCode).toBe('US-NY')
  })

  it('adds a new holiday source (ical)', async () => {
    const wrapper = mount(SupportPolicyEditor, { props: { supportPolicy: createBaseSupportPolicy() } })
    await wrapper.findAll('button.btn-secondary.btn-sm').filter(w => w.text().includes("Add Holiday Source"))[0].trigger('click')
    await wrapper.find('select').setValue('ical') // Change type to iCal
    expect(wrapper.emitted('update:supportPolicy')[1][0].holidaySchedule.sources[0].type).toBe('ical')

    await wrapper.find('input[placeholder="https://example.com/holidays.ics"]').setValue('https://test.com/cal.ics')
    expect(wrapper.emitted('update:supportPolicy')[2][0].holidaySchedule.sources[0].calendarUrl).toBe('https://test.com/cal.ics')
  })

  it('removes a holiday source', async () => {
    const policy = {
      hoursAvailable: [],
      holidaySchedule: { sources: [{ type: 'region', regionCode: 'DE' }] },
      serviceLevelObjectives: [],
    };
    const wrapper = mount(SupportPolicyEditor, { props: { supportPolicy: policy } })

    // Find the remove button for holiday source
    await wrapper.findAll('.card.mb-2.p-2 > .d-flex > .btn-danger.btn-sm')[0].trigger('click') 
    expect(wrapper.emitted('update:supportPolicy')[0][0].holidaySchedule.sources.length).toBe(0)
  })

  it('updates support policy when SLOs change', async () => {
    const policy = createBaseSupportPolicy();
    const wrapper = mount(SupportPolicyEditor, { props: { supportPolicy: policy } });
    
    const sloEditor = wrapper.getComponent({ name: 'ServiceLevelObjectivesEditor' });
    const newSlos = [{ priority: 'High', name: 'Test', guarantees: [] }];
    
    await sloEditor.vm.$emit('update:modelValue', newSlos);
    
    expect(wrapper.emitted('update:supportPolicy')).toBeTruthy();
    expect(wrapper.emitted('update:supportPolicy')[0][0].serviceLevelObjectives).toEqual(newSlos);
  })

  // Contact Points and Channels Tests
  it('adds a new contact point and channel', async () => {
    const wrapper = mount(SupportPolicyEditor, { props: { supportPolicy: createBaseSupportPolicy() } })
    await wrapper.findAll('button.btn-secondary').filter(w => w.text().includes("Add Contact Point"))[0].trigger('click')
    expect(wrapper.emitted('update:supportPolicy')[0][0].contactPoints.length).toBe(1)
    
    const updatedPolicy = wrapper.emitted('update:supportPolicy')[0][0];
    await wrapper.setProps({ supportPolicy: updatedPolicy });

    await wrapper.findAll('button.btn-secondary').filter(w => w.text().includes("Add Channel"))[0].trigger('click')
    expect(wrapper.emitted('update:supportPolicy')[1][0].contactPoints[0].channels.length).toBe(1)
  })

  it('updates channel type and auto-updates protocol', async () => {
    const policy = {
      contactPoints: [{
        contactType: 'Support',
        channels: [{ type: 'web', url: 'https://example.com' }]
      }]
    };
    const wrapper = mount(SupportPolicyEditor, { props: { supportPolicy: policy } })

    const select = wrapper.find('select');
    
    // Switch to email
    await select.setValue('email');
    expect(wrapper.emitted('update:supportPolicy')[0][0].contactPoints[0].channels[0].url).toBe('mailto://example.com')

    // Switch to phone
    await select.setValue('phone');
    expect(wrapper.emitted('update:supportPolicy')[1][0].contactPoints[0].channels[0].url).toBe('tel://example.com')

    // Switch back to web
    await select.setValue('web');
    expect(wrapper.emitted('update:supportPolicy')[2][0].contactPoints[0].channels[0].url).toBe('https://example.com')
  })
})