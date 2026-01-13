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

    <div v-if="localErrors.length > 0" class="alert alert-warning m-3">
       <strong>Missing Information:</strong>
       <ul class="mb-0">
          <li v-for="(err, i) in localErrors" :key="i">{{ err }}</li>
       </ul>
    </div>

    <div class="flex-grow-1 position-relative m-3 border">
       <div ref="editorContainer" class="ace-editor-container"></div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import ace from 'ace-builds';
// Using javascript mode as a fallback if bicep is not available in ace-builds
// but usually we can use 'text' or try to find a bicep mode.
import 'ace-builds/src-noconflict/mode-javascript'; 
import 'ace-builds/src-noconflict/theme-monokai';

export default {
  name: 'AzureBicepGenerator',
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
    const editorContainer = ref(null);
    let editor = null;

    const hasBlockingErrors = ref(false);

    onMounted(() => {
       editor = ace.edit(editorContainer.value);
       editor.setTheme('ace/theme/monokai');
       editor.session.setMode('ace/mode/javascript'); // Bicep looks somewhat like JS/CSS
       editor.setReadOnly(true);
    });

    watch(generatedCode, (newCode) => {
       if (editor) {
          editor.setValue(newCode, -1);
       }
    });

    const generate = () => {
       localErrors.value = [];
       hasBlockingErrors.value = false;
       const sla = props.sla;
       const azure = sla['x-azure-monitoring'];

       if (!azure || !azure.resourceId) {
          localErrors.value.push("Azure Resource ID is not configured.");
          hasBlockingErrors.value = true;
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
                               chunk += `  name: '${name.replace(/[^a-zA-Z0-9-]/g, '-')}'
`;
                               chunk += `  location: 'Global'
`;
                               chunk += `  properties: {
`;
                               chunk += `    groupShortName: '${name.substring(0, 12).replace(/[^a-zA-Z0-9]/g, '')}'
`;
                               chunk += `    enabled: true
`;
                               if (type === 'email') {
                                  chunk += `    emailReceivers: [\n`;
                                  chunk += `      {
`;
                                  chunk += `        name: '${name}'
`;
                                  chunk += `        emailAddress: '${emailAddress}'
`;
                                  chunk += `        useCommonAlertSchema: true
`;
                                  chunk += `      }
`;
                                  chunk += `    ]
`;
                               } else if (type === 'sms') {
                                  chunk += `    smsReceivers: [\n`;
                                  chunk += `      {
`;
                                  chunk += `        name: '${name}'
`;
                                  chunk += `        countryCode: '1'
`;
                                  chunk += `        phoneNumber: '${phoneNumber}'
`;
                                  chunk += `      }
`;
                                  chunk += `    ]
`;
                               }
                               chunk += `  }
`;
                               chunk += `}

`;
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
          bicep += `  name: 'SLA Breach: ${planName} - ${source} - ${metricName}'
`;
          bicep += `  location: 'global'
`;
          bicep += `  properties: {
`;
          bicep += `    description: 'Alert for SLA breach of ${metricName} in plan ${planName}'
`;
          bicep += `    severity: 2
`;
          bicep += `    enabled: true
`;
          bicep += `    scopes: [
`;
          bicep += `      '${resourceId}'
`;
          bicep += `    ]
`;
          bicep += `    evaluationFrequency: '${period}'
`;
          bicep += `    windowSize: '${period}'
`;
          bicep += `    criteria: {
`;
          bicep += `      'odata.type': 'Microsoft.Azure.Monitor.SingleResourceMultipleMetricCriteria'
`;
          bicep += `      allOf: [
`;
          bicep += `        {
`;
          bicep += `          name: 'Metric1'
`;
          bicep += `          metricName: '${metricDef.monitoringId}'
`;
          bicep += `          operator: '${getAzureOperator(guarantee.operator)}'
`;
          bicep += `          threshold: ${parseFloat(guarantee.value) || 0}
`;
          bicep += `          timeAggregation: 'Average'
`;
          bicep += `          criterionType: 'StaticThresholdCriterion'
`;
          bicep += `        }
`;
          bicep += `      ]
`;
          bicep += `    }
`;
          if (actionGroups.length > 0) {
             bicep += `    actions: [\n`;
             actionGroups.forEach(ag => {
                bicep += `      {
`;
                bicep += `        actionGroupId: ${ag.resourceName}.id
`;
                bicep += `      }
`;
             });
             bicep += `    ]
`;
          }
          bicep += `  }
`;
          bicep += `}

`;
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
       hasBlockingErrors
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
