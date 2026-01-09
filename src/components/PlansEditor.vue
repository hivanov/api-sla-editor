<template>
  <div class="plans-editor-content plans-editor-component">
    <div v-for="(plan, name) in plans" :key="name" class="card mb-4 plan-item shadow-sm">
      <div class="card-header d-flex justify-content-between align-items-center bg-light">
        <h5 class="mb-0">{{ name }}</h5>
        <button class="btn btn-outline-danger btn-sm" @click="removePlan(name)">Remove</button>
      </div>
      <div class="card-body">
        <div class="mb-3">
          <label class="form-label">Title</label>
          <input type="text" class="form-control" :class="{'is-invalid': errors['/plans/' + name + '/title']}" placeholder="Plan Title" :value="plan.title" @input="updatePlan(name, 'title', $event.target.value)">
          <div class="invalid-feedback" v-if="errors['/plans/' + name + '/title']">
            {{ errors['/plans/' + name + '/title'].join(', ') }}
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label">Description</label>
          <textarea class="form-control" :class="{'is-invalid': errors['/plans/' + name + '/description']}" placeholder="Plan Description" :value="plan.description" @input="updatePlan(name, 'description', $event.target.value)"></textarea>
          <div class="invalid-feedback" v-if="errors['/plans/' + name + '/description']">
            {{ errors['/plans/' + name + '/description'].join(', ') }}
          </div>
        </div>
        
        <!-- Availability Editor -->
        <AvailabilityEditor :availability="plan.availability" :errors="errors" :path="'/plans/' + name + '/availability'" @update:availability="updatePlan(name, 'availability', $event)" />

        <!-- Pricing Editor -->
        <PricingEditor :pricing="plan.pricing" :errors="errors" :path="'/plans/' + name + '/pricing'" @update:pricing="updatePlanSubObject(name, 'pricing', $event)" />

        <!-- Quotas Editor -->
        <QuotasEditor :quotas="plan.quotas" :metrics="metrics" :errors="errors" :path="'/plans/' + name + '/quotas'" @update:quotas="updatePlanSubObject(name, 'quotas', $event)" />

        <!-- Guarantees Editor -->
        <GuaranteesEditor :guarantees="plan.guarantees" :metrics="metrics" :errors="errors" :path="'/plans/' + name + '/guarantees'" @update:guarantees="updatePlanSubObject(name, 'guarantees', $event)" />

        <!-- Service Level Objectives Editor -->
        <ServiceLevelObjectivesEditor :model-value="plan.serviceLevelObjectives" :metrics="metrics" :errors="errors" :path="'/plans/' + name + '/serviceLevelObjectives'" @update:model-value="updatePlanSubObject(name, 'serviceLevelObjectives', $event)" />

        <!-- Support Policy Editor -->
        <SupportPolicyEditor :support-policy="plan['x-support-policy']" :metrics="metrics" :errors="errors" :path="'/plans/' + name + '/x-support-policy'" @update:support-policy="updatePlanSubObject(name, 'x-support-policy', $event)" />

        <!-- Service Credits Editor -->
        <ServiceCreditsEditor :service-credits="plan['x-service-credits']" :metrics="metrics" :errors="errors" :path="'/plans/' + name + '/x-service-credits'" @update:service-credits="updatePlanSubObject(name, 'x-service-credits', $event)" />

        <!-- Maintenance Policy Editor -->
        <MaintenancePolicyEditor :maintenance-policy="plan['x-maintenance-policy']" :errors="errors" :path="'/plans/' + name + '/x-maintenance-policy'" @update:maintenance-policy="updatePlanSubObject(name, 'x-maintenance-policy', $event)" />

        <!-- Exclusions Editor -->
        <ExclusionsEditor :exclusions="plan['x-sla-exclusions']" :errors="errors" :path="'/plans/' + name + '/x-sla-exclusions'" @update:exclusions="updatePlanSubObject(name, 'x-sla-exclusions', $event)" />

        <!-- Lifecycle Policy Editor -->
        <LifecyclePolicyEditor :lifecycle-policy="plan['x-lifecycle-policy']" :errors="errors" :path="'/plans/' + name + '/x-lifecycle-policy'" @update:lifecycle-policy="updatePlanSubObject(name, 'x-lifecycle-policy', $event)" />
      </div>
    </div>
    <div class="mt-3">
      <div class="input-group">
        <input type="text" class="form-control" placeholder="New plan name" v-model="newPlanName">
        <button class="btn btn-primary" @click="addPlan">Add Plan</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import AvailabilityEditor from './AvailabilityEditor.vue';
import PricingEditor from './PricingEditor.vue';
import QuotasEditor from './QuotasEditor.vue';
import SupportPolicyEditor from './SupportPolicyEditor.vue';
import GuaranteesEditor from './GuaranteesEditor.vue';
import ServiceLevelObjectivesEditor from './ServiceLevelObjectivesEditor.vue';
import ServiceCreditsEditor from './ServiceCreditsEditor.vue';
import MaintenancePolicyEditor from './MaintenancePolicyEditor.vue';
import ExclusionsEditor from './ExclusionsEditor.vue';
import LifecyclePolicyEditor from './LifecyclePolicyEditor.vue';

export default {
  name: 'PlansEditor',
  components: {
    AvailabilityEditor,
    PricingEditor,
    QuotasEditor,
    SupportPolicyEditor,
    GuaranteesEditor,
    ServiceLevelObjectivesEditor,
    ServiceCreditsEditor,
    MaintenancePolicyEditor,
    ExclusionsEditor,
    LifecyclePolicyEditor,
  },
  props: {
    plans: {
      type: Object,
      required: true,
    },
    metrics: {
      type: Object,
      default: () => ({}),
    },
    errors: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['update:plans'],
  setup(props, { emit }) {
    const newPlanName = ref('');

    const updatePlan = (name, key, value) => {
      const newPlans = { ...props.plans };
      newPlans[name] = { ...newPlans[name], [key]: value };
      emit('update:plans', newPlans);
    };

    const updatePlanSubObject = (name, subObjectKey, value) => {
      const newPlans = { ...props.plans };
      newPlans[name] = { ...newPlans[name], [subObjectKey]: value };
      emit('update:plans', newPlans);
    };

    const addPlan = () => {
      if (newPlanName.value && !props.plans[newPlanName.value]) {
        const newPlans = { ...props.plans };
        newPlans[newPlanName.value] = {
          title: '',
          description: '',
          availability: '',
          guarantees: [],
          serviceLevelObjectives: [],
          pricing: {},
          quotas: {},
          'x-support-policy': {},
          'x-service-credits': {},
          'x-maintenance-policy': {},
          'x-sla-exclusions': [],
          'x-lifecycle-policy': {},
        };
        emit('update:plans', newPlans);
        newPlanName.value = '';
      }
    };

    const removePlan = (name) => {
      const newPlans = { ...props.plans };
      delete newPlans[name];
      emit('update:plans', newPlans);
    };

    return {
      newPlanName,
      updatePlan,
      updatePlanSubObject,
      addPlan,
      removePlan,
    };
  },
};
</script>
