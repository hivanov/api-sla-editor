export const holidayCalendars = [
  { name: "Andorra", code: "AD" },
  { name: "Albania", code: "AL" },
  { name: "Armenia", code: "AM" },
  { name: "Argentina", code: "AR" },
  { name: "Austria", code: "AT" },
  { name: "Australia", code: "AU" },
  { name: "Åland Islands", code: "AX" },
  { name: "Bosnia and Herzegovina", code: "BA" },
  { name: "Barbados", code: "BB" },
  { name: "Belgium", code: "BE" },
  { name: "Bulgaria", code: "BG" },
  { name: "Benin", code: "BJ" },
  { name: "Bolivia", code: "BO" },
  { name: "Brazil", code: "BR" },
  { name: "Bahamas", code: "BS" },
  { name: "Botswana", code: "BW" },
  { name: "Belarus", code: "BY" },
  { name: "Belize", code: "BZ" },
  { name: "Canada", code: "CA" },
  { name: "DR Congo", code: "CD" },
  { name: "Congo", code: "CG" },
  { name: "Switzerland", code: "CH" },
  { name: "Chile", code: "CL" },
  { name: "China", code: "CN" },
  { name: "Colombia", code: "CO" },
  { name: "Costa Rica", code: "CR" },
  { name: "Cuba", code: "CU" },
  { name: "Cyprus", code: "CY" },
  { name: "Czechia", code: "CZ" },
  { name: "Germany", code: "DE" },
  { name: "Denmark", code: "DK" },
  { name: "Dominican Republic", code: "DO" },
  { name: "Ecuador", code: "EC" },
  { name: "Estonia", code: "EE" },
  { name: "Egypt", code: "EG" },
  { name: "Spain", code: "ES" },
  { name: "Finland", code: "FI" },
  { name: "Faroe Islands", code: "FO" },
  { name: "France", code: "FR" },
  { name: "Gabon", code: "GA" },
  { name: "United Kingdom", code: "GB" },
  { name: "Grenada", code: "GD" },
  { name: "Georgia", code: "GE" },
  { name: "Guernsey", code: "GG" },
  { name: "Ghana", code: "GH" },
  { name: "Gibraltar", code: "GI" },
  { name: "Greenland", code: "GL" },
  { name: "Gambia", code: "GM" },
  { name: "Greece", code: "GR" },
  { name: "Guatemala", code: "GT" },
  { name: "Guyana", code: "GY" },
  { name: "Hong Kong", code: "HK" },
  { name: "Honduras", code: "HN" },
  { name: "Croatia", code: "HR" },
  { name: "Haiti", code: "HT" },
  { name: "Hungary", code: "HU" },
  { name: "Indonesia", code: "ID" },
  { name: "Ireland", code: "IE" },
  { name: "Isle of Man", code: "IM" },
  { name: "Iceland", code: "IS" },
  { name: "Italy", code: "IT" },
  { name: "Jersey", code: "JE" },
  { name: "Jamaica", code: "JM" },
  { name: "Japan", code: "JP" },
  { name: "Kenya", code: "KE" },
  { name: "South Korea", code: "KR" },
  { name: "Kazakhstan", code: "KZ" },
  { name: "Liechtenstein", code: "LI" },
  { name: "Lesotho", code: "LS" },
  { name: "Lithuania", code: "LT" },
  { name: "Luxembourg", code: "LU" },
  { name: "Latvia", code: "LV" },
  { name: "Morocco", code: "MA" },
  { name: "Monaco", code: "MC" },
  { name: "Moldova", code: "MD" },
  { name: "Montenegro", code: "ME" },
  { name: "Madagascar", code: "MG" },
  { name: "North Macedonia", code: "MK" },
  { name: "Mongolia", code: "MN" },
  { name: "Montserrat", code: "MS" },
  { name: "Malta", code: "MT" },
  { name: "Mexico", code: "MX" },
  { name: "Mozambique", code: "MZ" },
  { name: "Namibia", code: "NA" },
  { name: "Niger", code: "NE" },
  { name: "Nigeria", code: "NG" },
  { name: "Nicaragua", code: "NI" },
  { name: "Netherlands", code: "NL" },
  { name: "Norway", code: "NO" },
  { name: "New Zealand", code: "NZ" },
  { name: "Panama", code: "PA" },
  { name: "Peru", code: "PE" },
  { name: "Papua New Guinea", code: "PG" },
  { name: "Philippines", code: "PH" },
  { name: "Poland", code: "PL" },
  { name: "Puerto Rico", code: "PR" },
  { name: "Portugal", code: "PT" },
  { name: "Paraguay", code: "PY" },
  { name: "Romania", code: "RO" },
  { name: "Serbia", code: "RS" },
  { name: "Russia", code: "RU" },
  { name: "Sweden", code: "SE" },
  { name: "Singapore", code: "SG" },
  { name: "Slovenia", code: "SI" },
  { name: "Svalbard and Jan Mayen", code: "SJ" },
  { name: "Slovakia", code: "SK" },
  { name: "San Marino", code: "SM" },
  { name: "Suriname", code: "SR" },
  { name: "El Salvador", code: "SV" },
  { name: "Tunisia", code: "TN" },
  { name: "Türkiye", code: "TR" },
  { name: "Ukraine", code: "UA" },
  { name: "United States", code: "US" },
  { name: "Uruguay", code: "UY" },
  { name: "Vatican City", code: "VA" },
  { name: "Venezuela", code: "VE" },
  { name: "Vietnam", code: "VN" },
  { name: "South Africa", code: "ZA" },
  { name: "Zimbabwe", code: "ZW" }
];

// Special cases for Google Calendar IDs that don't follow the simple pattern
export const specialHolidayCalendars = [
  { name: "Australian Holidays", id: "en.australian.official#holiday@group.v.calendar.google.com" },
  { name: "Austrian Holidays", id: "en.austrian.official#holiday@group.v.calendar.google.com" },
  { name: "Brazilian Holidays", id: "en.brazilian.official#holiday@group.v.calendar.google.com" },
  { name: "Canadian Holidays", id: "en.canadian.official#holiday@group.v.calendar.google.com" },
  { name: "China Holidays", id: "en.china.official#holiday@group.v.calendar.google.com" },
  { name: "Christian Holidays", id: "en.christian#holiday@group.v.calendar.google.com" },
  { name: "Danish Holidays", id: "en.danish.official#holiday@group.v.calendar.google.com" },
  { name: "Dutch Holidays", id: "en.dutch.official#holiday@group.v.calendar.google.com" },
  { name: "Finnish Holidays", id: "en.finnish.official#holiday@group.v.calendar.google.com" },
  { name: "French Holidays", id: "en.french.official#holiday@group.v.calendar.google.com" },
  { name: "German Holidays", id: "en.german.official#holiday@group.v.calendar.google.com" },
  { name: "Greek Holidays", id: "en.greek.official#holiday@group.v.calendar.google.com" },
  { name: "Hong Kong Holidays", id: "en.hong_kong.official#holiday@group.v.calendar.google.com" },
  { name: "Indian Holidays", id: "en.indian.official#holiday@group.v.calendar.google.com" },
  { name: "Indonesian Holidays", id: "en.indonesian.official#holiday@group.v.calendar.google.com" },
  { name: "Iranian Holidays", id: "en.iranian#holiday@group.v.calendar.google.com" },
  { name: "Irish Holidays", id: "en.irish.official#holiday@group.v.calendar.google.com" },
  { name: "Islamic Holidays", id: "en.islamic#holiday@group.v.calendar.google.com" },
  { name: "Italian Holidays", id: "en.italian.official#holiday@group.v.calendar.google.com" },
  { name: "Japanese Holidays", id: "en.japanese.official#holiday@group.v.calendar.google.com" },
  { name: "Jewish Holidays", id: "en.jewish.official#holiday@group.v.calendar.google.com" },
  { name: "Malaysian Holidays", id: "en.malaysia.official#holiday@group.v.calendar.google.com" },
  { name: "Mexican Holidays", id: "en.mexican.official#holiday@group.v.calendar.google.com" },
  { name: "New Zealand Holidays", id: "en.new_zealand.official#holiday@group.v.calendar.google.com" },
  { name: "Norwegian Holidays", id: "en.norwegian.official#holiday@group.v.calendar.google.com" },
  { name: "Philippines Holidays", id: "en.philippines.official#holiday@group.v.calendar.google.com" },
  { name: "Polish Holidays", id: "en.polish.official#holiday@group.v.calendar.google.com" },
  { name: "Portuguese Holidays", id: "en.portuguese.official#holiday@group.v.calendar.google.com" },
  { name: "Russian Holidays", id: "en.russian.official#holiday@group.v.calendar.google.com" },
  { name: "Singapore Holidays", id: "en.singapore.official#holiday@group.v.calendar.google.com" },
  { name: "South Africa Holidays", id: "en.sa.official#holiday@group.v.calendar.google.com" },
  { name: "South Korean Holidays", id: "en.south_korea.official#holiday@group.v.calendar.google.com" },
  { name: "Spain Holidays", id: "en.spain.official#holiday@group.v.calendar.google.com" },
  { name: "Swedish Holidays", id: "en.swedish.official#holiday@group.v.calendar.google.com" },
  { name: "Taiwan Holidays", id: "en.taiwan.official#holiday@group.v.calendar.google.com" },
  { name: "Thai Holidays", id: "en.thai.official#holiday@group.v.calendar.google.com" },
  { name: "UK Holidays", id: "en.uk.official#holiday@group.v.calendar.google.com" },
  { name: "US Holidays", id: "en.usa.official#holiday@group.v.calendar.google.com" },
  { name: "Vietnamese Holidays", id: "en.vietnamese.official#holiday@group.v.calendar.google.com" },
  // German States
  { name: "Germany: Baden-Württemberg Holidays", id: "de.bw#holiday@group.v.calendar.google.com" },
  { name: "Germany: Bavaria Holidays", id: "de.by#holiday@group.v.calendar.google.com" },
  { name: "Germany: Berlin Holidays", id: "de.be#holiday@group.v.calendar.google.com" },
  { name: "Germany: Brandenburg Holidays", id: "de.bb#holiday@group.v.calendar.google.com" },
  { name: "Germany: Bremen Holidays", id: "de.hb#holiday@group.v.calendar.google.com" },
  { name: "Germany: Hamburg Holidays", id: "de.hh#holiday@group.v.calendar.google.com" },
  { name: "Germany: Hessen Holidays", id: "de.he#holiday@group.v.calendar.google.com" },
  { name: "Germany: Mecklenburg-Vorpommern Holidays", id: "de.mv#holiday@group.v.calendar.google.com" },
  { name: "Germany: Niedersachsen Holidays", id: "de.ni#holiday@group.v.calendar.google.com" },
  { name: "Germany: Nordrhein-Westfalen Holidays", id: "de.nw#holiday@group.v.calendar.google.com" },
  { name: "Germany: Rheinland-Pfalz Holidays", id: "de.rp#holiday@group.v.calendar.google.com" },
  { name: "Germany: Saarland Holidays", id: "de.sl#holiday@group.v.calendar.google.com" },
  { name: "Germany: Sachsen Holidays", id: "de.sn#holiday@group.v.calendar.google.com" },
  { name: "Germany: Sachsen-Anhalt Holidays", id: "de.st#holiday@group.v.calendar.google.com" },
  { name: "Germany: Schleswig-Holstein Holidays", id: "de.sh#holiday@group.v.calendar.google.com" },
  { name: "Germany: Thüringen Holidays", id: "de.th#holiday@group.v.calendar.google.com" }
];

export function getGoogleHolidayCalendarUrl(id) {
  // Replace # with %23 and @ with %40 for the URL
  const encodedId = id.replace(/#/g, '%23').replace(/@/g, '%40');
  return `https://calendar.google.com/calendar/ical/${encodedId}/public/basic.ics`;
}

export function getHolidayCalendarId(code) {
  // Check special cases first
  // Try exact match on the name or specialized logic
  if (code.toUpperCase() === 'US') return 'en.usa.official#holiday@group.v.calendar.google.com';
  if (code.toUpperCase() === 'DE') return 'en.german.official#holiday@group.v.calendar.google.com';
  if (code.toUpperCase() === 'GB' || code.toUpperCase() === 'UK') return 'en.uk.official#holiday@group.v.calendar.google.com';

  const special = specialHolidayCalendars.find(c => {
    const name = c.name.toLowerCase();
    const search = code.toLowerCase();
    // Match "Country Holidays" or "Country: ..."
    return name === `${search} holidays` || name.startsWith(`${search}:`);
  });
  if (special) return special.id;

  // Default pattern: en.[code].official#holiday@group.v.calendar.google.com
  return `en.${code.toLowerCase()}.official#holiday@group.v.calendar.google.com`;
}

export function getAllHolidayCalendars() {
  const all = [...specialHolidayCalendars];
  
  holidayCalendars.forEach(country => {
    const id = getHolidayCalendarId(country.code);
    if (!all.find(c => c.id === id)) {
      all.push({
        name: `${country.name} Holidays`,
        id: id
      });
    }
  });

  return all.sort((a, b) => a.name.localeCompare(b.name));
}

export function getHolidayCalendarName(url) {
  if (!url) return null;
  const all = getAllHolidayCalendars();
  const found = all.find(c => getGoogleHolidayCalendarUrl(c.id) === url);
  return found ? found.name : null;
}
