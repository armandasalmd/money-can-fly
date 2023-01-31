export function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function round(num: number, precision = 2) {
  const factor = Math.pow(10, precision);
  return Math.round(num * factor) / factor;
}

export function splitDateIntoEqualIntervals(start: Date, end: Date, numberOfIntervals: number) {
  const diff = end.getTime() - start.getTime();
  const intervalLength = diff / (numberOfIntervals - 1);
  const intervals = [start];

  for (let i = 1; i < numberOfIntervals; i++) intervals.push(new Date(start.getTime() + i * intervalLength));

  return intervals;
}
