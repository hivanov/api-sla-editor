<template>
  <div class="card mt-3 lifecycle-policy-editor-component">
    <div class="card-header">
      Lifecycle Policy
    </div>
    <div class="card-body">
      <div class="mb-3">
        <label class="form-label">Minimum Term (ISO 8601)</label>
        <input type="text" class="form-control" placeholder="P1Y" :value="safeLifecyclePolicy.minimumTerm" @input="updateField('minimumTerm', $event.target.value)">
      </div>
      <div class="form-check mb-3">
        <input class="form-check-input" type="checkbox" :checked="safeLifecyclePolicy.autoRenewal" @change="updateField('autoRenewal', $event.target.checked)" id="autoRenewal">
        <label class="form-check-label" for="autoRenewal">
          Auto Renewal
        </label>
      </div>
      <div class="mb-3">
        <label class="form-label">Notice Period (ISO 8601)</label>
        <input type="text" class="form-control" placeholder="P30D" :value="safeLifecyclePolicy.noticePeriod" @input="updateField('noticePeriod', $event.target.value)">
      </div>
      <h6>Data Retention</h6>
      <div class="mb-3">
        <label class="form-label">After Termination (ISO 8601)</label>
        <input type="text" class="form-control" placeholder="P90D" :value="safeLifecyclePolicy.dataRetention?.afterTermination" @input="updateDataRetention('afterTermination', $event.target.value)">
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'LifecyclePolicyEditor',
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
