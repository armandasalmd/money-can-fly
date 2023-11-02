// x and y object names were chosen over "time" and "value" to make response payload smaller
export interface BalanceChartPoint {
  x: number; // Point date - time post 1970 Jan 1
  y: number; // Balance value
}