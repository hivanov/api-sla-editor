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

  it('updates existing hours available', async () => {
    const policy = {
      hoursAvailable: [{ dayOfWeek: ['Monday'], opens: '09:00', closes: '17:00' }],
      holidaySchedule: { sources: [] },
      serviceLevelObjectives: [],
    };
    const wrapper = mount(SupportPolicyEditor, { props: { supportPolicy: policy } })

    await wrapper.find('input[placeholder="e.g., Monday,Tuesday"]').setValue('Monday,Tuesday,Wednesday')
    expect(wrapper.emitted('update:supportPolicy')[0][0].hoursAvailable[0].dayOfWeek).toEqual(['Monday', 'Tuesday', 'Wednesday'])

    await wrapper.find('input[placeholder="HH:mm"]').setValue('10:00')
    expect(wrapper.emitted('update:supportPolicy')[1][0].hoursAvailable[0].opens).toBe('10:00')
  })

  it('removes hours available', async () => {
    const policy = {
      hoursAvailable: [{ dayOfWeek: ['Monday'], opens: '09:00', closes: '17:00' }],
      holidaySchedule: { sources: [] },
      serviceLevelObjectives: [],
    };
    const wrapper = mount(SupportPolicyEditor, { props: { supportPolicy: policy } })

    // Find the remove button for hours available, it's the first danger button inside a hoursAvailable card
    await wrapper.findAll('.card.mb-2.p-2 > .d-flex > .btn-danger.btn-sm')[0].trigger('click') 
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

  // Service Level Objectives Tests
  it('adds a new SLO', async () => {
    const wrapper = mount(SupportPolicyEditor, { props: { supportPolicy: createBaseSupportPolicy() } })
    await wrapper.findAll('button.btn-secondary.btn-sm').filter(w => w.text().includes("Add SLO"))[0].trigger('click')
    expect(wrapper.emitted('update:supportPolicy')[0][0].serviceLevelObjectives.length).toBe(1)
    expect(wrapper.emitted('update:supportPolicy')[0][0].serviceLevelObjectives[0]).toEqual({ priority: '', name: '', guarantees: [] })
  })

  it('updates an existing SLO', async () => {
    const policy = {
      hoursAvailable: [],
      holidaySchedule: { sources: [] },
      serviceLevelObjectives: [{ priority: 'High', name: 'Incident Resolution', guarantees: [] }],
    };
    const wrapper = mount(SupportPolicyEditor, { props: { supportPolicy: policy } })

    await wrapper.find('input[placeholder="e.g., High"]').setValue('Critical')
    expect(wrapper.emitted('update:supportPolicy')[0][0].serviceLevelObjectives[0].priority).toBe('Critical')

    await wrapper.find('input[placeholder="e.g., Incident Resolution"]').setValue('Bug Fix Time')
    expect(wrapper.emitted('update:supportPolicy')[1][0].serviceLevelObjectives[0].name).toBe('Bug Fix Time')
  })

  it('removes an SLO', async () => {
    const policy = {
      hoursAvailable: [],
      holidaySchedule: { sources: [] },
      serviceLevelObjectives: [{ priority: 'High', name: 'Incident Resolution', guarantees: [] }],
    };
    const wrapper = mount(SupportPolicyEditor, { props: { supportPolicy: policy } })

    // Find the correct remove button for SLO, it's the first danger button inside an SLO card
    await wrapper.findAll('.card.mb-2 > .d-flex > .btn-danger.btn-sm')[0].trigger('click')
    expect(wrapper.emitted('update:supportPolicy')[0][0].serviceLevelObjectives.length).toBe(0)
  })

  // SLO Guarantee Tests
  it('adds a new SLO guarantee', async () => {
    const policy = {
      hoursAvailable: [],
      holidaySchedule: { sources: [] },
      serviceLevelObjectives: [{ priority: 'High', name: 'Incident Resolution', guarantees: [] }],
    };
    const wrapper = mount(SupportPolicyEditor, { props: { supportPolicy: policy } })

    await wrapper.findAll('button.btn-secondary.btn-sm').filter(w => w.text().includes("Add SLO Guarantee"))[0].trigger('click')
    expect(wrapper.emitted('update:supportPolicy')[0][0].serviceLevelObjectives[0].guarantees.length).toBe(1)
    expect(wrapper.emitted('update:supportPolicy')[0][0].serviceLevelObjectives[0].guarantees[0]).toEqual({ metric: '', duration: '' })
  })

  it('updates an existing SLO guarantee', async () => {
    const policy = {
      hoursAvailable: [],
      holidaySchedule: { sources: [] },
      serviceLevelObjectives: [{ priority: 'High', name: 'Incident Resolution', guarantees: [{ metric: 'Uptime', duration: 'PT1H' }] }],
    };
    const wrapper = mount(SupportPolicyEditor, { props: { supportPolicy: policy } })

    await wrapper.find('input[placeholder="e.g., Uptime"]').setValue('Performance')
    expect(wrapper.emitted('update:supportPolicy')[0][0].serviceLevelObjectives[0].guarantees[0].metric).toBe('Performance')

    await wrapper.find('input[placeholder="e.g., PT1H"]').setValue('PT2H')
    expect(wrapper.emitted('update:supportPolicy')[1][0].serviceLevelObjectives[0].guarantees[0].duration).toBe('PT2H')
  })

  it('removes an SLO guarantee', async () => {
    const policy = {
      hoursAvailable: [],
      holidaySchedule: { sources: [] },
      serviceLevelObjectives: [{ priority: 'High', name: 'Incident Resolution', guarantees: [{ metric: 'Uptime', duration: 'PT1H' }] }],
    };
    const wrapper = mount(SupportPolicyEditor, { props: { supportPolicy: policy } })

    const sloCard = wrapper.findAll('.card.mb-2.p-2')[0]; // The first SLO card
    const guaranteeCard = sloCard.findAll('.card.mb-2.p-2').filter(w => w.text().includes("Guar. #1"))[0];
    await guaranteeCard.find('.btn-danger.btn-sm').trigger('click');

    expect(wrapper.emitted('update:supportPolicy')[0][0].serviceLevelObjectives[0].guarantees.length).toBe(0)
  })
})