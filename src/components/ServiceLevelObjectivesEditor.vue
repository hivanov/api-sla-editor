<template>
  <div class="service-level-objectives-editor-component">
    <h6 v-if="title">{{ title }}</h6>
    <div v-for="(slo, index) in safeObjectives" :key="index" class="card mb-2 p-2 slo-item">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <span>SLO #{{ index + 1 }}</span>
        <button class="btn btn-danger btn-sm" @click="removeSlo(index)">Remove</button>
      </div>
      <div class="mb-3">
        <label class="form-label">Priority</label>
        <input type="text" class="form-control" :class="{'is-invalid': errors[path + '/' + index + '/priority']}" placeholder="e.g., High" :value="slo.priority" @input="updateSlo(index, 'priority', $event.target.value)">
        <div class="invalid-feedback" v-if="errors[path + '/' + index + '/priority']">
          {{ errors[path + '/' + index + '/priority'].join(', ') }}
        </div>
      </div>
      <div class="mb-3">
        <label class="form-label">Name</label>
        <input type="text" class="form-control" :class="{'is-invalid': errors[path + '/' + index + '/name']}" placeholder="e.g., Incident Resolution" :value="slo.name" @input="updateSlo(index, 'name', $event.target.value)">
        <div class="invalid-feedback" v-if="errors[path + '/' + index + '/name']">
          {{ errors[path + '/' + index + '/name'].join(', ') }}
        </div>
      </div>
      <h6>Guarantees for SLO</h6>
      <div v-for="(guarantee, gIndex) in slo.guarantees" :key="gIndex" class="card mb-2 p-2 slo-guarantee-item">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span>Guar. #{{ gIndex + 1 }}</span>
          <button class="btn btn-danger btn-sm" @click="removeSloGuarantee(index, gIndex)">Remove</button>
        </div>
        <div class="mb-3">
          <div class="d-flex gap-3 mb-2">
            <div class="form-check">
              <input class="form-check-input" type="radio" :name="'slo-mode-' + path.replace(/\//g, '-') + '-' + index + '-' + gIndex" :id="'slo-mode-structured-' + path.replace(/\//g, '-') + '-' + index + '-' + gIndex" 
                :checked="getSloGuaranteeMode(guarantee) === 'structured'" 
                @change="setSloGuaranteeMode(index, gIndex, 'structured')">
              <label class="form-check-label small" :for="'slo-mode-structured-' + path.replace(/\//g, '-') + '-' + index + '-' + gIndex">
                Structured (Recommended)
              </label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" :name="'slo-mode-' + path.replace(/\//g, '-') + '-' + index + '-' + gIndex" :id="'slo-mode-legacy-' + path.replace(/\//g, '-') + '-' + index + '-' + gIndex" 
                :checked="getSloGuaranteeMode(guarantee) === 'legacy'" 
                @change="setSloGuaranteeMode(index, gIndex, 'legacy')">
              <label class="form-check-label small" :for="'slo-mode-legacy-' + path.replace(/\//g, '-') + '-' + index + '-' + gIndex">
                Simple Duration (Legacy)
              </label>
            </div>
          </div>

          <label class="form-label">Metric</label>
          <select class="form-select" :class="{'is-invalid': errors[path + '/' + index + '/guarantees/' + gIndex + '/metric']}" :value="guarantee.metric" @change="updateSloGuarantee(index, gIndex, 'metric', $event.target.value)">
            <option value="" disabled>Select metric</option>
            <option v-for="(metric, name) in metrics" :key="name" :value="name">{{ name }}</option>
          </select>
          <div class="invalid-feedback" v-if="errors[path + '/' + index + '/guarantees/' + gIndex + '/metric']">
            {{ errors[path + '/' + index + '/guarantees/' + gIndex + '/metric'].join(', ') }}
          </div>
        </div>

        <template v-if="getSloGuaranteeMode(guarantee) === 'structured'">
          <div class="row g-2">
            <div class="col-md-4 mb-2">
              <label class="form-label">Operator</label>
              <select class="form-select" :class="{'is-invalid': errors[path + '/' + index + '/guarantees/' + gIndex + '/operator']}" :value="guarantee.operator" @change="updateSloGuarantee(index, gIndex, 'operator', $event.target.value)">
                <option value="">None</option>
                <option value=">">></option>
                <option value="<"><</option>
                <option value=">=">>=</option>
                <option value="<="><=</option>
                <option value="=">=</option>
                <option value="between">between</option>
                <option value="avg">avg</option>
              </select>
            </div>
            
            <div class="col-md-8 mb-2">
              <label class="form-label">Value</label>
              <input type="text" class="form-control" :class="{'is-invalid': errors[path + '/' + index + '/guarantees/' + gIndex + '/value']}" placeholder="Value" :value="guarantee.value" @input="updateSloGuarantee(index, gIndex, 'value', $event.target.value)">
            </div>
          </div>

          <div class="mb-2">
            <DurationEditor 
              :model-value="guarantee.period" 
              :errors="errors"
              :path="path + '/' + index + '/guarantees/' + gIndex + '/period'"
              @update:model-value="updateSloGuarantee(index, gIndex, 'period', $event)"
              label="Period"
            />
          </div>
        </template>

        <template v-else>
          <div class="mt-2 pt-2 border-top">
            <DurationEditor 
              :model-value="guarantee.duration" 
              :errors="errors"
              :path="path + '/' + index + '/guarantees/' + gIndex + '/duration'"
              @update:model-value="updateSloGuarantee(index, gIndex, 'duration', $event)"
              label="Duration"
            />
          </div>
        </template>
      </div>
      <button class="btn btn-secondary btn-sm mt-2" @click="addSloGuarantee(index)">Add SLO Guarantee</button>
    </div>
    <button class="btn btn-secondary btn-sm mt-2 add-slo-btn" @click="addSlo">Add SLO</button>
  </div>
</template>

<script>
import { computed } from 'vue';
import DurationEditor from './DurationEditor.vue';

export default {
  name: 'ServiceLevelObjectivesEditor',
  components: {
    DurationEditor
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
      slo.guarantees.push({ metric: '' });
      newObjectives[sloIndex] = slo;
      updateObjectives(newObjectives);
    };

    const getSloGuaranteeMode = (guarantee) => {
      if (guarantee.duration !== undefined && guarantee.operator === undefined && guarantee.value === undefined && guarantee.period === undefined) {
        return 'legacy';
      }
      return 'structured';
    };

    const setSloGuaranteeMode = (sloIndex, guaranteeIndex, mode) => {
      const newObjectives = [...safeObjectives.value];
      const slo = { ...newObjectives[sloIndex] };
      slo.guarantees = [...slo.guarantees];
      const guarantee = { ...slo.guarantees[guaranteeIndex] };
      
      if (mode === 'legacy') {
        delete guarantee.operator;
        delete guarantee.value;
        delete guarantee.period;
        if (guarantee.duration === undefined) guarantee.duration = '';
      } else {
        delete guarantee.duration;
      }
      
      slo.guarantees[guaranteeIndex] = guarantee;
      newObjectives[sloIndex] = slo;
      updateObjectives(newObjectives);
    };

    const updateSloGuarantee = (sloIndex, guaranteeIndex, key, value) => {
      const newObjectives = [...safeObjectives.value];
      const slo = { ...newObjectives[sloIndex] };
      slo.guarantees = [...slo.guarantees];
      const guarantee = { ...slo.guarantees[guaranteeIndex], [key]: value };
      if (value === '' || value === null || value === undefined) {
        delete guarantee[key];
      }
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
      getSloGuaranteeMode,
      setSloGuaranteeMode,
    };
  },
};
</script>
