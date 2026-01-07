<script setup>
import { reactive, watch, computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: 'Duration'
  },
  errors: {
    type: Object,
    default: () => ({})
  },
  path: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);

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

const parseDuration = (val) => {
  const parts = { days: 0, hours: 0, minutes: 0, seconds: 0 };
  if (!val || typeof val !== 'string') return parts;

  const match = val.match(/^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/);
  if (!match) return parts;

  if (match[1]) parts.days = parseInt(match[1], 10);
  if (match[2]) parts.hours = parseInt(match[2], 10);
  if (match[3]) parts.minutes = parseInt(match[3], 10);
  if (match[4]) parts.seconds = parseInt(match[4], 10);

  return parts;
};

const formatDuration = (p) => {
  let res = 'P';
  let hasValue = false;
  if (p.days > 0) {
    res += p.days + 'D';
    hasValue = true;
  }
  
  if (p.hours > 0 || p.minutes > 0 || p.seconds > 0) {
    res += 'T';
    if (p.hours > 0) {
      res += p.hours + 'H';
      hasValue = true;
    }
    if (p.minutes > 0) {
      res += p.minutes + 'M';
      hasValue = true;
    }
    if (p.seconds > 0) {
      res += p.seconds + 'S';
      hasValue = true;
    }
  }
  
  return hasValue ? res : '';
};

const parts = reactive(parseDuration(props.modelValue));

watch(() => props.modelValue, (newVal) => {
  const parsed = parseDuration(newVal);
  // Only update parts if they are different to avoid unnecessary cycles
  // and to allow some invalid intermediate states in the manual input
  // if the parsed result is the same as current parts.
  // Actually, if it's invalid, parsed will be all 0s. 
  // We should probably only update if it matches the pattern.
  if (/^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/.test(newVal)) {
    parts.days = parsed.days;
    parts.hours = parsed.hours;
    parts.minutes = parsed.minutes;
    parts.seconds = parsed.seconds;
  }
});

const updatePart = (part, value) => {
  parts[part] = Math.max(0, parseInt(value, 10) || 0);
  emit('update:modelValue', formatDuration(parts));
};

const onManualInput = (value) => {
  emit('update:modelValue', value);
};
</script>

<template>
  <div class="duration-editor border p-2 rounded bg-light mb-3">
    <label class="form-label small fw-bold">{{ label }}</label>
    <div class="input-group mb-2">
      <span class="input-group-text small">ISO 8601</span>
      <input 
        type="text" 
        class="form-control form-control-sm" 
        :class="{'is-invalid': hasError}"
        :value="modelValue" 
        @input="onManualInput($event.target.value)" 
        placeholder="e.g. P1DT4H"
      >
      <div class="invalid-feedback" v-if="hasError">
        {{ getErrors.join(', ') }}
      </div>
    </div>
    <div class="row g-2">
      <div class="col-3">
        <label class="form-label x-small mb-0">Days</label>
        <input type="number" class="form-control form-control-sm" :value="parts.days" @input="updatePart('days', $event.target.value)" min="0">
      </div>
      <div class="col-3">
        <label class="form-label x-small mb-0">Hours</label>
        <input type="number" class="form-control form-control-sm" :value="parts.hours" @input="updatePart('hours', $event.target.value)" min="0">
      </div>
      <div class="col-3">
        <label class="form-label x-small mb-0">Mins</label>
        <input type="number" class="form-control form-control-sm" :value="parts.minutes" @input="updatePart('minutes', $event.target.value)" min="0">
      </div>
      <div class="col-3">
        <label class="form-label x-small mb-0">Secs</label>
        <input type="number" class="form-control form-control-sm" :value="parts.seconds" @input="updatePart('seconds', $event.target.value)" min="0">
      </div>
    </div>
  </div>
</template>

<style scoped>
.x-small {
  font-size: 0.7rem;
}
.duration-editor {
  max-width: 100%;
}
</style>
