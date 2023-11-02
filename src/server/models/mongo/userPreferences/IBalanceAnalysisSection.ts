import { ChartColor } from "@utils/Types";

export interface IBalanceAnalysisSection {
  forecastPivotDate: Date;
  forecastPivotValue: number;
  hideInvestmentsOnLoad: boolean;
  totalWorthColor: ChartColor;
  predictionColor: ChartColor;
  investmentColor: ChartColor;
  defaultDaysAfterNow: number;
  defaultDaysBeforeNow: number;
}