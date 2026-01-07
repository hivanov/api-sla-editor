<template>
  <div class="card context-editor-component">
    <div class="card-header">
      Context
    </div>
    <div class="card-body">
      <div v-if="errors['/context']" class="alert alert-danger py-1 small mb-2">
        {{ errors['/context'].join(', ') }}
      </div>
      <div class="mb-3">
        <label for="context-id" class="form-label">ID</label>
        <input type="text" class="form-control" :class="{'is-invalid': errors['/context/id']}" id="context-id" :value="safeContext.id" @input="update('id', $event.target.value)">
        <div class="invalid-feedback" v-if="errors['/context/id']">
          {{ errors['/context/id'].join(', ') }}
        </div>
      </div>
      <div class="mb-3">
        <label for="context-type" class="form-label">Type</label>
        <input type="text" class="form-control" :class="{'is-invalid': errors['/context/type']}" id="context-type" :value="safeContext.type" @input="update('type', $event.target.value)">
        <div class="invalid-feedback" v-if="errors['/context/type']">
          {{ errors['/context/type'].join(', ') }}
        </div>
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
    errors: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['update:context'],
  setup(props, { emit }) {
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
