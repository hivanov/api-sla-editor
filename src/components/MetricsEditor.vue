<template>
  <div class="metrics-editor-content metrics-editor-component">
    <div v-for="(metric, name) in safeMetrics" :key="name" class="card mb-3">
      <div class="card-header d-flex justify-content-between align-items-center bg-light">
        <h5 class="mb-0">{{ name }}</h5>
        <button class="btn btn-outline-danger btn-sm" @click="removeMetric(name)">Remove</button>
      </div>
      <div class="card-body">
        <div class="mb-3">
          <label class="form-label">Type</label>
          <select class="form-select" :class="{'is-invalid': errors['/metrics/' + name + '/type']}" :value="metric.type" @change="updateMetric(name, 'type', $event.target.value)">
            <option value="">Select Type</option>
            <option value="boolean">boolean</option>
            <option value="integer">integer</option>
            <option value="number">number</option>
            <option value="string">string</option>
          </select>
          <div class="invalid-feedback" v-if="errors['/metrics/' + name + '/type']">
            {{ errors['/metrics/' + name + '/type'].join(', ') }}
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label">Unit</label>
          <select class="form-select" :class="{'is-invalid': errors['/metrics/' + name + '/unit']}" :value="metric.unit" @change="updateMetric(name, 'unit', $event.target.value)">
            <option value="">None / Custom</option>
            <option value="requests">requests</option>
            <option value="ms">ms</option>
            <option value="s">s</option>
            <option value="m">m</option>
            <option value="h">h</option>
            <option value="d">d</option>
            <option value="percent">percent</option>
            <option value="bytes">bytes</option>
            <option value="KB">KB</option>
            <option value="MB">MB</option>
            <option value="GB">GB</option>
            <option value="items">items</option>
            <option value="calls">calls</option>
          </select>
          <div class="invalid-feedback" v-if="errors['/metrics/' + name + '/unit']">
            {{ errors['/metrics/' + name + '/unit'].join(', ') }}
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label">Description</label>
          <textarea class="form-control" :class="{'is-invalid': errors['/metrics/' + name + '/description']}" placeholder="Description" :value="metric.description" @input="updateMetric(name, 'description', $event.target.value)"></textarea>
          <div class="invalid-feedback" v-if="errors['/metrics/' + name + '/description']">
            {{ errors['/metrics/' + name + '/description'].join(', ') }}
          </div>
        </div>
      </div>
    </div>
    <div class="mt-3">
      <div class="input-group">
        <input type="text" class="form-control" placeholder="New metric name" v-model="newMetricName">
        <button class="btn btn-primary" @click="addMetric">Add Metric</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  name: 'MetricsEditor',
  props: {
    metrics: {
      type: Object,
      default: () => ({}),
    },
    errors: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['update:metrics'],
  setup(props, { emit }) {
    const newMetricName = ref('');

    const safeMetrics = computed(() => props.metrics || {});

    const updateMetric = (name, key, value) => {
      const newMetrics = { ...safeMetrics.value };
      newMetrics[name] = { ...newMetrics[name], [key]: value };
      emit('update:metrics', newMetrics);
    };

    const addMetric = () => {
      if (newMetricName.value && !safeMetrics.value[newMetricName.value]) {
        const newMetrics = { ...safeMetrics.value };
        newMetrics[newMetricName.value] = {
          type: '',
          unit: '',
          description: '',
        };
        emit('update:metrics', newMetrics);
        newMetricName.value = '';
      }
    };

    const removeMetric = (name) => {
      const newMetrics = { ...safeMetrics.value };
      delete newMetrics[name];
      emit('update:metrics', newMetrics);
    };

    return {
      newMetricName,
      safeMetrics,
      updateMetric,
      addMetric,
      removeMetric,
    };
  },
};
</script>
