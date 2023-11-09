import { InvestmentSummary, Money } from "@utils/Types";

export interface InvestmentProfitChart {
  description: string;
  labels: string[];
  values: number[];
}

export interface InvestmentsModel {
  totalValue: Money;
  investments: InvestmentSummary[];
  profitChart: InvestmentProfitChart;
}
