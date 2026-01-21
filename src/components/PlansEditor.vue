<template>
  <div class="plans-editor-content plans-editor-component">
    <div v-for="(plan, name) in plans" :key="name" class="card mb-4 plan-item" :data-plan-name="name">
      <div class="card-header d-flex justify-content-between align-items-center bg-light">
        <h5 class="mb-0">{{ name }}</h5>
        <button class="btn btn-outline-danger btn-sm btn-remove-plan" @click="removePlan(name)">Remove</button>
      </div>
      <div class="card-body">
        <div class="mb-3">
          <label class="form-label">Title</label>
          <input type="text" class="form-control input-plan-title" :class="{'is-invalid': errors['/plans/' + name + '/title']}" placeholder="Plan Title" :value="plan.title" @input="updatePlan(name, 'title', $event.target.value)">
          <div class="invalid-feedback" v-if="errors['/plans/' + name + '/title']">
            {{ errors['/plans/' + name + '/title'].join(', ') }}
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label">Description</label>
          <MarkdownEditor 
            :model-value="plan.description" 
            :invalid="!!errors['/plans/' + name + '/description']"
            placeholder="Plan Description (Markdown supported)"
            @update:modelValue="updatePlan(name, 'description', $event)" 
          />
          <div class="invalid-feedback d-block" v-if="errors['/plans/' + name + '/description']">
            {{ errors['/plans/' + name + '/description'].join(', ') }}
          </div>
        </div>
        
        <!-- Availability Editor -->
        <AvailabilityEditor :availability="plan.availability" :metrics="metrics" :errors="errors" :path="'/plans/' + name + '/availability'" @update:availability="updatePlan(name, 'availability', $event)" />

        <!-- Pricing Editor -->
        <PricingEditor :pricing="plan.pricing" :errors="errors" :path="'/plans/' + name + '/pricing'" @update:pricing="updatePlanSubObject(name, 'pricing', $event)" />

        <!-- Quotas Editor -->
        <QuotasEditor :quotas="plan.quotas" :metrics="metrics" :errors="errors" :path="'/plans/' + name + '/quotas'" @update:quotas="updatePlanSubObject(name, 'quotas', $event)" />

        <!-- Guarantees Editor -->
        <GuaranteesEditor :guarantees="plan.guarantees" :metrics="metrics" :errors="errors" :path="'/plans/' + name + '/guarantees'" @update:guarantees="updatePlanSubObject(name, 'guarantees', $event)" />

        <!-- Service Level Objectives Editor -->
        <ServiceLevelObjectivesEditor :model-value="plan.serviceLevelObjectives" :metrics="metrics" :errors="errors" :path="'/plans/' + name + '/serviceLevelObjectives'" @update:model-value="updatePlanSubObject(name, 'serviceLevelObjectives', $event)" />

        <!-- Support Policy Editor -->
        <SupportPolicyEditor :support-policy="plan.supportPolicy" :metrics="metrics" :errors="errors" :path="'/plans/' + name + '/supportPolicy'" @update:support-policy="updatePlanSubObject(name, 'supportPolicy', $event)" />

        <!-- Service Credits Editor -->
        <ServiceCreditsEditor :service-credits="plan.serviceCredits" :metrics="metrics" :errors="errors" :path="'/plans/' + name + '/serviceCredits'" @update:service-credits="updatePlanSubObject(name, 'serviceCredits', $event)" />

        <!-- Maintenance Policy Editor -->
        <MaintenancePolicyEditor :maintenance-policy="plan.maintenancePolicy" :errors="errors" :path="'/plans/' + name + '/maintenancePolicy'" @update:maintenance-policy="updatePlanSubObject(name, 'maintenancePolicy', $event)" />

        <!-- Exclusions Editor -->
        <ExclusionsEditor :exclusions="plan.slaExclusions" :metrics="metrics" :errors="errors" :path="'/plans/' + name + '/slaExclusions'" @update:exclusions="updatePlanSubObject(name, 'slaExclusions', $event)" />

        <!-- Lifecycle Policy Editor -->
        <LifecyclePolicyEditor :lifecycle-policy="plan.lifecyclePolicy" :errors="errors" :path="'/plans/' + name + '/lifecyclePolicy'" @update:lifecycle-policy="updatePlanSubObject(name, 'lifecyclePolicy', $event)" />
      </div>
    </div>
    <div class="mt-3">
      <div class="input-group">
        <input type="text" class="form-control input-new-plan-name" placeholder="New plan name" v-model="newPlanName">
        <button class="btn btn-primary btn-add-plan" @click="addPlan">Add Plan</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import MarkdownEditor from './MarkdownEditor.vue';
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
    MarkdownEditor,
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
          availability: { target: '100%', metric: '', expression: '' }
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
