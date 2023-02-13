import { isDateString } from "class-validator";
import { CookieUser } from "@server/core";
import { CategoryAnalysisModel, TransactionModel } from "@server/models";
import { Currency, DateRange } from "@utils/Types";
import { capitalise } from "@utils/Global";
import { CurrencyRateManager } from "./CurrencyRateManager";
import { addMonths, endOfMonth, format } from "date-fns";
import { round } from "@server/utils/Global";

interface ICategorySummary {
  _id: string;
  totalUsd: number;
}

export class CategoryAnalysisManager {
  constructor(private defaultCurrency: Currency) {}

  public async GetCategoryAnalysis(user: CookieUser, dateRange: DateRange): Promise<CategoryAnalysisModel> {
    const avgMonthSetting = 3;

    if (dateRange?.from === undefined || dateRange.to === undefined) {
      return this.CreateError("Incorrect date passed in");
    }

    const [categorySummary, averageSummary] = await Promise.all([
      this.GetCategorySummaray(user, dateRange),
      this.GetCategorySummaray(user, this.GetRecentAverageDateRange(avgMonthSetting)),
    ]);
    const rateManager = CurrencyRateManager.getInstance();
    const labels = [];
    const values = [];
    const avgValues = [];

    for (const category of categorySummary) {
      labels.push(capitalise(category._id));
      values.push(await rateManager.convert(Math.abs(category.totalUsd), "USD", this.defaultCurrency));

      const avgCategory = averageSummary.find((x) => x._id === category._id);

      if (avgCategory) {
        const avgSum = await rateManager.convert(Math.abs(avgCategory.totalUsd), "USD", this.defaultCurrency);

        avgValues.push(round(avgSum / avgMonthSetting));
      } else {
        avgValues.push(NaN);
      }
    }

    return {
      chartLabels: labels,
      averageSpendingDataset: avgValues,
      cardDescription: `Statistics for ${format(new Date(dateRange.from), "MMMM yyyy")} in ${this.defaultCurrency}`,
      categorySpendingDataset: values,
    };
  }

  private GetRecentAverageDateRange(monthsToAverage: number): DateRange {
    const monthAgo = addMonths(new Date(), -1);
    const start = addMonths(monthAgo, -monthsToAverage + 1);

    return {
      from: new Date(start.getFullYear(), start.getMonth(), 1),
      to: endOfMonth(monthAgo),
    };
  }

  private async GetCategorySummaray(user: CookieUser, dateRange: DateRange): Promise<ICategorySummary[]> {
    const from = isDateString(dateRange.from) ? new Date(dateRange.from) : dateRange.from;
    const to = isDateString(dateRange.to) ? new Date(dateRange.to) : dateRange.to;

    return await TransactionModel.aggregate([
      {
        $match: {
          userUID: user.userUID,
          date: {
            $gte: from,
            $lte: to,
          },
          amount: {
            $lt: 0,
          },
          isActive: true,
          isInvestment: false
        },
      },
      {
        $project: {
          category: 1,
          usdValueWhenExecuted: 1,
        },
      },
      {
        $group: {
          _id: "$category",
          totalUsd: {
            $sum: "$usdValueWhenExecuted",
          },
        },
      },
      {
        $sort: {
          totalUsd: 1,
        },
      },
    ]);
  }

  private CreateError(error: string): CategoryAnalysisModel {
    return {
      errorMessage: error,
      averageSpendingDataset: [],
      cardDescription: "",
      categorySpendingDataset: [],
      chartLabels: [],
    };
  }
}
