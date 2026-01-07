<template>
  <div class="card mt-3 service-credits-editor-component">
    <div class="card-header">
      Service Credits
    </div>
    <div class="card-body">
      <div class="mb-3">
        <label class="form-label">Currency</label>
        <input type="text" class="form-control" placeholder="Currency" :value="safeServiceCredits.currency" @input="updateField('currency', $event.target.value)">
      </div>
      <DurationEditor 
        :model-value="safeServiceCredits.claimWindow" 
        @update:model-value="updateField('claimWindow', $event)"
        label="Claim Window"
      />

      <h6>Tiers</h6>
      <div v-for="(tier, index) in safeServiceCredits.tiers" :key="index" class="card mb-2 p-2">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span>Tier #{{ index + 1 }}</span>
          <button class="btn btn-danger btn-sm" @click="removeTier(index)">Remove</button>
        </div>
        <div class="row">
          <div class="col-md-6 mb-2">
            <label class="form-label">Metric</label>
            <input type="text" class="form-control" placeholder="uptime" :value="tier.condition?.metric" @input="updateTierCondition(index, 'metric', $event.target.value)">
          </div>
          <div class="col-md-6 mb-2">
            <label class="form-label">Operator</label>
            <input type="text" class="form-control" placeholder="<" :value="tier.condition?.operator" @input="updateTierCondition(index, 'operator', $event.target.value)">
          </div>
          <div class="col-md-6 mb-2">
            <label class="form-label">Value</label>
            <input type="text" class="form-control" placeholder="99.9" :value="tier.condition?.value" @input="updateTierCondition(index, 'value', $event.target.value)">
          </div>
          <div class="col-md-6 mb-2">
            <label class="form-label">Compensation</label>
            <input type="number" class="form-control" placeholder="5" :value="tier.compensation" @input="updateTier(index, 'compensation', Math.max(0, Number($event.target.value)))" min="0">
          </div>
        </div>
      </div>
      <button class="btn btn-secondary btn-sm mt-2" @click="addTier">Add Tier</button>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import DurationEditor from './DurationEditor.vue';

export default {
  name: 'ServiceCreditsEditor',
  components: {
    DurationEditor
  },
  props: {
    serviceCredits: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['update:serviceCredits'],
  setup(props, { emit }) {
    const safeServiceCredits = computed(() => props.serviceCredits || {});

    const updateServiceCredits = (newCredits) => {
      const cleaned = { ...newCredits };
      // Deep clean tiers if needed, but for now just basic check
      emit('update:serviceCredits', cleaned);
    };

    const updateField = (key, value) => {
      const newCredits = { ...safeServiceCredits.value, [key]: value };
      if (value === '' || value === null || value === undefined) {
        delete newCredits[key];
      }
      updateServiceCredits(newCredits);
    };

    const addTier = () => {
      const newCredits = { ...safeServiceCredits.value };
      if (!newCredits.tiers) {
        newCredits.tiers = [];
      }
      newCredits.tiers.push({ condition: {}, compensation: 0 });
      updateServiceCredits(newCredits);
    };

    const updateTier = (index, key, value) => {
      const newCredits = { ...safeServiceCredits.value };
      newCredits.tiers[index] = { ...newCredits.tiers[index], [key]: value };
      updateServiceCredits(newCredits);
    };

    const updateTierCondition = (index, key, value) => {
      const newCredits = { ...safeServiceCredits.value };
      const tier = { ...newCredits.tiers[index] };
      const condition = { ...tier.condition, [key]: value };
      if (value === '' || value === null || value === undefined) {
        delete condition[key];
      }
      tier.condition = condition;
      newCredits.tiers[index] = tier;
      updateServiceCredits(newCredits);
    };

    const removeTier = (index) => {
      const newCredits = { ...safeServiceCredits.value };
      newCredits.tiers.splice(index, 1);
      if (newCredits.tiers.length === 0) delete newCredits.tiers;
      updateServiceCredits(newCredits);
    };

    return {
      safeServiceCredits,
      updateField,
      addTier,
      updateTier,
      updateTierCondition,
      removeTier,
    };
  },
};
</script>
