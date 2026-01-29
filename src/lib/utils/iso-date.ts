export type UTCTourDateParts = {
  day: number;
  month: number; // 0-based
  year: number;
};

// Parse an ISO date string and return UTC date parts.
export const getUTCTourDateParts = (isoDate: string): null | UTCTourDateParts => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    console.warn('Invalid tour date:', isoDate);
    return null;
  }

  return {
    day: date.getUTCDate(),
    month: date.getUTCMonth(),
    year: date.getUTCFullYear(),
  };
};

// Stable YYYY-MM-DD key for grouping and comparisons.
export const getUTCTourDateKey = (isoDate: string): null | string => {
  const parts = getUTCTourDateParts(isoDate);
  if (!parts) return null;

  const { day, month, year } = parts;
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

// Get UTC year from a tour date. (Used by Summit filtering)
export const getUTCTourYear = (isoDate: string): null | number => {
  return getUTCTourDateParts(isoDate)?.year ?? null;
};

// Get UTC month index (0–11) from a tour date. (Used by Summit filtering)
export const getUTCTourMonth = (isoDate: string): null | number => {
  return getUTCTourDateParts(isoDate)?.month ?? null;
};

// Human-readable weekday name (UTC-safe). (Used by Docent UI)
export const formatUTCDayOfWeek = (isoDate: string, locale = 'en-US'): string => {
  const parts = getUTCTourDateParts(isoDate);
  if (!parts) return '';

  const { day, month, year } = parts;
  return new Date(Date.UTC(year, month, day)).toLocaleDateString(locale, {
    timeZone: 'UTC',
    weekday: 'long',
  });
};

// Human-readable "March 12" style date (UTC-safe). (Used by Docent UI)
export const formatUTCTourDisplayDate = (isoDate: string, locale = 'en-US'): string => {
  const parts = getUTCTourDateParts(isoDate);
  if (!parts) return '';

  const { day, month, year } = parts;
  return new Date(Date.UTC(year, month, day)).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  });
};
