import { validatePromQL, astToString } from './formatters';
import type { 
    TerraformFile, 
    TerraformResource, 
    TerraformArgument, 
    TerraformBlock, 
    TerraformNode,
    TerraformExpression,
    TerraformLiteral,
    TerraformIdentifier
} from './terraform/ast';
import { emitTerraform } from './terraform/emitter';

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

export const generateGcpAlertPolicyNode = (opts: TerraformAlertOptions): TerraformResource => {
    const policyName = `alert_${opts.planName}_${opts.source}_${opts.index}`.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
    
    const body: (TerraformArgument | TerraformBlock)[] = [
        {
            type: 'Argument',
            identifier: 'display_name',
            expression: { type: 'Literal', value: `SLA Breach: ${opts.planName} - ${opts.source} - ${opts.metricName}` }
        },
        {
            type: 'Argument',
            identifier: 'combiner',
            expression: { type: 'Literal', value: 'OR' }
        }
    ];

    const usePromQL = isComplexPromQL(opts.expression);

    if (usePromQL) {
        let query = opts.expression;
        const analysis = validatePromQL(query);
        const isBoolean = analysis.valid && analysis.ast.type === 'BinaryExpr' && (analysis.ast.returnBool || ['<', '>', '<=', '>=', '==', '!='].includes(analysis.ast.op));
        
        if (!isBoolean && opts.operator && opts.threshold !== undefined) {
             const violationOp = invertOperator(opts.operator);
             query = `${query} ${violationOp} ${opts.threshold}`;
        }

        const promqlBlock: TerraformBlock = {
            type: 'Block',
            blockType: 'condition_prometheus_query_language',
            labels: [],
            body: [
                {
                    type: 'Argument',
                    identifier: 'query',
                    expression: { type: 'Literal', value: query }
                }
            ]
        };

        if (opts.duration) {
            promqlBlock.body.push({
                type: 'Argument',
                identifier: 'duration',
                expression: { type: 'Literal', value: opts.duration }
            });
        }

        body.push({
            type: 'Block',
            blockType: 'conditions',
            labels: [],
            body: [
                {
                    type: 'Argument',
                    identifier: 'display_name',
                    expression: { type: 'Literal', value: `${opts.metricName} breach` }
                },
                promqlBlock
            ]
        });
    } else {
        const resourceType = opts.resourceType || 'global';
        const metricType = opts.metricType || opts.expression;

        const thresholdBlock: TerraformBlock = {
            type: 'Block',
            blockType: 'condition_threshold',
            labels: [],
            body: [
                {
                    type: 'Argument',
                    identifier: 'filter',
                    expression: { type: 'Literal', value: `resource.type = "${resourceType}" AND metric.type = "${metricType}"` }
                },
                {
                    type: 'Argument',
                    identifier: 'duration',
                    expression: { type: 'Literal', value: opts.duration || '60s' }
                },
                {
                    type: 'Argument',
                    identifier: 'comparison',
                    expression: { type: 'Literal', value: getGcpComparison(opts.operator || '<') }
                },
                {
                    type: 'Argument',
                    identifier: 'threshold_value',
                    expression: { type: 'Literal', value: opts.threshold !== undefined ? opts.threshold : 0 }
                },
                {
                    type: 'Block',
                    blockType: 'aggregations',
                    labels: [],
                    body: [
                        {
                            type: 'Argument',
                            identifier: 'alignment_period',
                            expression: { type: 'Literal', value: '60s' }
                        },
                        {
                            type: 'Argument',
                            identifier: 'per_series_aligner',
                            expression: { type: 'Literal', value: opts.aligner || 'ALIGN_MEAN' }
                        }
                    ]
                }
            ]
        };

        body.push({
            type: 'Block',
            blockType: 'conditions',
            labels: [],
            body: [
                {
                    type: 'Argument',
                    identifier: 'display_name',
                    expression: { type: 'Literal', value: `${opts.metricName} breach` }
                },
                thresholdBlock
            ]
        });
    }

    if (opts.channels && opts.channels.length > 0) {
        body.push({
            type: 'Argument',
            identifier: 'notification_channels',
            expression: {
                type: 'List',
                elements: opts.channels.map(c => ({
                    type: 'Identifier',
                    name: `google_monitoring_notification_channel.${c}.name`
                } as TerraformIdentifier))
            }
        });
    }

    return {
        type: 'Resource',
        resourceType: 'google_monitoring_alert_policy',
        name: policyName,
        body
    };
};

export const generateGcpAlertPolicy = (opts: TerraformAlertOptions): string => {
    return emitTerraform(generateGcpAlertPolicyNode(opts)) + '\n\n';
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
