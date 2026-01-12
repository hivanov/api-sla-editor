<template>
  <div class="prometheus-measurement-editor border p-3 rounded bg-light" :class="{'border-danger': hasError}">
    <div class="row g-3">
      <div class="col-md-4">
        <label class="form-label small fw-bold">Function</label>
        <select class="form-select form-select-sm" :value="state.func" @change="updateField('func', $event.target.value)">
          <option v-for="fn in prometheusFunctions" :key="fn.value" :value="fn.value">{{ fn.label }}</option>
        </select>
      </div>
      
      <div class="col-md-2" v-if="showQuantile">
        <label class="form-label small fw-bold">Quantile</label>
        <input type="number" step="0.01" min="0" max="1" class="form-control form-control-sm" :value="state.quantile" @input="updateField('quantile', $event.target.value)">
      </div>

      <div class="col-md-6" :class="{'col-md-4': showQuantile}">
        <label class="form-label small fw-bold">Metric</label>
        <select class="form-select form-select-sm" :value="state.metric" @change="updateField('metric', $event.target.value)">
          <option value="" disabled>Select metric</option>
          <option v-for="(metric, name) in metrics" :key="name" :value="name">{{ name }}</option>
        </select>
      </div>

      <div class="col-md-3">
        <label class="form-label small fw-bold">Window</label>
        <div class="input-group input-group-sm">
          <input type="number" min="1" class="form-control" :value="state.windowValue" @input="updateField('windowValue', $event.target.value)">
          <select class="form-select" style="max-width: 80px;" :value="state.windowUnit" @change="updateField('windowUnit', $event.target.value)">
            <option value="s">sec</option>
            <option value="m">min</option>
            <option value="h">hour</option>
            <option value="d">day</option>
          </select>
        </div>
      </div>

      <div class="col-md-3">
        <label class="form-label small fw-bold">Operator</label>
        <select class="form-select form-select-sm" :value="state.operator" @change="updateField('operator', $event.target.value)">
          <option value="<">&lt;</option>
          <option value="<=">&lt;=</option>
          <option value=">">&gt;</option>
          <option value=">=">&gt;=</option>
          <option value="=">=</option>
          <option value="!=">!=</option>
          <option value="between">between</option>
        </select>
      </div>

      <div class="col-md-6">
        <label class="form-label small fw-bold">Value</label>
        <input type="text" class="form-control form-control-sm" :class="{'is-invalid': hasError}" :placeholder="state.operator === 'between' ? 'e.g. 15 and 28' : 'e.g. 15'" :value="state.value" @input="updateField('value', $event.target.value)">
        <div class="invalid-feedback" v-if="hasError">
          {{ getErrors.join(', ') }}
        </div>
      </div>
    </div>
    <div class="mt-2 text-muted x-small">
      Preview: <code>{{ preview }}</code>
    </div>
  </div>
</template>

<script>
import { reactive, computed, watch } from 'vue';

export default {
  name: 'PrometheusMeasurementEditor',
  props: {
    modelValue: {
      type: String,
      default: '',
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
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const prometheusFunctions = [
      { value: 'avg_over_time', label: 'Average' },
      { value: 'min_over_time', label: 'Minimum' },
      { value: 'max_over_time', label: 'Maximum' },
      { value: 'sum_over_time', label: 'Sum' },
      { value: 'count_over_time', label: 'Count' },
      { value: 'quantile_over_time', label: 'Quantile (Percentile)' },
      { value: 'stddev_over_time', label: 'Standard Deviation' },
      { value: 'stdvar_over_time', label: 'Standard Variance' },
      { value: 'last_over_time', label: 'Last Value' },
      { value: 'histogram_quantile', label: 'Histogram Quantile' }
    ];

    const state = reactive({
      func: 'avg_over_time',
      quantile: '0.99',
      metric: '',
      windowValue: '5',
      windowUnit: 'm',
      operator: '<',
      value: '',
    });

    const showQuantile = computed(() => {
      return state.func === 'quantile_over_time' || state.func === 'histogram_quantile';
    });

    const hasError = computed(() => {
      if (!props.errors || !props.path) return false;
      const p = props.path;
      const variations = [p, '/' + p, p.startsWith('/') ? p.substring(1) : p];
      return variations.some(v => props.errors[v] && props.errors[v].length > 0);
    });

    const getErrors = computed(() => {
      if (!hasError.value) return [];
      const p = props.path;
      const variations = [p, '/' + p, p.startsWith('/') ? p.substring(1) : p];
      for (const v of variations) {
        if (props.errors[v] && props.errors[v].length > 0) return props.errors[v];
      }
      return [];
    });

    // Simple parser for the Prometheus-like string
    const parse = (str) => {
      if (!str) return;
      
      try {
        const funcMatch = str.match(/^([a-z_]+)\((.*)\)\s+([<>=!]+|between)\s+(.*)$/);
        if (funcMatch) {
          state.func = funcMatch[1];
          const args = funcMatch[2];
          state.operator = funcMatch[3];
          state.value = funcMatch[4];
          
          if (state.func === 'quantile_over_time') {
            const qMatch = args.match(/^([^,]+),\s*(.*)\[(\d+)([smhd])\]$/);
            if (qMatch) {
              state.quantile = qMatch[1].trim();
              state.metric = qMatch[2].trim();
              state.windowValue = qMatch[3];
              state.windowUnit = qMatch[4];
            }
          } else if (state.func === 'histogram_quantile') {
             const hMatch = args.match(/^([^,]+),\s*sum by \(le\) \(rate\((.*)\[(\d+)([smhd])\]\)\)$/);
             if (hMatch) {
               state.quantile = hMatch[1].trim();
               state.metric = hMatch[2].trim();
               state.windowValue = hMatch[3];
               state.windowUnit = hMatch[4];
             }
          } else {
            const mMatch = args.match(/^(.*)\[(\d+)([smhd])\]$/);
            if (mMatch) {
              state.metric = mMatch[1].trim();
              state.windowValue = mMatch[2];
              state.windowUnit = mMatch[3];
            }
          }
        }
      } catch (e) {
        console.error('Failed to parse prometheus-like string', e);
      }
    };

    const format = () => {
      let args = '';
      if (state.func === 'quantile_over_time') {
        args = `${state.quantile}, ${state.metric}[${state.windowValue}${state.windowUnit}]`;
      } else if (state.func === 'histogram_quantile') {
        args = `${state.quantile}, sum by (le) (rate(${state.metric}[${state.windowValue}${state.windowUnit}]))`;
      } else {
        args = `${state.metric}[${state.windowValue}${state.windowUnit}]`;
      }
      
      return `${state.func}(${args}) ${state.operator} ${state.value}`;
    };

    const preview = computed(() => format());

    watch(() => props.modelValue, (newVal) => {
      if (newVal !== preview.value) {
        parse(newVal);
      }
    }, { immediate: true });

    const updateField = (field, val) => {
      state[field] = val;
      emit('update:modelValue', format());
    };

    return {
      prometheusFunctions,
      state,
      showQuantile,
      preview,
      updateField,
      hasError,
      getErrors
    };
  }
};
</script>

<style scoped>
.prometheus-measurement-editor {
  font-size: 0.9rem;
}
.x-small {
  font-size: 0.75rem;
}
</style>