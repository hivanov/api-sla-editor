<template>
  <div class="gcp-monitoring-editor-content gcp-monitoring-editor-component">
    <div class="mb-3">
       <label class="form-label">GCP Project ID</label>
       <input type="text" class="form-control" 
          :value="projectId" 
          @input="projectId = $event.target.value"
          placeholder="e.g. my-gcp-project-id">
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'GcpMonitoringEditor',
  props: {
    modelValue: {
      type: Object,
      default: () => ({ projectId: '' }),
    },
    errors: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const projectId = computed({
      get: () => props.modelValue?.projectId || '',
      set: (val) => emit('update:modelValue', { ...props.modelValue, projectId: val })
    });

    return {
      projectId
    };
  },
};
</script>
