import { ChartColor } from "@utils/Types";

export interface IBalanceAnalysisSection {
  defaultDaysAfterNow: number;
  defaultDaysBeforeNow: number;
  forecastPivotDate: Date;
  forecastPivotValue: number;
  hideInvestmentsOnLoad: boolean;
  investmentColor: ChartColor;
  predictionColor: ChartColor;
  totalWorthColor: ChartColor;
}