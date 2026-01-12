import { RRule } from 'rrule';

export const formatDuration = (duration) => {
  if (!duration || typeof duration !== 'string') return duration;
  
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
    const funcMatch = str.match(/^([a-z_]+)\((.*)\)\s+([<>=!]+|between)\s+(.*)$/);
    if (!funcMatch) return str;
    
    const func = funcMatch[1];
    const args = funcMatch[2];
    const operator = funcMatch[3];
    const value = funcMatch[4];
    
    const funcMap = {
      'avg_over_time': 'average',
      'min_over_time': 'minimum',
      'max_over_time': 'maximum',
      'sum_over_time': 'sum',
      'count_over_time': 'count',
      'stddev_over_time': 'standard deviation',
      'stdvar_over_time': 'standard variance',
      'last_over_time': 'last value',
      'quantile_over_time': 'quantile',
      'histogram_quantile': 'histogram quantile'
    };
    
    let humanFunc = funcMap[func] || func;
    
    let metric = '';
    let windowValue = '';
    let windowUnitCode = '';
    let quantile = '';
    
    const unitMap = { 
      s: { singular: 'second', plural: 'seconds' }, 
      m: { singular: 'minute', plural: 'minutes' }, 
      h: { singular: 'hour', plural: 'hours' }, 
      d: { singular: 'day', plural: 'days' } 
    };
    
    if (func === 'quantile_over_time') {
      const qMatch = args.match(/^([^,]+),\s*(.*)\[(\d+)([smhd])\]$/);
      if (qMatch) {
        quantile = qMatch[1].trim();
        metric = qMatch[2].trim();
        windowValue = qMatch[3];
        windowUnitCode = qMatch[4];
      }
    } else if (func === 'histogram_quantile') {
      const hMatch = args.match(/^([^,]+),\s*sum by \(le\) \(rate\((.*)\[(\d+)([smhd])\]\)\)$/);
      if (hMatch) {
        quantile = hMatch[1].trim();
        metric = hMatch[2].trim();
        windowValue = hMatch[3];
        windowUnitCode = hMatch[4];
      }
    } else {
      const mMatch = args.match(/^(.*)\[(\d+)([smhd])\]$/);
      if (mMatch) {
        metric = mMatch[1].trim();
        windowValue = mMatch[2];
        windowUnitCode = mMatch[3];
      }
    }
    
    if (!metric) metric = '(metric not specified)';
    
    const v = parseInt(windowValue);
    const window = `${windowValue} ${v === 1 ? unitMap[windowUnitCode].singular : unitMap[windowUnitCode].plural}`;
    
    let res = '';
    if (quantile) {
      const percentValue = parseFloat(quantile);
      if (!isNaN(percentValue)) {
        const percent = percentValue * 100;
        res = `the ${percent}th percentile of ${metric} over ${window}`;
      } else {
        res = `the ${humanFunc} (${quantile}) of ${metric} over ${window}`;
      }
    } else {
      res = `the ${humanFunc} of ${metric} over ${window}`;
    }
    
    const operatorMap = {
      '>': 'is greater than',
      '<': 'is less than',
      '>=': 'is at least',
      '<=': 'is at most',
      '=': 'is equal to',
      '!=': 'is not equal to',
      'between': 'is between'
    };
    
    const humanOperator = operatorMap[operator] || operator;
    return `${res.charAt(0).toUpperCase() + res.slice(1)} ${humanOperator} ${value}`;
  } catch (e) {
    return str;
  }
};

export const hasContent = (obj) => {
  if (!obj) return false;
  if (Array.isArray(obj)) return obj.length > 0;
  if (typeof obj === 'object') return Object.keys(obj).length > 0;
  return !!obj;
};