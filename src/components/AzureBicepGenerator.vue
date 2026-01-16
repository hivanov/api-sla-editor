<template>
  <div class="azure-bicep-generator h-100 d-flex flex-column">
    <div class="d-flex justify-content-between align-items-center mb-3 p-3 bg-light border-bottom">
       <h4 class="mb-0">Azure Bicep Generator</h4>
       <div class="d-flex gap-2">
          <button class="btn btn-outline-secondary" @click="$emit('close')">Back to Editor</button>
          <button class="btn btn-primary" @click="generate" :disabled="hasBlockingErrors">Generate</button>
          <button class="btn btn-outline-secondary" @click="download" :disabled="!generatedCode">Download .bicep</button>
       </div>
    </div>

    <div class="p-3 bg-white border-bottom">
       <h5>Azure Configuration</h5>
       <AzureMonitoringEditor v-model="azureConfig" />
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
// Using toml mode as it matches Bicep's property assignment better than javascript
import 'ace-builds/src-noconflict/mode-toml'; 
import 'ace-builds/src-noconflict/theme-monokai';
import AzureMonitoringEditor from './AzureMonitoringEditor.vue';

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
    const azureConfig = ref({ resourceId: '', location: '' });
    let editor = null;

    const hasBlockingErrors = computed(() => {
       return !azureConfig.value.resourceId || !azureConfig.value.location;
    });

    const hasValidationErrors = computed(() => {
       return validationResults.value.some(r => r.type === 'error');
    });

    onMounted(() => {
       editor = ace.edit(editorContainer.value);
       editor.setTheme('ace/theme/monokai');
       editor.session.setMode('ace/mode/toml'); 
       editor.session.setUseWorker(false); // Disable worker to avoid syntax errors on Bicep
       editor.setReadOnly(true);
    });

    watch(generatedCode, (newCode) => {
       if (editor) {
          editor.setValue(newCode, -1);
          validateBicep(newCode);
       }
    });

    const validateBicep = (code) => {
       const results = [];
       const lines = code.split('\n');
       
       // Regex-based validation mimicking official Bicep rules
       lines.forEach((line, index) => {
          const trimmed = line.trim();
          const lineNum = index + 1;

          // 1. Check for unbalanced braces
          const openBraces = (line.match(/\{/g) || []).length;
          const closeBraces = (line.match(/\}/g) || []).length;
          if (openBraces !== closeBraces && !trimmed.endsWith('{') && !trimmed.startsWith('}')) {
             // This is a naive check, but useful for inline blocks
          }

          // 2. Check for missing quotes in property assignments
          // Pattern: name: value (where value is not quoted and not a number/bool/ref)
          const propMatch = line.match(/^\s*([a-zA-Z0-9]+)\s*:\s*([^'\[\{0-9tfn\s][^,]*)$/);
          if (propMatch) {
             const val = propMatch[2].trim();
             if (!['true', 'false', 'null'].includes(val) && !val.includes('.') && !val.includes('(')) {
                results.push({
                   line: lineNum,
                   message: `Property '${propMatch[1]}' value should likely be quoted or is an invalid reference.`,
                   type: 'warning'
                });
             }
          }

          // 3. Check for invalid resource declarations
          if (trimmed.startsWith('resource ') && !trimmed.includes('\'')) {
             results.push({
                line: lineNum,
                message: "Resource declaration missing type string (e.g. resource res 'type@ver' = { ... })",
                type: 'error'
             });
          }

          // 4. Check for unclosed strings
          const quotes = (line.match(/'/g) || []).length;
          if (quotes % 2 !== 0) {
             results.push({
                line: lineNum,
                message: "Unterminated string literal.",
                type: 'error'
             });
          }
       });

       // Global balance check
       const totalOpen = (code.match(/\{/g) || []).length;
       const totalClose = (code.match(/\}/g) || []).length;
       if (totalOpen > totalClose) {
          results.push({ line: lines.length, message: "Missing closing brace '}'.", type: 'error' });
       } else if (totalClose > totalOpen) {
          results.push({ line: 1, message: "Unexpected closing brace '}'.", type: 'error' });
       }

       validationResults.value = results;
       
       if (editor) {
          const annotations = results.map(r => ({
             row: r.line - 1,
             column: 0,
             text: r.message,
             type: r.type
          }));
          editor.session.setAnnotations(annotations);
       }
    };

    const generate = () => {
       localErrors.value = [];
       const sla = props.sla;
       const azure = azureConfig.value;

       if (!azure || !azure.resourceId) {
          localErrors.value.push("Azure Resource ID is not configured.");
          return;
       }

       let bicep = '// Azure Bicep Monitoring Template generated from SLA\n\n';

       const location = (azure && azure.location) || 'eastus';
       const resourceId = azure && azure.resourceId;

       // Action Groups from Support Policy Contact Points
       const actionGroups = [];
       const actionGroupNames = new Set();

       if (sla.plans) {
          Object.values(sla.plans).forEach(plan => {
             const support = plan['x-support-policy'];
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
                               let chunk = `resource ${groupKey} 'Microsoft.Insights/actionGroups@2023-01-01' = {\n`;
                               chunk += `  name: '${name.replace(/[^a-zA-Z0-9-]/g, '-')}'\n`;
                               chunk += `  location: 'Global'\n`;
                               chunk += `  properties: {\n`;
                               chunk += `    groupShortName: '${name.substring(0, 12).replace(/[^a-zA-Z0-9]/g, '')}'\n`;
                               chunk += `    enabled: true\n`;
                               if (type === 'email') {
                                  chunk += `    emailReceivers: [\n`;
                                  chunk += `      {\n`;
                                  chunk += `        name: '${name}'\n`;
                                  chunk += `        emailAddress: '${emailAddress}'\n`;
                                  chunk += `        useCommonAlertSchema: true\n`;
                                  chunk += `      }\n`;
                                  chunk += `    ]\n`;
                               } else if (type === 'sms') {
                                  chunk += `    smsReceivers: [\n`;
                                  chunk += `      {\n`;
                                  chunk += `        name: '${name}'\n`;
                                  chunk += `        countryCode: '1'\n`;
                                  chunk += `        phoneNumber: '${phoneNumber}'\n`;
                                  chunk += `      }\n`;
                                  chunk += `    ]\n`;
                               }
                               chunk += `  }\n`;
                               chunk += `}\n\n`;
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

       // Generate Metric Alerts
       allGuarantees.forEach(({ planName, guarantee, index, source }) => {
          const metricName = guarantee.metric;
          const metricDef = (sla.metrics && sla.metrics[metricName]) || {};
          
          if (!metricDef.monitoringId) {
             localErrors.value.push(`No Azure metric mapping (monitoringId) for '${metricName}'. Skipping alert.`);
             return;
          }

          const alertResourceName = `alert_${planName}_${source}_${index}`.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
          const period = guarantee.period || guarantee.duration || 'PT5M';

          bicep += `resource ${alertResourceName} 'Microsoft.Insights/metricalerts@2018-03-01' = {\n`;
          bicep += `  name: 'SLA Breach: ${planName} - ${source} - ${metricName}'\n`;
          bicep += `  location: 'global'\n`;
          bicep += `  properties: {\n`;
          bicep += `    description: 'Alert for SLA breach of ${metricName} in plan ${planName}'\n`;
          bicep += `    severity: 2\n`;
          bicep += `    enabled: true\n`;
          bicep += `    scopes: [\n`;
          bicep += `      '${resourceId}'\n`;
          bicep += `    ]\n`;
          bicep += `    evaluationFrequency: '${period}'\n`;
          bicep += `    windowSize: '${period}'\n`;
          bicep += `    criteria: {\n`;
          bicep += `      'odata.type': 'Microsoft.Azure.Monitor.SingleResourceMultipleMetricCriteria'\n`;
          bicep += `      allOf: [\n`;
          bicep += `        {\n`;
          bicep += `          name: 'Metric1'\n`;
          bicep += `          metricName: '${metricDef.monitoringId}'\n`;
          bicep += `          operator: '${getAzureOperator(guarantee.operator)}'\n`;
          bicep += `          threshold: ${parseFloat(guarantee.value) || 0}\n`;
          bicep += `          timeAggregation: 'Average'\n`;
          bicep += `          criterionType: 'StaticThresholdCriterion'\n`;
          bicep += `        }\n`;
          bicep += `      ]\n`;
          bicep += `    }\n`;
          if (actionGroups.length > 0) {
             bicep += `    actions: [\n`;
             actionGroups.forEach(ag => {
                bicep += `      {\n`;
                bicep += `        actionGroupId: ${ag.resourceName}.id\n`;
                bicep += `      }\n`;
             });
             bicep += `    ]\n`;
          }
          bicep += `  }\n`;
          bicep += `}\n\n`;
       });

       generatedCode.value = bicep;
    };

    const getAzureOperator = (operator) => {
       // Violation operator
       switch (operator) {
          case '<': return 'GreaterThanOrEqual';
          case '<=': return 'GreaterThan';
          case '>': return 'LessThanOrEqual';
          case '>=': return 'LessThan';
          case '=': return 'NotEqual';
          default: return 'GreaterThan';
       }
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
       azureConfig
    };
  }
};
</script>

<style scoped>
.ace-editor-container {
  width: 100%;
  height: 100%;
}
</style>
