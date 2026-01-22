<template>
  <div class="azure-bicep-generator h-100 d-flex flex-column">
    <div class="d-flex justify-content-between align-items-center mb-3 p-3 bg-light border-bottom">
       <h4 class="mb-0">Azure Bicep Generator</h4>
       <div class="d-flex gap-2">
          <button class="btn btn-outline-secondary" @click="$emit('close')">Back to Editor</button>
          <button class="btn btn-primary btn-generate" @click="generate" :disabled="hasBlockingErrors">Generate</button>
          <button class="btn btn-outline-secondary" @click="download" :disabled="!generatedCode">Download .bicep</button>
       </div>
    </div>

    <div class="p-3 bg-white border-bottom">
       <h5>Azure Configuration</h5>
       <AzureMonitoringEditor :modelValue="{ resourceId, location }" @update:modelValue="val => { resourceId = val.resourceId; location = val.location; }" />
    </div>

    <div v-if="localErrors.length > 0" class="alert alert-warning m-3">
       <strong>Missing Information:</strong>
       <ul class="mb-0">
          <li v-for="(err, i) in localErrors" :key="i">{{ err }}</li>
       </ul>
    </div>

    <div v-if="validationResults.length > 0" class="m-3">
       <div :class="['alert', hasValidationErrors ? 'alert-danger' : 'alert-info']">
          <h6 class="alert-heading">{{ hasValidationErrors ? 'Bicep Validation Errors' : 'Bicep Validation Warnings' }}</h6>
          <ul class="mb-0 small">
             <li v-for="(res, i) in validationResults" :key="i">
                <strong>Line {{ res.line }}:</strong> {{ res.message }}
             </li>
          </ul>
       </div>
    </div>

    <div class="flex-grow-1 position-relative m-3 border">
       <div ref="editorContainer" class="ace-editor-container"></div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, computed } from 'vue';
import ace from 'ace-builds';
import 'ace-builds/src-noconflict/theme-monokai';
import AzureMonitoringEditor from './AzureMonitoringEditor.vue';
import { extractStructuredGuarantee, getTopLevelFunction, resolveMetricAliases } from '../utils/formatters';
import { generateAzureBicepAlert, isComplexPromQL, generateAzureActionGroup } from '../utils/transformers';
import { validateBicep as actualValidateBicep } from '../utils/bicep/validator';

// Define Bicep mode for Ace
ace.define('ace/mode/bicep_highlight_rules', function(require, exports, module) {
    const oop = require("ace/lib/oop");
    const TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;

    const BicepHighlightRules = function() {
        this.$rules = {
            "start": [
                { token: "comment", regex: "//.*$" },
                { token: "comment", regex: "/\*", next: "comment" },
                { token: "string", regex: "'", next: "string" },
                { token: "keyword", regex: "\\b(?:resource|targetScope|module|param|var|output|for|in|if|existing|metadata)\b" },
                { token: "constant.language.boolean", regex: "\\b(?:true|false|null)\b" },
                { token: "variable", regex: "[a-zA-Z_][a-zA-Z0-9_]*" },
                { token: "constant.numeric", regex: "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b" },
                { token: "paren.lparen", regex: "[[({]" },
                { token: "paren.rparen", regex: "[\\])}]" },
                { token: "keyword.operator", regex: "[=:?]" },
                { token: "text", regex: "\\s+" }
            ],
            "comment": [
                { token: "comment", regex: "\\*/", next: "start" },
                { defaultToken: "comment" }
            ],
            "string": [
                { token: "constant.character.escape", regex: "''" },
                { token: "constant.character.escape", regex: "\\$\\{ ", push: "interpolation" },
                { token: "string", regex: "'", next: "start" },
                { defaultToken: "string" }
            ],
            "interpolation": [
                { token: "constant.character.escape", regex: "}" , next: "pop" },
                { include: "start" }
            ]
        };
        this.normalizeRules();
    };

    oop.inherits(BicepHighlightRules, TextHighlightRules);
    exports.BicepHighlightRules = BicepHighlightRules;
});

ace.define('ace/mode/bicep', function(require, exports, module) {
    const oop = require("ace/lib/oop");
    const TextMode = require("ace/mode/text").Mode;
    const BicepHighlightRules = require("ace/mode/bicep_highlight_rules").BicepHighlightRules;

    const Mode = function() {
        this.HighlightRules = BicepHighlightRules;
    };
    oop.inherits(Mode, TextMode);

    (function() {
        this.$id = "ace/mode/bicep";
    }).call(Mode.prototype);

    exports.Mode = Mode;
});

export default {
  name: 'AzureBicepGenerator',
  components: {
    AzureMonitoringEditor
  },
  props: {
    sla: {
      type: Object,
      required: true
    }
  },
  emits: ['close'],
  setup(props) {
    const generatedCode = ref('');
    const localErrors = ref([]);
    const validationResults = ref([]);
    const editorContainer = ref(null);
    const resourceId = ref('');
    const location = ref('');
    let editor = null;

    const hasBlockingErrors = computed(() => {
       return !resourceId.value || !location.value;
    });

    const hasValidationErrors = computed(() => {
       return validationResults.value.some(r => r.type === 'error');
    });

    onMounted(() => {
       editor = ace.edit(editorContainer.value);
       editor.setTheme('ace/theme/monokai');
       editor.session.setMode('ace/mode/bicep'); 
       editor.session.setUseWorker(false);
       editor.setReadOnly(true);
    });

    watch(generatedCode, (newCode) => {
       if (editor) {
          editor.setValue(newCode, -1);
          validateBicep(newCode);
       }
    });

    const validateBicep = (code) => {
       const result = actualValidateBicep(code);
       validationResults.value = result.errors;
       
       if (editor) {
          const annotations = result.errors.map(r => ({
             row: r.line - 1,
             column: r.column,
             text: r.message,
             type: r.type
          }));
          editor.session.setAnnotations(annotations);
       }
    };

    const generate = () => {
       localErrors.value = [];
       const sla = props.sla;

       if (!resourceId.value || !location.value) {
          localErrors.value.push("Azure Configuration is incomplete.");
          return;
       }

       let bicep = '// Azure Bicep Monitoring Template generated from SLA\n\n';

       // Action Groups
       const actionGroups = [];
       const actionGroupNames = new Set();

       if (sla.plans) {
          Object.values(sla.plans).forEach(plan => {
             const support = plan.supportPolicy;
             if (support && support.contactPoints) {
                support.contactPoints.forEach(cp => {
                   if (cp.channels) {
                      cp.channels.forEach(ch => {
                         let type = '';
                         let emailAddress = '';
                         let phoneNumber = '';
                         let name = cp.contactType || ch.description || 'SLA Contact';

                         if (ch.type === 'email' && ch.url && ch.url.startsWith('mailto:')) {
                            type = 'email';
                            emailAddress = ch.url.replace(/^mailto:(\/\/)?/, '');
                         } else if ((ch.type === 'phone' || ch.type === 'sms') && ch.url && ch.url.startsWith('tel:')) {
                             type = 'sms';
                             phoneNumber = ch.url.replace(/^tel:(\/\/)?/, '');
                         }
                         
                         if (type) {
                            const groupKey = `ag_${name.replace(/[^a-zA-Z0-9]/g, '_')}`;
                            if (!actionGroupNames.has(groupKey)) {
                               actionGroupNames.add(groupKey);
                               const chunk = generateAzureActionGroup(name, type, type === 'email' ? emailAddress : phoneNumber);
                               actionGroups.push({ resourceName: groupKey, chunk });
                            }
                         }
                      });
                   }
                });
             }
          });
       }

       actionGroups.forEach(ag => bicep += ag.chunk);

       // Collect all guarantees
       const allGuarantees = [];
       if (sla.plans) {
          Object.entries(sla.plans).forEach(([planName, plan]) => {
             if (plan.guarantees) {
                plan.guarantees.forEach((g, i) => allGuarantees.push({ planName, guarantee: g, index: i, source: 'direct' }));
             }
             if (plan.serviceLevelObjectives) {
                plan.serviceLevelObjectives.forEach((slo, sloIdx) => {
                   if (slo.guarantees) {
                      slo.guarantees.forEach((g, i) => allGuarantees.push({ planName, guarantee: g, index: `${sloIdx}_${i}`, source: `slo_${slo.name || sloIdx}` }));
                   }
                });
             }
          });
       }

       allGuarantees.forEach(({ planName, guarantee, index, source }) => {
          const measurement = guarantee.measurement;
          let metricName, operator, value, period;
          let expression = '';
          let timeAggregation = 'Average';
          
          const extracted = extractStructuredGuarantee(measurement);
          if (extracted) {
             metricName = extracted.metric;
             operator = extracted.operator;
             value = extracted.value;
             period = extracted.period;
          } else {
             return;
          }

          const metricDef = (sla.metrics && sla.metrics[metricName]) || {};
          
          if (!metricDef.monitoringId) {
             localErrors.value.push(`No Azure metric mapping (monitoringId) for '${metricName}'. Skipping alert.`);
             return;
          }

          const complex = isComplexPromQL(measurement);
          let resolvedPromQL = '';
          
          if (complex) {
              const aliases = {};
              Object.entries(sla.metrics).forEach(([k, v]) => {
                  if (v.monitoringId) aliases[k] = v.monitoringId;
              });
              resolvedPromQL = resolveMetricAliases(measurement, aliases);
          }
          
          if (complex && isComplexPromQL(resolvedPromQL)) {
             expression = resolvedPromQL;
          } else {
             expression = metricDef.monitoringId;
             const func = getTopLevelFunction(measurement);
             if (func) {
                 const map = {
                     'avg_over_time': 'Average',
                     'sum_over_time': 'Total',
                     'min_over_time': 'Minimum',
                     'max_over_time': 'Maximum',
                     'count_over_time': 'Count'
                 };
                 if (map[func]) timeAggregation = map[func];
             }
          }

          const agNames = actionGroups.map(ag => ag.resourceName);
          
          const alertBicep = generateAzureBicepAlert({
             planName,
             source,
             index,
             metricName,
             expression: expression,
             duration: period,
             operator,
             threshold: parseFloat(value),
             location: location.value,
             scope: resourceId.value,
             actionGroups: agNames.length > 0 ? agNames : undefined,
             timeAggregation
          });

          bicep += alertBicep;
       });

       generatedCode.value = bicep;
    };

    const download = () => {
       const blob = new Blob([generatedCode.value], { type: 'text/plain' });
       const url = window.URL.createObjectURL(blob);
       const a = document.createElement('a');
       a.href = url;
       a.download = 'monitoring.bicep';
       a.click();
       window.URL.revokeObjectURL(url);
    };

    return {
       editorContainer,
       generate,
       download,
       generatedCode,
       localErrors,
       validationResults,
       hasValidationErrors,
       hasBlockingErrors,
       resourceId,
       location
    };
  }
};
</script>

<style scoped>
.ace-editor-container {
  width: 100%;
  height: 500px;
  min-height: 500px;
}
</style>