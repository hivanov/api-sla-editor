<template>
  <div class="policy-description p-4">
    <div v-html="renderedMarkdown" class="markdown-body"></div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { marked } from 'marked';
import { formatDuration, formatRRule, hasContent } from '../utils/formatters';

export default {
  name: 'PolicyDescription',
  props: {
    sla: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const generateMarkdown = () => {
      const { sla, context, metrics, plans } = props.sla;
      let md = `# SLA Policy Description\n\n`;

      // Summary Section
      md += `## Summary\n\n`;
      if (context && context.id) {
        md += `- **Policy ID:** ${context.id}\n`;
      }
      if (sla) {
        md += `- **SLA Version:** ${sla}\n`;
      }
      if (context && context.type) {
        md += `- **Type:** ${context.type.charAt(0).toUpperCase() + context.type.slice(1)}\n`;
      }
      
      const planCount = plans ? Object.keys(plans).filter(k => k && k.trim() !== '').length : 0;
      md += `- **Total Plans:** ${planCount}\n`;
      
      md += `\n---\n\n`;

      // Currencies Section
      if (props.sla.customCurrencies && props.sla.customCurrencies.length > 0) {
        md += `## Currencies\n\n`;
        props.sla.customCurrencies.forEach(c => {
          md += `- **${c.code}**: ${c.description}`;
          if (c.conversion && c.conversion.rate !== undefined && c.conversion.baseCurrency) {
            md += ` (1 ${c.code} = ${c.conversion.rate} ${c.conversion.baseCurrency})`;
          }
          md += `\n`;
        });
        md += `\n---\n\n`;
      }

      // Plans Section
      if (plans && Object.keys(plans).length > 0) {
        md += `## Service Plans\n\n`;
        for (const [planName, plan] of Object.entries(plans)) {
          if (!planName || planName.trim() === '') continue;

          md += `### ${plan.title || planName}\n`;
          if (plan.description) {
            md += `*${plan.description}*\n\n`;
          }

          // Availability
          if (plan.availability) {
            md += `#### 🟢 Availability\n`;
            md += `Guaranteed uptime: **${plan.availability}**\n\n`;
          }

          // Pricing
          if (plan.pricing && plan.pricing.cost !== undefined) {
            md += `#### 💰 Pricing\n`;
            const currencyCode = plan.pricing.currency || '';
            md += `- **Cost:** ${plan.pricing.cost} ${currencyCode}\n`;
            
            // Show conversion if it's a custom currency
            const customCurrency = props.sla.customCurrencies?.find(c => c.code === currencyCode);
            if (customCurrency && customCurrency.conversion && customCurrency.conversion.rate !== undefined && customCurrency.conversion.baseCurrency) {
              const baseCost = (plan.pricing.cost * customCurrency.conversion.rate).toFixed(2);
              md += `  *(Equivalent to ${baseCost} ${customCurrency.conversion.baseCurrency})*\n`;
            }

            if (plan.pricing.period) {
              md += `- **Billing Period:** ${formatDuration(plan.pricing.period)}\n`;
            }
            md += `\n`;
          }

          // Quotas
          const validQuotas = plan.quotas ? Object.entries(plan.quotas).filter(([k]) => k && k.trim() !== '') : [];
          if (validQuotas.length > 0) {
            md += `#### 📊 Quotas\n`;
            for (const [metricKey, quota] of validQuotas) {
              const metric = metrics && metrics[metricKey];
              const metricName = metric ? (metric.description || metricKey) : metricKey;
              md += `- **${metricName}:** `;
              if (quota.max !== undefined) md += `Maximum ${quota.max} `;
              if (quota.unit) md += `${quota.unit}`;
              else if (metric && metric.unit) md += `${metric.unit}`;
              md += `\n`;
            }
            md += `\n`;
          }

          // Guarantees
          const validGuarantees = plan.guarantees ? plan.guarantees.filter(g => g.metric && g.metric.trim() !== '') : [];
          if (validGuarantees.length > 0) {
            md += `#### 🛡️ Guarantees\n`;
            validGuarantees.forEach(g => {
              let guaranteeText = `- **${g.metric}:** `;
              if (g.operator) {
                if (g.operator === 'avg') {
                  guaranteeText += `Average of ${g.value || '?'}`;
                } else if (g.operator === 'between') {
                  guaranteeText += `Between ${g.value || '?'}`;
                } else {
                  guaranteeText += `${g.operator} ${g.value || '?'}`;
                }
                
                if (g.period) {
                  guaranteeText += ` per ${formatDuration(g.period)}`;
                }
              } else if (g.limit) {
                guaranteeText += `${formatDuration(g.limit)}`;
              } else if (g.value) {
                guaranteeText += `${g.value}`;
              }
              md += `${guaranteeText}\n`;
            });
            md += `\n`;
          }

          // Support Policy
          if (plan['x-support-policy']) {
            const support = plan['x-support-policy'];
            const hasSupportContent = hasContent(support.hoursAvailable) || 
                                     hasContent(support.holidaySchedule?.sources) || 
                                     hasContent(support.serviceLevelObjectives) || 
                                     hasContent(support.contactPoints);
            
            if (hasSupportContent) {
              md += `#### 🎧 Support Policy\n`;
              
              if (support.hoursAvailable && support.hoursAvailable.length > 0) {
                md += `**Support Hours:**\n`;
                support.hoursAvailable.forEach(h => {
                  const days = h.dayOfWeek ? h.dayOfWeek.join(', ') : 'All days';
                  md += `- ${days}: ${h.opens} - ${h.closes} (${h.timezone || 'UTC'})\n`;
                });
                md += `\n`;
              }

              if (support.holidaySchedule && support.holidaySchedule.sources && support.holidaySchedule.sources.length > 0) {
                md += `**Holidays:**\n`;
                support.holidaySchedule.sources.forEach(s => {
                  if (s.type === 'region') md += `- Regional holidays for **${s.regionCode}**\n`;
                  else if (s.type === 'manual' && s.dates) md += `- Specified dates: ${s.dates.join(', ')}\n`;
                  else if (s.type === 'ical') md += `- Calendar feed: ${s.calendarUrl}\n`;
                  if (s.description) md += `  *${s.description}*\n`;
                });
                md += `\n`;
              }

                          if (support.serviceLevelObjectives && support.serviceLevelObjectives.length > 0) {
                            md += `**Service Level Objectives (SLOs):**\n`;
                            support.serviceLevelObjectives.forEach(slo => {
                              const validSloGuarantees = slo.guarantees ? slo.guarantees.filter(g => g.metric && g.metric.trim() !== '') : [];
                              if (slo.name || slo.priority || validSloGuarantees.length > 0) {
                                md += `- **${slo.name || (slo.priority ? 'Priority ' + slo.priority : 'Objective')}**:\n`;
                                validSloGuarantees.forEach(g => {
                                  let guaranteeText = `  - ${g.metric}: `;
                                  if (g.operator) {
                                    if (g.operator === 'avg') {
                                      guaranteeText += `Average of ${g.value || '?'}`;
                                    } else if (g.operator === 'between') {
                                      guaranteeText += `Between ${g.value || '?'}`;
                                    } else {
                                      guaranteeText += `${g.operator} ${g.value || '?'}`;
                                    }
                                    
                                    if (g.period) {
                                      guaranteeText += ` per ${formatDuration(g.period)}`;
                                    }
                                  } else if (g.duration) {
                                    guaranteeText += `${formatDuration(g.duration)}`;
                                  } else if (g.value) {
                                    guaranteeText += `${g.value}`;
                                  }
                                  md += `${guaranteeText}\n`;
                                });
                              }
                            });
                            md += `\n`;
                          }
              if (support.contactPoints && support.contactPoints.length > 0) {
                md += `**Contact Channels:**\n`;
                support.contactPoints.forEach(cp => {
                  if (cp.channels && cp.channels.length > 0) {
                    cp.channels.forEach(ch => {
                      if (ch.type && ch.url) {
                        md += `- **${ch.type.charAt(0).toUpperCase() + ch.type.slice(1)}:** [${ch.url}](${ch.url})`;
                        if (ch.description) md += ` (${ch.description})`;
                        md += `\n`;
                      }
                    });
                  }
                });
                md += `\n`;
              }
            }
          }

          // Maintenance Policy
          if (plan['x-maintenance-policy']) {
            const maintenance = plan['x-maintenance-policy'];
            const hasMaintenanceContent = maintenance.countsAsDowntime !== undefined || 
                                         hasContent(maintenance.minimumNotice) || 
                                         hasContent(maintenance.windows);
            
            if (hasMaintenanceContent) {
              md += `#### 🛠️ Maintenance Policy\n`;
              if (maintenance.countsAsDowntime !== undefined) {
                md += `- **Counts as downtime:** ${maintenance.countsAsDowntime ? '✅ Yes' : '❌ No'}\n`;
              }
              if (maintenance.minimumNotice) {
                if (maintenance.minimumNotice.standard) md += `- **Standard Notice:** ${formatDuration(maintenance.minimumNotice.standard)}\n`;
                if (maintenance.minimumNotice.emergency) md += `- **Emergency Notice:** ${formatDuration(maintenance.minimumNotice.emergency)}\n`;
              }
              if (maintenance.windows && maintenance.windows.length > 0) {
                md += `**Scheduled Windows:**\n`;
                maintenance.windows.forEach(w => {
                  if (w.type || w.rrule) {
                    const recurrence = w.rrule ? formatRRule(w.rrule) : '';
                    md += `- ${w.type || 'Maintenance'}: ${recurrence || ''}`;
                    if (w.duration) {
                      md += ` (Duration: ${formatDuration(w.duration)})`;
                    }
                    if (w.timezone) {
                      md += ` [${w.timezone}]`;
                    }
                    md += `\n`;
                  }
                });
              }
              md += `\n`;
            }
          }

          // Service Credits
          if (plan['x-service-credits']) {
            const credits = plan['x-service-credits'];
            const hasCreditsContent = credits.claimWindow || hasContent(credits.tiers);
            
            if (hasCreditsContent) {
              md += `#### 💸 Service Credits\n`;
              if (credits.claimWindow) md += `- **Claim Window:** ${formatDuration(credits.claimWindow)}\n`;
              if (credits.tiers && credits.tiers.length > 0) {
                md += `**Compensation Tiers:**\n`;
                credits.tiers.forEach(t => {
                  if (t.condition && t.condition.metric) {
                    const val = formatDuration(t.condition.value);
                    md += `- If ${t.condition.metric} ${t.condition.operator || 'is'} ${val}: **${t.compensation}${credits.currency || ''}** credit\n`;
                  }
                });
              }
              md += `\n`;
            }
          }

          // Lifecycle Policy
          if (plan['x-lifecycle-policy']) {
            const lifecycle = plan['x-lifecycle-policy'];
            const hasLifecycleContent = lifecycle.minimumTerm || lifecycle.autoRenewal !== undefined || lifecycle.noticePeriod || lifecycle.dataRetention;
            
            if (hasLifecycleContent) {
              md += `#### 🔄 Lifecycle Policy\n`;
              if (lifecycle.minimumTerm) md += `- **Minimum Term:** ${formatDuration(lifecycle.minimumTerm)}\n`;
              if (lifecycle.autoRenewal !== undefined) md += `- **Auto Renewal:** ${lifecycle.autoRenewal ? 'Yes' : 'No'}\n`;
              if (lifecycle.noticePeriod) md += `- **Notice Period:** ${formatDuration(lifecycle.noticePeriod)}\n`;
              if (lifecycle.dataRetention && lifecycle.dataRetention.afterTermination) {
                md += `- **Data Retention (Post-Termination):** ${formatDuration(lifecycle.dataRetention.afterTermination)}\n`;
              }
              md += `\n`;
            }
          }

          // Exclusions
          if (plan['x-sla-exclusions'] && plan['x-sla-exclusions'].length > 0) {
            const validExclusions = plan['x-sla-exclusions'].filter(e => e && e.trim() !== '');
            if (validExclusions.length > 0) {
              md += `#### 🚫 Exclusions\n`;
              validExclusions.forEach(e => {
                md += `- ${e}\n`;
              });
              md += `\n`;
            }
          }

          md += `---\n\n`;
        }
      } else {
        md += `*No plans defined in this SLA.*\n`;
      }

      return md;
    };

    const renderedMarkdown = computed(() => {
      return marked(generateMarkdown());
    });

    return {
      renderedMarkdown,
    };
  }
};
</script>

<style scoped>
.policy-description {
  background-color: white;
  color: #24292e;
}

:deep(.markdown-body) {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 1.6;
  word-wrap: break-word;
}

:deep(.markdown-body h1) { padding-bottom: 0.3em; font-size: 2.25em; border-bottom: 1px solid #eaecef; margin-bottom: 16px; }
:deep(.markdown-body h2) { padding-bottom: 0.3em; font-size: 1.75em; border-bottom: 1px solid #eaecef; margin-top: 32px; margin-bottom: 16px; }
:deep(.markdown-body h3) { font-size: 1.5em; margin-top: 24px; margin-bottom: 16px; color: #0366d6; }
:deep(.markdown-body h4) { font-size: 1.1em; margin-top: 20px; margin-bottom: 12px; font-weight: 600; }
:deep(.markdown-body ul) { padding-left: 2em; margin-bottom: 16px; }
:deep(.markdown-body li) { margin-top: 0.25em; }
:deep(.markdown-body hr) { height: 0.25em; padding: 0; margin: 32px 0; background-color: #e1e4e8; border: 0; }
:deep(.markdown-body p) { margin-bottom: 16px; }
:deep(.markdown-body strong) { font-weight: 600; }
</style>
