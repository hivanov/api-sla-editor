<template>
  <div class="card mt-3 guarantees-editor-component">
    <div class="card-header">
      Guarantees
    </div>
    <div class="card-body">
      <div v-for="(guarantee, index) in safeGuarantees" :key="index" class="card mb-2 p-2">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span class="fw-bold">Guarantee #{{ index + 1 }}</span>
          <button class="btn btn-outline-danger btn-sm" @click="removeGuarantee(index)">Remove</button>
        </div>
        <div class="row g-2">
          <div class="col-md-12 mb-2">
            <div class="d-flex gap-3 mb-2 flex-wrap">
              <div class="form-check">
                <input class="form-check-input" type="radio" :name="'mode-' + index" :id="'mode-measurement-' + index" 
                  :checked="getMode(guarantee) === 'measurement'" 
                  @change="setMode(index, 'measurement')">
                <label class="form-check-label small" :for="'mode-measurement-' + index">
                  Measurement (Recommended)
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" :name="'mode-' + index" :id="'mode-structured-' + index" 
                  :checked="getMode(guarantee) === 'structured'" 
                  @change="setMode(index, 'structured')">
                <label class="form-check-label small" :for="'mode-structured-' + index">
                  Structured
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" :name="'mode-' + index" :id="'mode-legacy-' + index" 
                  :checked="getMode(guarantee) === 'legacy'" 
                  @change="setMode(index, 'legacy')">
                <label class="form-check-label small" :for="'mode-legacy-' + index">
                  Simple Limit (Legacy)
                </label>
              </div>
            </div>

            <template v-if="getMode(guarantee) === 'measurement'">
              <PrometheusMeasurementEditor 
                :model-value="guarantee.measurement" 
                :metrics="metrics"
                :errors="errors"
                :path="path + '/' + index + '/measurement'"
                @update:model-value="updateGuarantee(index, 'measurement', $event)"
              />
              <div class="invalid-feedback d-block" v-if="errors[path + '/' + index]">
                {{ errors[path + '/' + index].join(', ') }}
              </div>
              <div class="invalid-feedback d-block" v-if="errors[path + '/' + index + '/measurement']">
                {{ errors[path + '/' + index + '/measurement'].join(', ') }}
              </div>
            </template>
            
            <template v-else>
              <label class="form-label">Metric Name</label>
              <select class="form-select" :class="{'is-invalid': errors[path + '/' + index + '/metric']}" :value="guarantee.metric" @change="updateGuarantee(index, 'metric', $event.target.value)">
                <option value="" disabled>Select metric</option>
                <option v-for="(metric, name) in metrics" :key="name" :value="name">{{ name }}</option>
              </select>
              <div class="invalid-feedback" v-if="errors[path + '/' + index + '/metric']">
                {{ errors[path + '/' + index + '/metric'].join(', ') }}
              </div>
            </template>
          </div>
          
          <template v-if="getMode(guarantee) === 'structured'">
            <div class="col-md-4 mb-2">
              <label class="form-label">Operator</label>
              <select class="form-select" :class="{'is-invalid': errors[path + '/' + index + '/operator']}" :value="guarantee.operator" @change="updateGuarantee(index, 'operator', $event.target.value)">
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
              <input type="text" class="form-control" :class="{'is-invalid': errors[path + '/' + index + '/value']}" placeholder="e.g. 5 or 6 and 12" :value="guarantee.value" @input="updateGuarantee(index, 'value', $event.target.value)">
              <div class="invalid-feedback" v-if="errors[path + '/' + index + '/value']">
                {{ errors[path + '/' + index + '/value'].join(', ') }}
              </div>
            </div>

            <div class="col-md-12 mb-2">
              <DurationEditor 
                :model-value="guarantee.period" 
                :errors="errors"
                :path="path + '/' + index + '/period'"
                @update:model-value="updateGuarantee(index, 'period', $event)"
                label="Period"
              />
            </div>
          </template>

          <template v-else-if="getMode(guarantee) === 'legacy'">
            <div class="col-md-12 mb-2">
              <DurationEditor 
                :model-value="guarantee.limit" 
                :errors="errors"
                :path="path + '/' + index + '/limit'"
                @update:model-value="updateGuarantee(index, 'limit', $event)"
                label="Limit"
              />
            </div>
          </template>
        </div>
      </div>
      <button class="btn btn-secondary btn-sm mt-2" @click="addGuarantee">Add Guarantee</button>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import DurationEditor from './DurationEditor.vue';
import PrometheusMeasurementEditor from './PrometheusMeasurementEditor.vue';

export default {
  name: 'GuaranteesEditor',
  components: {
    DurationEditor,
    PrometheusMeasurementEditor
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
      newList.push({ measurement: '' });
      updateGuarantees(newList);
    };

    const getMode = (guarantee) => {
      if (guarantee.measurement !== undefined) {
        return 'measurement';
      }
      if (guarantee.limit !== undefined && guarantee.operator === undefined && guarantee.value === undefined && guarantee.period === undefined) {
        return 'legacy';
      }
      return 'structured';
    };

    const setMode = (index, mode) => {
      const newList = [...safeGuarantees.value];
      const guarantee = { ...newList[index] };
      
      if (mode === 'measurement') {
        delete guarantee.metric;
        delete guarantee.operator;
        delete guarantee.value;
        delete guarantee.period;
        delete guarantee.limit;
        if (guarantee.measurement === undefined) guarantee.measurement = '';
      } else if (mode === 'legacy') {
        delete guarantee.measurement;
        delete guarantee.operator;
        delete guarantee.value;
        delete guarantee.period;
        if (guarantee.limit === undefined) guarantee.limit = '';
        if (guarantee.metric === undefined) guarantee.metric = '';
      } else {
        delete guarantee.measurement;
        delete guarantee.limit;
        if (guarantee.metric === undefined) guarantee.metric = '';
      }
      
      newList[index] = guarantee;
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
      getMode,
      setMode,
    };
  },
};
</script>