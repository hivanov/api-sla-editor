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
import 'ace-builds/src-noconflict/mode-terraform';
import 'ace-builds/src-noconflict/theme-monokai';

export default {
  name: 'TerraformGenerator',
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
       editor.session.setMode('ace/mode/terraform');
       editor.setReadOnly(true);
    });

    watch(generatedCode, (newCode) => {
       if (editor) {
          editor.setValue(newCode, -1);
       }
    });

    const parseDurationToSeconds = (duration) => {
        // Simple regex for P1D, PT1H, PT1M, PT1S
        // This is a naive implementation
        if (!duration) return 0;
        const match = duration.match(/P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        if (!match) return 0;
        const days = parseInt(match[1] || 0);
        const hours = parseInt(match[2] || 0);
        const minutes = parseInt(match[3] || 0);
        const seconds = parseInt(match[4] || 0);
        return (days * 86400) + (hours * 3600) + (minutes * 60) + seconds;
    };

    const generate = () => {
       localErrors.value = [];
       hasBlockingErrors.value = false;
       const sla = props.sla;
       const gcp = sla['x-gcp-monitoring'];

       if (!gcp || !gcp.projectId) {
          localErrors.value.push("GCP Project ID is not configured.");
          hasBlockingErrors.value = true;
       }

       let tf = '';

       // Provider
       if (gcp && gcp.projectId) {
          tf += `provider "google" {\n  project = "${gcp.projectId}"\n}\n\n`;
       }

       // Metric Descriptors
       if (sla.metrics) {
          Object.entries(sla.metrics).forEach(([metricId, metricDef]) => {
             if (metricDef.monitoringId && metricDef.resourceType) {
                // Only generate if it's a custom metric (optional heuristic, but let's generate for all configured)
                // Actually GCP monitoringId might be a standard one. 
                // If it starts with custom.googleapis.com, it definitely needs a descriptor if we want to manage it.
                if (metricDef.monitoringId.includes('custom.googleapis.com')) {
                   const resourceName = `metric_${metricId.replace(/[^a-zA-Z0-9_]/g, '_')}`;
                   tf += `resource "google_monitoring_metric_descriptor" "${resourceName}" {\n`;
                   tf += `  description = "${metricDef.description || metricId}"\n`;
                   tf += `  display_name = "${metricId}"\n`;
                   tf += `  type = "${metricDef.monitoringId}"\n`;
                   tf += `  metric_kind = "${metricDef.metricKind || 'GAUGE'}"\n`;
                   tf += `  value_type = "${getValueType(metricDef.type)}"\n`;
                   if (metricDef.unit) {
                      tf += `  unit = "${metricDef.unit}"\n`;
                   }
                   tf += `}\n\n`;
                }
             }
          });
       }

       // Notification Channels from Support Policy Contact Points
       const channelIds = new Set();
       const channelsTf = [];

       if (sla.plans) {
          Object.values(sla.plans).forEach(plan => {
             const support = plan['x-support-policy'];
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
                               
                               let chunk = `resource "google_monitoring_notification_channel" "${resourceName}" {\n`;
                               chunk += `  display_name = "${displayName}"\n`;
                               chunk += `  type         = "${type}"\n`;
                               chunk += `  labels = {\n`;
                               Object.entries(labels).forEach(([k, v]) => {
                                  chunk += `    "${k}" = "${v}"\n`;
                               });
                               chunk += `  }\n`;
                               chunk += `}\n\n`;
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
             const support = plan['x-support-policy'];
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
          const metricName = guarantee.metric;
          const metricDef = sla.metrics[metricName];
          
          if (!metricDef) {
             localErrors.value.push(`Metric definition not found for '${metricName}' in plan '${planName}'.`);
             return;
          }

          if (!metricDef.monitoringId || !metricDef.resourceType) {
             localErrors.value.push(`No GCP metric mapping (monitoringId, resourceType) for '${metricName}'. Skipping alert generation.`);
             return;
          }

          const policyName = `alert_${planName}_${source}_${index}`.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
          
          tf += `resource "google_monitoring_alert_policy" "${policyName}" {\n`;
          tf += `  display_name = "SLA Breach: ${planName} - ${source} - ${metricName}"\n`;
          tf += `  combiner     = "OR"\n`;
          tf += `  conditions {\n`;
          tf += `    display_name = "${metricName} breach"\n`;
          tf += `    condition_threshold {\n`;
          tf += `      filter     = "resource.type = \\\"${metricDef.resourceType}\\\" AND metric.type = \\\"${metricDef.monitoringId}\\\""\n`;
          tf += `      duration   = "${guarantee.period ? parseDurationToSeconds(guarantee.period) + 's' : (guarantee.duration ? parseDurationToSeconds(guarantee.duration) + 's' : '60s')}"\n`;
          tf += `      comparison = "${getComparison(guarantee.operator)}"\n`;
          
          let thresholdValue = parseFloat(guarantee.value); 
          if (isNaN(thresholdValue)) thresholdValue = 0;

          tf += `      threshold_value = ${thresholdValue}\n`;
          
          tf += `      aggregations {\n`;
          tf += `        alignment_period   = "60s"\n`;
          tf += `        per_series_aligner = "ALIGN_MEAN"\n`;
          tf += `      }\n`;
          tf += `    }\n`;
          tf += `  }\n`;
          
          if (channelsTf.length > 0) {
             tf += `  notification_channels = [\n`;
             channelsTf.forEach(c => {
                tf += `    google_monitoring_notification_channel.${c.resourceName}.name,\n`;
             });
             tf += `  ]\n`;
          }

          tf += `}\n\n`;
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

    const getComparison = (operator) => {
       // SLA defines guarantee. Operator is what we WANT.
       // Alert is when it is VIOLATED.
       // So we need to invert or map carefully.
       // If guarantee: response_time < 200ms. Violation: response_time > 200ms.
       // Terraform comparison is for the VIOLATION. 
       
       switch (operator) {
          case '<': return 'COMPARISON_GT';
          case '<=': return 'COMPARISON_GT'; // Strictly should be GT, but threshold handling might be fuzzy
          case '>': return 'COMPARISON_LT';
          case '>=': return 'COMPARISON_LT';
          default: return 'COMPARISON_GT';
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
