import { CookieUser } from "@server/core";
import { CategoryAnalysisModel } from "@server/models";
import { Currency, DateRange } from "@utils/Types";

export class CategoryAnalysisManager {
  constructor(private defaultCurrency: Currency) {}

  public GetCategoryAnalysis(user: CookieUser, dateRange: DateRange): Promise<CategoryAnalysisModel> {
    return Promise.resolve(null);
  }
}
