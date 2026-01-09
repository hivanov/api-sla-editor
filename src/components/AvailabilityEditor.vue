<template>
  <div class="card mt-3 availability-editor-component">
    <div class="card-header d-flex justify-content-between align-items-center">
      <span>Availability</span>
      <span class="badge bg-primary">{{ percentageDisplay }}%</span>
    </div>
    <div class="card-body">
      <!-- Mode Switcher -->
      <ul class="nav nav-pills nav-fill mb-3 bg-light p-1 rounded border">
        <li class="nav-item" v-for="mode in modes" :key="mode.id">
          <button 
            class="nav-link py-1 px-2 small" 
            :class="{ active: currentMode === mode.id }"
            @click="currentMode = mode.id"
            type="button"
          >
            {{ mode.label }}
          </button>
        </li>
      </ul>

      <!-- Standard Tiers Mode -->
      <div v-if="currentMode === 'tier'" class="mb-3">
        <label class="form-label small fw-bold">Select Common Tier</label>
        <select class="form-select border-primary tier-select" :value="currentTier" @change="onTierSelect($event.target.value)">
          <option value="" disabled>Select common tier...</option>
          <option v-for="tier in commonTiers" :key="tier.value" :value="tier.value">
            {{ tier.label }} ({{ tier.value }}%)
          </option>
        </select>
      </div>

      <!-- Manual Percentage Mode -->
      <div v-if="currentMode === 'manual'" class="mb-3">
        <label class="form-label small fw-bold">Custom Percentage (%)</label>
        <div class="input-group">
          <input 
            type="number" 
            class="form-control" 
            :class="{'is-invalid': errors[path]}"
            step="0.000000001" 
            min="0" 
            max="100" 
            :value="percentageValue" 
            @input="onPercentageInput($event.target.value)"
            placeholder="e.g. 99.9"
          >
          <span class="input-group-text">%</span>
          <div class="invalid-feedback" v-if="errors[path]">
            {{ errors[path].join(', ') }}
          </div>
        </div>
        <div v-if="error" class="text-danger small mt-1">{{ error }}</div>
      </div>

      <!-- Downtime Duration Mode -->
      <div v-if="currentMode === 'downtime'" class="mb-3">
        <label class="form-label small fw-bold">Allowed Downtime</label>
        <div class="row g-2 mb-3">
          <div class="col-md-6">
            <label class="form-label extra-small">Calculation Period</label>
            <select class="form-select form-select-sm period-select" v-model="selectedPeriod" @change="recalculateDowntime">
              <option value="day">Daily</option>
              <option value="week">Weekly</option>
              <option value="bi-weekly">Bi-weekly (14d)</option>
              <option value="month">Monthly (30.44d)</option>
              <option value="year">Yearly (365.24d)</option>
            </select>
          </div>
        </div>

        <div class="row g-2">
          <div class="col">
            <label class="form-label extra-small">Days</label>
            <input type="number" class="form-control form-control-sm" v-model.number="downtime.days" @input="onDowntimeInput" min="0">
          </div>
          <div class="col">
            <label class="form-label extra-small">Hours</label>
            <input type="number" class="form-control form-control-sm" v-model.number="downtime.hours" @input="onDowntimeInput" min="0">
          </div>
          <div class="col">
            <label class="form-label extra-small">Mins</label>
            <input type="number" class="form-control form-control-sm" v-model.number="downtime.mins" @input="onDowntimeInput" min="0">
          </div>
          <div class="col">
            <label class="form-label extra-small">Secs</label>
            <input type="number" class="form-control form-control-sm" v-model.number="downtime.secs" @input="onDowntimeInput" min="0">
          </div>
          <div class="col">
            <label class="form-label extra-small">Ms</label>
            <input type="number" class="form-control form-control-sm" v-model.number="downtime.ms" @input="onDowntimeInput" min="0">
          </div>
        </div>
        <div class="form-text small mt-2">
          Adjusting downtime automatically updates the availability percentage.
        </div>
      </div>

      <!-- Deployment Calculator Mode -->
      <div v-if="currentMode === 'deployment'" class="mb-3 deployment-calculator">
        <label class="form-label small fw-bold">Deployment Impact Calculator</label>
        
        <div class="row g-2 mb-3">
          <div class="col-md-6">
            <label class="form-label extra-small">Deployments</label>
            <div class="input-group input-group-sm">
              <input type="number" class="form-control" v-model.number="deployment.count" @input="onDeploymentInput" min="0">
              <span class="input-group-text">per</span>
            </div>
          </div>
          <div class="col-md-6">
            <label class="form-label extra-small">Period</label>
            <select class="form-select form-select-sm deployment-period-select" v-model="deployment.period" @change="onDeploymentInput">
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="bi-weekly">2 Weeks (Bi-weekly)</option>
              <option value="month">Month</option>
              <option value="year">Year</option>
            </select>
          </div>
        </div>

        <label class="form-label extra-small">Avg. Unavailability per Deployment</label>
        <div class="row g-2">
          <div class="col">
            <label class="form-label extra-small text-muted">Days</label>
            <input type="number" class="form-control form-control-sm deployment-days" v-model.number="deployment.duration.days" @input="onDeploymentInput" min="0">
          </div>
          <div class="col">
            <label class="form-label extra-small text-muted">Hours</label>
            <input type="number" class="form-control form-control-sm deployment-hours" v-model.number="deployment.duration.hours" @input="onDeploymentInput" min="0">
          </div>
          <div class="col">
            <label class="form-label extra-small text-muted">Mins</label>
            <input type="number" class="form-control form-control-sm deployment-mins" v-model.number="deployment.duration.mins" @input="onDeploymentInput" min="0">
          </div>
          <div class="col">
            <label class="form-label extra-small text-muted">Secs</label>
            <input type="number" class="form-control form-control-sm deployment-secs" v-model.number="deployment.duration.secs" @input="onDeploymentInput" min="0">
          </div>
          <div class="col">
            <label class="form-label extra-small text-muted">Ms</label>
            <input type="number" class="form-control form-control-sm deployment-ms" v-model.number="deployment.duration.ms" @input="onDeploymentInput" min="0">
          </div>
        </div>
        
        <div class="alert alert-info mt-3 py-2 small mb-0 deployment-info">
          Total estimated downtime: <strong>{{ totalDeploymentDowntimeDisplay }}</strong> per {{ deployment.period }}.
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { ref, computed, watch, reactive } from 'vue';

const PERIODS = {
  day: 24 * 60 * 60 * 1000,
  week: 7 * 24 * 60 * 60 * 1000,
  'bi-weekly': 14 * 24 * 60 * 60 * 1000,
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
    errors: {
      type: Object,
      default: () => ({}),
    },
    path: {
      type: String,
      default: '',
    },
  },
  emits: ['update:availability'],
  setup(props, { emit }) {
    const error = ref('');
    const currentMode = ref('tier');
    const modes = [
      { id: 'tier', label: 'Standard Tiers' },
      { id: 'manual', label: 'Manual Entry' },
      { id: 'downtime', label: 'Downtime Duration' },
      { id: 'deployment', label: 'Deployment Calculator' }
    ];

    const selectedPeriod = ref('year');
    const downtime = reactive({
      days: 0,
      hours: 0,
      mins: 0,
      secs: 0,
      ms: 0
    });

    const deployment = reactive({
      count: 1,
      period: 'bi-weekly',
      duration: {
        days: 0,
        hours: 0,
        mins: 15,
        secs: 0,
        ms: 0
      }
    });

    const parsePercentage = (val) => {
      if (!val) return 100;
      const numeric = parseFloat(val.replace('%', ''));
      return isNaN(numeric) ? 100 : numeric;
    };

    const percentageValue = ref(parsePercentage(props.availability));

    const commonTiers = [
      { label: '90%', value: 90 },
      { label: '95%', value: 95 },
      { label: '98%', value: 98 },
      { label: '99% (Two Nines)', value: 99 },
      { label: '99.5%', value: 99.5 },
      { label: '99.9% (Three Nines)', value: 99.9 },
      { label: '99.95%', value: 99.95 },
      { label: '99.99% (Four Nines)', value: 99.99 },
      { label: '99.999% (Five Nines)', value: 99.999 },
    ];

    const percentageDisplay = computed(() => {
      // Show up to 9 decimal places if needed for 1ms precision
      return Number(percentageValue.value.toFixed(9)).toString();
    });

    const currentTier = computed(() => {
      const match = commonTiers.find(t => Math.abs(t.value - percentageValue.value) < 1e-9);
      return match ? match.value : '';
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
      // Round to 9 decimal places to ensure consistency with emitted value and 1ms precision
      percentageValue.value = Number(num.toFixed(9));
      emit('update:availability', percentageDisplay.value + '%');
    };

    const onPercentageInput = (val) => {
      updateAvailability(val);
      recalculateDowntime();
    };

    const onTierSelect = (val) => {
      if (val) {
        updateAvailability(val);
        recalculateDowntime();
      }
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
      const downtimeMs = Math.max(0, downtime.days || 0) * 24 * 60 * 60 * 1000 +
                         Math.max(0, downtime.hours || 0) * 60 * 60 * 1000 +
                         Math.max(0, downtime.mins || 0) * 60 * 1000 +
                         Math.max(0, downtime.secs || 0) * 1000 +
                         Math.max(0, downtime.ms || 0);
      
      let newPercentage = (1 - downtimeMs / totalPeriodMs) * 100;
      
      // Clamp values
      if (newPercentage < 0) newPercentage = 0;
      if (newPercentage > 100) newPercentage = 100;
      
      updateAvailability(newPercentage);
    };

    const onDeploymentInput = () => {
      const totalPeriodMs = PERIODS[deployment.period];
      const singleDeploymentMs = Math.max(0, deployment.duration.days || 0) * 24 * 60 * 60 * 1000 +
                                 Math.max(0, deployment.duration.hours || 0) * 60 * 60 * 1000 +
                                 Math.max(0, deployment.duration.mins || 0) * 60 * 1000 +
                                 Math.max(0, deployment.duration.secs || 0) * 1000 +
                                 Math.max(0, deployment.duration.ms || 0);
      
      const totalDowntimeMs = (deployment.count || 0) * singleDeploymentMs;
      
      let newPercentage = (1 - totalDowntimeMs / totalPeriodMs) * 100;
      
      // Clamp values
      if (newPercentage < 0) newPercentage = 0;
      if (newPercentage > 100) newPercentage = 100;
      
      updateAvailability(newPercentage);
      recalculateDowntime();
    };

    const totalDeploymentDowntimeDisplay = computed(() => {
      const ms = (deployment.duration.days || 0) * 24 * 60 * 60 * 1000 +
                 (deployment.duration.hours || 0) * 60 * 60 * 1000 +
                 (deployment.duration.mins || 0) * 60 * 1000 +
                 (deployment.duration.secs || 0) * 1000 +
                 (deployment.duration.ms || 0);
      const totalMs = ms * (deployment.count || 0);
      
      const d = Math.floor(totalMs / (24 * 60 * 60 * 1000));
      const h = Math.floor((totalMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
      const m = Math.floor((totalMs % (60 * 60 * 1000)) / (60 * 1000));
      const s = Math.floor((totalMs % (60 * 1000)) / 1000);
      const mms = Math.round(totalMs % 1000);

      const parts = [];
      if (d > 0) parts.push(`${d}d`);
      if (h > 0) parts.push(`${h}h`);
      if (m > 0) parts.push(`${m}m`);
      if (s > 0) parts.push(`${s}s`);
      if (mms > 0) parts.push(`${mms}ms`);
      
      return parts.length > 0 ? parts.join(' ') : '0ms';
    });

    // Initialize downtime on mount
    recalculateDowntime();

    watch(() => props.availability, (newVal) => {
      const parsed = parsePercentage(newVal);
      if (Math.abs(parsed - percentageValue.value) > 1e-10) {
        percentageValue.value = parsed;
        recalculateDowntime();
      }
    });

    return {
      error,
      modes,
      currentMode,
      selectedPeriod,
      downtime,
      deployment,
      percentageValue,
      percentageDisplay,
      commonTiers,
      currentTier,
      onPercentageInput,
      onTierSelect,
      onDowntimeInput,
      onDeploymentInput,
      recalculateDowntime,
      totalDeploymentDowntimeDisplay
    };
  },
};
</script>

<style scoped>
.extra-small {
  font-size: 0.7rem;
}
.deployment-calculator {
  border-left: 3px solid #0d6efd;
  padding-left: 1rem;
}
</style>