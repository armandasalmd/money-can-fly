export function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function findIndexBackwards<T>(
  arr: T[],
  callback: (element: T, index: number, array: T[]) => boolean
): number {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (callback(arr[i], i, arr)) {
      return i;
    }
  }
  return -1;
}

export function getLast<T>(array: T[]): T {
  return Array.isArray(array) ? array[array.length - 1] : null;
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
