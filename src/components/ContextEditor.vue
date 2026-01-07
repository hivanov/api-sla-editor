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
        <label class="form-label">Type</label>
        <div class="form-check">
          <input class="form-check-input" :class="{'is-invalid': errors['/context/type']}" type="radio" name="context-type" id="type-plans" value="plans" :checked="safeContext.type === 'plans'" @change="update('type', 'plans')">
          <label class="form-check-label" for="type-plans">
            <strong>plans</strong>
            <div class="form-text mt-0">Used for a template of a Service Level Agreement. It defines the common characteristics for a set of agreements.</div>
          </label>
        </div>
        <div class="form-check mt-2">
          <input class="form-check-input" :class="{'is-invalid': errors['/context/type']}" type="radio" name="context-type" id="type-agreements" value="agreements" :checked="safeContext.type === 'agreements'" @change="update('type', 'agreements')">
          <label class="form-check-label" for="type-agreements">
            <strong>agreements</strong>
            <div class="form-text mt-0">Used for a specific instance of a Service Level Agreement between a provider and a consumer.</div>
          </label>
        </div>
        <div class="invalid-feedback d-block" v-if="errors['/context/type']">
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
