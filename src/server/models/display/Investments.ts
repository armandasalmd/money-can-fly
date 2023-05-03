import { Investment, Money } from "@utils/Types";

export interface InvestmentProfitChart {
  description: string;
  labels: string[];
  values: number[];
}

export interface InvestmentsModel {
  totalValue: Money;
  investments: Investment[];
  profitChart: InvestmentProfitChart;
}
