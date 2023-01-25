import { Money } from "@utils/Types";

export interface InsightsModel {
  availableBalance: Money;
  spentInLastWeek: Money;
  lastMonthProfit: Money;
  lastMonth: string;
  budgetRemaining: Money;
  budgetResetDate: Date;
  budgetRecommendedPerDay: Money;
  budgetRecommendedDaysLeft: number;
  totalWorth: Money;
}
