<template>
  <div class="card mt-3 guarantees-editor-component">
    <div class="card-header">
      Guarantees
    </div>
    <div class="card-body">
      <div v-for="(guarantee, index) in safeGuarantees" :key="index" class="card mb-2 p-2">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span>Guarantee #{{ index + 1 }}</span>
          <button class="btn btn-danger btn-sm" @click="removeGuarantee(index)">Remove</button>
        </div>
        <div class="mb-3">
          <label class="form-label">Metric Name</label>
          <select class="form-select" :class="{'is-invalid': errors[path + '/' + index + '/metric']}" :value="guarantee.metric" @change="updateGuarantee(index, 'metric', $event.target.value)">
            <option value="" disabled>Select metric</option>
            <option v-for="(metric, name) in metrics" :key="name" :value="name">{{ name }}</option>
          </select>
          <div class="invalid-feedback" v-if="errors[path + '/' + index + '/metric']">
            {{ errors[path + '/' + index + '/metric'].join(', ') }}
          </div>
        </div>
        <DurationEditor 
          :model-value="guarantee.limit" 
          :errors="errors"
          :path="path + '/' + index + '/limit'"
          @update:model-value="updateGuarantee(index, 'limit', $event)"
          label="Limit"
        />
      </div>
      <button class="btn btn-secondary btn-sm mt-2" @click="addGuarantee">Add Guarantee</button>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import DurationEditor from './DurationEditor.vue';

export default {
  name: 'GuaranteesEditor',
  components: {
    DurationEditor
  },
  props: {
    guarantees: {
      type: Array,
      default: () => [],
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
  emits: ['update:guarantees'],
  setup(props, { emit }) {
    const safeGuarantees = computed(() => props.guarantees || []);

    const updateGuarantees = (newList) => {
      emit('update:guarantees', newList);
    };

    const addGuarantee = () => {
      const newList = [...safeGuarantees.value];
      newList.push({ metric: '', limit: '' });
      updateGuarantees(newList);
    };

    const updateGuarantee = (index, key, value) => {
      const newList = [...safeGuarantees.value];
      const newGuarantee = { ...newList[index], [key]: value };
      if (value === '' || value === null || value === undefined) {
        delete newGuarantee[key];
      }
      newList[index] = newGuarantee;
      updateGuarantees(newList);
    };

    const removeGuarantee = (index) => {
      const newList = [...safeGuarantees.value];
      newList.splice(index, 1);
      updateGuarantees(newList);
    };

    return {
      safeGuarantees,
      addGuarantee,
      updateGuarantee,
      removeGuarantee,
    };
  },
};
</script>