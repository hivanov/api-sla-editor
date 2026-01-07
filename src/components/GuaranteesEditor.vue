<template>
  <div class="card mt-3 guarantees-editor-component">
    <div class="card-header">
      Guarantees
    </div>
    <div class="card-body">
      <div v-for="(guarantee, index) in safeGuarantees" :key="index" class="card mb-2 p-2">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span>Guarantee #{{ index + 1 }}</span>
          <button class="btn btn-danger btn-sm" @click="removeGuarantee(index)">Remove</button>
        </div>
        <div class="mb-3">
          <label class="form-label">Metric Name</label>
          <input type="text" class="form-control" placeholder="Metric Name" :value="guarantee.metric" @input="updateGuarantee(index, 'metric', $event.target.value)">
        </div>
        <div class="mb-3">
          <label class="form-label">Limit (ISO 8601 Duration)</label>
          <input type="text" class="form-control" placeholder="Limit" :value="guarantee.limit" @input="updateGuarantee(index, 'limit', $event.target.value)">
        </div>
      </div>
      <button class="btn btn-secondary btn-sm mt-2" @click="addGuarantee">Add Guarantee</button>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'GuaranteesEditor',
  props: {
    guarantees: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['update:guarantees'],
  setup(props, { emit }) {
    const safeGuarantees = computed(() => props.guarantees || []);

    const updateGuarantees = (newList) => {
      emit('update:guarantees', newList);
    };

    const addGuarantee = () => {
      const newList = [...safeGuarantees.value];
      newList.push({ metric: '', limit: '' });
      updateGuarantees(newList);
    };

    const updateGuarantee = (index, key, value) => {
      const newList = [...safeGuarantees.value];
      const newGuarantee = { ...newList[index], [key]: value };
      if (value === '' || value === null || value === undefined) {
        delete newGuarantee[key];
      }
      newList[index] = newGuarantee;
      updateGuarantees(newList);
    };

    const removeGuarantee = (index) => {
      const newList = [...safeGuarantees.value];
      newList.splice(index, 1);
      updateGuarantees(newList);
    };

    return {
      safeGuarantees,
      addGuarantee,
      updateGuarantee,
      removeGuarantee,
    };
  },
};
</script>
