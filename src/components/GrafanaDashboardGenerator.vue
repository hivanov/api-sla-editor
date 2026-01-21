<template>
  <div class="grafana-generator h-100 d-flex flex-column">
    <div class="d-flex justify-content-between align-items-center mb-3 p-3 bg-light border-bottom">
       <h4 class="mb-0">Grafana Dashboard Generator</h4>
       <div class="d-flex gap-2">
          <button class="btn btn-outline-secondary" @click="$emit('close')">Back to Editor</button>
          <button class="btn btn-primary" @click="generate" :disabled="!datasourceName">Generate</button>
          <button class="btn btn-outline-secondary" @click="download" :disabled="!generatedCode">Download</button>
       </div>
    </div>

    <div class="p-3 bg-white border-bottom">
       <h5>Configuration</h5>
       <div class="row g-3">
         <div class="col-md-6">
           <label class="form-label">Datasource Name (UID)</label>
           <input type="text" class="form-control" v-model="datasourceName" placeholder="e.g. Prometheus">
           <div class="form-text">The UID of your Prometheus datasource in Grafana.</div>
         </div>
         <div class="col-md-6">
           <label class="form-label">Dashboard Title</label>
           <input type="text" class="form-control" v-model="dashboardTitle" placeholder="SLA Dashboard">
         </div>
       </div>
    </div>

    <div class="card-header bg-white border-bottom-0 pb-0 pt-3">
      <ul class="nav nav-tabs card-header-tabs">
        <li class="nav-item">
          <a href="#" class="nav-link" :class="{ active: activeTab === 'dashboard' }" @click.prevent="activeTab = 'dashboard'">Dashboard JSON</a>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link" :class="{ active: activeTab === 'alerts' }" @click.prevent="activeTab = 'alerts'">Alert Rules & Contact Points (YAML)</a>
        </li>
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
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/theme-monokai';
import jsYaml from 'js-yaml';
import { toPromQL, ensurePromQLBoolean, extractStructuredGuarantee } from '../utils/formatters';

export default {
  name: 'GrafanaDashboardGenerator',
  props: {
    sla: {
      type: Object,
      required: true
    }
  },
  emits: ['close'],
  setup(props) {
    const datasourceName = ref('Prometheus');
    const dashboardTitle = ref('SLA Dashboard');
    const activeTab = ref('dashboard');
    const dashboardJson = ref('');
    const alertsYaml = ref('');
    const editorContainer = ref(null);
    let editor = null;

    const generatedCode = computed(() => {
      return activeTab.value === 'dashboard' ? dashboardJson.value : alertsYaml.value;
    });

    onMounted(() => {
       editor = ace.edit(editorContainer.value);
       editor.setTheme('ace/theme/monokai');
       updateEditorMode();
       editor.setReadOnly(true);
       generate(); // Auto-generate on load if possible
    });

    const updateEditorMode = () => {
      if (editor) {
        editor.session.setMode(activeTab.value === 'dashboard' ? 'ace/mode/json' : 'ace/mode/yaml');
        editor.setValue(generatedCode.value, -1);
      }
    };

    watch(activeTab, () => {
      updateEditorMode();
    });

    watch([datasourceName, dashboardTitle], () => {
      // clear previous generation if config changes? Or just re-generate?
      // Re-generating might be annoying if user is typing. Let's wait for button click or just keep old value.
    });

    watch(generatedCode, (newCode) => {
       if (editor) {
          editor.setValue(newCode, -1);
       }
    });

    const generate = () => {
       const sla = props.sla;
       if (!sla) return;

       // 1. Generate Dashboard JSON
       const panels = [];
       let yPos = 0;
       
       // Plan Availability Panels (Top Priority)
       if (sla.plans) {
           Object.entries(sla.plans).forEach(([planName, plan], index) => {
               if (plan.availability && typeof plan.availability === 'object' && plan.availability.metric) {
                   const metricName = plan.availability.metric;
                   const targetStr = plan.availability.target;
                   const metric = sla.metrics[metricName];
                   
                   if (metric && metric.monitoringId) {
                       const targetVal = parseFloat(targetStr); // e.g. 99.9
                       const condition = plan.availability.expression || metric.monitoringId;
                       
                       // For Availability logic: "evaluates to true X% of the time"
                       // We must ensure the condition returns 0 or 1 (bool) and use subquery for range
                       const boolCondition = ensurePromQLBoolean(condition);
                       const availabilityExpr = `avg_over_time((${boolCondition})[1h:]) * 100`;
                       
                       panels.push({
                           id: 1000 + index, // Distinct ID range
                           gridPos: { h: 4, w: 24, x: 0, y: yPos },
                           type: 'stat',
                           title: `${planName} Service Availability Status (${metric.description || metricName})`,
                           datasource: { uid: datasourceName.value },
                           targets: [{
                               expr: availabilityExpr,
                               refId: 'A'
                           }],
                           fieldConfig: {
                               defaults: {
                                   thresholds: {
                                       mode: 'absolute',
                                       steps: [
                                           { value: null, color: "red" },
                                           { value: targetVal, color: "green" }
                                       ]
                                   },
                                   unit: 'percent',
                                   min: 0,
                                   max: 100
                               }
                           }
                       });
                       yPos += 4;
                   }
               }
           });
       }

       // Row 1: Status Headers (Stat Panels) 
       
       let xPos = 0;
       
       const guarantees = [];
       if (sla.plans) {
         Object.values(sla.plans).forEach(plan => {
           if (plan.guarantees) {
             plan.guarantees.forEach(g => guarantees.push({ ...g, planName: plan.name || 'Plan' }));
           }
         });
       }

       // Status Panels
       guarantees.forEach((g, i) => {
         const extracted = extractStructuredGuarantee(g.measurement);
         if (!extracted) return;
         
         const { metric: metricName, operator, value } = extracted;
         const metric = sla.metrics[metricName];
         if (!metric || !metric.monitoringId) return;

         panels.push({
           id: i + 1,
           gridPos: { h: 6, w: 4, x: xPos % 24, y: yPos },
           type: 'stat',
           title: `${metric.description || metricName} Status`,
           datasource: { uid: datasourceName.value },
           targets: [{
             expr: toPromQL(metric.monitoringId),
             refId: 'A'
           }],
           fieldConfig: {
             defaults: {
               thresholds: {
                 mode: 'absolute',
                 steps: generateThresholds(operator, value)
               },
               unit: metric.unit === 'percent' ? 'percent' : (metric.unit === 'ms' ? 'ms' : 'none')
             }
           }
         });

         xPos += 4;
         if (xPos >= 24) {
           xPos = 0;
           yPos += 6;
         }
       });

       yPos += 6;
       xPos = 0;

       // Time Series Panels
       guarantees.forEach((g, i) => {
         const extracted = extractStructuredGuarantee(g.measurement);
         if (!extracted) return;

         const { metric: metricName, operator, value } = extracted;
         const metric = sla.metrics[metricName];
         if (!metric || !metric.monitoringId) return;

         panels.push({
           id: i + 100,
           gridPos: { h: 8, w: 12, x: xPos % 24, y: yPos },
           type: 'timeseries',
           title: `${metric.description || metricName} Over Time`,
           datasource: { uid: datasourceName.value },
           targets: [{
             expr: toPromQL(metric.monitoringId),
             refId: 'A'
           }],
           fieldConfig: {
             defaults: {
               thresholds: {
                 mode: 'absolute',
                 steps: generateThresholds(operator, value)
               },
               custom: {
                  axisLabel: metric.unit,
               },
               unit: metric.unit === 'percent' ? 'percent' : (metric.unit === 'ms' ? 'ms' : 'none')
             }
           }
         });

         xPos += 12;
         if (xPos >= 24) {
           xPos = 0;
           yPos += 8;
         }
       });

       yPos += 8;

       // Compensation / Service Credits
       const compensationQueries = [];
       if (sla.plans) {
         Object.values(sla.plans).forEach(plan => {
           if (plan.serviceCredits) {
             const credits = plan.serviceCredits;
             
             // Text Panel explaining the policy
             let md = `### Service Credits Policy\n\n**Currency**: ${credits.currency}\n**Claim Window**: ${credits.claimWindow}\n\n| Condition | Compensation |\n|---|---|
`;
             if (credits.tiers) {
               credits.tiers.forEach(tier => {
                 const cond = tier.condition;
                 let condStr = `${cond.metric} ${cond.operator} ${cond.value}`;
                 if (cond.floor) condStr += ` (Floor: ${cond.floor})`;
                 md += `| ${condStr} | ${tier.compensation} |\n`;

                 // Generate PromQL for Compensation Liability
                 const metric = sla.metrics[cond.metric];
                 if (metric && metric.monitoringId) {
                    const mId = toPromQL(metric.monitoringId);
                    let expr = `${mId} ${convertOperator(cond.operator)} bool ${cond.value}`;
                    if (cond.floor) {
                        const floorOp = invertOperator(cond.operator); // >=
                        expr = `(${expr}) * (${mId} ${floorOp} bool ${cond.floor})`;
                    }
                    compensationQueries.push(`(${expr}) * ${tier.compensation}`);
                 }
               });
             }

             panels.push({
               id: 200,
               gridPos: { h: 6, w: 12, x: 0, y: yPos },
               type: 'text',
               title: 'Compensation Policy',
               mode: 'markdown',
               content: md
             });
           }
         });
       }

       if (compensationQueries.length > 0) {
           const totalExpr = compensationQueries.join(' + ');
           panels.push({
               id: 300,
               gridPos: { h: 6, w: 12, x: 12, y: yPos },
               type: 'stat',
               title: 'Estimated Compensation Liability',
               datasource: { uid: datasourceName.value },
               targets: [{
                   expr: totalExpr,
                   refId: 'A'
               }],
               fieldConfig: {
                   defaults: {
                       unit: 'currencyUSD', // simplified
                       color: { 
                           mode: 'continuous-GrYlRd',
                           fixedColor: 'red',
                           seriesBy: 'last'
                        },
                       min: 0
                   }
               }
           });
       }

       const dashboard = {
         title: dashboardTitle.value,
         tags: ['SLA', 'Generated'],
         timezone: 'browser',
         schemaVersion: 30,
         panels: panels
       };

       dashboardJson.value = JSON.stringify(dashboard, null, 2);


       // 2. Generate Alert Rules & Contact Points (YAML)
       const groups = [];
       const contactPoints = [];
       
       if (sla.plans) {
         Object.entries(sla.plans).forEach(([planName, plan]) => {
           // Alert Rules
           const rules = [];

           // Availability Alert
           if (plan.availability && typeof plan.availability === 'object' && plan.availability.metric) {
               const metricName = plan.availability.metric;
               const targetStr = plan.availability.target;
               const metric = sla.metrics[metricName];
               
               if (metric && metric.monitoringId) {
                   const targetVal = parseFloat(targetStr);
                   const condition = plan.availability.expression || metric.monitoringId;
                   const boolCondition = ensurePromQLBoolean(condition);
                   const expr = `avg_over_time((${boolCondition})[5m:]) * 100 < ${targetVal}`;
                   
                   rules.push({
                       alert: `SlaBreach_${planName}_Availability`,
                       expr: expr,
                       for: '5m', // Default window
                       labels: {
                           severity: 'critical',
                           plan: planName,
                           type: 'availability'
                       },
                       annotations: {
                           summary: `Availability Breach: ${planName} is below ${targetVal}%`,
                           description: `Current availability: {{ $value }}%`
                       }
                   });
               }
           }

           if (plan.guarantees) {
             plan.guarantees.forEach(g => {
                const extracted = extractStructuredGuarantee(g.measurement);
                if (!extracted) return;

                const { metric: metricName, operator, value, period } = extracted;
                const metric = sla.metrics[metricName];
                if (!metric || !metric.monitoringId) return;

                // Prometheus Rule
                const op = invertOperator(operator);
                const mId = toPromQL(metric.monitoringId);
                const expr = `${mId} ${op} ${value}`;
                
                rules.push({
                  alert: `SlaBreach_${metricName}`,
                  expr: expr,
                  for: period || '1m', 
                  labels: {
                    severity: 'page',
                    plan: planName
                  },
                  annotations: {
                    summary: `SLA Breach: ${metricName} is ${op} ${value}`,
                    description: `Current value: {{ $value }}`
                  }
                });
             });
           }
           if (rules.length > 0) {
             groups.push({
               name: `SLA-${planName}`,
               rules: rules
             });
           }

           // Contact Points
           if (plan.supportPolicy && plan.supportPolicy.contactPoints) {
              plan.supportPolicy.contactPoints.forEach(cp => {
                  if (cp.channels) {
                      const receivers = cp.channels.map(ch => {
                          if (ch.type === 'email') {
                              return {
                                  uid: `cp-${planName}-${ch.type}`,
                                  name: `${cp.contactType} (${ch.type})`,
                                  type: 'email',
                                  settings: {
                                      addresses: ch.url.replace(/^mailto:(\/\/)?/, '')
                                  }
                              };
                          }
                          // Handle other types if needed
                          return null;
                      }).filter(r => r !== null);
                      contactPoints.push(...receivers);
                  }
              });
           }
         });
       }

       const alertConfig = {
         apiVersion: 1,
         contactPoints: contactPoints,
         policies: [
             {
                 orgId: 1,
                 receiver: contactPoints.length > 0 ? contactPoints[0].name : 'default-email',
                 group_by: ['grafana_folder', 'alertname']
             }
         ],
         groups: groups
       };
       
       alertsYaml.value = jsYaml.dump(alertConfig);
    };

    const generateThresholds = (operator, value) => {
      // Logic:
      // Red: Failed (Violated)
      // Yellow: Warning (Approaching, 75%)
      // Green: OK
      
      const val = parseFloat(value);
      if (isNaN(val)) return [];

      if (operator === '>=' || operator === '>') {
        // Higher is better. 
        // Fail: < val.
        return [
          { value: null, color: "red" },
          { value: val, color: "green" }
        ];
      } else if (operator === '<=' || operator === '<') {
        // Lower is better.
        // Limit: val.
        // Warning: 0.75 * val.
        const warningVal = val * 0.75;
        
        return [
          { value: null, color: "green" },
          { value: warningVal, color: "orange" },
          { value: val, color: "red" }
        ];
      }
      return [];
    };

    const convertOperator = (op) => {
        // PromQL operators: ==, !=, >, <, >=, <=
        if (op === '=') return '==';
        return op;
    };

    const invertOperator = (op) => {
       if (op === '>=') return '<';
       if (op === '>') return '<=';
       if (op === '<=') return '>';
       if (op === '<') return '>=';
       return '==';
    };

    const download = () => {
       const content = generatedCode.value;
       const ext = activeTab.value === 'dashboard' ? 'json' : 'yaml';
       const blob = new Blob([content], { type: 'text/plain' });
       const url = window.URL.createObjectURL(blob);
       const a = document.createElement('a');
       a.href = url;
       a.download = `sla-${activeTab.value}.${ext}`;
       a.click();
       window.URL.revokeObjectURL(url);
    };

    return {
       datasourceName,
       dashboardTitle,
       activeTab,
       editorContainer,
       generate,
       download,
       generatedCode
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