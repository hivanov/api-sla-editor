<template>
  <div class="card mt-3 quotas-editor-component">
    <div class="card-header">
      Quotas
    </div>
    <div class="card-body">
      <div v-for="(value, key) in safeQuotas" :key="key" class="mb-3">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span class="fw-bold small">Quota Entry</span>
          <button class="btn btn-outline-danger btn-sm" @click="removeQuota(key)">Remove</button>
        </div>
        <PrometheusMeasurementEditor 
          :model-value="value" 
          :metrics="metrics"
          :errors="errors"
          :path="path + '/' + key"
          @update:model-value="updateQuota(key, $event)"
        />
        <div class="invalid-feedback d-block" v-if="errors[path + '/' + key]">
          {{ errors[path + '/' + key].join(', ') }}
        </div>
      </div>
      <button class="btn btn-secondary btn-sm mt-2" @click="addQuota">Add Quota</button>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import PrometheusMeasurementEditor from './PrometheusMeasurementEditor.vue';

export default {
  name: 'QuotasEditor',
  components: {
    PrometheusMeasurementEditor
  },
  props: {
    quotas: {
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
  emits: ['update:quotas'],
  setup(props, { emit }) {
    const safeQuotas = computed(() => props.quotas || {});

    const updateQuota = (key, value) => {
      const newQuotas = { ...safeQuotas.value, [key]: value };
      emit('update:quotas', newQuotas);
    };

    const addQuota = () => {
      const newKey = 'q' + Date.now();
      const newQuotas = { ...safeQuotas.value, [newKey]: '' };
      emit('update:quotas', newQuotas);
    };

    const removeQuota = (key) => {
      const newQuotas = { ...safeQuotas.value };
      delete newQuotas[key];
      emit('update:quotas', newQuotas);
    };

    return {
      safeQuotas,
      updateQuota,
      addQuota,
      removeQuota,
    };
  },
};
</script>
