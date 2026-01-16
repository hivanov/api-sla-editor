<template>
  <div class="azure-monitoring-editor-content azure-monitoring-editor-component">
    <div class="mb-3">
       <label class="form-label">Azure Resource ID</label>
       <input type="text" class="form-control" 
          :value="resourceId" 
          @input="resourceId = $event.target.value"
          placeholder="e.g. /subscriptions/.../resourceGroups/...">
    </div>
    <div class="mb-3">
       <label class="form-label">Location</label>
       <input type="text" class="form-control" 
          :value="location" 
          @input="location = $event.target.value"
          placeholder="e.g. eastus">
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'AzureMonitoringEditor',
  props: {
    modelValue: {
      type: Object,
      default: () => ({ resourceId: '', location: '' }),
    },
    errors: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const resourceId = computed({
      get: () => props.modelValue?.resourceId || '',
      set: (val) => emit('update:modelValue', { ...props.modelValue, resourceId: val })
    });

    const location = computed({
      get: () => props.modelValue?.location || '',
      set: (val) => emit('update:modelValue', { ...props.modelValue, location: val })
    });

    return {
      resourceId,
      location
    };
  },
};
</script>
