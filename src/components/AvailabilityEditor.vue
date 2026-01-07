<template>
  <div class="card mt-3 availability-editor-component">
    <div class="card-header d-flex justify-content-between align-items-center">
      <span>Availability</span>
      <span class="badge bg-primary">{{ percentageDisplay }}%</span>
    </div>
    <div class="card-body">
      <div class="mb-3">
        <label class="form-label">Availability Percentage (%)</label>
        <div class="input-group">
          <input 
            type="number" 
            class="form-control" 
            step="0.000000001" 
            min="0.000000001" 
            max="100" 
            :value="percentageValue" 
            @input="onPercentageInput($event.target.value)"
            placeholder="e.g. 99.9"
          >
          <span class="input-group-text">%</span>
        </div>
        <div v-if="error" class="text-danger small mt-1">{{ error }}</div>
      </div>

      <hr>
      <h6>Uptime Calculator (Allowed Downtime)</h6>
      <div class="row g-2 mb-3">
        <div class="col-md-4">
          <label class="form-label small">Period</label>
          <select class="form-select form-select-sm" v-model="selectedPeriod" @change="recalculateDowntime">
            <option value="day">Daily</option>
            <option value="week">Weekly</option>
            <option value="month">Monthly (30.44d)</option>
            <option value="year">Yearly (365.24d)</option>
          </select>
        </div>
      </div>

      <div class="row g-2">
        <div class="col">
          <label class="form-label small">Days</label>
          <input type="number" class="form-control form-control-sm" v-model.number="downtime.days" @input="onDowntimeInput">
        </div>
        <div class="col">
          <label class="form-label small">Hours</label>
          <input type="number" class="form-control form-control-sm" v-model.number="downtime.hours" @input="onDowntimeInput">
        </div>
        <div class="col">
          <label class="form-label small">Mins</label>
          <input type="number" class="form-control form-control-sm" v-model.number="downtime.mins" @input="onDowntimeInput">
        </div>
        <div class="col">
          <label class="form-label small">Secs</label>
          <input type="number" class="form-control form-control-sm" v-model.number="downtime.secs" @input="onDowntimeInput">
        </div>
        <div class="col">
          <label class="form-label small">Ms</label>
          <input type="number" class="form-control form-control-sm" v-model.number="downtime.ms" @input="onDowntimeInput">
        </div>
      </div>
      <div class="form-text small mt-2">
        Adjusting downtime automatically updates the availability percentage.
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, reactive } from 'vue';

const PERIODS = {
  day: 24 * 60 * 60 * 1000,
  week: 7 * 24 * 60 * 60 * 1000,
  month: 30.436875 * 24 * 60 * 60 * 1000, // Average month
  year: 365.2425 * 24 * 60 * 60 * 1000   // Gregorian year
};

export default {
  name: 'AvailabilityEditor',
  props: {
    availability: {
      type: String,
      default: '100%',
    },
  },
  emits: ['update:availability'],
  setup(props, { emit }) {
    const error = ref('');
    const selectedPeriod = ref('year');
    const downtime = reactive({
      days: 0,
      hours: 0,
      mins: 0,
      secs: 0,
      ms: 0
    });

    const parsePercentage = (val) => {
      if (!val) return 100;
      const numeric = parseFloat(val.replace('%', ''));
      return isNaN(numeric) ? 100 : numeric;
    };

    const percentageValue = ref(parsePercentage(props.availability));

    const percentageDisplay = computed(() => {
      // Show up to 9 decimal places if needed for 1ms precision
      return Number(percentageValue.value.toFixed(9)).toString();
    });

    const updateAvailability = (val) => {
      let num = parseFloat(val);
      if (isNaN(num)) {
        error.value = 'Invalid number';
        return;
      }
      if (num <= 0 || num > 100) {
        error.value = 'Availability must be > 0% and <= 100%';
        return;
      }
      error.value = '';
      percentageValue.value = num;
      emit('update:availability', percentageDisplay.value + '%');
    };

    const onPercentageInput = (val) => {
      updateAvailability(val);
      recalculateDowntime();
    };

    const recalculateDowntime = () => {
      const totalMs = PERIODS[selectedPeriod.value];
      let downtimeMs = totalMs * (1 - percentageValue.value / 100);
      
      // Round to nearest ms to avoid floating point issues at extreme precision
      downtimeMs = Math.round(downtimeMs);

      downtime.days = Math.floor(downtimeMs / (24 * 60 * 60 * 1000));
      downtimeMs %= (24 * 60 * 60 * 1000);
      downtime.hours = Math.floor(downtimeMs / (60 * 60 * 1000));
      downtimeMs %= (60 * 60 * 1000);
      downtime.mins = Math.floor(downtimeMs / (60 * 1000));
      downtimeMs %= (60 * 1000);
      downtime.secs = Math.floor(downtimeMs / 1000);
      downtime.ms = Math.round(downtimeMs % 1000);
    };

    const onDowntimeInput = () => {
      const totalPeriodMs = PERIODS[selectedPeriod.value];
      const downtimeMs = (downtime.days || 0) * 24 * 60 * 60 * 1000 +
                         (downtime.hours || 0) * 60 * 60 * 1000 +
                         (downtime.mins || 0) * 60 * 1000 +
                         (downtime.secs || 0) * 1000 +
                         (downtime.ms || 0);
      
      let newPercentage = (1 - downtimeMs / totalPeriodMs) * 100;
      
      // Clamp values
      if (newPercentage < 0) newPercentage = 0;
      if (newPercentage > 100) newPercentage = 100;
      
      updateAvailability(newPercentage);
    };

    // Initialize downtime on mount
    recalculateDowntime();

    watch(() => props.availability, (newVal) => {
      const parsed = parsePercentage(newVal);
      if (parsed !== percentageValue.value) {
        percentageValue.value = parsed;
        recalculateDowntime();
      }
    });

    return {
      error,
      selectedPeriod,
      downtime,
      percentageValue,
      percentageDisplay,
      onPercentageInput,
      onDowntimeInput,
      recalculateDowntime
    };
  },
};
</script>
