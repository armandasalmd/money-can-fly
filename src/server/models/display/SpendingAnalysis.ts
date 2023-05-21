export interface MonthlySpendingDataset {
  label: string;
  budgetLimit: number;
  spendingLine: number[];
  dateLine: Date[];
}

export interface SpendingAnalysisModel {
  errorMessage?: string;
  cardDescription: string;
  datasets: MonthlySpendingDataset[];
}