<template>
  <div class="card mt-3 lifecycle-policy-editor-component">
    <div class="card-header">
      Lifecycle Policy
    </div>
    <div class="card-body">
      <DurationEditor 
        :model-value="safeLifecyclePolicy.minimumTerm" 
        @update:model-value="updateField('minimumTerm', $event)"
        label="Minimum Term"
      />
      <div class="form-check mb-3">
        <input class="form-check-input" type="checkbox" :checked="safeLifecyclePolicy.autoRenewal" @change="updateField('autoRenewal', $event.target.checked)" id="autoRenewal">
        <label class="form-check-label" for="autoRenewal">
          Auto Renewal
        </label>
      </div>
      <DurationEditor 
        :model-value="safeLifecyclePolicy.noticePeriod" 
        @update:model-value="updateField('noticePeriod', $event)"
        label="Notice Period"
      />
      <h6>Data Retention</h6>
      <DurationEditor 
        :model-value="safeLifecyclePolicy.dataRetention?.afterTermination" 
        @update:model-value="updateDataRetention('afterTermination', $event)"
        label="After Termination"
      />
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import DurationEditor from './DurationEditor.vue';

export default {
  name: 'LifecyclePolicyEditor',
  components: {
    DurationEditor
  },
  props: {
    lifecyclePolicy: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['update:lifecyclePolicy'],
  setup(props, { emit }) {
    const safeLifecyclePolicy = computed(() => props.lifecyclePolicy || {});

    const updateLifecyclePolicy = (newPolicy) => {
      const cleaned = { ...newPolicy };
      if (cleaned.dataRetention && Object.keys(cleaned.dataRetention).length === 0) {
        delete cleaned.dataRetention;
      }
      emit('update:lifecyclePolicy', cleaned);
    };

    const updateField = (key, value) => {
      const newPolicy = { ...safeLifecyclePolicy.value, [key]: value };
      if (value === '' || value === null || value === undefined) {
        delete newPolicy[key];
      }
      updateLifecyclePolicy(newPolicy);
    };

    const updateDataRetention = (key, value) => {
      const newPolicy = { ...safeLifecyclePolicy.value };
      const newDataRetention = { ...newPolicy.dataRetention, [key]: value };
      if (value === '' || value === null || value === undefined) {
        delete newDataRetention[key];
      }
      newPolicy.dataRetention = newDataRetention;
      updateLifecyclePolicy(newPolicy);
    };

    return {
      safeLifecyclePolicy,
      updateField,
      updateDataRetention,
    };
  },
};
</script>
