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

export const hasContent = (obj) => {
  if (!obj) return false;
  if (Array.isArray(obj)) return obj.length > 0;
  if (typeof obj === 'object') return Object.keys(obj).length > 0;
  return !!obj;
};