<template>
  <div class="currency-editor-component">
    <div v-for="(currency, index) in safeCurrencies" :key="index" class="card mb-2 p-2 shadow-sm">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <span class="fw-bold">Custom Currency #{{ index + 1 }}</span>
        <button class="btn btn-outline-danger btn-sm" @click="removeCurrency(index)">Remove</button>
      </div>
      
      <div class="row g-2">
        <div class="col-md-4 mb-2">
          <label class="form-label">Code (e.g., SKU, CPU)</label>
          <input type="text" class="form-control" 
                 :class="{'is-invalid': errors[path + '/' + index + '/code']}"
                 placeholder="SKU" 
                 :value="currency.code" 
                 @input="updateCurrency(index, 'code', $event.target.value)">
          <div class="invalid-feedback" v-if="errors[path + '/' + index + '/code']">
            {{ errors[path + '/' + index + '/code'].join(', ') }}
          </div>
        </div>
        
        <div class="col-md-8 mb-2">
          <label class="form-label">Description</label>
          <MarkdownEditor 
            :model-value="currency.description" 
            :invalid="!!errors[path + '/' + index + '/description']"
            placeholder="Currency Description (Markdown supported)"
            @update:modelValue="updateCurrency(index, 'description', $event)" 
          />
          <div class="invalid-feedback d-block" v-if="errors[path + '/' + index + '/description']">
            {{ errors[path + '/' + index + '/description'].join(', ') }}
          </div>
        </div>
      </div>

      <div class="card bg-light p-2 mt-2">
        <h6>Conversion (Optional)</h6>
        <div class="row g-2">
          <div class="col-md-6">
            <label class="form-label">Rate (1 {{ currency.code || 'unit' }} = ?)</label>
            <input type="number" step="any" min="0" class="form-control" 
                   :class="{'is-invalid': errors[path + '/' + index + '/conversion/rate']}"
                   placeholder="1.0" 
                   :value="currency.conversion?.rate" 
                   @input="updateConversion(index, 'rate', $event.target.value)">
            <div class="invalid-feedback" v-if="errors[path + '/' + index + '/conversion/rate']">
              {{ errors[path + '/' + index + '/conversion/rate'].join(', ') }}
            </div>
          </div>
          <div class="col-md-6">
            <label class="form-label">Base Currency</label>
            <input type="text" class="form-control" 
                   :class="{'is-invalid': errors[path + '/' + index + '/conversion/baseCurrency']}"
                   placeholder="USD" 
                   :value="currency.conversion?.baseCurrency" 
                   @input="updateConversion(index, 'baseCurrency', $event.target.value)"
                   :list="'base-currencies-' + index">
            <datalist :id="'base-currencies-' + index">
              <option v-for="c in standardCurrencies" :key="c.code" :value="c.code">{{ c.name }}</option>
            </datalist>
            <div class="invalid-feedback" v-if="errors[path + '/' + index + '/conversion/baseCurrency']">
              {{ errors[path + '/' + index + '/conversion/baseCurrency'].join(', ') }}
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <button class="btn btn-secondary btn-sm mt-2" @click="addCurrency">Add Custom Currency</button>
  </div>
</template>

<script>
import { computed } from 'vue';
import MarkdownEditor from './MarkdownEditor.vue';
import { currencies as standardCurrencies } from '../utils/currencies';

export default {
  name: 'CurrencyEditor',
  components: {
    MarkdownEditor
  },
  props: {
    customCurrencies: {
      type: Array,
      default: () => [],
    },
    errors: {
      type: Object,
      default: () => ({}),
    },
    path: {
      type: String,
      default: '/customCurrencies',
    },
  },
  emits: ['update:custom-currencies'],
  setup(props, { emit }) {
    const safeCurrencies = computed(() => props.customCurrencies || []);

    const updateCurrencies = (newList) => {
      emit('update:custom-currencies', newList);
    };

    const addCurrency = () => {
      const newList = [...safeCurrencies.value];
      newList.push({ code: '', description: '' });
      updateCurrencies(newList);
    };

    const updateCurrency = (index, key, value) => {
      const newList = [...safeCurrencies.value];
      newList[index] = { ...newList[index], [key]: value };
      updateCurrencies(newList);
    };

    const updateConversion = (index, key, value) => {
      const newList = [...safeCurrencies.value];
      const currency = { ...newList[index] };
      const conversion = currency.conversion ? { ...currency.conversion } : { rate: 1, baseCurrency: '' };
      
      if (key === 'rate') {
        conversion.rate = parseFloat(value) || 0;
      } else {
        conversion[key] = value;
      }
      
      currency.conversion = conversion;
      newList[index] = currency;
      updateCurrencies(newList);
    };

    const removeCurrency = (index) => {
      const newList = [...safeCurrencies.value];
      newList.splice(index, 1);
      updateCurrencies(newList);
    };

    return {
      safeCurrencies,
      standardCurrencies,
      addCurrency,
      updateCurrency,
      updateConversion,
      removeCurrency,
    };
  },
};
</script>
