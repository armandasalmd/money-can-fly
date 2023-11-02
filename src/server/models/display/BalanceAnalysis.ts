import { BalanceChartPoint } from "./BalanceChartPoint";

export interface BalanceAnalysisModel {
  errorMessage?: string;
  cardDescription: string;
  balanceDataset: BalanceChartPoint[];
  expectationDataset: BalanceChartPoint[];
  investmentDataset: BalanceChartPoint[];
}
