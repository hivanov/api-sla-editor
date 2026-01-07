import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PlansEditor from '../../src/components/PlansEditor.vue'
import AvailabilityEditor from '../../src/components/AvailabilityEditor.vue'
import PricingEditor from '../../src/components/PricingEditor.vue'
import QuotasEditor from '../../src/components/QuotasEditor.vue'
import SupportPolicyEditor from '../../src/components/SupportPolicyEditor.vue'
import GuaranteesEditor from '../../src/components/GuaranteesEditor.vue'
import ServiceCreditsEditor from '../../src/components/ServiceCreditsEditor.vue'
import MaintenancePolicyEditor from '../../src/components/MaintenancePolicyEditor.vue'
import ExclusionsEditor from '../../src/components/ExclusionsEditor.vue'
import LifecyclePolicyEditor from '../../src/components/LifecyclePolicyEditor.vue'

describe('PlansEditor', () => {
  it('renders the plans editor with all sub-editors', () => {
    const wrapper = mount(PlansEditor, {
      props: {
        plans: {
          enterprise: {
            title: 'Gold Enterprise Tier',
            description: 'Mission critical support',
            availability: '99.95%',
            guarantees: [],
            pricing: { cost: 100, currency: 'USD', period: 'P1M' },
            quotas: { 'max-users': '100' },
            'x-support-policy': {},
            'x-service-credits': {},
            'x-maintenance-policy': {},
            'x-sla-exclusions': [],
            'x-lifecycle-policy': {},
          },
        },
        metrics: { 'max-users': { type: 'integer' } }
      },
    })

    expect(wrapper.text()).toContain('Plans')
    expect(wrapper.text()).toContain('enterprise')
    expect(wrapper.find('input[placeholder="Plan Title"]').element.value).toBe('Gold Enterprise Tier')

    // Check for child components
    expect(wrapper.findComponent(AvailabilityEditor).exists()).toBe(true)
    expect(wrapper.findComponent(PricingEditor).exists()).toBe(true)
    expect(wrapper.findComponent(QuotasEditor).exists()).toBe(true)
    expect(wrapper.findComponent(SupportPolicyEditor).exists()).toBe(true)
    expect(wrapper.findComponent(GuaranteesEditor).exists()).toBe(true)
    expect(wrapper.findComponent(ServiceCreditsEditor).exists()).toBe(true)
    expect(wrapper.findComponent(MaintenancePolicyEditor).exists()).toBe(true)
    expect(wrapper.findComponent(ExclusionsEditor).exists()).toBe(true)
    expect(wrapper.findComponent(LifecyclePolicyEditor).exists()).toBe(true)
  })

  it('adds a new plan with full initial state', async () => {
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
        guarantees: [],
        pricing: {},
        quotas: {},
        'x-support-policy': {},
        'x-service-credits': {},
        'x-maintenance-policy': {},
        'x-sla-exclusions': [],
        'x-lifecycle-policy': {},
      },
    })
  })

  it('updates an existing plan', async () => {
    const wrapper = mount(PlansEditor, {
      props: {
        plans: {
          basic: { title: 'Basic Plan', description: 'Desc', availability: '99%', guarantees: [], pricing: {}, quotas: {}, 'x-support-policy': {} },
        },
      },
    })

    // Update title
    await wrapper.find('input[placeholder="Plan Title"]').setValue('Updated Basic Plan')
    let expectedPlans = {
      basic: { title: 'Updated Basic Plan', description: 'Desc', availability: '99%', guarantees: [], pricing: {}, quotas: {}, 'x-support-policy': {} },
    }
    expect(wrapper.emitted('update:plans')[0][0]).toEqual(expectedPlans)

    // Update availability
    await wrapper.findComponent(AvailabilityEditor).vm.$emit('update:availability', '99.99%')
    expect(wrapper.emitted('update:plans')[1][0].basic.availability).toBe('99.99%')
  })

  it('emits update:plans when sub-editors update', async () => {
    const wrapper = mount(PlansEditor, {
      props: {
        plans: {
          basic: { title: 'Basic Plan', pricing: {}, quotas: {}, guarantees: [], 'x-support-policy': {} },
        },
      },
    })

    // Test PricingEditor update
    await wrapper.findComponent(PricingEditor).vm.$emit('update:pricing', { cost: 100 })
    expect(wrapper.emitted('update:plans')[0][0].basic.pricing).toEqual({ cost: 100 })

    // Test GuaranteesEditor update
    await wrapper.findComponent(GuaranteesEditor).vm.$emit('update:guarantees', [{ metric: 'uptime', limit: '99.9' }])
    expect(wrapper.emitted('update:plans')[1][0].basic.guarantees).toEqual([{ metric: 'uptime', limit: '99.9' }])
  })

  it('removes a plan', async () => {
    const wrapper = mount(PlansEditor, {
      props: {
        plans: {
          enterprise: { title: 'Gold' },
        },
      },
    })

    await wrapper.find('.card-header > button.btn-danger').trigger('click')
    expect(wrapper.emitted('update:plans')[0][0]).toEqual({})
  })
})