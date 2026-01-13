<template>
  <div class="card mb-3 shadow-sm responsive-wrapper" ref="wrapper" :id="id">
    <div class="card-header d-flex justify-content-between align-items-center bg-white py-2">
      <span class="fw-bold">{{ title }}</span>
      <div v-if="isNarrow" class="form-check form-switch mb-0">
        <input class="form-check-input" type="checkbox" v-model="isTextMode" :id="id + '-mode-switch'">
        <label class="form-check-label small" :for="id + '-mode-switch'">
          {{ isTextMode ? 'Source' : 'UI' }}
        </label>
      </div>
    </div>
    <div class="card-body" :class="{ 'p-0': isTextMode }">
      <div v-if="isTextMode" class="text-mode-container">
        <div ref="miniEditor" class="mini-ace-editor"></div>
      </div>
      <slot v-else></slot>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import ace from 'ace-builds';
import jsYaml from 'js-yaml';

export default {
  name: 'ResponsiveWrapper',
  props: {
    title: String,
    id: String,
    modelValue: Object,
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const wrapper = ref(null);
    const miniEditor = ref(null);
    const isNarrow = ref(false);
    const isTextMode = ref(false);
    let editor = null;
    let isProgrammaticChange = false;

    const checkWidth = () => {
      if (wrapper.value) {
        isNarrow.value = wrapper.value.offsetWidth < 500;
        if (!isNarrow.value) {
          isTextMode.value = false;
        }
      }
    };

    let resizeObserver = null;

    onMounted(() => {
      checkWidth();
      resizeObserver = new ResizeObserver(checkWidth);
      resizeObserver.observe(wrapper.value);
    });

    onUnmounted(() => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (editor) {
        editor.destroy();
      }
    });

    watch(isTextMode, async (val) => {
      if (val) {
        await nextTick();
        if (!editor && miniEditor.value) {
          editor = ace.edit(miniEditor.value);
          editor.setTheme('ace/theme/monokai');
          editor.session.setMode('ace/mode/yaml');
          editor.setOptions({
            maxLines: 20,
            minLines: 10,
            fontSize: '12px',
          });
          editor.on('change', () => {
            if (isProgrammaticChange) return;
            try {
              const yaml = editor.getValue();
              const parsed = jsYaml.load(yaml);
              emit('update:modelValue', parsed);
            } catch (e) {
              // Invalid YAML, don't update
            }
          });
        }
        if (editor) {
          isProgrammaticChange = true;
          editor.setValue(jsYaml.dump(props.modelValue), -1);
          isProgrammaticChange = false;
          editor.resize();
        }
      }
    });

    watch(() => props.modelValue, (newVal) => {
      if (isTextMode.value && editor && !isProgrammaticChange) {
        isProgrammaticChange = true;
        editor.setValue(jsYaml.dump(newVal), -1);
        isProgrammaticChange = false;
      }
    }, { deep: true });

    return {
      wrapper,
      miniEditor,
      isNarrow,
      isTextMode,
    };
  },
};
</script>

<style scoped>
.mini-ace-editor {
  width: 100%;
  border-radius: 0 0 4px 4px;
}
.text-mode-container {
  border-top: 1px solid #dee2e6;
}
</style>
