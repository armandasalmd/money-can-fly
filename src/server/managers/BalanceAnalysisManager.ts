import { CookieUser } from "@server/core";
import { BalanceAnalysisModel } from "@server/models";
import { Currency, DateRange } from "@utils/Types";

export class BalanceAnalysisManager {
  constructor(private defaultCurrency: Currency) {}

  public async GetBalanceAnalysis(user: CookieUser, dateRange: DateRange): Promise<BalanceAnalysisModel> {
    return {
      cardDescription: "£59.21 (19.2%) above expected",
      chartLabels: ["Oct 1", "Oct 2", "Oct 3", "Oct 4", "Oct 5", "Oct 6", "Oct 7", "Oct 8", "Oct 9", "Oct 10", "Oct 11", "Oct 12"],
      expectedWorthDataset: [500, 100, 200, 300, 400, 500, 600, 700, 800, 850, 658, 1000],
      investmentsDataset: [0, 200, 300, 312, 296, 264, 301, 312, 285, 386, 400, 285],
      projectionDataset: [NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, 1200, 1250, 1300, 1400],
      totalWorthDataset: [400, 500, 600, 700, 800, 900, 1000, 1250, 1200, NaN, NaN, NaN],
    };
  }
}
