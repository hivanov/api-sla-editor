<template>
  <div class="card mt-3 quotas-editor-component">
    <div class="card-header">
      Quotas
    </div>
    <div class="card-body">
      <div v-for="(value, key) in safeQuotas" :key="key" class="mb-2">
        <div class="input-group">
          <span class="input-group-text">{{ key }}</span>
          <input type="text" class="form-control" :class="{'is-invalid': errors[path + '/' + key]}" :value="value" @input="updateQuota(key, $event.target.value)" placeholder="Quota Value">
          <button class="btn btn-danger" @click="removeQuota(key)">Remove</button>
          <div class="invalid-feedback" v-if="errors[path + '/' + key]">
            {{ errors[path + '/' + key].join(', ') }}
          </div>
        </div>
      </div>
      <div class="input-group mt-3">
        <input type="text" class="form-control" placeholder="New quota key" v-model="newQuotaKey">
        <input type="text" class="form-control" placeholder="New quota value" v-model="newQuotaValue">
        <button class="btn btn-primary" @click="addQuota">Add Quota</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  name: 'QuotasEditor',
  props: {
    quotas: {
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
    const newQuotaKey = ref('');
    const newQuotaValue = ref('');

    const safeQuotas = computed(() => props.quotas || {});

    const updateQuota = (key, value) => {
      const newQuotas = { ...safeQuotas.value, [key]: value };
      emit('update:quotas', newQuotas);
    };

    const addQuota = () => {
      if (newQuotaKey.value && !safeQuotas.value[newQuotaKey.value]) {
        const newQuotas = { ...safeQuotas.value, [newQuotaKey.value]: newQuotaValue.value };
        emit('update:quotas', newQuotas);
        newQuotaKey.value = '';
        newQuotaValue.value = '';
      }
    };

    const removeQuota = (key) => {
      const newQuotas = { ...safeQuotas.value };
      delete newQuotas[key];
      emit('update:quotas', newQuotas);
    };

    return {
      newQuotaKey,
      newQuotaValue,
      safeQuotas,
      updateQuota,
      addQuota,
      removeQuota,
    };
  },
};
</script>
