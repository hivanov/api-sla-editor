<template>
  <div class="card mt-3 pricing-editor-component">
    <div class="card-header">
      Pricing
    </div>
    <div class="card-body">
      <div class="mb-3">
        <label class="form-label">Cost</label>
        <input type="number" class="form-control" :class="{'is-invalid': errors[path + '/cost']}" placeholder="Cost" :value="safePricing.cost" @input="update('cost', $event.target.value)" min="0">
        <div class="invalid-feedback" v-if="errors[path + '/cost']">
          {{ errors[path + '/cost'].join(', ') }}
        </div>
      </div>
      <div class="mb-3">
        <label class="form-label">Currency</label>
        <input type="text" class="form-control" 
               :class="{'is-invalid': errors[path + '/currency']}" 
               placeholder="Currency" 
               :value="safePricing.currency" 
               @input="update('currency', $event.target.value)"
               :list="datalistId">
        <datalist :id="datalistId">
            <option v-for="c in availableCurrencies" :key="c.code" :value="c.code">{{ c.name }}</option>
        </datalist>
        <div class="invalid-feedback" v-if="errors[path + '/currency']">
          {{ errors[path + '/currency'].join(', ') }}
        </div>
      </div>
      <DurationEditor 
        :modelValue="safePricing.period" 
        :errors="errors"
        :path="path + '/period'"
        @update:modelValue="update('period', $event)"
        label="Period"
      />
    </div>
  </div>
</template>

<script>
import { computed, inject } from 'vue';
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
    errors: {
      type: Object,
      default: () => ({}),
    },
    path: {
      type: String,
      default: '',
    },
  },
  emits: ['update:pricing'],
  setup(props, { emit }) {
    const safePricing = computed(() => props.pricing || {});
    const availableCurrencies = inject('availableCurrencies', []);
    const datalistId = computed(() => (props.path || 'pricing').replace(/\//g, '-') + '-currency-list');

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
      availableCurrencies,
      datalistId,
    };
  },
};
</script>
