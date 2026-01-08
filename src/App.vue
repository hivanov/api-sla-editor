<template>
  <div class="d-flex flex-column vh-100 bg-light">
    <header class="bg-dark text-light p-3 shadow-sm">
      <div class="container-xxl d-flex justify-content-between align-items-center">
        <h1 class="h3 mb-0">SLA Editor</h1>
        <div class="d-flex gap-2">
          <span class="badge" :class="validationErrors.length === 0 ? 'bg-success' : 'bg-danger'">
            {{ validationErrors.length === 0 ? 'Valid' : validationErrors.length + ' Errors' }}
          </span>
        </div>
      </div>
    </header>
    <main class="flex-grow-1 overflow-hidden">
      <div class="container-xxl h-100 px-0 px-md-3">
        <div class="row g-0 g-md-3 h-100">
          <div class="col-12 col-md-8 h-100 d-flex flex-column p-2 p-md-3">
            <div class="card flex-grow-1 mb-3 shadow-sm overflow-hidden">
              <div class="card-header bg-white border-bottom-0 pb-0">
                <ul class="nav nav-tabs card-header-tabs">
                  <li class="nav-item">
                    <a href="#" class="nav-link" :class="{ active: activeTab === 'gui' }" @click.prevent="activeTab = 'gui'">GUI</a>
                  </li>
                  <li class="nav-item">
                    <a href="#" class="nav-link" :class="{ active: activeTab === 'source' }" @click.prevent="activeTab = 'source'">Source</a>
                  </li>
                </ul>
              </div>
              <div class="card-body p-0 overflow-auto">
                <div v-show="activeTab === 'gui'" class="p-3">
                  <ResponsiveWrapper title="Context" id="context-editor" v-model="sla.context">
                    <ContextEditor :context="sla.context" :errors="validationErrorsMap" @update:context="Object.assign(sla.context, $event)" />
                  </ResponsiveWrapper>
                  
                  <ResponsiveWrapper title="Metrics" id="metrics-editor" v-model="sla.metrics">
                    <MetricsEditor :metrics="sla.metrics" :errors="validationErrorsMap" @update:metrics="(m) => { Object.keys(sla.metrics).forEach(k => delete sla.metrics[k]); Object.assign(sla.metrics, m); }" />
                  </ResponsiveWrapper>
                  
                  <ResponsiveWrapper title="Plans" id="plans-editor" v-model="sla.plans">
                    <PlansEditor :plans="sla.plans" :metrics="sla.metrics" :errors="validationErrorsMap" @update:plans="(p) => { Object.keys(sla.plans).forEach(k => delete sla.plans[k]); Object.assign(sla.plans, p); }" />
                  </ResponsiveWrapper>
                </div>
                <div v-show="activeTab === 'source'" class="h-100">
                  <div ref="aceEditor" class="ace-editor-container h-100"></div>
                </div>
              </div>
            </div>
            
            <!-- Error List below editor -->
            <div class="card validation-card shadow-sm" style="max-height: 250px;">
              <div class="card-header d-flex justify-content-between align-items-center bg-white">
                <span class="fw-bold">Validation Errors</span>
                <span v-if="validationErrors.length === 0" class="badge bg-success">Valid</span>
                <span v-else class="badge bg-danger">{{ validationErrors.length }} Errors</span>
              </div>
              <div class="card-body p-0 overflow-auto">
                <div v-if="validationErrors.length === 0" class="p-3 text-success">
                  <i class="bi bi-check-circle-fill me-2"></i>Validation successful!
                </div>
                <div v-else class="error-list-container">
                  <table class="table table-hover mb-0">
                    <thead class="table-light sticky-top">
                      <tr>
                        <th style="width: 80px">Line</th>
                        <th style="width: 200px">Path</th>
                        <th>Message</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(error, index) in validationErrors" :key="index" @click="jumpToError(error.line)" style="cursor: pointer;">
                        <td><span class="badge bg-danger">L{{ (error.line || 0) + 1 }}</span></td>
                        <td class="text-muted small">{{ error.instancePath || 'root' }}</td>
                        <td class="text-danger">{{ error.message }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-4 h-100 p-2 p-md-3 d-none d-md-flex flex-column">
            <div class="card shadow-sm h-100">
              <div class="card-header bg-white fw-bold">
                Examples
              </div>
              <div class="card-body overflow-auto">
                <p class="text-muted small">Load an example to get started with SLA creation.</p>
                <select class="form-select mb-3" @change="loadExample($event.target.value)">
                  <option selected disabled>Select an example</option>
                  <option v-for="(content, name) in examples" :key="name" :value="name">
                    {{ name.replace(/-/g, ' ') }}
                  </option>
                </select>
                <div class="list-group list-group-flush mb-3 d-none">
                  <button v-for="(content, name) in examples" :key="name" 
                    @click="loadExample(name)"
                    class="list-group-item list-group-item-action">
                    {{ name.replace(/-/g, ' ') }}
                  </button>
                </div>
                <hr>
                <div class="alert alert-info small">
                  <strong>Tips:</strong>
                  <ul class="mb-0 ps-3">
                    <li>Use GUI for easy editing</li>
                    <li>Use Source for advanced YAML</li>
                    <li>Check validation errors below</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch, reactive, computed } from 'vue';
import 'bootstrap/dist/css/bootstrap.css';
import ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import jsYaml from 'js-yaml';
import YAML from 'yaml';
import schema from './spec/spec.json';
import example from './assets/example.yaml?raw';
import supportMonFri from './assets/examples/support-mon-fri.yaml?raw';
import availability1WeekDowntime from './assets/examples/availability-1-week-downtime.yaml?raw';
import metrics100ConcurrentConnections from './assets/examples/metrics-100-concurrent-connections.yaml?raw';
import ContextEditor from './components/ContextEditor.vue';
import MetricsEditor from './components/MetricsEditor.vue';
import PlansEditor from './components/PlansEditor.vue';
import ResponsiveWrapper from './components/ResponsiveWrapper.vue';

const Range = ace.require('ace/range').Range;

export default {
  name: 'App',
  components: {
    ContextEditor,
    MetricsEditor,
    PlansEditor,
    ResponsiveWrapper,
  },
  setup() {
    const activeTab = ref('gui');
    const aceEditor = ref(null);
    let editor = null;
    const validationErrors = ref([]);
    const markers = ref([]);

    const validationErrorsMap = computed(() => {
      const map = {};
      validationErrors.value.forEach(error => {
        let path = error.instancePath || '';
        
        const addError = (p, msg) => {
          if (!map[p]) map[p] = [];
          if (map[p].indexOf(msg) === -1) map[p].push(msg);
        };

        addError(path, error.message);
        addError(path.startsWith('/') ? path : '/' + path, error.message);
        addError(path.startsWith('/') ? path.substring(1) : path, error.message);
        
        if (error.keyword === 'required') {
          const propPath = (path === '' ? '' : path) + '/' + error.params.missingProperty;
          addError(propPath, error.message);
          addError(propPath.startsWith('/') ? propPath : '/' + propPath, error.message);
        }
      });
      return map;
    });

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

    const clearMarkers = () => {
      if (editor) {
        markers.value.forEach(id => editor.session.removeMarker(id));
        markers.value = [];
        editor.session.setAnnotations([]);
      }
    };

    const getFriendlyErrorMessage = (err) => {
      const params = err.params;
      switch (err.keyword) {
        case 'required':
          return `Field '${params.missingProperty}' is required`;
        case 'pattern':
          if (err.instancePath.includes('availability')) {
            return 'Availability must be a percentage (e.g., 99.9%)';
          }
          if (err.instancePath.includes('rrule')) {
            return 'Invalid RRULE format (e.g., FREQ=DAILY)';
          }
          if (err.instancePath.includes('duration') || err.instancePath.includes('Period') || err.instancePath.includes('period') || err.instancePath.includes('claimWindow') || err.instancePath.includes('afterTermination') || err.instancePath.includes('minimumTerm')) {
            return 'Invalid duration format (e.g., P1D or PT1H)';
          }
          if (err.instancePath.includes('url')) {
            return 'URL must start with http://, https://, mailto://, or tel://';
          }
          if (err.instancePath.includes('opens') || err.instancePath.includes('closes')) {
            return 'Time must be in HH:mm format (e.g., 09:00)';
          }
          if (err.instancePath.includes('regionCode')) {
            return 'Invalid region code (e.g., DE or US-NY)';
          }
          if (err.instancePath.includes('date')) {
            return 'Invalid date format (YYYY-MM-DD)';
          }
          return err.message;
        case 'enum':
          return `Must be one of: ${params.allowedValues.join(', ')}`;
        case 'type':
          return `Value must be a ${params.type}`;
        case 'minimum':
          return `Value must be at least ${params.limit}`;
        case 'maximum':
          return `Value must be at most ${params.limit}`;
        case 'minItems':
          return `Must have at least ${params.limit} item(s)`;
        default:
          return err.message;
      }
    };

    const validateYaml = (content) => {
      try {
        const doc = jsYaml.load(content);
        if (doc && typeof doc === 'object') {
          if (doc.context) Object.assign(sla.context, doc.context);
          if (doc.metrics) {
            Object.keys(sla.metrics).forEach(key => delete sla.metrics[key]);
            Object.assign(sla.metrics, doc.metrics);
          } else {
            Object.keys(sla.metrics).forEach(key => delete sla.metrics[key]);
          }
          if (doc.plans) {
             Object.keys(sla.plans).forEach(key => delete sla.plans[key]);
             // Deeply assign to ensure nested objects like pricing are reactive
             for (const [planName, planData] of Object.entries(doc.plans)) {
               sla.plans[planName] = planData;
             }
          } else {
             Object.keys(sla.plans).forEach(key => delete sla.plans[key]);
          }
          if (doc.sla) sla.sla = doc.sla;
        }

        const valid = validate(doc);
        clearMarkers();

        if (valid) {
          validationErrors.value = [];
        } else {
          // Map errors to line numbers
          const parsedYaml = YAML.parseDocument(content);
          const errorsWithLines = validate.errors.map(err => {
            const path = err.instancePath.split('/').filter(p => p !== '');
            let node = parsedYaml.getIn(path, true);
            
            // If node not found, try parents
            let currentPath = [...path];
            while (!node && currentPath.length > 0) {
              currentPath.pop();
              node = parsedYaml.getIn(currentPath, true);
            }

            let line = 0;
            let range = null;
            if (node) {
              const rangeArray = node.range || (node.value && node.value.range);
              
              if (rangeArray) {
                const before = content.substring(0, rangeArray[0]);
                line = before.split('\n').length - 1;
                
                const nodeText = content.substring(rangeArray[0], rangeArray[1]);
                const nodeLines = nodeText.split('\n');
                const endLine = line + nodeLines.length - 1;
                const endColumn = nodeLines[nodeLines.length - 1].length;
                range = { startLine: line, startColumn: 0, endLine, endColumn };
              }
            }
            return { ...err, line, range, message: getFriendlyErrorMessage(err) };
          });

          validationErrors.value = errorsWithLines;
          
          if (editor) {
            const annotations = [];
            errorsWithLines.forEach(err => {
              annotations.push({
                row: err.line,
                column: 0,
                text: err.message,
                type: "error"
              });

              if (err.range) {
                const markerRange = new Range(err.range.startLine, 0, err.range.endLine, err.range.endColumn || 100);
                const markerId = editor.session.addMarker(markerRange, "error-squiggly", "text", true);
                markers.value.push(markerId);
              }
            });
            editor.session.setAnnotations(annotations);
          }
        }
      } catch (e) {
        let line = 0;
        if (e.mark) line = e.mark.line;
        validationErrors.value = [{ message: e.message, line }];
        clearMarkers();
        if (editor) {
          editor.session.setAnnotations([{ 
            row: line,
            column: 0,
            text: e.message,
            type: "error"
          }]);
          const markerRange = new Range(line, 0, line, 100);
          const markerId = editor.session.addMarker(markerRange, "error-squiggly", "text", true);
          markers.value.push(markerId);
        }
      }
    };

    let isProgrammaticChange = false;

    onMounted(() => {
      window.addEventListener('resize', handleResize);
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

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
    });

    watch(activeTab, (newTab) => {
      if (newTab === 'source' && editor) {
        isProgrammaticChange = true;
        editor.setValue(yamlContent.value, -1);
        // Delay resize slightly to ensure DOM is updated if v-show/v-if was used
        setTimeout(() => {
          editor.resize();
          editor.renderer.updateFull();
        }, 0);
        isProgrammaticChange = false;
      }
    });

    watch(yamlContent, (newContent) => {
      validateYaml(newContent);
    });

    watch(sla, (newSla) => {
      const newYaml = jsYaml.dump(newSla);
      if (yamlContent.value !== newYaml) {
        isProgrammaticChange = true;
        yamlContent.value = newYaml;
        if (editor) {
          editor.setValue(newYaml, -1);
        }
        isProgrammaticChange = false;
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
      if (editor) {
        isProgrammaticChange = true;
        editor.setValue(content, -1);
        isProgrammaticChange = false;
      }
    };

    const jumpToError = (line) => {
      activeTab.value = 'source';
      if (editor) {
        editor.gotoLine((line || 0) + 1, 0, true);
        editor.focus();
      }
    };

    const handleResize = () => {
      if (editor) {
        editor.resize();
      }
    };

    return {
      activeTab,
      aceEditor,
      validationErrors,
      validationErrorsMap,
      sla,
      examples,
      loadExample,
      setYamlContent,
      jumpToError,
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
  height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  min-height: 0;
}

.ace-editor-container {
  min-height: 200px;
  height: 100%;
}

.error-list-container {
  max-height: 300px;
  overflow-y: auto;
}

.validation-card {
  min-height: 150px;
}

.error-squiggly {
  position: absolute;
  border-bottom: 2px dotted red;
  z-index: 4;
}

@media (max-width: 768px) {
  .ace-editor-container {
    height: 300px;
  }
}
</style>