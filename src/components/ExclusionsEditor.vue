<template>
  <div class="card mt-3 exclusions-editor-component">
    <div class="card-header">
      SLA Exclusions
    </div>
    <div class="card-body">
      <div v-for="(exclusion, index) in safeExclusions" :key="index" class="mb-2">
        <div class="input-group">
          <input type="text" class="form-control" :class="{'is-invalid': errors[path + '/' + index]}" :value="exclusion" @input="updateExclusion(index, $event.target.value)" placeholder="Exclusion description">
          <button class="btn btn-danger" @click="removeExclusion(index)">Remove</button>
          <div class="invalid-feedback" v-if="errors[path + '/' + index]">
            {{ errors[path + '/' + index].join(', ') }}
          </div>
        </div>
      </div>
      <button class="btn btn-secondary btn-sm mt-2" @click="addExclusion">Add Exclusion</button>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'ExclusionsEditor',
  props: {
    exclusions: {
      type: Array,
      default: () => [],
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
  emits: ['update:exclusions'],
  setup(props, { emit }) {
    const safeExclusions = computed(() => props.exclusions || []);

    const updateExclusions = (newList) => {
      emit('update:exclusions', newList);
    };

    const addExclusion = () => {
      const newList = [...safeExclusions.value, ''];
      updateExclusions(newList);
    };

    const updateExclusion = (index, value) => {
      const newList = [...safeExclusions.value];
      newList[index] = value;
      updateExclusions(newList);
    };

    const removeExclusion = (index) => {
      const newList = [...safeExclusions.value];
      newList.splice(index, 1);
      updateExclusions(newList);
    };

    return {
      safeExclusions,
      addExclusion,
      updateExclusion,
      removeExclusion,
    };
  },
};
</script>