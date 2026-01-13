<template>
  <div class="azure-monitoring-editor-content azure-monitoring-editor-component">
    <div class="mb-3">
       <label class="form-label">Azure Resource ID</label>
       <input type="text" class="form-control" 
          :class="{'is-invalid': errors['/x-azure-monitoring/resourceId']}"
          :value="safeAzure.resourceId" 
          @input="update('resourceId', $event.target.value)"
          placeholder="e.g. /subscriptions/.../resourceGroups/...">
       <div class="invalid-feedback" v-if="errors['/x-azure-monitoring/resourceId']">
          {{ errors['/x-azure-monitoring/resourceId'].join(', ') }}
       </div>
    </div>
    <div class="mb-3">
       <label class="form-label">Location</label>
       <input type="text" class="form-control" 
          :class="{'is-invalid': errors['/x-azure-monitoring/location']}"
          :value="safeAzure.location" 
          @input="update('location', $event.target.value)"
          placeholder="e.g. eastus">
       <div class="invalid-feedback" v-if="errors['/x-azure-monitoring/location']">
          {{ errors['/x-azure-monitoring/location'].join(', ') }}
       </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'AzureMonitoringEditor',
  props: {
    azureMonitoring: {
      type: Object,
      default: () => ({}),
    },
    errors: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['update:azureMonitoring'],
  setup(props, { emit }) {
    const safeAzure = computed(() => props.azureMonitoring || {});

    const update = (key, value) => {
      emit('update:azureMonitoring', { ...safeAzure.value, [key]: value });
    };

    return {
      safeAzure,
      update
    };
  },
};
</script>
