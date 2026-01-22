<template>
  <div class="terraform-generator h-100 d-flex flex-column">
    <div class="d-flex justify-content-between align-items-center mb-3 p-3 bg-light border-bottom">
       <h4 class="mb-0">GCP Terraform Generator</h4>
       <div class="d-flex gap-2">
          <button class="btn btn-outline-secondary" @click="$emit('close')">Back to Editor</button>
          <button class="btn btn-primary" @click="generate" :disabled="hasBlockingErrors">Generate</button>
          <button class="btn btn-outline-secondary" @click="download" :disabled="!generatedCode">Download .tf</button>
       </div>
    </div>

    <div class="p-3 bg-white border-bottom">
       <h5>GCP Configuration</h5>
       <GcpMonitoringEditor v-model="gcpConfig" />
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
import { ref, onMounted, watch, computed } from 'vue';
import ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-terraform';
import 'ace-builds/src-noconflict/theme-monokai';
import GcpMonitoringEditor from './GcpMonitoringEditor.vue';
import { extractStructuredGuarantee, getTopLevelFunction, resolveMetricAliases } from '../utils/formatters';
import { generateGcpAlertPolicy, isComplexPromQL } from '../utils/transformers';

export default {
  name: 'TerraformGenerator',
  components: {
    GcpMonitoringEditor
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
    const editorContainer = ref(null);
    const gcpConfig = ref({ projectId: '' });
    let editor = null;

    const hasBlockingErrors = computed(() => {
       return !gcpConfig.value.projectId;
    });

    onMounted(() => {
       editor = ace.edit(editorContainer.value);
       editor.setTheme('ace/theme/monokai');
       editor.session.setMode('ace/mode/terraform');
       editor.setReadOnly(true);
    });

    watch(generatedCode, (newCode) => {
       if (editor) {
          editor.setValue(newCode, -1);
       }
    });

    const generate = () => {
       localErrors.value = [];
       const sla = props.sla;
       const gcp = gcpConfig.value;

       if (!gcp || !gcp.projectId) {
          localErrors.value.push("GCP Project ID is not configured.");
          return;
       }

       let tf = '';

       // Provider
       if (gcp && gcp.projectId) {
          tf += `provider "google" {
  project = "${gcp.projectId}"
}

`;
       }

       // Metric Descriptors
       if (sla.metrics) {
          Object.entries(sla.metrics).forEach(([metricId, metricDef]) => {
             if (metricDef.monitoringId && metricDef.resourceType) {
                // Only generate if it's a custom metric (optional heuristic, but let's generate for all configured)
                // Actually GCP monitoringId might be a standard one. 
                // If it starts with custom.googleapis.com (or its PromQL-friendly version), it definitely needs a descriptor if we want to manage it.
                if (metricDef.monitoringId.includes('custom.googleapis.com') || metricDef.monitoringId.includes('custom_googleapis_com')) {
                   const resourceName = `metric_${metricId.replace(/[^a-zA-Z0-9_]/g, '_')}`;
                   tf += `resource "google_monitoring_metric_descriptor" "${resourceName}" {
`;
                   tf += `  description = "${metricDef.description || metricId}"
`;
                   tf += `  display_name = "${metricId}"
`;
                   tf += `  type = "${metricDef.monitoringId}"
`;
                   tf += `  metric_kind = "${metricDef.metricKind || 'GAUGE'}"
`;
                   tf += `  value_type = "${getValueType(metricDef.type)}"
`;
                   if (metricDef.unit) {
                      tf += `  unit = "${metricDef.unit}"
`;
                   }
                   tf += `}

`;
                }
             }
          });
       }

       // Notification Channels from Support Policy Contact Points
       const channelIds = new Set();
       const channelsTf = [];

       if (sla.plans) {
          Object.values(sla.plans).forEach(plan => {
             const support = plan['supportPolicy'];
             if (support && support.contactPoints) {
                support.contactPoints.forEach(cp => {
                   if (cp.channels) {
                      cp.channels.forEach(ch => {
                         let type = '';
                         let labels = {};
                         let displayName = cp.contactType || ch.description || 'SLA Contact';

                         if (ch.type === 'email' && ch.url && ch.url.startsWith('mailto:')) {
                            type = 'email';
                            labels['email_address'] = ch.url.replace(/^mailto:(\/\/)?/, '');
                            if (!cp.contactType) displayName = labels['email_address'];
                         } else if ((ch.type === 'phone' || ch.type === 'sms') && ch.url && ch.url.startsWith('tel:')) {
                             type = 'sms';
                             labels['number'] = ch.url.replace(/^tel:(\/\/)?/, '');
                             if (!cp.contactType) displayName = labels['number'];
                         }
                         
                         if (type) {
                            // Deduplicate based on type+labels
                            const key = `${type}:${JSON.stringify(labels)}`;
                            if (!channelIds.has(key)) {
                               channelIds.add(key);
                               const resourceName = `channel_${channelIds.size}`;
                               
                               let chunk = `resource "google_monitoring_notification_channel" "${resourceName}" {
`;
                               chunk += `  display_name = "${displayName}"
`;
                               chunk += `  type         = "${type}"
`;
                               chunk += `  labels = {
`;
                               Object.entries(labels).forEach(([k, v]) => {
                                  chunk += `    "${k}" = "${v}"
`;
                               });
                               chunk += `  }
`;
                               chunk += `}

`;
                               channelsTf.push({ resourceName, chunk });
                            }
                         }
                      });
                   }
                });
             }
          });
       }

       channelsTf.forEach(c => tf += c.chunk);

       // Collect all guarantees to generate alert policies
       const allGuarantees = [];

       if (sla.plans) {
          Object.entries(sla.plans).forEach(([planName, plan]) => {
             // 1. Direct guarantees
             if (plan.guarantees) {
                plan.guarantees.forEach((g, i) => allGuarantees.push({ planName, guarantee: g, index: i, source: 'direct' }));
             }
             // 2. Plan SLOs
             if (plan.serviceLevelObjectives) {
                plan.serviceLevelObjectives.forEach((slo, sloIdx) => {
                   if (slo.guarantees) {
                      slo.guarantees.forEach((g, i) => allGuarantees.push({ planName, guarantee: g, index: `${sloIdx}_${i}`, source: `slo_${slo.name || sloIdx}` }));
                   }
                });
             }
             // 3. Support Policy SLOs
             const support = plan['supportPolicy'];
             if (support && support.serviceLevelObjectives) {
                support.serviceLevelObjectives.forEach((slo, sloIdx) => {
                   if (slo.guarantees) {
                      slo.guarantees.forEach((g, i) => allGuarantees.push({ planName, guarantee: g, index: `support_slo_${sloIdx}_${i}`, source: `support_slo_${slo.name || sloIdx}` }));
                   }
                });
             }
          });
       }

       // Generate Alert Policies
       allGuarantees.forEach(({ planName, guarantee, index, source }) => {
          const measurement = guarantee.measurement;
          let metricName, operator, value, period;
          let expression = '';
          let aligner = 'ALIGN_MEAN';
          
          const extracted = extractStructuredGuarantee(measurement);
          
          if (extracted) {
             metricName = extracted.metric;
             operator = extracted.operator;
             value = extracted.value;
             period = extracted.period;
          } else {
             return;
          }

          const metricDef = sla.metrics[metricName];
          
          if (!metricDef) {
             localErrors.value.push(`Metric definition not found for '${metricName}' in plan '${planName}'.`);
             return;
          }

          if (!metricDef.monitoringId) {
             localErrors.value.push(`No GCP metric mapping (monitoringId) for '${metricName}'. Skipping alert generation.`);
             return;
          }

          // Determine if we should use PromQL or Standard
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
             // Fallback to Standard
             expression = metricDef.monitoringId;
             
             // Try to map aligner from top level function
             const func = getTopLevelFunction(measurement);
             if (func) {
                 const map = {
                     'avg_over_time': 'ALIGN_MEAN',
                     'sum_over_time': 'ALIGN_SUM',
                     'min_over_time': 'ALIGN_MIN',
                     'max_over_time': 'ALIGN_MAX',
                     'count_over_time': 'ALIGN_COUNT',
                     'rate': 'ALIGN_RATE',
                     'delta': 'ALIGN_DELTA'
                 };
                 if (map[func]) aligner = map[func];
             }
          }

          const channels = channelsTf.map(c => c.resourceName);

          const alertTf = generateGcpAlertPolicy({
             planName,
             source,
             index,
             metricName,
             expression: expression,
             duration: period || '60s',
             operator,
             threshold: parseFloat(value) || 0,
             channels: channels.length > 0 ? channels : undefined,
             project: gcp.projectId,
             resourceType: metricDef.resourceType,
             metricType: metricDef.monitoringId,
             aligner
          });

          tf += alertTf;
       });

       generatedCode.value = tf;
    };

    const getValueType = (type) => {
       switch (type) {
          case 'integer': return 'INT64';
          case 'number': return 'DOUBLE';
          case 'boolean': return 'BOOL';
          case 'string': return 'STRING';
          default: return 'DOUBLE';
       }
    };

    const download = () => {
       const blob = new Blob([generatedCode.value], { type: 'text/plain' });
       const url = window.URL.createObjectURL(blob);
       const a = document.createElement('a');
       a.href = url;
       a.download = 'main.tf';
       a.click();
       window.URL.revokeObjectURL(url);
    };

    return {
       editorContainer,
       generate,
       download,
       generatedCode,
       localErrors,
       hasBlockingErrors,
       gcpConfig
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