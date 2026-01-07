<template>
  <div class="card mt-3 pricing-editor-component">
    <div class="card-header">
      Pricing
    </div>
    <div class="card-body">
      <div class="mb-3">
        <label class="form-label">Cost</label>
        <input type="number" class="form-control" placeholder="Cost" :value="safePricing.cost" @input="update('cost', $event.target.value)" min="0">
      </div>
      <div class="mb-3">
        <label class="form-label">Currency</label>
        <input type="text" class="form-control" placeholder="Currency" :value="safePricing.currency" @input="update('currency', $event.target.value)">
      </div>
      <DurationEditor 
        :model-value="safePricing.period" 
        @update:model-value="update('period', $event)"
        label="Period"
      />
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import DurationEditor from './DurationEditor.vue';

export default {
  name: 'PricingEditor',
  components: {
    DurationEditor
  },
  props: {
    pricing: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['update:pricing'],
  setup(props, { emit }) {
    const safePricing = computed(() => props.pricing || {});

    const update = (key, value) => {
      // Convert cost to number as per schema
      let newValue = key === 'cost' ? Math.max(0, Number(value)) : value;
      const newPricing = { ...safePricing.value, [key]: newValue };
      
      if (value === '' || value === null || value === undefined) {
        delete newPricing[key];
      }
      
      emit('update:pricing', newPricing);
    };

    return {
      safePricing,
      update,
    };
  },
};
</script>
