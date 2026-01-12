<template>
  <div class="card mt-3 exclusions-editor-component">
    <div class="card-header">
      SLA Exclusions
    </div>
    <div class="card-body">
      <div v-for="(exclusion, index) in safeExclusions" :key="index" class="mb-3">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span class="fw-bold small">Exclusion #{{ index + 1 }}</span>
          <button class="btn btn-outline-danger btn-sm" @click="removeExclusion(index)">Remove</button>
        </div>
        <PrometheusMeasurementEditor 
          :model-value="exclusion" 
          :metrics="metrics"
          :errors="errors"
          :path="path + '/' + index"
          @update:model-value="updateExclusion(index, $event)"
        />
        <div class="invalid-feedback d-block" v-if="errors[path + '/' + index]">
          {{ errors[path + '/' + index].join(', ') }}
        </div>
      </div>
      <button class="btn btn-secondary btn-sm mt-2" @click="addExclusion">Add Exclusion</button>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import PrometheusMeasurementEditor from './PrometheusMeasurementEditor.vue';

export default {
  name: 'ExclusionsEditor',
  components: {
    PrometheusMeasurementEditor
  },
  props: {
    exclusions: {
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
  emits: ['update:exclusions'],
  setup(props, { emit }) {
    const safeExclusions = computed(() => props.exclusions || []);

    const updateExclusions = (newList) => {
      emit('update:exclusions', newList);
    };

    const addExclusion = () => {
      const newList = [...safeExclusions.value, ''];
      updateExclusions(newList);
    };

    const updateExclusion = (index, value) => {
      const newList = [...safeExclusions.value];
      newList[index] = value;
      updateExclusions(newList);
    };

    const removeExclusion = (index) => {
      const newList = [...safeExclusions.value];
      newList.splice(index, 1);
      updateExclusions(newList);
    };

    return {
      safeExclusions,
      addExclusion,
      updateExclusion,
      removeExclusion,
    };
  },
};
</script>