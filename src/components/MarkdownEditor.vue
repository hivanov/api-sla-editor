<template>
  <div class="markdown-editor card">
    <div class="card-header p-0 bg-light border-bottom-0 d-flex justify-content-between align-items-center">
      <ul class="nav nav-tabs card-header-tabs m-0">
        <li class="nav-item">
          <a class="nav-link rounded-0 border-0" :class="{ active: !preview }" href="#" @click.prevent="preview = false">Write</a>
        </li>
        <li class="nav-item">
          <a class="nav-link rounded-0 border-0" :class="{ active: preview }" href="#" @click.prevent="preview = true">Preview</a>
        </li>
      </ul>
      <div v-if="!preview" class="toolbar px-2 d-flex gap-1">
        <button class="btn btn-sm btn-light border" title="Bold" @click.prevent="applyFormatting('bold')"><strong>B</strong></button>
        <button class="btn btn-sm btn-light border" title="Italic" @click.prevent="applyFormatting('italic')"><em>I</em></button>
        <button class="btn btn-sm btn-light border" title="Heading" @click.prevent="applyFormatting('heading')">H</button>
        <div class="vr mx-1"></div>
        <button class="btn btn-sm btn-light border" title="List" @click.prevent="applyFormatting('list')">List</button>
        <button class="btn btn-sm btn-light border" title="Code" @click.prevent="applyFormatting('code')">Code</button>
        <button class="btn btn-sm btn-light border" title="Link" @click.prevent="applyFormatting('link')">Link</button>
      </div>
    </div>
    <div class="card-body p-0">
      <textarea
        ref="textareaRef"
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
  setup(props, { emit }) {
    const preview = ref(false);
    const textareaRef = ref(null);

    const renderedMarkdown = computed(() => {
      return marked.parse(props.modelValue || '', { breaks: true });
    });

    const applyFormatting = (type) => {
      const textarea = textareaRef.value;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = props.modelValue.substring(start, end);
      let newText = props.modelValue;
      let replacement = '';
      let cursorOffset = 0;

      switch (type) {
        case 'bold':
          replacement = `**${selectedText || 'text'}**`;
          cursorOffset = selectedText ? replacement.length : 2;
          break;
        case 'italic':
          replacement = `*${selectedText || 'text'}*`;
          cursorOffset = selectedText ? replacement.length : 1;
          break;
        case 'heading':
          replacement = `### ${selectedText || 'Heading'}`;
          cursorOffset = replacement.length;
          break;
        case 'list':
          replacement = `\n- ${selectedText || 'item'}`;
          cursorOffset = replacement.length;
          break;
        case 'code':
          replacement = `\`${selectedText || 'code'}\``;
          cursorOffset = selectedText ? replacement.length : 1;
          break;
        case 'link':
          replacement = `[${selectedText || 'link text'}](https://)`;
          cursorOffset = selectedText ? replacement.length : 1;
          break;
      }

      newText = props.modelValue.substring(0, start) + replacement + props.modelValue.substring(end);
      emit('update:modelValue', newText);

      // Restore focus and selection
      setTimeout(() => {
        textarea.focus();
        const newPos = start + cursorOffset;
        if (selectedText) {
           textarea.setSelectionRange(start, start + replacement.length);
        } else {
           textarea.setSelectionRange(newPos, newPos);
        }
      }, 0);
    };

    return {
      preview,
      renderedMarkdown,
      textareaRef,
      applyFormatting,
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
