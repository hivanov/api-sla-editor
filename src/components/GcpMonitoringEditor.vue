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

    <hr>
    <h6 class="mb-3">Notification Channels</h6>
    
    <div v-for="(channel, index) in safeGcp.channels || []" :key="index" class="card mb-3">
       <div class="card-header d-flex justify-content-between align-items-center">
          <span>Channel #{{ index + 1 }}</span>
          <button class="btn btn-outline-danger btn-sm" @click="removeChannel(index)">Remove</button>
       </div>
       <div class="card-body">
          <div class="mb-3">
             <label class="form-label">Display Name</label>
             <input type="text" class="form-control"
                :class="{'is-invalid': errors[`/x-gcp-monitoring/channels/${index}/displayName`]}"
                :value="channel.displayName"
                @input="updateChannel(index, 'displayName', $event.target.value)">
             <div class="invalid-feedback" v-if="errors[`/x-gcp-monitoring/channels/${index}/displayName`]">
               {{ errors[`/x-gcp-monitoring/channels/${index}/displayName`].join(', ') }}
             </div>
          </div>
          <div class="mb-3">
             <label class="form-label">Type</label>
             <select class="form-select"
                :class="{'is-invalid': errors[`/x-gcp-monitoring/channels/${index}/type`]}"
                :value="channel.type"
                @change="updateChannel(index, 'type', $event.target.value)">
                <option value="">Select Type</option>
                <option value="email">email</option>
                <option value="slack">slack</option>
                <option value="sms">sms</option>
             </select>
             <div class="invalid-feedback" v-if="errors[`/x-gcp-monitoring/channels/${index}/type`]">
               {{ errors[`/x-gcp-monitoring/channels/${index}/type`].join(', ') }}
             </div>
          </div>

          <!-- Labels Editor -->
          <div class="mb-3">
             <label class="form-label">Labels</label>
             <div v-for="(value, key) in channel.labels" :key="key" class="d-flex gap-2 mb-2">
                <input type="text" class="form-control" :value="key" readonly disabled>
                <input type="text" class="form-control" :value="value" @input="updateLabel(index, key, $event.target.value)">
                <button class="btn btn-outline-danger" @click="removeLabel(index, key)">X</button>
             </div>
             
             <div class="input-group mt-2">
                <input type="text" class="form-control" placeholder="Label Key (e.g. email_address)" v-model="newLabelKeys[index]">
                <button class="btn btn-outline-secondary" @click="addLabel(index)">Add Label</button>
             </div>
             <div class="form-text">Common labels: email_address, channel_name, number</div>
          </div>
       </div>
    </div>

    <button class="btn btn-primary" @click="addChannel">Add Notification Channel</button>

  </div>
</template>

<script>
import { computed, ref } from 'vue';

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
    const newLabelKeys = ref({});

    const update = (key, value) => {
      emit('update:gcpMonitoring', { ...safeGcp.value, [key]: value });
    };

    const addChannel = () => {
      const channels = [...(safeGcp.value.channels || [])];
      channels.push({ type: '', labels: {} });
      update('channels', channels);
    };

    const removeChannel = (index) => {
      const channels = [...(safeGcp.value.channels || [])];
      channels.splice(index, 1);
      update('channels', channels);
    };

    const updateChannel = (index, key, value) => {
       const channels = [...(safeGcp.value.channels || [])];
       channels[index] = { ...channels[index], [key]: value };
       update('channels', channels);
    };

    const addLabel = (index) => {
       const key = newLabelKeys.value[index];
       if (!key) return;
       
       const channels = [...(safeGcp.value.channels || [])];
       const labels = { ...(channels[index].labels || {}) };
       labels[key] = '';
       channels[index] = { ...channels[index], labels };
       update('channels', channels);
       newLabelKeys.value[index] = '';
    };

    const updateLabel = (index, key, value) => {
       const channels = [...(safeGcp.value.channels || [])];
       const labels = { ...(channels[index].labels || {}) };
       labels[key] = value;
       channels[index] = { ...channels[index], labels };
       update('channels', channels);
    };

    const removeLabel = (index, key) => {
       const channels = [...(safeGcp.value.channels || [])];
       const labels = { ...(channels[index].labels || {}) };
       delete labels[key];
       channels[index] = { ...channels[index], labels };
       update('channels', channels);
    };

    return {
      safeGcp,
      newLabelKeys,
      update,
      addChannel,
      removeChannel,
      updateChannel,
      addLabel,
      updateLabel,
      removeLabel
    };
  },
};
</script>
