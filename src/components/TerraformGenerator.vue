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
import { generateGcpAlertPolicyNode, isComplexPromQL } from '../utils/transformers';
import { emitTerraform } from '../utils/terraform/emitter';

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

       /** @type {import('../utils/terraform/ast').TerraformFile} */
       const tfFile = {
          type: 'File',
          blocks: []
       };

       // Provider
       if (gcp && gcp.projectId) {
          tfFile.blocks.push({
             type: 'Provider',
             name: 'google',
             body: [
                {
                   type: 'Argument',
                   identifier: 'project',
                   expression: { type: 'Literal', value: gcp.projectId }
                }
             ]
          });
       }

       // Metric Descriptors
       if (sla.metrics) {
          Object.entries(sla.metrics).forEach(([metricId, metricDef]) => {
             if (metricDef.monitoringId && metricDef.resourceType) {
                if (metricDef.monitoringId.includes('custom.googleapis.com') || metricDef.monitoringId.includes('custom_googleapis_com')) {
                   const resourceName = `metric_${metricId.replace(/[^a-zA-Z0-9_]/g, '_')}`;
                   const body = [
                      {
                         type: 'Argument',
                         identifier: 'description',
                         expression: { type: 'Literal', value: metricDef.description || metricId }
                      },
                      {
                         type: 'Argument',
                         identifier: 'display_name',
                         expression: { type: 'Literal', value: metricId }
                      },
                      {
                         type: 'Argument',
                         identifier: 'type',
                         expression: { type: 'Literal', value: metricDef.monitoringId }
                      },
                      {
                         type: 'Argument',
                         identifier: 'metric_kind',
                         expression: { type: 'Literal', value: metricDef.metricKind || 'GAUGE' }
                      },
                      {
                         type: 'Argument',
                         identifier: 'value_type',
                         expression: { type: 'Literal', value: getValueType(metricDef.type) }
                      }
                   ];
                   if (metricDef.unit) {
                      body.push({
                         type: 'Argument',
                         identifier: 'unit',
                         expression: { type: 'Literal', value: metricDef.unit }
                      });
                   }
                   tfFile.blocks.push({
                      type: 'Resource',
                      resourceType: 'google_monitoring_metric_descriptor',
                      name: resourceName,
                      body
                   });
                }
             }
          });
       }

       // Notification Channels from Support Policy Contact Points
       const channelIds = new Set();
       const channelsResources = [];

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
                            const key = `${type}:${JSON.stringify(labels)}`;
                            if (!channelIds.has(key)) {
                               channelIds.add(key);
                               const resourceName = `channel_${channelIds.size}`;
                               
                               const body = [
                                  {
                                     type: 'Argument',
                                     identifier: 'display_name',
                                     expression: { type: 'Literal', value: displayName }
                                  },
                                  {
                                     type: 'Argument',
                                     identifier: 'type',
                                     expression: { type: 'Literal', value: type }
                                  },
                                  {
                                     type: 'Argument',
                                     identifier: 'labels',
                                     expression: {
                                        type: 'Map',
                                        entries: Object.entries(labels).map(([k, v]) => ({
                                           type: 'Argument',
                                           identifier: k,
                                           expression: { type: 'Literal', value: v }
                                        }))
                                     }
                                  }
                               ];

                               tfFile.blocks.push({
                                  type: 'Resource',
                                  resourceType: 'google_monitoring_notification_channel',
                                  name: resourceName,
                                  body
                               });
                               channelsResources.push({ resourceName });
                            }
                         }
                      });
                   }
                });
             }
          });
       }

       // Collect all guarantees to generate alert policies
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

          const channels = channelsResources.map(c => c.resourceName);

          const alertNode = generateGcpAlertPolicyNode({
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

          tfFile.blocks.push(alertNode);
       });

       generatedCode.value = emitTerraform(tfFile);
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