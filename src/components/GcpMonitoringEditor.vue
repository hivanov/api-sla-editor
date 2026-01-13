<template>
  <div class="gcp-monitoring-editor-content gcp-monitoring-editor-component">
    <div class="mb-3">
       <label class="form-label">GCP Project ID</label>
       <input type="text" class="form-control" 
          :class="{'is-invalid': errors['/x-gcp-monitoring/projectId']}"
          :value="safeGcp.projectId" 
          @input="update('projectId', $event.target.value)"
          placeholder="e.g. my-gcp-project-id">
       <div class="invalid-feedback" v-if="errors['/x-gcp-monitoring/projectId']">
          {{ errors['/x-gcp-monitoring/projectId'].join(', ') }}
       </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'GcpMonitoringEditor',
  props: {
    gcpMonitoring: {
      type: Object,
      default: () => ({}),
    },
    errors: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['update:gcpMonitoring'],
  setup(props, { emit }) {
    const safeGcp = computed(() => props.gcpMonitoring || {});

    const update = (key, value) => {
      emit('update:gcpMonitoring', { ...safeGcp.value, [key]: value });
    };

    return {
      safeGcp,
      update
    };
  },
};
</script>
