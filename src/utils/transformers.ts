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
import type {
    BicepStatement,
    BicepExpression,
    BicepObject,
    BicepResource
} from './bicep/ast';
import { BicepEmitter } from './bicep/emitter';

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

export const generateAzureBicepAlertNode = (opts: TerraformAlertOptions & { location: string, scope: string, actionGroups?: string[] }): BicepStatement => {
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

        const properties: BicepObject = {
            type: 'Object',
            properties: [
                { name: 'description', value: { type: 'Literal', value: `SLA Breach: ${opts.planName} - ${opts.source} - ${opts.metricName}` } },
                { name: 'scopes', value: { type: 'Array', items: [{ type: 'Literal', value: opts.scope }] } },
                { name: 'enabled', value: { type: 'Literal', value: true } },
                {
                    name: 'rules',
                    value: {
                        type: 'Array',
                        items: [
                            {
                                type: 'Object',
                                properties: [
                                    { name: 'alert', value: { type: 'Literal', value: `SlaBreach_${opts.metricName}` } },
                                    { name: 'expression', value: { type: 'Literal', value: query } },
                                    { name: 'severity', value: { type: 'Literal', value: 2 } },
                                    { name: 'enabled', value: { type: 'Literal', value: true } }
                                ]
                            }
                        ]
                    }
                }
            ]
        };

        if (opts.duration) {
            (properties.properties.find(p => p.name === 'rules')!.value as any).items[0].properties.push({
                name: 'for',
                value: { type: 'Literal', value: parseDurationToIso(opts.duration) }
            });
        }

        if (opts.actionGroups && opts.actionGroups.length > 0) {
            (properties.properties.find(p => p.name === 'rules')!.value as any).items[0].properties.push({
                name: 'actions',
                value: {
                    type: 'Array',
                    items: opts.actionGroups.map(ag => ({
                        type: 'Object',
                        properties: [
                            { name: 'actionGroupId', value: { type: 'MemberExpression', object: { type: 'Identifier', name: ag }, property: 'id' } }
                        ]
                    }))
                }
            });
        }

        return {
            type: 'Resource',
            name: ruleGroupName,
            resourceType: 'Microsoft.AlertsManagement/prometheusRuleGroups@2023-03-01',
            body: properties
        } as BicepResource;

    } else {
        // Standard Metric Alert
        const alertName = `alert_${opts.planName}_${opts.source}_${opts.index}`.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
        const period = parseDurationToIso(opts.duration || '60s');

        const properties: BicepObject = {
            type: 'Object',
            properties: [
                { name: 'description', value: { type: 'Literal', value: `Alert for SLA breach of ${opts.metricName} in plan ${opts.planName}` } },
                { name: 'severity', value: { type: 'Literal', value: 2 } },
                { name: 'enabled', value: { type: 'Literal', value: true } },
                { name: 'scopes', value: { type: 'Array', items: [{ type: 'Literal', value: opts.scope }] } },
                { name: 'evaluationFrequency', value: { type: 'Literal', value: period } },
                { name: 'windowSize', value: { type: 'Literal', value: period } },
                {
                    name: 'criteria',
                    value: {
                        type: 'Object',
                        properties: [
                            { name: "'odata.type'", value: { type: 'Literal', value: 'Microsoft.Azure.Monitor.SingleResourceMultipleMetricCriteria' } },
                            {
                                name: 'allOf',
                                value: {
                                    type: 'Array',
                                    items: [
                                        {
                                            type: 'Object',
                                            properties: [
                                                { name: 'name', value: { type: 'Literal', value: 'Metric1' } },
                                                { name: 'metricName', value: { type: 'Literal', value: opts.expression } },
                                                { name: 'operator', value: { type: 'Literal', value: getAzureOperator(opts.operator || '<') } },
                                                { name: 'threshold', value: { type: 'Literal', value: opts.threshold !== undefined ? opts.threshold : 0 } },
                                                { name: 'timeAggregation', value: { type: 'Literal', value: opts.timeAggregation || 'Average' } },
                                                { name: 'criterionType', value: { type: 'Literal', value: 'StaticThresholdCriterion' } }
                                            ]
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                }
            ]
        };

        if (opts.actionGroups && opts.actionGroups.length > 0) {
            properties.properties.push({
                name: 'actions',
                value: {
                    type: 'Array',
                    items: opts.actionGroups.map(ag => ({
                        type: 'Object',
                        properties: [
                            { name: 'actionGroupId', value: { type: 'MemberExpression', object: { type: 'Identifier', name: ag }, property: 'id' } }
                        ]
                    }))
                }
            });
        }

        return {
            type: 'Resource',
            name: alertName,
            resourceType: 'Microsoft.Insights/metricalerts@2018-03-01',
            body: {
                type: 'Object',
                properties: [
                    { name: 'name', value: { type: 'Literal', value: `SLA Breach: ${opts.planName} - ${opts.source} - ${opts.metricName}` } },
                    { name: 'location', value: { type: 'Literal', value: 'global' } },
                    { name: 'properties', value: properties }
                ]
            }
        } as BicepResource;
    }
};

export const generateAzureBicepAlert = (opts: TerraformAlertOptions & { location: string, scope: string, actionGroups?: string[] }): string => {
    const node = generateAzureBicepAlertNode(opts);
    const emitter = new BicepEmitter();
    return emitter.emit([node]) + '\n\n';
};

export const generateAzureActionGroupNode = (name: string, type: 'email' | 'sms', value: string): BicepStatement => {
    const groupKey = `ag_${name.replace(/[^a-zA-Z0-9]/g, '_')}`;
    const properties: BicepObject = {
        type: 'Object',
        properties: [
            { name: 'groupShortName', value: { type: 'Literal', value: name.substring(0, 12).replace(/[^a-zA-Z0-9]/g, '') } },
            { name: 'enabled', value: { type: 'Literal', value: true } }
        ]
    };

    if (type === 'email') {
        properties.properties.push({
            name: 'emailReceivers',
            value: {
                type: 'Array',
                items: [
                    {
                        type: 'Object',
                        properties: [
                            { name: 'name', value: { type: 'Literal', value: name } },
                            { name: 'emailAddress', value: { type: 'Literal', value: value } },
                            { name: 'useCommonAlertSchema', value: { type: 'Literal', value: true } }
                        ]
                    }
                ]
            }
        });
    } else if (type === 'sms') {
        properties.properties.push({
            name: 'smsReceivers',
            value: {
                type: 'Array',
                items: [
                    {
                        type: 'Object',
                        properties: [
                            { name: 'name', value: { type: 'Literal', value: name } },
                            { name: 'countryCode', value: { type: 'Literal', value: '1' } },
                            { name: 'phoneNumber', value: { type: 'Literal', value: value } }
                        ]
                    }
                ]
            }
        });
    }

    return {
        type: 'Resource',
        name: groupKey,
        resourceType: 'Microsoft.Insights/actionGroups@2023-01-01',
        body: {
            type: 'Object',
            properties: [
                { name: 'name', value: { type: 'Literal', value: name.replace(/[^a-zA-Z0-9-]/g, '-') } },
                { name: 'location', value: { type: 'Literal', value: 'Global' } },
                { name: 'properties', value: properties }
            ]
        }
    } as BicepResource;
};

export const generateAzureActionGroup = (name: string, type: 'email' | 'sms', value: string): string => {
    const node = generateAzureActionGroupNode(name, type, value);
    const emitter = new BicepEmitter();
    return emitter.emit([node]) + '\n\n';
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
