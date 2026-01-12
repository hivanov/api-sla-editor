<template>
  <div class="card mt-3 exclusions-editor-component">
    <div class="card-header">
      SLA Exclusions
    </div>
    <div class="card-body">
      <div v-for="(exclusion, index) in safeExclusions" :key="index" class="mb-3">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <div class="d-flex align-items-center">
            <span class="fw-bold small me-2">Exclusion #{{ index + 1 }}</span>
            <select class="form-select form-select-sm" style="width: auto;" :value="getExclusionType(index, exclusion)" @change="setExclusionType(index, $event.target.value)">
              <option value="metric">Metric (PromQL)</option>
              <option value="text">Text (Description)</option>
            </select>
          </div>
          <button class="btn btn-outline-danger btn-sm" @click="removeExclusion(index)">Remove</button>
        </div>
        
        <div v-if="getExclusionType(index, exclusion) === 'text'">
          <textarea 
            class="form-control" 
            rows="2" 
            placeholder="Describe the exclusion..." 
            :value="exclusion" 
            @input="updateExclusion(index, $event.target.value)"
          ></textarea>
        </div>
        <PrometheusMeasurementEditor 
          v-else
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
      <button class="btn btn-outline-secondary btn-sm mt-2 ms-2" @click="addStandardExclusions">Add Standard Force Majeure</button>
    </div>
  </div>
</template>

<script>
import { computed, reactive } from 'vue';
import PrometheusMeasurementEditor from './PrometheusMeasurementEditor.vue';

const STANDARD_EXCLUSIONS = [
  "Natural disasters (e.g., fire, flood, earthquake, hurricane)",
  "War, terrorism, riots, or civil unrest",
  "Epidemics or pandemics",
  "Strikes, lockouts, or labor disputes",
  "Governmental actions or regulatory changes",
  "Failures of infrastructure (transportation, utilities, communications) outside provider control"
];

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
    
    // Store manual type overrides
    const typeOverrides = reactive({});

    const isPromQL = (str) => {
      if (!str) return true; // Default empty to metric to preserve old behavior
      return /^[a-z_]+\(.*\)\s+([<>=!]+|between)\s+.*$/.test(str);
    };

    const getExclusionType = (index, exclusion) => {
      if (typeOverrides[index]) return typeOverrides[index];
      return isPromQL(exclusion) ? 'metric' : 'text';
    };

    const setExclusionType = (index, type) => {
      typeOverrides[index] = type;
    };

    const updateExclusions = (newList) => {
      emit('update:exclusions', newList);
    };

    const addExclusion = () => {
      const newList = [...safeExclusions.value, ''];
      // Force new exclusion to text
      typeOverrides[newList.length - 1] = 'text';
      updateExclusions(newList);
    };

    const addStandardExclusions = () => {
      const currentExclusions = new Set(safeExclusions.value);
      const newList = [...safeExclusions.value];
      let added = false;
      
      STANDARD_EXCLUSIONS.forEach(exclusion => {
        if (!currentExclusions.has(exclusion)) {
          newList.push(exclusion);
          // Standard exclusions are definitely text, implicit by content
          added = true;
        }
      });

      if (added) {
        updateExclusions(newList);
      }
    };

    const updateExclusion = (index, value) => {
      const newList = [...safeExclusions.value];
      newList[index] = value;
      updateExclusions(newList);
    };

    const removeExclusion = (index) => {
      const newList = [...safeExclusions.value];
      newList.splice(index, 1);
      
      // Shift overrides
      const newOverrides = {};
      Object.keys(typeOverrides).forEach(key => {
        const k = parseInt(key);
        if (k < index) newOverrides[k] = typeOverrides[k];
        if (k > index) newOverrides[k - 1] = typeOverrides[k];
      });
      // Replace properties of reactive object
      for (const k in typeOverrides) delete typeOverrides[k];
      Object.assign(typeOverrides, newOverrides);

      updateExclusions(newList);
    };

    return {
      safeExclusions,
      addExclusion,
      addStandardExclusions,
      updateExclusion,
      removeExclusion,
      getExclusionType,
      setExclusionType
    };
  },
};
</script>