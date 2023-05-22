import { IconProps } from "phosphor-react";
import { add, differenceInDays, format, startOfMonth } from "date-fns";
import { CheckState, DateRange } from "./Types";

export function toCheckState(value: boolean | null): CheckState {
  if (value === null) return "indeterminate";
  return value ? "checked" : "unchecked";
}

export function callIfFunction(...args: any[]) {
  if (typeof args[0] === "function") {
    args[0](...args.splice(1));
  }
}

export function getValue(
  target: any,
  path: string,
  defaultValue: any,
  pathSeparator = ".",
) {
  if (!target || typeof path !== "string") {
    return defaultValue;
  } else {
    return path
      .split(pathSeparator)
      .reduce((p, c) => (p && p[c]) || defaultValue, target);
  }
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

export function dateFromNow(daysToAdd: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + daysToAdd);
  return date;
}

export function dateString(date: Date) {
  if (date instanceof Date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${year}.${month}.${day}`;
  }
}

export function capitalise(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const iconOptions: IconProps = {
  weight: "bold",
  size: 20,
  color: "var(--shade40)",
};

export function getDateRange(periodStart: Date = new Date(), monthsToAdd: number = 0): DateRange {
  if (monthsToAdd !== 0) {
    periodStart = add(periodStart, {
      months: monthsToAdd
    });
  }
  
  periodStart.setUTCDate(1);
  periodStart.setUTCHours(0,0,0,0);

  return {
    from: periodStart,
    to: add(periodStart, {
      months: 1,
      days: -1,
    })
  };
}

export function getPeriodNow(): DateRange {
  return getDateRange();
}

export function getImportTitle(item: {source: string, date: string | Date}): string {
  if (!item) return "";
  return `${capitalise(item?.source)} - ${format(
    typeof item.date === "string" ? new Date(item.date) : item.date,
    "dd/MM/yyyy HH:mm"
  )}`;
}

export function getUTCNow(overrideDay?: number): Date {
  const now = new Date();
  now.setUTCHours(0,0,0,0);
  if (overrideDay) now.setUTCDate(overrideDay);
  return now;
}

export function getLast<T>(array: T[]): T {
  return Array.isArray(array) ? array[array.length - 1] : null;
}