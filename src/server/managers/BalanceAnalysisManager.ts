import { CookieUser } from "@server/core";
import { BalanceAnalysisModel } from "@server/models";
import { Currency, DateRange } from "@utils/Types";

export class BalanceAnalysisManager {
  constructor(private defaultCurrency: Currency) {}

  public GetBalanceAnalysis(user: CookieUser, dateRange: DateRange): Promise<BalanceAnalysisModel> {
    return Promise.resolve(null);
  }
}
