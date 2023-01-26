import { CookieUser } from "@server/core";
import { CategoryAnalysisModel } from "@server/models";
import { Currency, DateRange } from "@utils/Types";
import constants from "@server/utils/Constants";

export class CategoryAnalysisManager {
  constructor(private defaultCurrency: Currency) {}

  public async GetCategoryAnalysis(user: CookieUser, dateRange: DateRange): Promise<CategoryAnalysisModel> {
    return {
      chartLabels: constants.negativeCategories,
      averageSpendingDataset: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100],
      cardDescription: "Statistics for 2024 October",
      categorySpendingDataset: [200, 300, 400, 500, 600, 700, 800, NaN, 1000, NaN, 1200]
    };
  }
}
