<template>
  <div class="d-flex flex-column vh-100 bg-light">
    <header class="bg-dark text-light p-3 shadow-sm">
      <div class="container-xxl d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center gap-3">
          <h1 class="h3 mb-0 logo-title" style="cursor: pointer;" @click="setView('editor')">SLA Editor</h1>
          <div class="vr d-none d-md-block bg-secondary"></div>
          <nav class="d-none d-md-flex gap-2">
            <div class="dropdown">
              <button class="btn btn-sm btn-outline-light dropdown-toggle btn-transform" type="button" data-bs-toggle="dropdown" :class="{ active: ['terraform', 'bicep', 'grafana'].includes(currentView) }">
                Transform
              </button>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item btn-gen-terraform" href="#" data-bs-dismiss="dropdown" @click.prevent="setView('terraform')">Generate Terraform (GCP)</a></li>
                <li><a class="dropdown-item btn-gen-bicep" href="#" data-bs-dismiss="dropdown" @click.prevent="setView('bicep')">Generate Bicep (Azure)</a></li>
                <li><a class="dropdown-item btn-gen-grafana" href="#" data-bs-dismiss="dropdown" @click.prevent="setView('grafana')">Generate Grafana (Prometheus)</a></li>
              </ul>
            </div>
            <div class="dropdown">
              <button class="btn btn-sm btn-outline-light dropdown-toggle btn-help-menu" type="button" data-bs-toggle="dropdown" :class="{ active: ['tutorial', 'help'].includes(currentView) }">
                Help
              </button>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item btn-view-tutorial" href="#" data-bs-dismiss="dropdown" @click.prevent="setView('tutorial')">Tutorial</a></li>
                <li><a class="dropdown-item btn-view-help" href="#" data-bs-dismiss="dropdown" @click.prevent="setView('help')">Help Page</a></li>
              </ul>
            </div>
            <div class="dropdown">
              <button class="btn btn-sm btn-outline-light dropdown-toggle btn-settings-menu" type="button" data-bs-toggle="dropdown" :class="{ active: currentView === 'history' }">
                Settings
              </button>
              <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item btn-view-history" href="#" data-bs-dismiss="dropdown" @click.prevent="openHistory">History</a></li>
              </ul>
            </div>
          </nav>
        </div>
        <div class="d-flex gap-2 align-items-center">
          <!-- Mobile Menu -->
          <div class="dropdown d-md-none">
             <button class="btn btn-sm btn-outline-light dropdown-toggle" type="button" data-bs-toggle="dropdown">
               Menu
             </button>
             <ul class="dropdown-menu">
               <li><a class="dropdown-item" href="#" data-bs-dismiss="dropdown" @click.prevent="setView('editor')">Editor</a></li>
               <li><a class="dropdown-item" href="#" data-bs-dismiss="dropdown" @click.prevent="setView('terraform')">Generate Terraform</a></li>
               <li><a class="dropdown-item" href="#" data-bs-dismiss="dropdown" @click.prevent="setView('bicep')">Generate Bicep</a></li>
               <li><a class="dropdown-item" href="#" data-bs-dismiss="dropdown" @click.prevent="setView('grafana')">Generate Grafana</a></li>
               <li><hr class="dropdown-divider"></li>
               <li><a class="dropdown-item" href="#" data-bs-dismiss="dropdown" @click.prevent="setView('tutorial')">Tutorial</a></li>
               <li><a class="dropdown-item" href="#" data-bs-dismiss="dropdown" @click.prevent="setView('help')">Help</a></li>
               <li><a class="dropdown-item" href="#" data-bs-dismiss="dropdown" @click.prevent="openHistory">History</a></li>
             </ul>
          </div>

          <span class="badge" :class="validationErrors.length === 0 ? 'bg-success' : 'bg-danger'">
            {{ validationErrors.length === 0 ? 'Valid' : validationErrors.length + ' Errors' }}
          </span>
        </div>
      </div>
    </header>
    <main class="flex-grow-1" :class="currentView === 'editor' ? 'overflow-hidden' : 'overflow-auto'">
      <div v-if="currentView === 'editor'" class="container-xxl h-100 px-0 px-md-3">
        <div class="row g-0 g-md-3 h-100">
          <div class="col-12 col-md-8 h-100 d-flex flex-column p-2 p-md-3">
            <div class="card flex-grow-1 mb-3 shadow-sm overflow-hidden">
              <div class="card-header bg-white border-bottom-0 pb-0">
                <ul class="nav nav-tabs card-header-tabs">
                  <li class="nav-item">
                    <a href="#" class="nav-link btn-tab-gui" :class="{ active: activeTab === 'gui' }" @click.prevent="activeTab = 'gui'">GUI</a>
                  </li>
                  <li class="nav-item">
                    <a href="#" class="nav-link btn-tab-description" :class="{ active: activeTab === 'description' }" @click.prevent="activeTab = 'description'">Description</a>
                  </li>
                  <li class="nav-item">
                    <a href="#" class="nav-link btn-tab-source" :class="{ active: activeTab === 'source' }" @click.prevent="activeTab = 'source'">Source</a>
                  </li>
                </ul>
              </div>
              <div class="card-body p-0 overflow-auto">
                <div v-show="activeTab === 'gui'" class="p-3">
                  <ResponsiveWrapper title="Context" id="context-editor" v-model="sla.context">
                    <ContextEditor :context="sla.context" :errors="validationErrorsMap" @update:context="Object.assign(sla.context, $event)" />
                  </ResponsiveWrapper>

                  <ResponsiveWrapper title="Currencies" id="currency-editor" v-model="sla.customCurrencies">
                    <CurrencyEditor :custom-currencies="sla.customCurrencies" :errors="validationErrorsMap" @update:custom-currencies="sla.customCurrencies = $event" />
                  </ResponsiveWrapper>
                  
                  <ResponsiveWrapper title="Metrics" id="metrics-editor" v-model="sla.metrics">
                    <MetricsEditor :metrics="sla.metrics" :errors="validationErrorsMap" @update:metrics="(m) => { Object.keys(sla.metrics).forEach(k => delete sla.metrics[k]); Object.assign(sla.metrics, m); }" />
                  </ResponsiveWrapper>
                  
                  <ResponsiveWrapper title="Plans" id="plans-editor" v-model="sla.plans">
                    <PlansEditor :plans="sla.plans" :metrics="sla.metrics" :errors="validationErrorsMap" @update:plans="(p) => { Object.keys(sla.plans).forEach(k => delete sla.plans[k]); Object.assign(sla.plans, p); }" />
                  </ResponsiveWrapper>
                </div>
                <div v-show="activeTab === 'description'">
                  <PolicyDescription :sla="sla" />
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
                <select class="form-select mb-3 select-example-loader" @change="confirmLoadExample($event.target.value)">
                  <option selected disabled>Select an example</option>
                  <option v-for="(content, name) in examples" :key="name" :value="name">
                    {{ name.replace(/-/g, ' ') }}
                  </option>
                </select>
                <div class="list-group list-group-flush mb-3 d-none">
                  <button v-for="(content, name) in examples" :key="name" 
                    @click="confirmLoadExample(name)"
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

      <HelpPage v-else-if="currentView === 'help'" @close="setView('editor')" />
      <TutorialPage v-else-if="currentView === 'tutorial'" @close="setView('editor')" />
      <TerraformGenerator v-else-if="currentView === 'terraform'" :sla="sla" @close="setView('editor')" />
      <AzureBicepGenerator v-else-if="currentView === 'bicep'" :sla="sla" @close="setView('editor')" />
      <GrafanaDashboardGenerator v-else-if="currentView === 'grafana'" :sla="sla" @close="setView('editor')" />

    </main>

    <!-- Confirmation Modal -->
    <div class="modal fade" id="confirmLoadModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Unsaved Changes</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>You have modified the current SLA. Loading a new example will overwrite your changes.</p>
            <p>Are you sure you want to proceed?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" @click="proceedWithExample">Proceed</button>
          </div>
        </div>
      </div>
    </div>

    <!-- History Modal -->
    <div class="modal fade" id="historyModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">SLA History</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div v-if="historyFiles.length === 0" class="text-center p-4">
              <p class="text-muted">No history found.</p>
            </div>
            <div v-else class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>SLA ID</th>
                    <th>Last Modified</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="file in historyFiles" :key="file.id">
                    <td>{{ file.id }}</td>
                    <td>{{ new Date(file.lastModified).toLocaleString() }}</td>
                    <td>
                      <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" @click="restoreFromHistory(file)">Restore</button>
                        <button class="btn btn-outline-danger" @click="deleteFromHistory(file.id)">Delete</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch, reactive, computed, provide, nextTick } from 'vue';
import { currencies } from './utils/currencies';
import { getAllHolidayCalendars, getGoogleHolidayCalendarUrl } from './utils/holidays';
import { validatePromQL } from './utils/formatters';
import { saveSla, getCurrentSlaId, getSla, getAllSlas, deleteSla } from './utils/storage';
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
import gcpMonitoringComplex from './assets/examples/gcp-monitoring-complex.yaml?raw';
import azureMonitoringSample from './assets/examples/azure-monitoring-sample.yaml?raw';
import fourGoldenSignals from './assets/examples/four-golden-signals.yaml?raw';
import grafanaPrometheusSample from './assets/examples/grafana-prometheus-sample.yaml?raw';
import ContextEditor from './components/ContextEditor.vue';
import CurrencyEditor from './components/CurrencyEditor.vue';
import MetricsEditor from './components/MetricsEditor.vue';
import PlansEditor from './components/PlansEditor.vue';
import ResponsiveWrapper from './components/ResponsiveWrapper.vue';
import PolicyDescription from './components/PolicyDescription.vue';
import HelpPage from './components/HelpPage.vue';
import TutorialPage from './components/TutorialPage.vue';
import TerraformGenerator from './components/TerraformGenerator.vue';
import AzureBicepGenerator from './components/AzureBicepGenerator.vue';
import GrafanaDashboardGenerator from './components/GrafanaDashboardGenerator.vue';

const Range = ace.require('ace/range').Range;

export default {
  name: 'App',
  components: {
    ContextEditor,
    CurrencyEditor,
    MetricsEditor,
    PlansEditor,
    ResponsiveWrapper,
    PolicyDescription,
    HelpPage,
    TutorialPage,
    TerraformGenerator,
    AzureBicepGenerator,
    GrafanaDashboardGenerator,
  },
  setup() {
    const activeTab = ref('gui');
    const currentView = ref('editor');
    const aceEditor = ref(null);
    let editor = null;
    const validationErrors = ref([]);
    const markers = ref([]);
    let processingUpdate = false;

    // Storage and Dirty Tracking
    const lastLoadedContent = ref(''); // Stores the CANONICAL YAML string
    
    const getNormalizedObject = (yaml) => {
      try {
        const doc = jsYaml.load(yaml);
        if (!doc || typeof doc !== 'object') return yaml ? yaml.trim() : '';
        const sortObject = (obj) => {
          if (obj === null || typeof obj !== 'object') return obj;
          if (Array.isArray(obj)) return obj.map(sortObject);
          return Object.keys(obj).sort().reduce((acc, key) => {
            acc[key] = sortObject(obj[key]);
            return acc;
          }, {});
        };
        return sortObject(doc);
      } catch (e) {
        return yaml ? yaml.trim() : '';
      }
    };

    const sla = reactive({
      sla: "1.0.0", // Required by schema
      context: { id: 'example-sla', type: 'plans' }, // Default structure for context editor
      metrics: {},
      plans: {},
      customCurrencies: []
    });

    const isDirty = computed(() => {
      if (!lastLoadedContent.value) return false;
      // We compare current canonical YAML with last loaded canonical YAML
      // This is efficient and handles all sorting/formatting because it's always generated from the model
      const currentCanonical = jsYaml.dump(sla);
      return currentCanonical !== lastLoadedContent.value;
    });

    const historyFiles = ref([]);
    const pendingExample = ref(null);
    let confirmModal = null;
    let historyModal = null;

    const setView = (view) => {
      currentView.value = view;
      // Force close any open Bootstrap dropdowns
      document.querySelectorAll('.dropdown-menu.show').forEach(el => el.classList.remove('show'));
      document.querySelectorAll('.dropdown-toggle.show').forEach(el => {
        el.classList.remove('show');
        el.setAttribute('aria-expanded', 'false');
      });
    };

    const openHistory = () => {
      historyFiles.value = getAllSlas();
      if (historyModal) historyModal.show();
    };

    const confirmLoadExample = (exampleName) => {
      if (isDirty.value) {
        pendingExample.value = exampleName;
        if (confirmModal) confirmModal.show();
      } else {
        loadExample(exampleName);
      }
    };

    const proceedWithExample = () => {
      if (pendingExample.value) {
        loadExample(pendingExample.value);
        pendingExample.value = null;
      }
    };

    const loadExample = (exampleName) => {
      const rawContent = examples[exampleName];
      const doc = jsYaml.load(rawContent);
      
      processingUpdate = true;
      try {
        updateModelFromDoc(doc);
        const canonical = jsYaml.dump(sla);
        yamlContent.value = canonical;
        lastLoadedContent.value = canonical;
        if (editor) editor.setValue(canonical, -1);
        if (confirmModal) confirmModal.hide();
        
        if (sla.context && sla.context.id) {
          saveSla(sla.context.id, canonical, true);
        }
      } finally {
        processingUpdate = false;
      }
      nextTick(() => { isProgrammaticChange = false; });
    };

    const restoreFromHistory = (file) => {
      const doc = jsYaml.load(file.current);
      
      processingUpdate = true;
      try {
        updateModelFromDoc(doc);
        const canonical = jsYaml.dump(sla);
        yamlContent.value = canonical;
        lastLoadedContent.value = canonical;
        if (editor) editor.setValue(canonical, -1);
        if (historyModal) historyModal.hide();
        
        saveSla(file.id, canonical, true);
      } finally {
        processingUpdate = false;
      }
      nextTick(() => { isProgrammaticChange = false; });
    };

    const deleteFromHistory = (id) => {
      deleteSla(id);
      historyFiles.value = getAllSlas();
    };

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

    const examples = {
      'support-mon-fri': supportMonFri,
      'availability-1-week-downtime': availability1WeekDowntime,
      'metrics-100-concurrent-connections': metrics100ConcurrentConnections,
      'gcp-monitoring-complex': gcpMonitoringComplex,
      'azure-monitoring-sample': azureMonitoringSample,
      'four-golden-signals': fourGoldenSignals,
      'grafana-prometheus-sample': grafanaPrometheusSample,
    };

    const availableCurrencies = computed(() => {
      const custom = (sla.customCurrencies || []).map(c => ({
        code: c.code,
        name: c.description || c.code,
        isCustom: true
      })).filter(c => c.code);
      return [...currencies, ...custom];
    });

    provide('availableCurrencies', availableCurrencies);
    provide('holidayCalendars', {
      all: getAllHolidayCalendars(),
      getUrl: getGoogleHolidayCalendarUrl
    });

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

    const updateModelFromDoc = (doc) => {
      if (!doc || typeof doc !== 'object') return;
      if (doc.context) Object.assign(sla.context, doc.context);
      
      if (doc.metrics) {
        Object.keys(sla.metrics).forEach(key => delete sla.metrics[key]);
        Object.assign(sla.metrics, doc.metrics);
      } else {
        Object.keys(sla.metrics).forEach(key => delete sla.metrics[key]);
      }
      
      if (doc.plans) {
         Object.keys(sla.plans).forEach(key => delete sla.plans[key]);
         for (const [planName, planData] of Object.entries(doc.plans)) {
           sla.plans[planName] = planData;
         }
      } else {
         Object.keys(sla.plans).forEach(key => delete sla.plans[key]);
      }
      
      if (doc.customCurrencies) {
         sla.customCurrencies.splice(0, sla.customCurrencies.length, ...doc.customCurrencies);
      } else {
         sla.customCurrencies.splice(0, sla.customCurrencies.length);
      }
      
      if (doc.sla) sla.sla = doc.sla;
    };

    const validateYaml = (content) => {
      try {
        const doc = jsYaml.load(content);
        if (doc && typeof doc === 'object' && !processingUpdate) {
          processingUpdate = true;
          try {
            updateModelFromDoc(doc);
          } finally {
            processingUpdate = false;
          }
        }

        const valid = validate(doc);
        clearMarkers();

        const allErrors = [];
        let parsedYaml;
        try {
          parsedYaml = YAML.parseDocument(content);
        } catch (e) {
          // Silent catch, parsedYaml will be null
        }

        const getErrorWithLine = (err) => {
          try {
            const path = err.instancePath.split('/').filter(p => p !== '');
            let node = parsedYaml ? parsedYaml.getIn(path, true) : null;
            
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
            const message = getFriendlyErrorMessage(err);
            return { ...err, line, range, message };
          } catch (e) {
            return { ...err, line: 0, message: getFriendlyErrorMessage(err) };
          }
        };

        if (!valid && validate.errors) {
          validate.errors.forEach(err => {
            allErrors.push(getErrorWithLine(err));
          });
        }
        
        // Custom PromQL Validation
        if (doc) {
          const validateObject = (node, path) => {
            if (!node || typeof node !== 'object') return;

            // 1. Direct PromQL fields
            const promqlFields = ['expression', 'measurement'];
            promqlFields.forEach(field => {
              if (node[field] && typeof node[field] === 'string') {
                const res = validatePromQL(node[field], doc.metrics);
                if (!res.valid) {
                  allErrors.push(getErrorWithLine({
                    instancePath: `${path}/${field}`,
                    message: `Invalid PromQL: ${res.error}`,
                    keyword: 'promql'
                  }));
                }
              }
            });

            // 2. Quotas (can be PromQL strings)
            if (node.quotas && typeof node.quotas === 'object') {
              Object.entries(node.quotas).forEach(([m, val]) => {
                if (typeof val === 'string' && (val.includes('(') || val.includes(' '))) {
                   const res = validatePromQL(val, doc.metrics);
                   if (!res.valid) {
                     allErrors.push(getErrorWithLine({
                       instancePath: `${path}/quotas/${m}`,
                       message: `Invalid PromQL: ${res.error}`,
                       keyword: 'promql'
                     }));
                   }
                }
              });
            }

            // Recursive traversal
            Object.entries(node).forEach(([k, v]) => {
              if (Array.isArray(v)) {
                v.forEach((item, idx) => validateObject(item, `${path}/${k}/${idx}`));
              } else if (typeof v === 'object') {
                validateObject(v, `${path}/${k}`);
              }
            });
          };

          if (doc.plans) {
            Object.entries(doc.plans).forEach(([planName, plan]) => {
              validateObject(plan, `/plans/${planName}`);
            });
          }
          if (doc.supportPolicy) {
             validateObject(doc.supportPolicy, '/supportPolicy');
          }
        }

        // Custom Validation: All defined metrics should be referenced at least once
        if (doc && doc.metrics && typeof doc.metrics === 'object') {
          const definedMetrics = Object.keys(doc.metrics);
          const referencedMetrics = new Set();

          const collectReferencedMetrics = (node) => {
            if (!node || typeof node !== 'object') return;
            
            // 1. Direct metric references
            if (node.metric && typeof node.metric === 'string') {
              referencedMetrics.add(node.metric);
            }

            // 2. PromQL expressions
            const promqlFields = ['expression', 'measurement'];
            promqlFields.forEach(field => {
              if (node[field] && typeof node[field] === 'string') {
                const res = validatePromQL(node[field]);
                if (res.valid && res.metrics) {
                  res.metrics.forEach(m => referencedMetrics.add(m));
                }
              }
            });

            // 3. Quotas (the keys are the metric names if they are not complex expressions)
            // If quotas are PromQL strings, they are handled by step 2 if we traverse them.
            if (node.quotas && typeof node.quotas === 'object') {
              Object.entries(node.quotas).forEach(([m, val]) => {
                if (typeof val === 'string') {
                   const res = validatePromQL(val);
                   if (res.valid && res.metrics) {
                     res.metrics.forEach(rm => referencedMetrics.add(rm));
                   } else {
                     // If not valid PromQL, assume it might be a simple value and the key is the metric
                     referencedMetrics.add(m);
                   }
                } else {
                   referencedMetrics.add(m);
                }
              });
            }

            // Recursive traversal
            Object.values(node).forEach(v => {
              if (Array.isArray(v)) v.forEach(collectReferencedMetrics);
              else if (typeof v === 'object') collectReferencedMetrics(v);
            });
          };

          if (doc.plans) collectReferencedMetrics(doc.plans);

          definedMetrics.forEach(metric => {
            if (!referencedMetrics.has(metric)) {
              allErrors.push(getErrorWithLine({
                instancePath: `/metrics/${metric}`,
                message: `Metric '${metric}' is defined but not referenced anywhere in the specification.`,
                keyword: 'unused-metric'
              }));
            }
          });
        }

        validationErrors.value = allErrors;

        if (editor) {
          const annotations = [];
          allErrors.forEach(err => {
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

    const initEditor = () => {
      if (!aceEditor.value) return;
      
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
        validateYaml(yamlContent.value);
      });

      // Initial value set
      isProgrammaticChange = true;
      editor.setValue(yamlContent.value, -1);
      isProgrammaticChange = false;

      validateYaml(yamlContent.value);
    };

    onMounted(() => {
      window.addEventListener('resize', handleResize);
      window.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('beforeunload', triggerImmediateSave);
      window.setYamlContent = setYamlContent; // Expose for testing
      
      const confirmEl = document.getElementById('confirmLoadModal');
      if (confirmEl && window.bootstrap) confirmModal = new window.bootstrap.Modal(confirmEl);
      const historyEl = document.getElementById('historyModal');
      if (historyEl && window.bootstrap) historyModal = new window.bootstrap.Modal(historyEl);

      const lastId = getCurrentSlaId();
      processingUpdate = true;
      try {
        if (lastId) {
          const lastSla = getSla(lastId);
          if (lastSla) {
            const doc = jsYaml.load(lastSla.current);
            updateModelFromDoc(doc);
            const canonical = jsYaml.dump(sla);
            yamlContent.value = canonical;
            lastLoadedContent.value = canonical;
          }
        } else {
          const doc = jsYaml.load(example);
          updateModelFromDoc(doc);
          const canonical = jsYaml.dump(sla);
          yamlContent.value = canonical;
          lastLoadedContent.value = canonical;
        }
      } finally {
        processingUpdate = false;
      }

      initEditor();
    });

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', triggerImmediateSave);
    });

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        triggerImmediateSave();
      }
    };

    watch(currentView, async (newView) => {
      if (newView === 'editor') {
        await nextTick();
        initEditor();
        if (activeTab.value === 'source' && editor) {
          editor.resize();
          editor.renderer.updateFull();
        }
      }
    });

    watch(activeTab, (newTab) => {
      if (newTab === 'source' && editor) {
        isProgrammaticChange = true;
        editor.setValue(yamlContent.value, -1);
        isProgrammaticChange = false;
        validateYaml(yamlContent.value);
        // Delay resize slightly to ensure DOM is updated if v-show/v-if was used
        setTimeout(() => {
          editor.resize();
          editor.renderer.updateFull();
        }, 0);
        isProgrammaticChange = false;
      }
    });

    let saveTimeout = null;
    const triggerImmediateSave = () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
        saveTimeout = null;
        if (sla.context && sla.context.id) {
          saveSla(sla.context.id, yamlContent.value);
        }
      }
    };

    watch(yamlContent, (newContent) => {
      validateYaml(newContent);
      if (saveTimeout) clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        if (sla.context && sla.context.id) {
          saveSla(sla.context.id, newContent);
          saveTimeout = null;
        }
      }, 2000); // 2 second debounce for auto-save
    });

    watch(sla, (newSla) => {
      if (processingUpdate) return;
      const newYaml = jsYaml.dump(newSla);
      const currentNorm = getNormalizedObject(yamlContent.value);
      const newNorm = getNormalizedObject(newYaml);
      
      if (JSON.stringify(currentNorm) !== JSON.stringify(newNorm)) {
        processingUpdate = true;
        try {
          isProgrammaticChange = true;
          yamlContent.value = newYaml;
          if (editor) {
            editor.setValue(newYaml, -1);
          }
          nextTick(() => { isProgrammaticChange = false; });
        } finally {
          processingUpdate = false;
        }
      }
    }, { deep: true });

    const setYamlContent = (content) => {
      const doc = jsYaml.load(content);
      processingUpdate = true;
      try {
        updateModelFromDoc(doc);
        const canonical = jsYaml.dump(sla);
        yamlContent.value = canonical;
        lastLoadedContent.value = canonical;
        if (editor) {
          editor.setValue(canonical, -1);
        }
      } finally {
        processingUpdate = false;
      }
      nextTick(() => { isProgrammaticChange = false; });
    };

    const jumpToError = async (line) => {
      activeTab.value = 'source';
      await nextTick();
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
      currentView,
      aceEditor,
      validationErrors,
      validationErrorsMap,
      sla,
      isDirty,
      examples,
      loadExample,
      confirmLoadExample,
      proceedWithExample,
      openHistory,
      restoreFromHistory,
      deleteFromHistory,
      setYamlContent,
      jumpToError,
      setView,
      historyFiles,
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