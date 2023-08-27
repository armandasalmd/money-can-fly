export function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function round(num: number, precision = 2) {
  return parseFloat(num.toFixed(precision));
}

export function splitDateIntoEqualIntervals(start: Date, end: Date, numberOfIntervals: number, endOfDay = false) {
  const diff = end.getTime() - start.getTime();
  const intervalLength = diff / (numberOfIntervals - 1);
  const intervals = [start];

  for (let i = 1; i < numberOfIntervals; i++) {
    const d = new Date(start.getTime() + i * intervalLength);
    if (endOfDay) d.setUTCHours(23, 59, 59, 999);
    intervals.push(d);
  }

  return intervals;
}
