import { describe, it, expect } from 'vitest';
import { formatDuration, formatRRule, hasContent, formatPrometheusMeasurement } from '../../src/utils/formatters';

describe('formatDuration', () => {
  it('formats simple days', () => {
    expect(formatDuration('P1D')).toBe('1 day');
    expect(formatDuration('P5D')).toBe('5 days');
  });

  it('formats simple hours', () => {
    expect(formatDuration('PT1H')).toBe('1 hour');
    expect(formatDuration('PT10H')).toBe('10 hours');
  });

  it('formats minutes and seconds', () => {
    expect(formatDuration('PT30M')).toBe('30 minutes');
    expect(formatDuration('PT15S')).toBe('15 seconds');
  });

  it('formats complex durations', () => {
    expect(formatDuration('P1DT2H30M15S')).toBe('1 day, 2 hours, 30 minutes and 15 seconds');
    expect(formatDuration('P2DT5H')).toBe('2 days and 5 hours');
  });

  it('handles zero or empty input', () => {
    expect(formatDuration('')).toBe('');
    expect(formatDuration(null)).toBe(null);
    expect(formatDuration('PT0S')).toBe('0 seconds');
  });

  it('falls back to raw string for invalid formats', () => {
    expect(formatDuration('invalid')).toBe('invalid');
  });
});

describe('formatRRule', () => {
  it('formats simple weekly rule', () => {
    expect(formatRRule('FREQ=WEEKLY;BYDAY=MO')).toBe('every week on Monday');
  });

  it('formats simple monthly rule', () => {
    expect(formatRRule('FREQ=MONTHLY;BYMONTHDAY=1')).toBe('every month on the 1st');
  });

  it('handles RRULE: prefix', () => {
    expect(formatRRule('RRULE:FREQ=DAILY')).toBe('every day');
  });

  it('falls back on error', () => {
    expect(formatRRule('INVALID_RULE')).toBe('INVALID_RULE');
  });
});

describe('hasContent', () => {
  it('checks strings', () => {
    expect(hasContent('')).toBe(false);
    expect(hasContent('test')).toBe(true);
  });

  it('checks arrays', () => {
    expect(hasContent([])).toBe(false);
    expect(hasContent([1])).toBe(true);
  });

  it('checks objects', () => {
    expect(hasContent({})).toBe(false);
    expect(hasContent({ a: 1 })).toBe(true);
  });

  it('checks null/undefined', () => {
    expect(hasContent(null)).toBe(false);
    expect(hasContent(undefined)).toBe(false);
  });
});

describe('formatPrometheusMeasurement', () => {

  it('formats avg_over_time', () => {

    expect(formatPrometheusMeasurement('avg_over_time(requests[5m]) < 100'))

      .toBe('The average of requests over 5 minutes is less than 100');

  });



  it('formats quantile_over_time', () => {

    expect(formatPrometheusMeasurement('quantile_over_time(0.99, latency[6h]) < 15'))

      .toBe('The 99th percentile of latency over 6 hours is less than 15');

  });



    it('formats histogram_quantile', () => {



      expect(formatPrometheusMeasurement('histogram_quantile(0.95, sum by (le) (rate(latency[1d]))) between 10 and 20'))



        .toBe('The 95th percentile of latency over 1 day is between 10 and 20');



    });



  



  it('handles "between" operator', () => {

    expect(formatPrometheusMeasurement('max_over_time(errors[10m]) between 5 and 10'))

      .toBe('The maximum of errors over 10 minutes is between 5 and 10');

  });



  it('falls back to raw string for unknown formats', () => {

    expect(formatPrometheusMeasurement('plain text exclusion')).toBe('plain text exclusion');

  });



  it('handles missing metric name gracefully', () => {

    expect(formatPrometheusMeasurement('quantile_over_time(0.95, [5m]) between 3 and 5'))

      .toBe('The 95th percentile of (metric not specified) over 5 minutes is between 3 and 5');

  });

});
