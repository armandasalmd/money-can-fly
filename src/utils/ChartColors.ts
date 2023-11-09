import { ChartColor } from "./Types";

const chartColors: Record<ChartColor, string> = {
  blue: "rgb(54, 162, 235)",
  green: "rgb(75, 192, 192)",
  grey: "rgb(201, 203, 207)",
  orange: "rgb(255, 159, 64)",
  purple: "rgb(153, 102, 255)",
  red: "rgb(255, 99, 132)",
  yellow: "rgb(255, 205, 86)"
};

export function getBorderColor(color: ChartColor) {
  return chartColors[color];
}

export function getBackgroundColor(color: ChartColor, opacity: number = 0.1) {
  let value = chartColors[color];

  return value.substring(0, value.length - 1) + `, ${opacity})`;
}