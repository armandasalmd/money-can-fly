export interface BalanceAnalysisModel {
  errorMessage?: string;
  cardDescription: string;
  chartLabels: string[];
  totalWorthDataset: number[];
  projectionDataset: number[];
  expectedWorthDataset: number[];
  investmentsDataset: number[];
}
