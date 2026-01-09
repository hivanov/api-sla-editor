import { describe, it, expect } from 'vitest';
import { getGoogleHolidayCalendarUrl, getHolidayCalendarId, getAllHolidayCalendars, getHolidayCalendarName } from '../../src/utils/holidays';

describe('Holiday Utilities', () => {
  it('should generate correct Google Calendar iCal URL', () => {
    const id = 'en.usa.official#holiday@group.v.calendar.google.com';
    const url = getGoogleHolidayCalendarUrl(id);
    expect(url).toBe('https://calendar.google.com/calendar/ical/en.usa.official%23holiday%40group.v.calendar.google.com/public/basic.ics');
  });

  it('should get correct holiday ID for special cases', () => {
    expect(getHolidayCalendarId('US')).toBe('en.usa.official#holiday@group.v.calendar.google.com');
    expect(getHolidayCalendarId('DE')).toBe('en.german.official#holiday@group.v.calendar.google.com');
  });

  it('should get default pattern holiday ID for other countries', () => {
    expect(getHolidayCalendarId('BG')).toBe('en.bg.official#holiday@group.v.calendar.google.com');
  });

  it('should return a sorted list of all holiday calendars', () => {
    const all = getAllHolidayCalendars();
    expect(all.length).toBeGreaterThan(100);
    expect(all[0].name.localeCompare(all[1].name)).toBeLessThanOrEqual(0);
    
    const usHolidays = all.find(c => c.name === 'US Holidays');
    expect(usHolidays).toBeDefined();
    expect(usHolidays.id).toBe('en.usa.official#holiday@group.v.calendar.google.com');

    const bavariaHolidays = all.find(c => c.name === 'Germany: Bavaria Holidays');
    expect(bavariaHolidays).toBeDefined();
  });

  it('should return correct name for a holiday calendar URL', () => {
    const url = 'https://calendar.google.com/calendar/ical/de.by%23holiday%40group.v.calendar.google.com/public/basic.ics';
    expect(getHolidayCalendarName(url)).toBe('Germany: Bavaria Holidays');
  });

  it('should return null for an unknown holiday calendar URL', () => {
    expect(getHolidayCalendarName('https://example.com/other.ics')).toBeNull();
  });
});
