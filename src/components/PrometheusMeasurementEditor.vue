<template>
  <div class="prometheus-measurement-editor border p-3 rounded bg-light" :class="{'border-danger': hasError || promqlError}">
    <div class="d-flex justify-content-between align-items-center mb-2">
      <span class="small fw-bold text-secondary">Prometheus Expression</span>
    </div>

    <div v-if="!isRawMode" class="row g-3">
      <div class="col-md-4">
        <label class="form-label small fw-bold">Function</label>
        <select class="form-select form-select-sm select-promql-func" :value="state.func" @change="updateField('func', $event.target.value)">
          <option v-for="fn in prometheusFunctions" :key="fn.value" :value="fn.value">{{ fn.label }}</option>
        </select>
      </div>
      
      <div class="col-md-2" v-if="showQuantile">
        <label class="form-label small fw-bold">Quantile</label>
        <input type="number" step="0.01" min="0" max="1" class="form-control form-control-sm input-promql-quantile" :value="state.quantile" @input="updateField('quantile', $event.target.value)">
      </div>

      <div class="col-md-2" v-if="showPredictionSeconds">
        <label class="form-label small fw-bold">Lookahead (s)</label>
        <input type="number" step="1" min="0" class="form-control form-control-sm input-promql-lookahead" :value="state.quantile" @input="updateField('quantile', $event.target.value)">
      </div>

      <div class="col-md-6" :class="{'col-md-4': showQuantile || showPredictionSeconds}">
        <label class="form-label small fw-bold">Metric</label>
        <select class="form-select form-select-sm metric-select select-promql-metric" :value="state.metric" @change="updateField('metric', $event.target.value)" :disabled="!!fixedMetric">
          <option value="" disabled>Select metric</option>
          <option v-for="(metric, name) in metrics" :key="name" :value="name">{{ name }}</option>
        </select>
      </div>

      <div class="col-md-3" v-if="isRangeFunc">
        <label class="form-label small fw-bold">Window</label>
        <div class="input-group input-group-sm">
          <input type="number" min="1" class="form-control input-promql-window-value" :value="state.windowValue" @input="updateField('windowValue', $event.target.value)">
          <select class="form-select select-promql-window-unit" style="max-width: 80px;" :value="state.windowUnit" @change="updateField('windowUnit', $event.target.value)">
            <option value="s">sec</option>
            <option value="m">min</option>
            <option value="h">hour</option>
            <option value="d">day</option>
          </select>
        </div>
      </div>

      <div class="col-md-3" :class="{'col-md-6': !isRangeFunc}">
        <label class="form-label small fw-bold">Operator</label>
        <select class="form-select form-select-sm select-promql-operator" :value="state.operator" @change="updateField('operator', $event.target.value)">
          <option value="<">&lt;</option>
          <option value="<=">&lt;=</option>
          <option value=">">&gt;</option>
          <option value=">=">&gt;=</option>
          <option value="==">==</option>
          <option value="!=">!=</option>
        </select>
      </div>

      <div class="col-md-6">
        <label class="form-label small fw-bold">Value</label>
        <input type="text" class="form-control form-control-sm input-promql-value" :class="{'is-invalid': hasError}" placeholder="e.g. 15" :value="state.value" @input="updateField('value', $event.target.value)">
        <div class="invalid-feedback" v-if="hasError">
          {{ getErrors.join(', ') }}
        </div>
      </div>
    </div>
    
    <div v-else class="row g-3">
      <div class="col-12">
        <label class="form-label small fw-bold">Raw Expression</label>
        <textarea 
          class="form-control form-control-sm font-monospace textarea-promql-raw" 
          rows="2" 
          :value="modelValue" 
          @input="emit('update:modelValue', $event.target.value)"
          :class="{'is-invalid': promqlError || hasError}"
        ></textarea>
        <div class="invalid-feedback d-block" v-if="promqlError || hasError">
          <div v-if="promqlError">{{ promqlError }}</div>
          <div v-if="hasError">{{ getErrors.join(', ') }}</div>
        </div>
      </div>
    </div>

    <div class="mt-2 text-muted x-small d-flex justify-content-between align-items-center">
      <span>Preview: <code>{{ preview }}</code></span>
      <div class="d-flex align-items-center gap-2">
        <span v-if="!promqlError && preview" class="text-success me-2 label-valid-promql"><i class="bi bi-check-circle-fill"></i> Valid PromQL</span>
        <div class="form-check form-switch mb-0">
          <input class="form-check-input check-raw-promql" type="checkbox" v-model="isRawMode" :disabled="disabled || (!canSwitchToEditor && isRawMode)">
          <label class="form-check-label x-small">Raw PromQL</label>
        </div>
        <div v-if="!canSwitchToEditor && isRawMode" class="badge bg-light text-secondary border x-small">
          Raw Mode Only
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, computed, watch, ref } from 'vue';
import { validatePromQL } from '../utils/formatters';

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
    fixedMetric: {
      type: String,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const isRawMode = ref(false);
    const prometheusFunctions = [
      // Aggregations over time (Range Vectors)
      { value: 'avg_over_time', label: 'Average Over Time', type: 'range' },
      { value: 'min_over_time', label: 'Minimum Over Time', type: 'range' },
      { value: 'max_over_time', label: 'Maximum Over Time', type: 'range' },
      { value: 'sum_over_time', label: 'Sum Over Time', type: 'range' },
      { value: 'count_over_time', label: 'Count Over Time', type: 'range' },
      { value: 'quantile_over_time', label: 'Quantile (Percentile) Over Time', type: 'range' },
      { value: 'stddev_over_time', label: 'Standard Deviation Over Time', type: 'range' },
      { value: 'stdvar_over_time', label: 'Standard Variance Over Time', type: 'range' },
      { value: 'last_over_time', label: 'Last Value Over Time', type: 'range' },
      { value: 'present_over_time', label: 'Presence Check Over Time', type: 'range' },
      { value: 'absent_over_time', label: 'Absence Check Over Time', type: 'range' },
      { value: 'changes', label: 'Number of Changes Over Time', type: 'range' },
      { value: 'resets', label: 'Number of Resets (Counters)', type: 'range' },

      // Rate and Increase (Range Vectors)
      { value: 'rate', label: 'Average Rate of Increase', type: 'range' },
      { value: 'irate', label: 'Instant Rate of Increase', type: 'range' },
      { value: 'increase', label: 'Total Increase Over Time', type: 'range' },
      { value: 'delta', label: 'Value Delta (Range)', type: 'range' },
      { value: 'idelta', label: 'Instant Value Delta', type: 'range' },
      { value: 'deriv', label: 'Derivative (Rate of Change)', type: 'range' },

      // Math and Transformation (Instant Vectors)
      { value: 'abs', label: 'Absolute Value', type: 'instant' },
      { value: 'ceil', label: 'Ceiling (Round Up)', type: 'instant' },
      { value: 'floor', label: 'Floor (Round Down)', type: 'instant' },
      { value: 'round', label: 'Round to Nearest', type: 'instant' },
      { value: 'sqrt', label: 'Square Root', type: 'instant' },
      { value: 'exp', label: 'Exponential (e^x)', type: 'instant' },
      { value: 'ln', label: 'Natural Logarithm (base e)', type: 'instant' },
      { value: 'log2', label: 'Binary Logarithm (base 2)', type: 'instant' },
      { value: 'log10', label: 'Decimal Logarithm (base 10)', type: 'instant' },
      
      // Complex / Histogram
      { value: 'histogram_quantile', label: 'Histogram Percentile', type: 'range' },
      { value: 'predict_linear', label: 'Linear Prediction (Trend)', type: 'range' }
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

    const currentFunc = computed(() => prometheusFunctions.find(f => f.value === state.func));

    const showQuantile = computed(() => {
      return state.func === 'quantile_over_time' || state.func === 'histogram_quantile';
    });

    const showPredictionSeconds = computed(() => {
        return state.func === 'predict_linear';
    });

    const isRangeFunc = computed(() => {
        return currentFunc.value?.type === 'range';
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

    // AST-based representability check
    const checkRepresentability = (ast) => {
      if (!ast) return false;
      
      if (ast.type !== 'BinaryExpr') return false;
      
      // Right side must be a number literal for our simple GUI
      if (!ast.right || ast.right.type !== 'NumberLiteral') return false;

      const left = ast.left;
      if (!left) return false;

      const supportedFuncs = prometheusFunctions.map(f => f.value);
      const op = left.type === 'AggregateExpr' ? left.op : (left.type === 'Call' ? left.func : null);
      
      if (!op || !supportedFuncs.includes(op)) return false;
      
      return true;
    };

    const parseAST = (ast) => {
      if (!ast) return;

      try {
        if (ast.type === 'BinaryExpr') {
          state.operator = ast.op;
          state.value = ast.right.value.toString();
        }

        const left = ast.left;
        state.func = left.type === 'AggregateExpr' ? left.op : left.func;

        let matrix;
        if (left.type === 'Call') {
            if (state.func === 'quantile_over_time' || state.func === 'histogram_quantile') {
                if (left.args.length < 2) throw new Error('Missing arguments');
                state.quantile = left.args[0].value.toString();
                matrix = left.args[1];
            } else if (state.func === 'predict_linear') {
                if (left.args.length < 2) throw new Error('Missing arguments');
                matrix = left.args[0];
                state.quantile = left.args[1].value.toString();
            } else {
                if (left.args.length < 1) throw new Error('Missing arguments');
                matrix = left.args[0];
            }
        } else {
            matrix = left.expr;
        }

        // histogram_quantile often has sum by (le) (rate(metric[5m]))
        if (state.func === 'histogram_quantile' && matrix.type === 'AggregateExpr') {
            const innerRate = matrix.expr;
            if (innerRate.type === 'Call' && innerRate.func === 'rate') {
                matrix = innerRate.args[0];
            }
        }

        if (matrix.type === 'MatrixSelector') {
          state.metric = matrix.vectorSelector.name || '';
          const matchVal = matrix.range.match(/\d+/);
          const matchUnit = matrix.range.match(/[smhdw]/);
          state.windowValue = matchVal ? matchVal[0] : '5';
          state.windowUnit = matchUnit ? matchUnit[0] : 'm';
        } else if (matrix.type === 'VectorSelector') {
          state.metric = matrix.name || '';
          state.windowValue = '';
          state.windowUnit = 'm';
        }
      } catch (e) {
        console.error('Failed to map AST to UI', e);
        throw e;
      }
    };

    const parse = (input) => {
      if (!input) return false;
      try {
        if (typeof input === 'string') {
          const result = validatePromQL(input);
          if (result.valid && checkRepresentability(result.ast)) {
            parseAST(result.ast);
            return true;
          }
        } else {
          // Assume AST
          parseAST(input);
          return true;
        }
      } catch (e) {
        console.error('Parse error', e);
      }
      return false;
    };

    const format = () => {
      let args = '';
      const windowStr = (state.windowValue && isRangeFunc.value) ? `[${state.windowValue}${state.windowUnit}]` : '';
      if (state.func === 'quantile_over_time') {
        args = `${state.quantile}, ${state.metric}${windowStr}`;
      } else if (state.func === 'histogram_quantile') {
        args = `${state.quantile}, sum by (le) (rate(${state.metric}${windowStr}))`;
      } else if (state.func === 'predict_linear') {
        args = `${state.metric}${windowStr}, ${state.quantile}`;
      } else {
        args = `${state.metric}${windowStr}`;
      }
      
      const opPart = state.value !== '' ? ` ${state.operator} ${state.value}` : ` ${state.operator}`;
      return `${state.func}(${args})${opPart}`;
    };

    const preview = computed(() => isRawMode.value ? props.modelValue : format());

    const promqlError = computed(() => {
      const val = preview.value;
      if (!val) return null;
      const result = validatePromQL(val, props.metrics);
      return result.valid ? null : result.error;
    });

    const canSwitchToEditor = computed(() => {
      if (!props.modelValue) return true;
      try {
        const result = validatePromQL(props.modelValue);
        return result.valid && checkRepresentability(result.ast);
      } catch (e) {
        return false;
      }
    });

    watch(() => props.modelValue, (newVal) => {
      if (!newVal) {
        if (!isRawMode.value) {
           // Reset state to defaults if empty
           state.metric = '';
           state.value = '';
        }
        return;
      }
      
      const result = validatePromQL(newVal);
      const representable = result.valid && checkRepresentability(result.ast);
      
      if (representable) {
        if (newVal !== format()) {
          parse(result.ast);
          isRawMode.value = false;
        }
      } else {
        // Only switch to raw mode if we are NOT already editing in GUI mode
        // and the value is NOT what our GUI would produce.
        if (newVal !== format() && !isRawMode.value) {
           // If it's valid but not representable, we MUST switch to raw
           if (result.valid) {
              isRawMode.value = true;
           } 
           // If it's invalid, it might be a partial expression from GUI or a totally broken raw expression.
           // We only switch to raw if it's NOT a partial expression from our GUI.
           // Heuristic: if it contains things our GUI doesn't produce (like multiple metrics or complex functions)
           else if (newVal.includes(' ') || newVal.includes('(')) {
              // Check if it looks like something GUI would produce but incomplete
              const looksLikeGui = prometheusFunctions.some(f => newVal.startsWith(f.value + '('));
              if (!looksLikeGui) {
                isRawMode.value = true;
              }
           }
        }
      }
    }, { immediate: true });

    watch(isRawMode, (newVal) => {
      if (!newVal) {
        // Switching back to editor mode
        parse(props.modelValue);
      }
    });

    watch(() => props.fixedMetric, (newMetric) => {
      if (newMetric && state.metric !== newMetric) {
        state.metric = newMetric;
        if (!isRawMode.value) {
          emit('update:modelValue', format());
        }
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
      showPredictionSeconds,
      isRangeFunc,
      preview,
      updateField,
      hasError,
      getErrors,
      isRawMode,
      canSwitchToEditor,
      promqlError,
      emit
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