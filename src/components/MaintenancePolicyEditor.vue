<template>
  <div class="card mt-3 maintenance-policy-editor-component">
    <div class="card-header">
      Maintenance Policy
    </div>
    <div class="card-body">
      <div class="form-check mb-3">
        <input class="form-check-input" type="checkbox" :checked="safeMaintenancePolicy.countsAsDowntime" @change="updateField('countsAsDowntime', $event.target.checked)" id="countsAsDowntime">
        <label class="form-check-label" for="countsAsDowntime">
          Counts as Downtime
        </label>
      </div>

      <h6>Minimum Notice</h6>
      <div class="row">
        <div class="col-md-6 mb-3">
          <DurationEditor 
            :model-value="safeMaintenancePolicy.minimumNotice?.standard" 
            :errors="errors"
            :path="path + '/minimumNotice/standard'"
            @update:model-value="updateNotice('standard', $event)"
            label="Standard Notice"
          />
        </div>
        <div class="col-md-6 mb-3">
          <DurationEditor 
            :model-value="safeMaintenancePolicy.minimumNotice?.emergency" 
            :errors="errors"
            :path="path + '/minimumNotice/emergency'"
            @update:model-value="updateNotice('emergency', $event)"
            label="Emergency Notice"
          />
        </div>
      </div>

      <h6>Maintenance Windows</h6>
      <div v-for="(window, index) in safeMaintenancePolicy.windows" :key="index" class="card mb-2 p-2">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span>Window #{{ index + 1 }}</span>
          <button class="btn btn-danger btn-sm" @click="removeWindow(index)">Remove</button>
        </div>
        <div class="mb-3">
          <label class="form-label">Type</label>
          <input type="text" class="form-control" :class="{'is-invalid': errors[path + '/windows/' + index + '/type']}" placeholder="Routine" :value="window.type" @input="updateWindow(index, 'type', $event.target.value)">
          <div class="invalid-feedback" v-if="errors[path + '/windows/' + index + '/type']">
            {{ errors[path + '/windows/' + index + '/type'].join(', ') }}
          </div>
        </div>
        <div class="mb-3">
          <RRuleEditor 
            :model-value="window.rrule" 
            :errors="errors"
            :path="path + '/windows/' + index + '/rrule'"
            @update:model-value="updateWindow(index, 'rrule', $event)"
            label="RRULE (RFC 5545)"
          />
        </div>
        <DurationEditor 
          :model-value="window.duration" 
          :errors="errors"
          :path="path + '/windows/' + index + '/duration'"
          @update:model-value="updateWindow(index, 'duration', $event)"
          label="Duration"
        />
      </div>
      <button class="btn btn-secondary btn-sm mt-2 mb-4" @click="addWindow">Add Window</button>

      <h6>Maintenance Sources (iCal)</h6>
      <div v-for="(source, index) in safeMaintenancePolicy.sources" :key="index" class="card mb-2 p-2">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span>Source #{{ index + 1 }}</span>
          <button class="btn btn-danger btn-sm" @click="removeSource(index)">Remove</button>
        </div>
        <div class="mb-3">
          <label class="form-label">Calendar URL</label>
          <input type="text" class="form-control" :class="{'is-invalid': errors[path + '/sources/' + index + '/calendarUrl']}" placeholder="https://example.com/maintenance.ics" :value="source.calendarUrl" @input="updateSource(index, 'calendarUrl', $event.target.value)">
          <div class="invalid-feedback" v-if="errors[path + '/sources/' + index + '/calendarUrl']">
            {{ errors[path + '/sources/' + index + '/calendarUrl'].join(', ') }}
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label">Description</label>
          <input type="text" class="form-control" :class="{'is-invalid': errors[path + '/sources/' + index + '/description']}" placeholder="Description of the source" :value="source.description" @input="updateSource(index, 'description', $event.target.value)">
          <div class="invalid-feedback" v-if="errors[path + '/sources/' + index + '/description']">
            {{ errors[path + '/sources/' + index + '/description'].join(', ') }}
          </div>
        </div>
      </div>
      <button class="btn btn-secondary btn-sm mt-2" @click="addSource">Add Source</button>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import DurationEditor from './DurationEditor.vue';
import RRuleEditor from './RRuleEditor.vue';

export default {
  name: 'MaintenancePolicyEditor',
  components: {
    DurationEditor,
    RRuleEditor
  },
  props: {
    maintenancePolicy: {
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
  emits: ['update:maintenancePolicy'],
  setup(props, { emit }) {
    const safeMaintenancePolicy = computed(() => props.maintenancePolicy || {});

    const updateMaintenancePolicy = (newPolicy) => {
      // Clean up empty strings
      const cleaned = { ...newPolicy };
      if (cleaned.minimumNotice) {
        if (!cleaned.minimumNotice.standard) delete cleaned.minimumNotice.standard;
        if (!cleaned.minimumNotice.emergency) delete cleaned.minimumNotice.emergency;
        if (Object.keys(cleaned.minimumNotice).length === 0) delete cleaned.minimumNotice;
      }
      emit('update:maintenancePolicy', cleaned);
    };

    const updateField = (key, value) => {
      const newPolicy = { ...safeMaintenancePolicy.value, [key]: value };
      if (value === '' || value === null || value === undefined) {
        delete newPolicy[key];
      }
      updateMaintenancePolicy(newPolicy);
    };

    const updateNotice = (key, value) => {
      const newPolicy = { ...safeMaintenancePolicy.value };
      const newNotice = { ...newPolicy.minimumNotice, [key]: value };
      if (value === '' || value === null || value === undefined) {
        delete newNotice[key];
      }
      newPolicy.minimumNotice = newNotice;
      updateMaintenancePolicy(newPolicy);
    };

    const addWindow = () => {
      const newPolicy = { ...safeMaintenancePolicy.value };
      if (!newPolicy.windows) {
        newPolicy.windows = [];
      }
      newPolicy.windows.push({ type: '', rrule: '', duration: '' });
      updateMaintenancePolicy(newPolicy);
    };

    const updateWindow = (index, key, value) => {
      const newPolicy = { ...safeMaintenancePolicy.value };
      newPolicy.windows[index] = { ...newPolicy.windows[index], [key]: value };
      updateMaintenancePolicy(newPolicy);
    };

    const removeWindow = (index) => {
      const newPolicy = { ...safeMaintenancePolicy.value };
      newPolicy.windows.splice(index, 1);
      if (newPolicy.windows.length === 0) delete newPolicy.windows;
      updateMaintenancePolicy(newPolicy);
    };

    const addSource = () => {
      const newPolicy = { ...safeMaintenancePolicy.value };
      if (!newPolicy.sources) {
        newPolicy.sources = [];
      }
      newPolicy.sources.push({ type: 'ical', calendarUrl: '', description: '' });
      updateMaintenancePolicy(newPolicy);
    };

    const updateSource = (index, key, value) => {
      const newPolicy = { ...safeMaintenancePolicy.value };
      newPolicy.sources[index] = { ...newPolicy.sources[index], [key]: value };
      updateMaintenancePolicy(newPolicy);
    };

    const removeSource = (index) => {
      const newPolicy = { ...safeMaintenancePolicy.value };
      newPolicy.sources.splice(index, 1);
      if (newPolicy.sources.length === 0) delete newPolicy.sources;
      updateMaintenancePolicy(newPolicy);
    };

    return {
      safeMaintenancePolicy,
      updateField,
      updateNotice,
      addWindow,
      updateWindow,
      removeWindow,
      addSource,
      updateSource,
      removeSource,
    };
  },
};
</script>