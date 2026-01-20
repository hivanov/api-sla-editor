import * as rrulePkg from 'rrule';
const RRule = (rrulePkg as any).RRule || (rrulePkg as any).default?.RRule || (rrulePkg as any).default;

import { Expr } from './promql/ast';
import { parsePromQL as actualParsePromQL } from './promql/parser';

export const formatDuration = (duration) => {
  if (!duration || typeof duration !== 'string') return duration;
  
  if (duration.startsWith('P')) {
      const regex = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/;
      const matches = duration.match(regex);
      if (!matches) return duration;
      const parts = [];
      const [ , days, hours, minutes, seconds ] = matches;
      if (days && parseInt(days) > 0) parts.push(`${days} day${days != 1 ? 's' : ''}`);
      if (hours && parseInt(hours) > 0) parts.push(`${hours} hour${hours != 1 ? 's' : ''}`);
      if (minutes && parseInt(minutes) > 0) parts.push(`${minutes} minute${minutes != 1 ? 's' : ''}`);
      if (seconds !== undefined && (parseInt(seconds) > 0 || (parts.length === 0 && duration.includes('S')))) {
         parts.push(`${seconds || 0} second${seconds != 1 ? 's' : ''}`);
      }
      if (parts.length === 0) return '';
      if (parts.length === 1) return parts[0];
      const lastPart = parts.pop();
      return `${parts.join(', ')} and ${lastPart}`;
  } else {
      const parts = [];
      const matches = duration.matchAll(/(\d+)([smhdw])/g);
      for (const match of matches) {
          const val = parseInt(match[1]);
          const unit = match[2];
          const unitMap: Record<string, string> = { 's': 'second', 'm': 'minute', 'h': 'hour', 'd': 'day', 'w': 'week' };
          parts.push(`${val} ${unitMap[unit]}${val != 1 ? 's' : ''}`);
      }
      if (parts.length === 0) return duration;
      if (parts.length === 1) return parts[0];
      const lastPart = parts.pop();
      return `${parts.join(', ')} and ${lastPart}`;
  }
};

export const formatRRule = (rruleStr) => {
  if (!rruleStr) return '';
  try {
    const ruleString = rruleStr.startsWith('RRULE:') ? rruleStr : `RRULE:${rruleStr}`;
    const rule = RRule.fromString(ruleString);
    return rule.toText();
  } catch (e) {
    return rruleStr;
  }
};

export const formatPrometheusMeasurement = (str) => {
  if (!str || typeof str !== 'string') return str;
  
  try {
    const result = validatePromQL(str);
    if (!result.valid || !result.ast) return str;
    const formatted = formatASTToHuman(result.ast);
    if (formatted) {
        return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    }
    return str;
  } catch (e) {
    return str;
  }
};

const formatASTToHuman = (node: any): string => {
  if (!node) return '';
  if (node.type === 'AggregateExpr' || node.type === 'Call') {
    const op = node.type === 'AggregateExpr' ? node.op : node.func;
    const opMap: Record<string, string> = {
      'avg_over_time': 'average',
      'min_over_time': 'minimum',
      'max_over_time': 'maximum',
      'sum_over_time': 'sum',
      'count_over_time': 'count',
      'quantile_over_time': '99th percentile',
      'histogram_quantile': '95th percentile'
    };
    
    let exprNode = node.expr;
    if (node.type === 'Call') {
      if (op === 'quantile_over_time' && node.args.length === 2) {
        const q = node.args[0].value;
        const qStr = q === 0.99 ? '99th percentile' : (q === 0.95 ? '95th percentile' : `${q*100}th percentile`);
        return `the ${qStr} of ${formatASTToHuman(node.args[1])}`;
      }
      if (op === 'histogram_quantile' && node.args.length === 2) {
        const q = node.args[0].value;
        const qStr = q === 0.99 ? '99th percentile' : (q === 0.95 ? '95th percentile' : `${q*100}th percentile`);
        const inner = node.args[1];
        if (inner.type === 'AggregateExpr' && inner.op === 'sum' && inner.expr.type === 'Call' && inner.expr.func === 'rate') {
            return `the ${qStr} of ${formatASTToHuman(inner.expr.args[0])}`;
        }
        return `the ${qStr} of ${formatASTToHuman(node.args[1])}`;
      }
      if (op === 'rate' && node.args.length === 1) {
          return `the rate of ${formatASTToHuman(node.args[0])}`;
      }
      if (node.args && node.args.length > 0) {
        exprNode = node.args[node.args.length - 1];
      }
    }

    const opStr = opMap[op] || op.replace(/_/g, ' ');
    return `the ${opStr} of ${formatASTToHuman(exprNode)}`;
  }
  if (node.type === 'MatrixSelector') {
    return `${formatASTToHuman(node.vectorSelector)} over ${formatDuration(node.range)}`;
  }
  if (node.type === 'VectorSelector') {
    return node.name || '(metric not specified)';
  }
  if (node.type === 'BinaryExpr') {
    const opMap: Record<string, string> = { '>': 'greater than', '<': 'less than', '>=': 'at least', '<=': 'at most', '==': 'equal to', '!=': 'not equal to', '*': 'times' };
    return `${formatASTToHuman(node.left)} is ${opMap[node.op] || node.op} ${formatASTToHuman(node.right)}`;
  }
  if (node.type === 'NumberLiteral') {
    return node.value.toString();
  }
  if (node.type === 'ParenExpr') {
      return formatASTToHuman(node.expr);
  }
  return 'expression';
};

export const astToString = (node: any): string => {
  if (!node) return '';
  switch (node.type) {
    case 'VectorSelector':
      let vs = node.name || '';
      if (node.labelMatchers && node.labelMatchers.length > 0) {
        vs += '{' + node.labelMatchers.map((m: any) => `${m.name}${m.type}"${m.value}"`).join(',') + '}';
      }
      return vs;
    case 'MatrixSelector':
      return `${astToString(node.vectorSelector)}[${node.range}]`;
    case 'AggregateExpr':
      let agg = `${node.op}`;
      if (node.grouping && node.grouping.length > 0) {
        agg += ` ${node.without ? 'without' : 'by'} (${node.grouping.join(', ')}) `;
      }
      agg += '(';
      if (node.param) agg += `${astToString(node.param)}, `;
      agg += `${astToString(node.expr)})`;
      return agg;
    case 'BinaryExpr':
      let bop = `${astToString(node.left)} ${node.op}`;
      if (node.returnBool) bop += ' bool';
      if (node.vectorMatching) {
          const vm = node.vectorMatching;
          bop += ` ${vm.on ? 'on' : 'ignoring'}(${vm.matchingLabels.join(', ')})`;
          if (vm.cardinality !== 'one-to-one') {
              bop += ` ${vm.cardinality === 'many-to-one' ? 'group_left' : 'group_right'}`;
              if (vm.include && vm.include.length > 0) {
                  bop += `(${vm.include.join(', ')})`;
              }
          }
      }
      bop += ` ${astToString(node.right)}`;
      return bop;
    case 'Call':
      return `${node.func}(${node.args.map((a: any) => astToString(a)).join(', ')})`;
    case 'NumberLiteral':
      return node.value.toString();
    case 'StringLiteral':
      return `"${node.value}"`;
    case 'UnaryExpr':
      return `${node.op}${astToString(node.expr)}`;
    case 'ParenExpr':
      return `(${astToString(node.expr)})`;
    case 'SubqueryExpr':
      return `${astToString(node.expr)}[${node.range}:${node.resolution || ''}]`;
    case 'OffsetExpr':
      return `${astToString(node.expr)} offset ${node.offset}`;
    case 'StepInvariantExpr':
        if (node.variant) return `${astToString(node.expr)} @ ${node.variant}()`;
        return `${astToString(node.expr)} @ ${node.timestamp}`;
    default:
      return '';
  }
};

export const parsePromQL = (expr: string): Expr => {
  return actualParsePromQL(expr);
};

export const validatePromQL = (expr: string, availableMetrics: any = null) => {
  if (!expr || typeof expr !== 'string' || !expr.trim()) {
    return { valid: false, error: 'Expression is empty' };
  }

  let ast: any;
  try {
    ast = parsePromQL(expr);
    if (!ast) return { valid: false, error: 'Failed to parse expression' };
  } catch (e: any) {
    let msg = e.message;
    if (msg.includes('but "=" found') || msg.includes("mismatched input '='")) {
      msg = 'Use "==" for equality comparison, not "="';
    }
    return { valid: false, error: msg };
  }

  const metricsInExpr: string[] = [];
  const walk = (node: any) => {
    if (!node || typeof node !== 'object') return;
    if (node.type === 'VectorSelector' && node.name) {
      if (!metricsInExpr.includes(node.name)) metricsInExpr.push(node.name);
    }
    Object.entries(node).forEach(([key, val]) => {
      if (key === 'type') return;
      if (Array.isArray(val)) val.forEach(walk);
      else if (typeof val === 'object') walk(val);
    });
  };
  walk(ast);

  if (availableMetrics) {
    for (const m of metricsInExpr) {
      if (!availableMetrics[m]) {
        return { valid: false, error: `Metric "${m}" is not defined in the metrics section`, metrics: metricsInExpr };
      }
    }
  }

  const semanticWalk = (node: any) => {
      if (!node || typeof node !== 'object') return;
      if (node.type === 'Call') {
          if (['rate', 'irate', 'increase', 'delta', 'idelta', 'deriv', 'predict_linear'].includes(node.func)) {
              const lastArg = node.args[node.args.length - 1];
              if (lastArg && lastArg.type !== 'MatrixSelector' && lastArg.type !== 'SubqueryExpr') {
                  throw new Error(`Function "${node.func}" requires a range vector`);
              }
          }
      }
      Object.values(node).forEach(v => {
          if (Array.isArray(v)) v.forEach(semanticWalk);
          else if (typeof v === 'object') semanticWalk(v);
      });
  };

  try {
      semanticWalk(ast);
  } catch (e: any) {
      return { valid: false, error: e.message, metrics: metricsInExpr, ast };
  }

  return { valid: true, metrics: metricsInExpr, ast };
};

export const toPromQL = (str: string) => {
  if (!str) return '';
  try {
    const res = validatePromQL(str);
    if (res.valid && res.ast) {
        return astToString(res.ast);
    }
  } catch(e) {}
  return str.trim();
};

export const ensurePromQLBoolean = (str: string) => {
  if (!str || !str.trim()) return '';
  try {
    const res = validatePromQL(str);
    if (!res.valid || !res.ast) return str;
    
    const forceBoolRecursive = (node: any): any => {
      if (!node || typeof node !== 'object') return node;
      const newNode = { ...node };
      if (newNode.type === 'BinaryExpr') {
        const comparisonOps = ['==', '!=', '>=', '<=', '>', '<'];
        if (comparisonOps.includes(newNode.op)) {
          newNode.returnBool = true;
        }
      }
      
      for (const key in newNode) {
          if (key === 'type' || key === 'returnBool') continue;
          const val = newNode[key];
          if (Array.isArray(val)) {
              newNode[key] = val.map(forceBoolRecursive);
          } else if (typeof val === 'object') {
              newNode[key] = forceBoolRecursive(val);
          }
      }
      return newNode;
    };

    const boolAst = forceBoolRecursive(res.ast);
    return astToString(boolAst);
  } catch (e) {
    return str;
  }
};

export const hasContent = (obj: any) => {
  if (!obj) return false;
  if (Array.isArray(obj)) return obj.length > 0;
  if (typeof obj === 'object') return Object.keys(obj).length > 0;
  return !!obj;
};