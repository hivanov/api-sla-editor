<template>
  <div class="card context-editor-component">
    <div class="card-header">
      Context
    </div>
    <div class="card-body">
      <div class="mb-3">
        <label for="context-id" class="form-label">ID</label>
        <input type="text" class="form-control" id="context-id" :value="context.id" @input="update('id', $event.target.value)">
      </div>
      <div class="mb-3">
        <label for="context-type" class="form-label">Type</label>
        <input type="text" class="form-control" id="context-type" :value="context.type" @input="update('type', $event.target.value)">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContextEditor',
  props: {
    context: {
      type: Object,
      required: true,
    },
  },
  emits: ['update:context'],
  setup(props, { emit }) {
    console.log('ContextEditor setup');
    const update = (key, value) => {
      emit('update:context', { ...props.context, [key]: value });
    };

    return {
      update,
    };
  },
};
</script>
