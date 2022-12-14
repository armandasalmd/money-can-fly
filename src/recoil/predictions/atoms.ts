import { atom } from "recoil";
import { MonthPrediction, WeekPrediction } from "@utils/Types";
import { getPeriodNow } from "@utils/Global";

export function getDefaultWeekPredictions(): WeekPrediction[] {
  const weeks: WeekPrediction[] = [];

  for (let i = 1; i <= 4; i++) {
    weeks.push({
      label: `Day ${(i - 1) * 7 + 1} - ${i * 7}`,
      week: i,
      moneyIn: 0,
      moneyOut: 0,
    });
  }

  weeks.push({
    label: "Day 29 - End",
    week: 5,
    moneyIn: 0,
    moneyOut: 0,
  });

  return weeks;
}

export const monthPredictionFormState = atom<MonthPrediction>({
  key: "monthPredictionForm",
  default: {
    period: getPeriodNow(),
    currency: "GBP",
    predictions: getDefaultWeekPredictions(),
  }
});

export const editorChartToolState = atom<MonthPrediction | null>({
  key: "editorChartTool",
  default: null
});

export const chartToolState = atom<MonthPrediction | null>({
  key: "chartTool",
  default: null
});