import { validatePromQL, astToString } from './formatters';

export interface TerraformAlertOptions {
    planName: string;
    source: string; // 'direct', 'slo', etc.
    index: string | number;
    metricName: string;
    expression: string; // The PromQL expression or Metric ID
    duration?: string; // e.g. "60s"
    operator?: string; // "<", ">", etc.
    threshold?: number;
    channels?: string[]; // Resource names of notification channels
    project?: string;
    resourceType?: string; // For standard metrics
    metricType?: string; // For standard metrics
    aligner?: string; // e.g. ALIGN_MEAN
    timeAggregation?: string; // e.g. Average, Total
}

export const isComplexPromQL = (str: string): boolean => {
    const res = validatePromQL(str);
    if (!res.valid || !res.ast) return false;
    // If it's just a single VectorSelector with no labels, treat as simple metric ID (not complex query)
    if (res.ast.type === 'VectorSelector' && (!res.ast.labelMatchers || res.ast.labelMatchers.length === 0)) {
        return false;
    }
    return true;
};

export const generateGcpAlertPolicy = (opts: TerraformAlertOptions): string => {
    const policyName = `alert_${opts.planName}_${opts.source}_${opts.index}`.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
    
    let tf = `resource "google_monitoring_alert_policy" "${policyName}" {
`;
    tf += `  display_name = "SLA Breach: ${opts.planName} - ${opts.source} - ${opts.metricName}"
`;
    tf += `  combiner     = "OR"
`;
    
    // Check if we should use PromQL (GMP) or Standard Stackdriver
    const usePromQL = isComplexPromQL(opts.expression);

    if (usePromQL) {
        // GMP Alert
        tf += `  conditions {
`;
        tf += `    display_name = "${opts.metricName} breach"
`;
        tf += `    condition_prometheus_query_language {
`;
        
        let query = opts.expression;
        const analysis = validatePromQL(query);
        const isBoolean = analysis.valid && analysis.ast.type === 'BinaryExpr' && (analysis.ast.returnBool || ['<', '>', '<=', '>=', '==', '!='].includes(analysis.ast.op));
        
        if (!isBoolean && opts.operator && opts.threshold !== undefined) {
             const violationOp = invertOperator(opts.operator);
             query = `${query} ${violationOp} ${opts.threshold}`;
        }

        tf += `      query = "${escapeTerraformString(query)}"
`;
        if (opts.duration) {
            tf += `      duration = "${opts.duration}"
`;
        }
        tf += `    }
`;
        tf += `  }
`;

    } else {
        // Standard Stackdriver
        const resourceType = opts.resourceType || 'global';
        const metricType = opts.metricType || opts.expression;

        tf += `  conditions {
`;
        tf += `    display_name = "${opts.metricName} breach"
`;
        tf += `    condition_threshold {
`;
        tf += `      filter     = "resource.type = \"${resourceType}\" AND metric.type = \"${metricType}\""
`;
        tf += `      duration   = "${opts.duration || '60s'}"
`;
        tf += `      comparison = "${getGcpComparison(opts.operator || '<')}"
`;
        tf += `      threshold_value = ${opts.threshold !== undefined ? opts.threshold : 0}
`;
        tf += `      aggregations {
`;
        tf += `        alignment_period   = "60s"
`;
        tf += `        per_series_aligner = "${opts.aligner || 'ALIGN_MEAN'}"
`;
        tf += `      }
`;
        tf += `    }
`;
        tf += `  }
`;
    }

    if (opts.channels && opts.channels.length > 0) {
        tf += `  notification_channels = [
`;
        opts.channels.forEach(c => {
            tf += `    google_monitoring_notification_channel.${c}.name,
`;
        });
        tf += `  ]
`;
    }

    tf += `}

`;
    return tf;
};

export const generateAzureBicepAlert = (opts: TerraformAlertOptions & { location: string, scope: string, actionGroups?: string[] }): string => {
    const usePromQL = isComplexPromQL(opts.expression);

    if (usePromQL) {
        // Azure Monitor Managed Prometheus Rule Group
        const ruleGroupName = `rule_${opts.planName}_${opts.source}_${opts.index}`.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
        
        let query = opts.expression;
        const analysis = validatePromQL(query);
        const isBoolean = analysis.valid && analysis.ast.type === 'BinaryExpr' && (analysis.ast.returnBool || ['<', '>', '<=', '>=', '==', '!='].includes(analysis.ast.op));
        
        if (!isBoolean && opts.operator && opts.threshold !== undefined) {
             const violationOp = invertOperator(opts.operator);
             query = `${query} ${violationOp} ${opts.threshold}`;
        }

        let bicep = `resource ${ruleGroupName} 'Microsoft.AlertsManagement/prometheusRuleGroups@2023-03-01' = {
`;
        bicep += `  name: '${ruleGroupName}'
`;
        bicep += `  location: '${opts.location}'
`;
        bicep += `  properties: {
`;
        bicep += `    description: 'SLA Breach: ${opts.planName} - ${opts.source} - ${opts.metricName}'
`;
        bicep += `    scopes: [
`;
        bicep += `      '${opts.scope}'
`;
        bicep += `    ]
`;
        bicep += `    enabled: true
`;
        bicep += `    rules: [
`;
        bicep += `      {
`;
        bicep += `        alert: 'SlaBreach_${opts.metricName}'
`;
        bicep += `        expression: '${query.replace(/'/g, "'" )}'
`;
        bicep += `        severity: 2
`;
        bicep += `        enabled: true
`;
        if (opts.duration) {
            bicep += `        for: '${parseDurationToIso(opts.duration)}'
`;
        }
        if (opts.actionGroups && opts.actionGroups.length > 0) {
            bicep += `        actions: [
`;
            opts.actionGroups.forEach(ag => {
               bicep += `          {
`;
               bicep += `            actionGroupId: ${ag}.id
`;
               bicep += `          }
`;
            });
            bicep += `        ]
`;
        }
        bicep += `      }
`;
        bicep += `    ]
`;
        bicep += `  }
`;
        bicep += `}

`;
        return bicep;

    } else {
        // Standard Metric Alert
        const alertName = `alert_${opts.planName}_${opts.source}_${opts.index}`.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
        const period = parseDurationToIso(opts.duration || '60s');

        let bicep = `resource ${alertName} 'Microsoft.Insights/metricalerts@2018-03-01' = {
`;
        bicep += `  name: 'SLA Breach: ${opts.planName} - ${opts.source} - ${opts.metricName}'
`;
        bicep += `  location: 'global'
`;
        bicep += `  properties: {
`;
        bicep += `    description: 'Alert for SLA breach of ${opts.metricName} in plan ${opts.planName}'
`;
        bicep += `    severity: 2
`;
        bicep += `    enabled: true
`;
        bicep += `    scopes: [
`;
        bicep += `      '${opts.scope}'
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
        bicep += `          metricName: '${opts.expression}'
`;
        bicep += `          operator: '${getAzureOperator(opts.operator || '<')}'
`;
        bicep += `          threshold: ${opts.threshold !== undefined ? opts.threshold : 0}
`;
        bicep += `          timeAggregation: '${opts.timeAggregation || 'Average'}'
`;
        bicep += `          criterionType: 'StaticThresholdCriterion'
`;
        bicep += `        }
`;
        bicep += `      ]
`;
        bicep += `    }
`;
        if (opts.actionGroups && opts.actionGroups.length > 0) {
            bicep += `    actions: [
`;
            opts.actionGroups.forEach(ag => {
               bicep += `      {
`;
               bicep += `        actionGroupId: ${ag}.id
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
        return bicep;
    }
};

const invertOperator = (op: string) => {
    switch (op) {
        case '<': return '>=';
        case '<=': return '>';
        case '>': return '<=';
        case '>=': return '<';
        case '==': return '!=';
        case '!=': return '==';
        default: return '==';
    }
};

const getGcpComparison = (operator: string) => {
    switch (operator) {
        case '<': return 'COMPARISON_GT';
        case '<=': return 'COMPARISON_GT';
        case '>': return 'COMPARISON_LT';
        case '>=': return 'COMPARISON_LT';
        default: return 'COMPARISON_GT';
    }
};

const getAzureOperator = (operator: string) => {
    switch (operator) {
        case '<': return 'GreaterThanOrEqual';
        case '<=': return 'GreaterThan';
        case '>': return 'LessThanOrEqual';
        case '>=': return 'LessThan';
        case '=': return 'NotEqual';
        default: return 'GreaterThan';
    }
};

const escapeTerraformString = (str: string) => {
    return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
};

const parseDurationToIso = (duration: string) => {
    if (!duration) return 'PT5M';
    if (duration.startsWith('P')) return duration;
    const match = duration.match(/^(\d+)([smhdw])$/);
    if (!match) return 'PT5M';
    const val = parseInt(match[1]);
    const unit = match[2];
    switch(unit) {
        case 's': return `PT${val}S`;
        case 'm': return `PT${val}M`;
        case 'h': return `PT${val}H`;
        case 'd': return `P${val}D`;
        default: return 'PT5M';
    }
};
