<template>
  <div class="card mt-3 plans-editor-component">
    <div class="card-header">
      Plans
    </div>
    <div class="card-body">
      <div v-for="(plan, name) in plans" :key="name" class="card mb-3 plan-item">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h5>{{ name }}</h5>
          <button class="btn btn-danger btn-sm" @click="removePlan(name)">Remove</button>
        </div>
        <div class="card-body">
          <div class="mb-3">
            <label class="form-label">Title</label>
            <input type="text" class="form-control" placeholder="Plan Title" :value="plan.title" @input="updatePlan(name, 'title', $event.target.value)">
          </div>
          <div class="mb-3">
            <label class="form-label">Description</label>
            <textarea class="form-control" placeholder="Plan Description" :value="plan.description" @input="updatePlan(name, 'description', $event.target.value)"></textarea>
          </div>
          
          <!-- Availability Editor -->
          <AvailabilityEditor :availability="plan.availability" @update:availability="updatePlan(name, 'availability', $event)" />

          <!-- Pricing Editor -->
          <PricingEditor :pricing="plan.pricing" @update:pricing="updatePlanSubObject(name, 'pricing', $event)" />

          <!-- Quotas Editor -->
          <QuotasEditor :quotas="plan.quotas" @update:quotas="updatePlanSubObject(name, 'quotas', $event)" />

          <!-- Guarantees Editor -->
          <GuaranteesEditor :guarantees="plan.guarantees" @update:guarantees="updatePlanSubObject(name, 'guarantees', $event)" />

          <!-- Support Policy Editor -->
          <SupportPolicyEditor :support-policy="plan['x-support-policy']" @update:support-policy="updatePlanSubObject(name, 'x-support-policy', $event)" />

          <!-- Service Credits Editor -->
          <ServiceCreditsEditor :service-credits="plan['x-service-credits']" @update:service-credits="updatePlanSubObject(name, 'x-service-credits', $event)" />

          <!-- Maintenance Policy Editor -->
          <MaintenancePolicyEditor :maintenance-policy="plan['x-maintenance-policy']" @update:maintenance-policy="updatePlanSubObject(name, 'x-maintenance-policy', $event)" />

          <!-- Exclusions Editor -->
          <ExclusionsEditor :exclusions="plan['x-sla-exclusions']" @update:exclusions="updatePlanSubObject(name, 'x-sla-exclusions', $event)" />

          <!-- Lifecycle Policy Editor -->
          <LifecyclePolicyEditor :lifecycle-policy="plan['x-lifecycle-policy']" @update:lifecycle-policy="updatePlanSubObject(name, 'x-lifecycle-policy', $event)" />
        </div>
      </div>
      <div class="mt-3">
        <div class="input-group">
          <input type="text" class="form-control" placeholder="New plan name" v-model="newPlanName">
          <button class="btn btn-primary" @click="addPlan">Add Plan</button>
        </div>
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
