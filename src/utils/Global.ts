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
): string {
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
  const diff = now -
    (typeof date === "object" ? date : new Date(date)).getTime();
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