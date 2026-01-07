<template>
  <div class="d-flex flex-column vh-100">
    <header class="bg-dark text-light p-3">
      <h1>SLA Editor</h1>
    </header>
    <main class="d-flex flex-grow-1">
      <div class="col-12 col-md-8 p-3">
        <div class="card">
          <div class="card-header">
            <ul class="nav nav-tabs card-header-tabs">
              <li class="nav-item">
                <a class="nav-link" :class="{ active: activeTab === 'gui' }" @click="activeTab = 'gui'">GUI</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" :class="{ active: activeTab === 'source' }" @click="activeTab = 'source'">Source</a>
              </li>
            </ul>
          </div>
          <div class="card-body">
            <div v-show="activeTab === 'gui'">
              <ContextEditor :context="sla.context" @update:context="sla.context = $event" />
              <MetricsEditor :metrics="sla.metrics" @update:metrics="sla.metrics = $event" />
              <PlansEditor :plans="sla.plans" @update:plans="sla.plans = $event" />
            </div>
            <div v-show="activeTab === 'source'">
              <div ref="aceEditor" class="ace-editor-container"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-4 p-3 bg-light">
        <div class="card">
          <div class="card-header">
            Validation
          </div>
          <div class="card-body">
            <div v-if="validationErrors.length === 0" class="alert alert-success">
              Validation successful!
            </div>
            <div v-else>
              <div v-for="(error, index) in validationErrors" :key="index" class="alert alert-danger">
                <pre>{{ error }}</pre>
              </div>
            </div>
          </div>
        </div>
        <div class="card mt-3">
          <div class="card-header">
            Examples
          </div>
          <div class="card-body">
            <select class="form-select" @change="loadExample($event.target.value)">
              <option selected disabled>Select an example</option>
              <option v-for="(content, name) in examples" :key="name" :value="name">
                {{ name }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted, watch, reactive } from 'vue';
import 'bootstrap/dist/css/bootstrap.css';
import ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import yaml from 'js-yaml';
import schema from './spec/spec.json';
import example from './assets/example.yaml?raw';
import supportMonFri from './assets/examples/support-mon-fri.yaml?raw';
import availability1WeekDowntime from './assets/examples/availability-1-week-downtime.yaml?raw';
import metrics100ConcurrentConnections from './assets/examples/metrics-100-concurrent-connections.yaml?raw';
import ContextEditor from './components/ContextEditor.vue';
import MetricsEditor from './components/MetricsEditor.vue';
import PlansEditor from './components/PlansEditor.vue';

export default {
  name: 'App',
  components: {
    ContextEditor,
    MetricsEditor,
    PlansEditor,
  },
  setup() {
    const activeTab = ref('gui');
    const aceEditor = ref(null);
    let editor = null;
    const validationErrors = ref([]);
    const sla = reactive({
      sla: "1.0.0", // Required by schema
      context: { id: '', type: 'plans' }, // Default structure for context editor
      metrics: {},
      plans: {}
    });

    const examples = {
      'support-mon-fri': supportMonFri,
      'availability-1-week-downtime': availability1WeekDowntime,
      'metrics-100-concurrent-connections': metrics100ConcurrentConnections,
    };

    const ajv = new Ajv({ allErrors: true });
    addFormats(ajv);
    const validate = ajv.compile(schema);

    const yamlContent = ref(example);

    const validateYaml = (content) => {
      try {
        const doc = yaml.load(content);
        const valid = validate(doc);
        if (valid) {
          validationErrors.value = [];
          Object.assign(sla.context, doc.context || {});
          Object.assign(sla.metrics, doc.metrics || {});
          Object.assign(sla.plans, doc.plans || {});
        } else {
          validationErrors.value = validate.errors;
          console.error("Validation errors:", JSON.stringify(validationErrors.value, null, 2));
        }
      } catch (e) {
        validationErrors.value = [e];
        console.error("YAML parsing error:", e);
      }
    };

    let isProgrammaticChange = false;

    onMounted(() => {
      ace.config.set('basePath', 'https://cdn.jsdelivr.net/npm/ace-builds@' + ace.version + '/src-noconflict/');
      editor = ace.edit(aceEditor.value);
      editor.setTheme('ace/theme/monokai');
      editor.session.setMode('ace/mode/yaml');
      editor.setOptions({
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
      });
      
      editor.on('change', () => {
        if (isProgrammaticChange) return;
        yamlContent.value = editor.getValue();
      });

      // Initial value set
      isProgrammaticChange = true;
      editor.setValue(yamlContent.value, -1);
      isProgrammaticChange = false;

      validateYaml(yamlContent.value);
    });

    watch(yamlContent, (newContent) => {
      validateYaml(newContent);
    });

    watch(sla, (newSla) => {
      if (activeTab.value === 'gui') {
        const newYaml = yaml.dump(newSla);
        if (yamlContent.value !== newYaml) {
          isProgrammaticChange = true;
          yamlContent.value = newYaml;
          editor.setValue(newYaml, -1);
          isProgrammaticChange = false;
        }
      }
    }, { deep: true });

    const loadExample = (exampleName) => {
      isProgrammaticChange = true;
      yamlContent.value = examples[exampleName];
      editor.setValue(yamlContent.value, -1);
      isProgrammaticChange = false;
    };

    const setYamlContent = (content) => {
      yamlContent.value = content;
      // Ensure Ace editor also gets updated if it's currently visible
      if (editor) {
        isProgrammaticChange = true;
        editor.setValue(content, -1);
        isProgrammaticChange = false;
      }
    };

    return {
      activeTab,
      aceEditor,
      validationErrors,
      sla,
      examples,
      loadExample,
      setYamlContent, // Expose the new method
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh; /* Ensure app takes full viewport height */
  display: flex;
  flex-direction: column;
}

main {
  min-height: 0; /* Allow main to shrink */
}

.ace-editor-container {
  min-height: 200px;
  height: calc(100vh - 250px); /* Adjust based on header/footer/card-header heights */
}

@media (max-width: 768px) {
  .ace-editor-container {
    height: 200px; /* Fixed height for smaller screens */
  }
}
</style>