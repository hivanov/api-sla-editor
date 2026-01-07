<template>
  <div class="card context-editor-component">
    <div class="card-header">
      Context
    </div>
    <div class="card-body">
      <div class="mb-3">
        <label for="context-id" class="form-label">ID</label>
        <input type="text" class="form-control" id="context-id" :value="safeContext.id" @input="update('id', $event.target.value)">
      </div>
      <div class="mb-3">
        <label for="context-type" class="form-label">Type</label>
        <input type="text" class="form-control" id="context-type" :value="safeContext.type" @input="update('type', $event.target.value)">
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'ContextEditor',
  props: {
    context: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['update:context'],
  setup(props, { emit }) {
    console.log('ContextEditor setup');
    const safeContext = computed(() => props.context || {});

    const update = (key, value) => {
      emit('update:context', { ...safeContext.value, [key]: value });
    };

    return {
      safeContext,
      update,
    };
  },
};
</script>
