import { format, getDaysInMonth } from "date-fns";

import { CookieUser } from "@server/core";
import { CurrencyRateManager, PeriodPredictionManager } from "@server/managers";
import {
  IUserPreferencesModel,
  MonthlySpendingDataset,
  SpendingAnalysisModel,
  TransactionModel,
} from "@server/models";
import { splitDateIntoEqualIntervals } from "@server/utils/Global";
import { amountForDisplay } from "@utils/Currency";
import { getLast } from "@utils/Global";
import { DateRange, Money } from "@utils/Types";

interface IMonthDatasetBucket {
  dateFrom: Date;
  usdSpent: number;
}

interface IMonthDataset {
  breakpoints: Date[];
  buckets: IMonthDatasetBucket[];
}

export class SpendingAnalysisManager {
  constructor(private user: CookieUser, private prefs: IUserPreferencesModel) {}

  public async Calculate(ranges: DateRange[]): Promise<SpendingAnalysisModel> {
    ranges = this.CleanupDateRanges(ranges);

    if (ranges.length === 0) {
      return this.ErrorMessage("Please select at least a single dataset");
    }

    const bucketsCount = ranges.length === 1
      ? getDaysInMonth(ranges[0].from)
      : 30 / ranges.length;
    const budgetsTask = this.MakeBudgetLimits(ranges);
    const datasetsTask = Promise.all(
      ranges.map((o) => this.FetchMonthDataset(o, bucketsCount)),
    );
    const [budgets, monthDatasets] = await Promise.all([
      budgetsTask,
      datasetsTask,
    ]);

    const resultDatasets: MonthlySpendingDataset[] = [];

    for (let i = 0; i < ranges.length; i++) {
      resultDatasets.push(
        await this.ToFinalDataset(
          monthDatasets[i],
          budgets[i],
          i === ranges.length - 1,
        ),
      );
    }

    return {
      cardDescription: this.GetCardDescription(resultDatasets),
      datasets: resultDatasets,
    };
  }

  private CleanupDateRanges(array: DateRange[]): DateRange[] {
    array = array?.filter((o) => o && o.from && o.to) ?? [];

    const uniqueDates = new Set();
    const result = [];

    for (let i = 0; i < array.length; i++) {
      if (!uniqueDates.has(array[i].from)) {
        uniqueDates.add(array[i].from);
        result.push(array[i]);
      }
    }

    return result.map((o) => ({
      from: new Date(o.from),
      to: new Date(o.to),
    }));
  }

  private ErrorMessage(message: string): SpendingAnalysisModel {
    return {
      cardDescription: this.GetCardDescription([]),
      datasets: [],
      errorMessage: message,
    };
  }

  private async FetchMonthDataset(
    dateRange: DateRange,
    bucketsCount: number,
  ): Promise<IMonthDataset> {
    const breakpoints: Date[] = splitDateIntoEqualIntervals(
      dateRange.from,
      dateRange.to,
      bucketsCount,
      true,
    );
    const buckets = await TransactionModel.aggregate<IMonthDatasetBucket>([
      {
        $match: {
          userUID: this.user.userUID,
          isInvestment: false,
          isActive: true,
          amount: { $lt: 0 },
          date: { $gte: dateRange.from, $lte: dateRange.to },
        },
      },
      {
        $bucket: {
          groupBy: "$date",
          boundaries: breakpoints,
          output: {
            usdSpent: { $sum: "$usdValueWhenExecuted" },
          },
        },
      },
      {
        $addFields: {
          dateFrom: "$_id",
          usdSpent: { $abs: "$usdSpent" },
        },
      },
    ]);

    return {
      buckets,
      breakpoints,
    };
  }

  private GetCardDescription(datasets: MonthlySpendingDataset[]): string {
    if (!datasets?.length) {
      return "No data selected";
    } else if (datasets.length === 1) {
      return `Money spent ${
        amountForDisplay({
          amount: getLast(datasets[0].spendingLine),
          currency: this.prefs.defaultCurrency,
        })
      } (${datasets[0].label})`;
    } else {
      const average = datasets.reduce((acc, current) =>
        acc + getLast(current.spendingLine), 0) / datasets.length;

      return `On average spent ${
        amountForDisplay({
          amount: average,
          currency: this.prefs.defaultCurrency,
        })
      }`;
    }
  }

  private async MakeBudgetLimits(ranges: DateRange[]): Promise<number[]> {
    const predictionManager = new PeriodPredictionManager(this.user);
    const predictions = await predictionManager.GetTotalSpending(
      ranges.map((o) => o.from),
      this.prefs.defaultCurrency
    );
    const budgets: number[] = [];

    for (const range of ranges) {
      const pred: Money = predictions.find((p) =>
        p.monthDate.getTime() === range.from.getTime()
      );

      if (pred) {
        budgets.push(pred.amount);
      } else {
        budgets.push(this.prefs.monthlyBudget);
      }
    }

    return budgets;
  }

  private async ToFinalDataset(
    dataset: IMonthDataset,
    budgetLimit: number,
    isLast: boolean,
  ): Promise<MonthlySpendingDataset> {
    if (!dataset?.breakpoints?.length) return null;

    const rateManager = CurrencyRateManager.getInstance();
    const spendingLine: number[] = [0];
    const dateLine: Date[] = [dataset.breakpoints[0] ?? new Date()];
    let value = 0;

    for (let i = 1; i < dataset.breakpoints.length; i++) {
      const breakpoint = dataset.breakpoints[i];
      value = dataset.buckets.filter((o) =>
        o.dateFrom.getTime() < breakpoint.getTime()
      ).reduce((acc, b) => acc + b.usdSpent, 0);
      value = await rateManager.convert(value, "USD", this.prefs.defaultCurrency);

      spendingLine.push(value);
      dateLine.push(breakpoint);
    }

    if (!isLast) {
      spendingLine.push(value);
    }

    return {
      budgetLimit,
      label: format(dataset.breakpoints[0], "yyyy MMMM"),
      dateLine,
      spendingLine,
    };
  }
}
