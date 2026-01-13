<template>
  <div class="terraform-generator h-100 d-flex flex-column">
    <div class="d-flex justify-content-between align-items-center mb-3 p-3 bg-light border-bottom">
       <h4 class="mb-0">GCP Terraform Generator</h4>
       <div class="d-flex gap-2">
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

       // Notification Channels
       const channelIds = {};
       if (gcp && gcp.channels) {
          gcp.channels.forEach((channel, index) => {
             const resourceName = `channel_${index}`;
             channelIds[index] = `google_monitoring_notification_channel.${resourceName}.name`;
             
             tf += `resource "google_monitoring_notification_channel" "${resourceName}" {\n`;
             tf += `  display_name = "${channel.displayName || 'Channel ' + index}"\n`;
             tf += `  type         = "${channel.type}"\n`;
             tf += `  labels = {\n`;
             if (channel.labels) {
                Object.entries(channel.labels).forEach(([k, v]) => {
                   tf += `    "${k}" = "${v}"\n`;
                });
             }
             tf += `  }\n`;
             tf += `}\n\n`;
          });
       }

       // Alert Policies from Plans -> Guarantees
       if (sla.plans) {
          Object.entries(sla.plans).forEach(([planName, plan]) => {
             if (plan.guarantees) {
                plan.guarantees.forEach((guarantee, gIndex) => {
                   const metricName = guarantee.metric;
                   const metricDef = sla.metrics[metricName];
                   
                   if (!metricDef) {
                      localErrors.value.push(`Metric definition not found for '${metricName}' in plan '${planName}'.`);
                      return;
                   }

                   const gcpMetric = metricDef['x-gcp-metric'];
                   if (!gcpMetric) {
                      localErrors.value.push(`No GCP metric mapping for '${metricName}'. Skipping alert generation.`);
                      return;
                   }

                   // Build Alert Policy
                   const policyName = `alert_${planName}_${metricName}_${gIndex}`.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
                   
                   tf += `resource "google_monitoring_alert_policy" "${policyName}" {\n`;
                   tf += `  display_name = "SLA Breach: ${planName} - ${metricName}"\n`;
                   tf += `  combiner     = "OR"\n`;
                   tf += `  conditions {
`;
                   tf += `    display_name = "${metricName} breach"\n`;
                   tf += `    condition_threshold {
`;
                   tf += `      filter     = "resource.type = \"${gcpMetric.resourceType}\" AND metric.type = \"${gcpMetric.metricType}\""
`;
                   tf += `      duration   = "${guarantee.period ? parseDurationToSeconds(guarantee.period) + 's' : '60s'}"\n`;
                   tf += `      comparison = "${getComparison(guarantee.operator)}"\n`;
                   
                   // Assuming value is numeric for now. 
                   // TODO: Handle parsing of value based on unit (e.g. 200ms -> 200)
                   let thresholdValue = parseFloat(guarantee.value); 
                   if (isNaN(thresholdValue)) thresholdValue = 0; // Fallback

                   tf += `      threshold_value = ${thresholdValue}\n`;
                   
                   tf += `      aggregations {
`;
                   tf += `        alignment_period   = "60s"\n`;
                   tf += `        per_series_aligner = "ALIGN_MEAN"\n`; // Default
                   tf += `      }\n`;
                   tf += `    }\n`;
                   tf += `  }\n`;
                   
                   if (Object.keys(channelIds).length > 0) {
                      tf += `  notification_channels = [\n`;
                      Object.values(channelIds).forEach(id => {
                         tf += `    ${id},\n`;
                      });
                      tf += `  ]\n`;
                   }

                   tf += `}\n\n`;
                });
             }
          });
       }

       generatedCode.value = tf;
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
