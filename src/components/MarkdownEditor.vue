<template>
  <div class="markdown-editor card">
    <div class="card-header p-0 bg-light border-bottom-0">
      <ul class="nav nav-tabs card-header-tabs m-0">
        <li class="nav-item">
          <a class="nav-link rounded-0 border-0" :class="{ active: !preview }" href="#" @click.prevent="preview = false">Write</a>
        </li>
        <li class="nav-item">
          <a class="nav-link rounded-0 border-0" :class="{ active: preview }" href="#" @click.prevent="preview = true">Preview</a>
        </li>
      </ul>
    </div>
    <div class="card-body p-0">
      <textarea
        v-if="!preview"
        class="form-control border-0 rounded-0 p-3"
        :class="{ 'is-invalid': invalid }"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="placeholder"
        style="min-height: 150px; resize: vertical;"
      ></textarea>
      <div v-else class="p-3 markdown-preview bg-white" v-html="renderedMarkdown" style="min-height: 150px;"></div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { marked } from 'marked';

export default {
  name: 'MarkdownEditor',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    invalid: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props) {
    const preview = ref(false);

    const renderedMarkdown = computed(() => {
      return marked.parse(props.modelValue || '', { breaks: true });
    });

    return {
      preview,
      renderedMarkdown,
    };
  },
};
</script>

<style scoped>
.markdown-preview {
  overflow-y: auto;
  border-bottom-left-radius: 0.375rem;
  border-bottom-right-radius: 0.375rem;
}
</style>
