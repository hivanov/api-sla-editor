<script setup>
import { reactive, watch, computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: 'Recurrence Rule (RRULE)'
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

const DAYS = [
  { value: 'MO', label: 'Mon' },
  { value: 'TU', label: 'Tue' },
  { value: 'WE', label: 'Wed' },
  { value: 'TH', label: 'Thu' },
  { value: 'FR', label: 'Fri' },
  { value: 'SA', label: 'Sat' },
  { value: 'SU', label: 'Sun' }
];

const FREQUENCIES = [
  { value: 'DAILY', label: 'Daily' },
  { value: 'WEEKLY', label: 'Weekly' },
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'YEARLY', label: 'Yearly' }
];

const parseRRule = (val) => {
  const parts = {
    FREQ: 'WEEKLY',
    INTERVAL: 1,
    BYDAY: [],
    BYMONTHDAY: [],
    BYMONTH: []
  };
  if (!val || typeof val !== 'string') return parts;

  const pairs = val.split(';');
  pairs.forEach(pair => {
    const [key, value] = pair.split('=');
    if (!key || !value) return;
    const upperKey = key.toUpperCase();
    if (upperKey === 'FREQ') parts.FREQ = value.toUpperCase();
    if (upperKey === 'INTERVAL') parts.INTERVAL = parseInt(value, 10) || 1;
    if (upperKey === 'BYDAY') parts.BYDAY = value.split(',').map(v => v.toUpperCase());
    if (upperKey === 'BYMONTHDAY') parts.BYMONTHDAY = value.split(',').map(v => parseInt(v, 10));
    if (upperKey === 'BYMONTH') parts.BYMONTH = value.split(',').map(v => parseInt(v, 10));
  });
  return parts;
};

const formatRRule = (p) => {
  const parts = [];
  if (p.FREQ) parts.push(`FREQ=${p.FREQ}`);
  if (p.INTERVAL && p.INTERVAL > 1) parts.push(`INTERVAL=${p.INTERVAL}`);
  if (p.BYDAY && p.BYDAY.length > 0) parts.push(`BYDAY=${p.BYDAY.join(',')}`);
  if (p.BYMONTHDAY && p.BYMONTHDAY.length > 0) parts.push(`BYMONTHDAY=${p.BYMONTHDAY.join(',')}`);
  if (p.BYMONTH && p.BYMONTH.length > 0) parts.push(`BYMONTH=${p.BYMONTH.join(',')}`);
  return parts.join(';');
};

const state = reactive(parseRRule(props.modelValue));

watch(() => props.modelValue, (newVal) => {
  const parsed = parseRRule(newVal);
  if (newVal !== formatRRule(state)) {
    state.FREQ = parsed.FREQ;
    state.INTERVAL = parsed.INTERVAL;
    state.BYDAY = parsed.BYDAY;
    state.BYMONTHDAY = parsed.BYMONTHDAY;
    state.BYMONTH = parsed.BYMONTH;
  }
});

const updateState = () => {
  emit('update:modelValue', formatRRule(state));
};

const toggleDay = (day) => {
  const index = state.BYDAY.indexOf(day);
  if (index === -1) {
    state.BYDAY.push(day);
  } else {
    state.BYDAY.splice(index, 1);
  }
  updateState();
};

const onManualInput = (value) => {
  emit('update:modelValue', value);
  const parsed = parseRRule(value);
  state.FREQ = parsed.FREQ;
  state.INTERVAL = parsed.INTERVAL;
  state.BYDAY = parsed.BYDAY;
  state.BYMONTHDAY = parsed.BYMONTHDAY;
  state.BYMONTH = parsed.BYMONTH;
};
</script>

<template>
  <div class="rrule-editor border p-2 rounded bg-light mb-3">
    <label class="form-label small fw-bold">{{ label }}</label>
    
    <div class="input-group mb-2">
      <span class="input-group-text small">RFC 5545</span>
      <input 
        type="text" 
        class="form-control form-control-sm" 
        :class="{'is-invalid': errors[path]}"
        :value="modelValue" 
        @input="onManualInput($event.target.value)" 
        placeholder="e.g. FREQ=WEEKLY;BYDAY=MO,WE"
      >
      <div class="invalid-feedback" v-if="errors[path]">
        {{ errors[path].join(', ') }}
      </div>
    </div>

    <div class="row g-2 mb-2">
      <div class="col-md-6">
        <label class="form-label x-small mb-0">Frequency</label>
        <select class="form-select form-select-sm" v-model="state.FREQ" @change="updateState">
          <option v-for="freq in FREQUENCIES" :key="freq.value" :value="freq.value">
            {{ freq.label }}
          </option>
        </select>
      </div>
      <div class="col-md-6">
        <label class="form-label x-small mb-0">Interval</label>
        <input type="number" class="form-control form-select-sm" v-model.number="state.INTERVAL" @input="updateState" min="1">
      </div>
    </div>

    <div v-if="state.FREQ === 'WEEKLY' || state.FREQ === 'DAILY'" class="mb-2">
      <label class="form-label x-small mb-1">Repeat on</label>
      <div class="d-flex flex-wrap gap-1">
        <button 
          v-for="day in DAYS" 
          :key="day.value"
          type="button"
          class="btn btn-sm"
          :class="state.BYDAY.includes(day.value) ? 'btn-primary' : 'btn-outline-secondary'"
          @click="toggleDay(day.value)"
        >
          {{ day.label }}
        </button>
      </div>
    </div>

    <div v-if="state.FREQ === 'MONTHLY'" class="mb-2">
      <label class="form-label x-small mb-0">Day of Month (e.g. 1, 15, -1)</label>
      <input 
        type="text" 
        class="form-control form-control-sm" 
        :value="state.BYMONTHDAY.join(', ')" 
        @input="state.BYMONTHDAY = $event.target.value.split(',').map(v => parseInt(v.trim(), 10)).filter(v => !isNaN(v)); updateState()"
        placeholder="1, 15, -1"
      >
    </div>
  </div>
</template>

<style scoped>
.x-small {
  font-size: 0.7rem;
}
.rrule-editor {
  max-width: 100%;
}
.btn-sm {
  padding: 0.2rem 0.4rem;
  font-size: 0.75rem;
}
</style>