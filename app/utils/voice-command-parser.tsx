export type CommandResult = {
  intent?: string;
  service?: string;
  stylist?: string;
  date?: Date;
  time?: string;
  branch?: string;
  rawText?: string; // Store the original command for reference
};

// Service mapping with synonyms and variations
const serviceMap: { [key: string]: string } = {
  // Haircut and variations
  haircut: '1',
  'hair cut': '1',
  cut: '1',
  trim: '1',

  // Coloring and variations
  color: '2',
  coloring: '2',
  'hair color': '2',
  dye: '2',
  highlight: '2',
  highlights: '2',

  // Styling and variations
  styling: '3',
  style: '3',
  blowout: '3',
  'blow dry': '3',
  updo: '3',
  'blow out': '3',
};

// Stylist mapping
const stylistMap: { [key: string]: string } = {
  john: '1',
  sarah: '2',
  michael: '3',
  jessica: '4',
  mike: '3', // Common nickname for Michael
  any: 'any',
  anyone: 'any',
  anybody: 'any',
  'any stylist': 'any',
};

// Branch mapping
const branchMap: { [key: string]: string } = {
  southside: 'southside',
  'south side': 'southside',
  south: 'southside',
  northside: 'northside',
  'north side': 'northside',
  north: 'northside',
  westside: 'westside',
  'west side': 'westside',
  west: 'westside',
  'east end': 'eastend',
  eastend: 'eastend',
  east: 'eastend',
  downtown: 'downtown',
  central: 'downtown',
};

export function parseVoiceCommand(text: string): CommandResult {
  const command = text.toLowerCase();
  const result: CommandResult = {
    rawText: text,
  };

  // Detect booking intent
  if (
    command.includes('book') ||
    command.includes('appointment') ||
    command.includes('schedule') ||
    command.includes('reserve')
  ) {
    result.intent = 'booking';
  } else if (
    command.includes('reschedule') ||
    command.includes('change') ||
    command.includes('move')
  ) {
    result.intent = 'reschedule';
  } else if (command.includes('cancel') || command.includes('delete')) {
    result.intent = 'cancel';
  }

  // Detect service using the service map
  for (const [key, value] of Object.entries(serviceMap)) {
    // Use word boundaries to avoid partial matches
    const pattern = new RegExp(`\\b${key}\\b`, 'i');
    if (pattern.test(command)) {
      result.service = value;
      break;
    }
  }

  // Detect stylist using the stylist map
  for (const [key, value] of Object.entries(stylistMap)) {
    const pattern = new RegExp(`\\b${key}\\b`, 'i');
    if (pattern.test(command)) {
      result.stylist = value;
      break;
    }
  }

  // Detect branch using the branch map
  for (const [key, value] of Object.entries(branchMap)) {
    const pattern = new RegExp(`\\b${key}\\b`, 'i');
    if (pattern.test(command)) {
      result.branch = value;
      break;
    }
  }

  // Enhanced date detection
  result.date = extractDate(command);

  // Enhanced time detection
  result.time = extractTime(command);

  return result;
}

// Extract date from natural language
function extractDate(text: string): Date | undefined {
  const today = new Date();

  // Check for "today"
  if (text.includes('today')) {
    return new Date();
  }

  // Check for "tomorrow"
  if (text.includes('tomorrow')) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  }

  // Check for specific date pattern (MM/DD, MM-DD, etc.)
  const dateRegex = /(\d{1,2})[./\-](\d{1,2})(?:[./\-](\d{2,4}))?/;
  const dateMatch = text.match(dateRegex);
  if (dateMatch) {
    const month = parseInt(dateMatch[1]) - 1; // JS months are 0-indexed
    const day = parseInt(dateMatch[2]);
    let year = dateMatch[3] ? parseInt(dateMatch[3]) : today.getFullYear();

    // Handle 2-digit years
    if (year < 100) {
      year += 2000;
    }

    return new Date(year, month, day);
  }

  // Check for day of the week
  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  for (let i = 0; i < daysOfWeek.length; i++) {
    if (text.includes(daysOfWeek[i])) {
      const targetDay = i;
      const currentDay = today.getDay();
      const daysToAdd = (targetDay - currentDay + 7) % 7 || 7; // If today, use next week

      const dateForDay = new Date();
      dateForDay.setDate(today.getDate() + daysToAdd);
      return dateForDay;
    }
  }

  // Check for "next week"
  if (text.includes('next week')) {
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    return nextWeek;
  }

  // Check for "in X days"
  const inDaysRegex = /in\s+(\d+)\s+days?/i;
  const inDaysMatch = text.match(inDaysRegex);
  if (inDaysMatch) {
    const daysToAdd = parseInt(inDaysMatch[1]);
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + daysToAdd);
    return futureDate;
  }

  // Month names with dates
  const months = [
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december',
  ];

  for (let i = 0; i < months.length; i++) {
    const month = months[i];
    if (text.includes(month)) {
      // Look for patterns like "january 15th" or "15th of january"
      const pattern1 = new RegExp(`${month}\\s+(\\d+)(?:st|nd|rd|th)?`, 'i');
      const pattern2 = new RegExp(`(\\d+)(?:st|nd|rd|th)?\\s+of\\s+${month}`, 'i');

      const match1 = text.match(pattern1);
      const match2 = text.match(pattern2);

      if (match1 || match2) {
        const day = parseInt(match1 ? match1[1] : match2![1]);
        const date = new Date(today.getFullYear(), i, day);

        // If date is in the past, assume next year
        if (date < today) {
          date.setFullYear(today.getFullYear() + 1);
        }

        return date;
      }
    }
  }

  return undefined;
}

// Extract time from natural language
function extractTime(text: string): string | undefined {
  // Pattern 1: HH:MM format with optional am/pm
  const timeRegex1 = /(\d{1,2}):(\d{2})\s*(am|pm)?/i;
  const match1 = text.match(timeRegex1);

  if (match1) {
    let hour = parseInt(match1[1]);
    const minute = match1[2];
    const ampm = match1[3]?.toLowerCase();

    // Convert to 24-hour format if necessary
    if (ampm === 'pm' && hour < 12) {
      hour += 12;
    } else if (ampm === 'am' && hour === 12) {
      hour = 0;
    }

    return `${hour.toString().padStart(2, '0')}:${minute}`;
  }

  // Pattern 2: # o'clock or # am/pm
  const timeRegex2 = /(\d{1,2})\s*(?:o'clock|oclock)?\s*(am|pm)/i;
  const match2 = text.match(timeRegex2);

  if (match2) {
    let hour = parseInt(match2[1]);
    const ampm = match2[2].toLowerCase();

    // Convert to 24-hour format
    if (ampm === 'pm' && hour < 12) {
      hour += 12;
    } else if (ampm === 'am' && hour === 12) {
      hour = 0;
    }

    return `${hour.toString().padStart(2, '0')}:00`;
  }

  // Pattern 3: at # (assumes current half of day)
  const timeRegex3 = /at\s+(\d{1,2})(?!\s*:\d{2}|\s*[ap]m)/i;
  const match3 = text.match(timeRegex3);

  if (match3) {
    let hour = parseInt(match3[1]);
    const currentHour = new Date().getHours();

    // Make reasonable assumptions: if it's morning, assume morning times, otherwise afternoon
    if (currentHour < 12 && hour < 12) {
      // morning
    } else if (hour < 12) {
      hour += 12; // assume afternoon
    }

    return `${hour.toString().padStart(2, '0')}:00`;
  }

  // Check for common time phrases
  if (text.includes('morning')) {
    return '09:00';
  } else if (text.includes('noon')) {
    return '12:00';
  } else if (text.includes('afternoon')) {
    return '14:00';
  } else if (text.includes('evening')) {
    return '18:00';
  }

  return undefined;
}

export default parseVoiceCommand;
