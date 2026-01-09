<template>
  <div class="card mt-3 service-credits-editor-component">
    <div class="card-header">
      Service Credits
    </div>
    <div class="card-body">
      <div class="mb-3">
        <label class="form-label">Currency</label>
        <input type="text" class="form-control" 
               :class="{'is-invalid': errors[path + '/currency']}" 
               placeholder="Currency" 
               :value="safeServiceCredits.currency" 
               @input="updateField('currency', $event.target.value)"
               :list="datalistId">
        <datalist :id="datalistId">
            <option v-for="c in availableCurrencies" :key="c.code" :value="c.code">{{ c.name }}</option>
        </datalist>
        <div class="invalid-feedback" v-if="errors[path + '/currency']">
          {{ errors[path + '/currency'].join(', ') }}
        </div>
      </div>
      <DurationEditor 
        :model-value="safeServiceCredits.claimWindow" 
        :errors="errors"
        :path="path + '/claimWindow'"
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
            <select class="form-select" :class="{'is-invalid': errors[path + '/tiers/' + index + '/condition/metric']}" :value="tier.condition?.metric" @change="updateTierCondition(index, 'metric', $event.target.value)">
              <option value="" disabled>Select metric</option>
              <option v-for="(metric, name) in metrics" :key="name" :value="name">{{ name }}</option>
            </select>
            <div class="invalid-feedback" v-if="errors[path + '/tiers/' + index + '/condition/metric']">
              {{ errors[path + '/tiers/' + index + '/condition/metric'].join(', ') }}
            </div>
          </div>
          <div class="col-md-6 mb-2">
            <label class="form-label">Operator</label>
            <input type="text" class="form-control" :class="{'is-invalid': errors[path + '/tiers/' + index + '/condition/operator']}" placeholder="<" :value="tier.condition?.operator" @input="updateTierCondition(index, 'operator', $event.target.value)">
            <div class="invalid-feedback" v-if="errors[path + '/tiers/' + index + '/condition/operator']">
              {{ errors[path + '/tiers/' + index + '/condition/operator'].join(', ') }}
            </div>
          </div>
          <div class="col-md-6 mb-2">
            <label class="form-label">Value</label>
            <input type="text" class="form-control" :class="{'is-invalid': errors[path + '/tiers/' + index + '/condition/value']}" placeholder="99.9" :value="tier.condition?.value" @input="updateTierCondition(index, 'value', $event.target.value)">
            <div class="invalid-feedback" v-if="errors[path + '/tiers/' + index + '/condition/value']">
              {{ errors[path + '/tiers/' + index + '/condition/value'].join(', ') }}
            </div>
          </div>
          <div class="col-md-6 mb-2">
            <label class="form-label">Compensation</label>
            <input type="number" class="form-control compensation-input" :class="{'is-invalid': errors[path + '/tiers/' + index + '/compensation']}" placeholder="5" :value="tier.compensation" @input="handleCompensationInput(index, $event)" min="0">
            <div class="invalid-feedback" v-if="errors[path + '/tiers/' + index + '/compensation']">
              {{ errors[path + '/tiers/' + index + '/compensation'].join(', ') }}
            </div>
          </div>
        </div>
      </div>
      <button class="btn btn-secondary btn-sm mt-2" @click="addTier">Add Tier</button>
    </div>
  </div>
</template>

<script>
import { computed, inject } from 'vue';
import DurationEditor from './DurationEditor.vue';

export default {
  name: 'ServiceCreditsEditor',
  components: {
    DurationEditor,
  },
  props: {
    serviceCredits: {
      type: Object,
      default: () => ({}),
    },
    metrics: {
      type: Object,
      default: () => ({}),
    },
    errors: {
      type: Object,
      default: () => ({}),
    },
    path: {
      type: String,
      default: '',
    },
  },
  emits: ['update:serviceCredits'],
  setup(props, { emit }) {
    const safeServiceCredits = computed(() => props.serviceCredits || {});
    const availableCurrencies = inject('availableCurrencies', []);
    const datalistId = computed(() => (props.path || 'service-credits').replace(/\//g, '-') + '-currency-list');

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
      const newTiers = [...(newCredits.tiers || [])];
      newTiers[index] = { ...newTiers[index], [key]: value };
      newCredits.tiers = newTiers;
      updateServiceCredits(newCredits);
    };

    const handleCompensationInput = (index, event) => {
      const val = Number(event.target.value);
      updateTier(index, 'compensation', Math.max(0, val));
    };

    const updateTierCondition = (index, key, value) => {
      const newCredits = { ...safeServiceCredits.value };
      const newTiers = [...(newCredits.tiers || [])];
      const tier = { ...newTiers[index] };
      const condition = { ...tier.condition, [key]: value };
      if (value === '' || value === null || value === undefined) {
        delete condition[key];
      }
      tier.condition = condition;
      newTiers[index] = tier;
      newCredits.tiers = newTiers;
      updateServiceCredits(newCredits);
    };

    const removeTier = (index) => {
      const newCredits = { ...safeServiceCredits.value };
      const newTiers = [...(newCredits.tiers || [])];
      newTiers.splice(index, 1);
      newCredits.tiers = newTiers;
      if (newCredits.tiers.length === 0) delete newCredits.tiers;
      updateServiceCredits(newCredits);
    };

    return {
      safeServiceCredits,
      updateField,
      addTier,
      updateTier,
      handleCompensationInput,
      updateTierCondition,
      removeTier,
      availableCurrencies,
      datalistId,
    };
  },
};
</script>