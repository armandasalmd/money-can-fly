import { atom } from "recoil";
import { DateRange, MonthPrediction, WeekPrediction } from "@utils/Types";
import { getOneMonthRange } from "@utils/Date";

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

export function getDefaultForm(period?: DateRange): MonthPrediction {
  return {
    period: period || getOneMonthRange(),
    currency: "GBP",
    predictions: getDefaultWeekPredictions(),
  };
}

export const monthPredictionFormState = atom<MonthPrediction>({
  key: "monthPredictionForm",
  default: getDefaultForm()
});

export const editorChartToolState = atom<MonthPrediction | null>({
  key: "editorChartTool",
  default: null
});

export const chartToolState = atom<MonthPrediction | null>({
  key: "chartTool",
  default: null
});