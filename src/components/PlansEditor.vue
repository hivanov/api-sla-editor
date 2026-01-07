<template>
  <div class="card mt-3">
    <div class="card-header">
      Plans
    </div>
    <div class="card-body">
      <div v-for="(plan, name) in plans" :key="name" class="card mb-3">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h5>{{ name }}</h5>
          <button class="btn btn-danger btn-sm" @click="removePlan(name)">Remove</button>
        </div>
        <div class="card-body">
          <div class="mb-3">
            <label class="form-label">Title</label>
            <input type="text" class="form-control" :value="plan.title" @input="updatePlan(name, 'title', $event.target.value)">
          </div>
          <div class="mb-3">
            <label class="form-label">Description</label>
            <textarea class="form-control" :value="plan.description" @input="updatePlan(name, 'description', $event.target.value)"></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">Availability</label>
            <input type="text" class="form-control" :value="plan.availability" @input="updatePlan(name, 'availability', $event.target.value)">
          </div>
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
      addPlan,
      removePlan,
    };
  },
};
</script>
