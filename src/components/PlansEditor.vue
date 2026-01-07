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
          <div class="mb-3">
            <label class="form-label">Availability</label>
            <input type="text" class="form-control" placeholder="Plan Availability" :value="plan.availability" @input="updatePlan(name, 'availability', $event.target.value)">
          </div>

          <h6>Guarantees</h6>
          <div v-for="(guarantee, index) in plan.guarantees" :key="index" class="card mb-2 p-2">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span>Guarantee #{{ index + 1 }}</span>
              <button class="btn btn-danger btn-sm" @click="removeGuarantee(name, index)">Remove</button>
            </div>
            <div class="mb-3">
              <label class="form-label">Metric Name</label>
              <input type="text" class="form-control" placeholder="Metric Name" :value="guarantee.metric" @input="updateGuarantee(name, index, 'metric', $event.target.value)">
            </div>
            <div class="mb-3">
              <label class="form-label">Limit (ISO 8601 Duration)</label>
              <input type="text" class="form-control" placeholder="Limit" :value="guarantee.limit" @input="updateGuarantee(name, index, 'limit', $event.target.value)">
            </div>
          </div>
          <button class="btn btn-secondary btn-sm mt-2" @click="addGuarantee(name)">Add Guarantee</button>
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

export default {
  name: 'PlansEditor',
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

    const addPlan = () => {
      if (newPlanName.value && !props.plans[newPlanName.value]) {
        const newPlans = { ...props.plans };
        newPlans[newPlanName.value] = {
          title: '',
          description: '',
          availability: '',
          guarantees: [], // Initialize guarantees as an empty array
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

    const addGuarantee = (planName) => {
      const newPlans = { ...props.plans };
      if (!newPlans[planName].guarantees) {
        newPlans[planName].guarantees = [];
      }
      newPlans[planName].guarantees.push({ metric: '', limit: '' });
      emit('update:plans', newPlans);
    };

    const updateGuarantee = (planName, guaranteeIndex, key, value) => {
      const newPlans = { ...props.plans };
      newPlans[planName].guarantees[guaranteeIndex] = {
        ...newPlans[planName].guarantees[guaranteeIndex],
        [key]: value,
      };
      emit('update:plans', newPlans);
    };

    const removeGuarantee = (planName, guaranteeIndex) => {
      const newPlans = { ...props.plans };
      newPlans[planName].guarantees.splice(guaranteeIndex, 1);
      emit('update:plans', newPlans);
    };

    return {
      newPlanName,
      updatePlan,
      addPlan,
      removePlan,
      addGuarantee,
      updateGuarantee,
      removeGuarantee,
    };
  },
};
</script>
