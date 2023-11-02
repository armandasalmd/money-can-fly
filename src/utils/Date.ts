import { add, differenceInDays, format } from "date-fns";
import { DateRange } from "./Types";

export function getUTCFirstOfMonth(date: Date): Date {
  const UTCDate = toUTCDate(date);
  UTCDate.setUTCDate(1);
  UTCDate.setUTCHours(0, 0, 0, 0);
  return UTCDate;
}

export function getUTCNow(overrideDay?: number): Date {
  const UTCDate = toUTCDate(new Date());
  overrideDay && UTCDate.setUTCDate(overrideDay);
  return UTCDate;
}

export function getOneMonthRange(periodStart: Date = new Date(), monthsToAdd: number = 0): DateRange {
  periodStart = getUTCFirstOfMonth(periodStart);
  
  if (monthsToAdd !== 0) {
    periodStart = add(periodStart, {
      months: monthsToAdd
    });
  }

  return {
    from: periodStart,
    to: add(periodStart, {
      months: 1,
      seconds: -1,
    })
  };
}

export function dateFromNow(daysToAdd: number): Date {
  return add(getUTCNow(), {
    days: daysToAdd
  });
}

export function shortDate(date: Date) {
  return format(date, "yyyy-MM-dd");
}

export function toDisplayDate(
  date: string | Date,
  rft = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" }),
  firstNDays?: number,
): string {
  date = typeof date === "object" ? date : new Date(date);

  if (firstNDays && differenceInDays(new Date(), date) > firstNDays) {
    return format(date, date.getHours() === 0 && date.getMinutes() === 0 ? "yyyy-MM-dd" : "yyyy-MM-dd HH:mm");
  }

  const SECOND = 1000;
  const MINUTE = 60 * SECOND;
  const HOUR = 60 * MINUTE;
  const DAY = 24 * HOUR;
  const WEEK = 7 * DAY;
  const MONTH = 30 * DAY;
  const YEAR = 365 * DAY;
  const intervals = [
    { ge: YEAR, divisor: YEAR, unit: "year" },
    { ge: MONTH, divisor: MONTH, unit: "month" },
    { ge: WEEK, divisor: WEEK, unit: "week" },
    { ge: DAY, divisor: DAY, unit: "day" },
    { ge: HOUR, divisor: HOUR, unit: "hour" },
    { ge: MINUTE, divisor: MINUTE, unit: "minute" },
    { ge: 30 * SECOND, divisor: SECOND, unit: "seconds" },
    { ge: 0, divisor: 1, text: "just now" },
  ];
  // FIX: Aim to refactor to use UTC date everywhere instead of local
  const now = new Date().getTime();
  const diff = now - date.getTime();
  const diffAbs = Math.abs(diff);
  for (const interval of intervals) {
    if (diffAbs >= interval.ge) {
      const x = Math.round(Math.abs(diff) / interval.divisor);
      const isFuture = diff < 0;
      return interval.unit
        ? rft.format(isFuture ? x : -x, interval.unit as any)
        : (interval.text || "");
    }
  }
  return "unknown";
}

export function toLocalDate(UTCDate: Date) {
  return UTCDate && new Date(UTCDate.getUTCFullYear(), UTCDate.getUTCMonth(), UTCDate.getUTCDate());
}

export function toUTCDate(localDate: Date) {
  return localDate && new Date(Date.UTC(localDate.getFullYear(), localDate.getMonth(), localDate.getDate()));
}