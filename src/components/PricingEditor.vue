<template>
  <div class="card mt-3 pricing-editor-component">
    <div class="card-header">
      Pricing
    </div>
    <div class="card-body">
      <div class="mb-3">
        <label class="form-label">Cost</label>
        <input type="number" class="form-control" placeholder="Cost" :value="safePricing.cost" @input="update('cost', $event.target.value)">
      </div>
      <div class="mb-3">
        <label class="form-label">Currency</label>
        <input type="text" class="form-control" placeholder="Currency" :value="safePricing.currency" @input="update('currency', $event.target.value)">
      </div>
      <div class="mb-3">
        <label class="form-label">Period</label>
        <input type="text" class="form-control" placeholder="Period (ISO 8601 Duration)" :value="safePricing.period" @input="update('period', $event.target.value)">
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'PricingEditor',
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
      let newValue = key === 'cost' ? Number(value) : value;
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
