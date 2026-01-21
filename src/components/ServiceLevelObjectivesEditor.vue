<template>
  <div class="service-level-objectives-editor-component">
    <h6 v-if="title">{{ title }}</h6>
    <div v-for="(slo, index) in safeObjectives" :key="index" class="card mb-2 p-2 slo-item">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <span>SLO #{{ index + 1 }}</span>
        <button class="btn btn-danger btn-sm btn-remove-slo" @click="removeSlo(index)">Remove</button>
      </div>
      <div class="mb-3">
        <label class="form-label">Priority</label>
        <input type="text" class="form-control input-slo-priority" :class="{'is-invalid': errors[path + '/' + index + '/priority']}" placeholder="e.g., High" :value="slo.priority" @input="updateSlo(index, 'priority', $event.target.value)">
        <div class="invalid-feedback" v-if="errors[path + '/' + index + '/priority']">
          {{ errors[path + '/' + index + '/priority'].join(', ') }}
        </div>
      </div>
      <div class="mb-3">
        <label class="form-label">Name</label>
        <input type="text" class="form-control input-slo-name" :class="{'is-invalid': errors[path + '/' + index + '/name']}" placeholder="e.g., Incident Resolution" :value="slo.name" @input="updateSlo(index, 'name', $event.target.value)">
        <div class="invalid-feedback" v-if="errors[path + '/' + index + '/name']">
          {{ errors[path + '/' + index + '/name'].join(', ') }}
        </div>
      </div>
      <h6>Guarantees for SLO</h6>
      <div v-for="(guarantee, gIndex) in slo.guarantees" :key="gIndex" class="card mb-2 p-2 slo-guarantee-item">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span>Guar. #{{ gIndex + 1 }}</span>
          <button class="btn btn-danger btn-sm btn-remove-slo-guarantee" @click="removeSloGuarantee(index, gIndex)">Remove</button>
        </div>
        <div class="mb-3">
          <PrometheusMeasurementEditor 
            :model-value="guarantee.measurement" 
            :metrics="metrics"
            :errors="errors"
            :path="path + '/' + index + '/guarantees/' + gIndex + '/measurement'"
            @update:model-value="updateSloGuarantee(index, gIndex, 'measurement', $event)"
          />
        </div>
      </div>
      <button class="btn btn-secondary btn-sm mt-2 btn-add-slo-guarantee" @click="addSloGuarantee(index)">Add SLO Guarantee</button>
    </div>
    <button class="btn btn-secondary btn-sm mt-2 add-slo-btn btn-add-slo" @click="addSlo">Add SLO</button>
  </div>
</template>

<script>
import { computed } from 'vue';
import PrometheusMeasurementEditor from './PrometheusMeasurementEditor.vue';

export default {
  name: 'ServiceLevelObjectivesEditor',
  components: {
    PrometheusMeasurementEditor
  },
  props: {
    modelValue: {
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
    title: {
      type: String,
      default: 'Service Level Objectives (SLOs)'
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const safeObjectives = computed(() => props.modelValue || []);

    const updateObjectives = (newObjectives) => {
      emit('update:modelValue', newObjectives);
    };

    const addSlo = () => {
      const newObjectives = [...safeObjectives.value];
      newObjectives.push({ priority: '', name: '', guarantees: [] });
      updateObjectives(newObjectives);
    };

    const updateSlo = (index, key, value) => {
      const newObjectives = [...safeObjectives.value];
      newObjectives[index] = { ...newObjectives[index], [key]: value };
      updateObjectives(newObjectives);
    };

    const removeSlo = (index) => {
      const newObjectives = [...safeObjectives.value];
      newObjectives.splice(index, 1);
      updateObjectives(newObjectives);
    };

    const addSloGuarantee = (sloIndex) => {
      const newObjectives = [...safeObjectives.value];
      const slo = { ...newObjectives[sloIndex] };
      if (!slo.guarantees) {
        slo.guarantees = [];
      } else {
        slo.guarantees = [...slo.guarantees];
      }
      slo.guarantees.push({ measurement: '' });
      newObjectives[sloIndex] = slo;
      updateObjectives(newObjectives);
    };

    const updateSloGuarantee = (sloIndex, guaranteeIndex, key, value) => {
      const newObjectives = [...safeObjectives.value];
      const slo = { ...newObjectives[sloIndex] };
      slo.guarantees = [...slo.guarantees];
      const guarantee = { ...slo.guarantees[guaranteeIndex], [key]: value };
      slo.guarantees[guaranteeIndex] = guarantee;
      newObjectives[sloIndex] = slo;
      updateObjectives(newObjectives);
    };

    const removeSloGuarantee = (sloIndex, guaranteeIndex) => {
      const newObjectives = [...safeObjectives.value];
      const slo = { ...newObjectives[sloIndex] };
      slo.guarantees = [...slo.guarantees];
      slo.guarantees.splice(guaranteeIndex, 1);
      newObjectives[sloIndex] = slo;
      updateObjectives(newObjectives);
    };

    return {
      safeObjectives,
      addSlo,
      updateSlo,
      removeSlo,
      addSloGuarantee,
      updateSloGuarantee,
      removeSloGuarantee,
    };
  },
};
</script>
