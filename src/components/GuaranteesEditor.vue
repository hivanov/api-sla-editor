<template>
  <div class="card mt-3 guarantees-editor-component">
    <div class="card-header">
      Guarantees
    </div>
    <div class="card-body">
      <div v-for="(guarantee, index) in safeGuarantees" :key="index" class="card mb-2 p-2">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span class="fw-bold">Guarantee #{{ index + 1 }}</span>
          <button class="btn btn-outline-danger btn-sm btn-remove-guarantee" @click="removeGuarantee(index)">Remove</button>
        </div>
        <div class="row g-2">
          <div class="col-md-12 mb-2">
            <PrometheusMeasurementEditor 
              :model-value="guarantee.measurement" 
              :metrics="metrics"
              :errors="errors"
              :path="path + '/' + index + '/measurement'"
              @update:model-value="updateGuarantee(index, 'measurement', $event)"
            />
          </div>
        </div>
      </div>
      <button class="btn btn-secondary btn-sm mt-2 btn-add-guarantee" @click="addGuarantee">Add Guarantee</button>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import PrometheusMeasurementEditor from './PrometheusMeasurementEditor.vue';

export default {
  name: 'GuaranteesEditor',
  components: {
    PrometheusMeasurementEditor
  },
  props: {
    guarantees: {
      type: Array,
      default: () => [],
    },
    metrics: {
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
  emits: ['update:guarantees'],
  setup(props, { emit }) {
    const safeGuarantees = computed(() => props.guarantees || []);

    const updateGuarantees = (newList) => {
      emit('update:guarantees', newList);
    };

    const addGuarantee = () => {
      const newList = [...safeGuarantees.value];
      newList.push({ measurement: '' });
      updateGuarantees(newList);
    };

    const updateGuarantee = (index, key, value) => {
      const newList = [...safeGuarantees.value];
      const newGuarantee = { ...newList[index], [key]: value };
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