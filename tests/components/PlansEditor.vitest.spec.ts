import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PlansEditor from '../../src/components/PlansEditor.vue'

describe('PlansEditor', () => {
  it('renders the plans editor', () => {
    const wrapper = mount(PlansEditor, {
      props: {
        plans: {
          enterprise: {
            title: 'Gold Enterprise Tier',
            description: 'Mission critical support',
            availability: '99.95%',
            guarantees: [], // Add guarantees for consistent rendering
          },
        },
      },
    })

    expect(wrapper.text()).toContain('Plans')
    expect(wrapper.text()).toContain('enterprise')
    expect(wrapper.find('input[placeholder="Plan Title"]').element.value).toBe('Gold Enterprise Tier')
    expect(wrapper.find('textarea[placeholder="Plan Description"]').element.value).toBe('Mission critical support')
    expect(wrapper.find('input[placeholder="Plan Availability"]').element.value).toBe('99.95%')
  })

  it('adds a new plan', async () => {
    const wrapper = mount(PlansEditor, {
      props: {
        plans: {},
      },
    })

    await wrapper.find('input[placeholder="New plan name"]').setValue('new-plan')
    await wrapper.find('button.btn-primary').trigger('click')

    expect(wrapper.emitted('update:plans')[0][0]).toEqual({
      'new-plan': {
        title: '',
        description: '',
        availability: '',
        guarantees: [], // Expect guarantees array
      },
    })
  })

  it('updates an existing plan', async () => {
    const wrapper = mount(PlansEditor, {
      props: {
        plans: {
          basic: { title: 'Basic Plan', description: 'Desc', availability: '99%', guarantees: [] },
        },
      },
    })

    // Update title
    await wrapper.find('input[placeholder="Plan Title"]').setValue('Updated Basic Plan')
    let expectedPlans = {
      basic: { title: 'Updated Basic Plan', description: 'Desc', availability: '99%', guarantees: [] },
    }
    expect(wrapper.emitted('update:plans')[0][0]).toEqual(expectedPlans)
    await wrapper.setProps({ plans: expectedPlans }); // Simulate parent updating props

    // Update description
    await wrapper.find('textarea[placeholder="Plan Description"]').setValue('Updated Desc')
    expectedPlans = {
      basic: { title: 'Updated Basic Plan', description: 'Updated Desc', availability: '99%', guarantees: [] },
    }
    expect(wrapper.emitted('update:plans')[1][0]).toEqual(expectedPlans)
    await wrapper.setProps({ plans: expectedPlans }); // Simulate parent updating props

    // Update availability
    await wrapper.find('input[placeholder="Plan Availability"]').setValue('99.99%')
    expectedPlans = {
      basic: { title: 'Updated Basic Plan', description: 'Updated Desc', availability: '99.99%', guarantees: [] },
    }
    expect(wrapper.emitted('update:plans')[2][0]).toEqual(expectedPlans)
    await wrapper.setProps({ plans: expectedPlans }); // Simulate parent updating props
  })

  it('adds a new guarantee to a plan', async () => {
    const wrapper = mount(PlansEditor, {
      props: {
        plans: {
          basic: { title: 'Basic Plan', guarantees: [] },
        },
      },
    })

    await wrapper.find('button.btn-secondary').trigger('click') // Click Add Guarantee button
    expect(wrapper.emitted('update:plans')[0][0]).toEqual({
      basic: { title: 'Basic Plan', guarantees: [{ metric: '', limit: '' }] },
    })
  })

  it('updates an existing guarantee', async () => {
    const wrapper = mount(PlansEditor, {
      props: {
        plans: {
          basic: { title: 'Basic Plan', guarantees: [{ metric: '', limit: '' }] },
        },
      },
    })

    await wrapper.find('input[placeholder="Metric Name"]').setValue('response-time')
    expect(wrapper.emitted('update:plans')[0][0]).toEqual({
      basic: { title: 'Basic Plan', guarantees: [{ metric: 'response-time', limit: '' }] },
    })

    await wrapper.find('input[placeholder="Limit"]').setValue('PT1H')
    expect(wrapper.emitted('update:plans')[1][0]).toEqual({
      basic: { title: 'Basic Plan', guarantees: [{ metric: 'response-time', limit: 'PT1H' }] },
    })
  })

  it('removes a guarantee from a plan', async () => {
    const wrapper = mount(PlansEditor, {
      props: {
        plans: {
          basic: { title: 'Basic Plan', description: 'Desc', availability: '99%', guarantees: [{ metric: 'response-time', limit: 'PT1H' }] },
        },
      },
    })

    await wrapper.findAll('.plan-item .card.mb-2 .btn-danger.btn-sm')[0].trigger('click') // Click remove guarantee button
    expect(wrapper.emitted('update:plans')[0][0]).toEqual({
      basic: { title: 'Basic Plan', description: 'Desc', availability: '99%', guarantees: [] },
    })
  })

  it('removes a plan', async () => {
    const wrapper = mount(PlansEditor, {
      props: {
        plans: {
          enterprise: {
            title: 'Gold Enterprise Tier',
            description: 'Mission critical support',
            availability: '99.95%',
            guarantees: [],
          },
        },
      },
    })

    await wrapper.find('.card-header > button.btn-danger').trigger('click') // Click remove plan button
    expect(wrapper.emitted('update:plans')[0][0]).toEqual({})
  })

  it('renders correctly with no plans', () => {
    const wrapper = mount(PlansEditor, {
      props: {
        plans: {},
      },
    })

    expect(wrapper.text()).toContain('Plans')
    expect(wrapper.findAll('.plan-item').length).toBe(0)
  })
})
