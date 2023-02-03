import { add } from "date-fns";
import { FilterQuery } from "mongoose";

import { CookieUser } from "@server/core";
import { IUserPreferencesModel, InsightsModel, TransactionModel, ImportModel, IImportModel } from "@server/models";
import { Currency, Money } from "@utils/Types";
import { CurrencyRateManager } from "./CurrencyRateManager";
import { round } from "@server/utils/Global";
import { capitalise, toDisplayDate } from "@utils/Global";

export class InsightsManager {
  private defaultCurrency: Currency;

  constructor(private balanceSummary: Money) {}

  public async GetInsights(
    user: CookieUser,
    investmentValue: Money,
    prefs: IUserPreferencesModel
  ): Promise<InsightsModel> {
    this.defaultCurrency = prefs.defaultCurrency;

    const budgetResetDate = this.GetBugdetResetDate(prefs);
    const lastMonth = add(new Date(), { months: -1 });

    lastMonth.setDate(1);
    lastMonth.setHours(0, 0, 0, 0);

    const budgetStartDate = add(budgetResetDate, { months: -1 });
    const budgetDaysLeft = this.GetBudgetDaysLeft(budgetResetDate);
    const cashValue = this.balanceSummary;

    const [amountSpentThisPeriod, spentInLastWeek, lastMonthProfit, lastImportMessage] = await Promise.all([
      this.GetAmountChange(user, budgetStartDate, budgetResetDate, false),
      this.GetAmountChange(user, add(new Date(), { weeks: -1 }), new Date(), false),
      this.GetAmountChange(user, lastMonth, add(lastMonth, { months: 1, seconds: -1 }), true),
      this.GetLastImportSummary(user),
    ]);

    amountSpentThisPeriod.amount = -amountSpentThisPeriod.amount;
    spentInLastWeek.amount = -spentInLastWeek.amount;

    const budgetRemaining = {
      amount: prefs.monthlyBudget - amountSpentThisPeriod.amount,
      currency: this.defaultCurrency,
    };

    return {
      availableBalance: cashValue,
      totalWorth: {
        amount: cashValue.amount + investmentValue.amount,
        currency: this.defaultCurrency,
      },
      spentInLastWeek,
      budgetRecommendedDaysLeft: budgetDaysLeft,
      budgetRecommendedPerDay:
        budgetDaysLeft === 0
          ? budgetRemaining
          : {
              amount: round(budgetRemaining.amount / budgetDaysLeft),
              currency: this.defaultCurrency,
            },
      budgetRemaining,
      budgetResetDate,
      lastMonth: lastMonth.getFullYear() + " " + lastMonth.toLocaleString("default", { month: "long" }),
      lastMonthProfit,
      lastImportMessage,
    };
  }

  private async GetLastImportSummary(user: CookieUser): Promise<string> {
    const lastImport: IImportModel = await ImportModel.findOne({ userUID: user.userUID }).sort({ date: -1 });

    if (!lastImport) {
      return "No imports yet";
    } else if (lastImport.importState === "error") {
      return `Failed to import ${capitalise(lastImport.source)} ${toDisplayDate(lastImport.date)}`;
    } else {
      return `${capitalise(lastImport.source)} import ${toDisplayDate(lastImport.date)}. ${lastImport.message}`;
    }
  }

  private async GetAmountChange(user: CookieUser, from: Date, to: Date, includeIncome: boolean): Promise<Money> {
    const matcher: FilterQuery<any> = {
      userUID: user.userUID,
      isDeleted: false,
      date: {
        $gte: from,
        $lte: to,
      },
    };

    if (!includeIncome) {
      matcher.amount = {
        $lt: 0,
      };
    }

    const result = await TransactionModel.aggregate([
      {
        $match: matcher,
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$usdValueWhenExecuted",
          },
        },
      },
    ]);

    const rateManager = CurrencyRateManager.getInstance();

    return {
      amount: await rateManager.convert(result[0]?.total ?? 0, "USD", this.defaultCurrency),
      currency: this.defaultCurrency,
    };
  }

  private GetBudgetDaysLeft(resetDate: Date): number {
    const date = new Date();
    date.setHours(0, 0, 0, 0);

    return Math.round((resetDate.getTime() - date.getTime()) / 86400000);
  }

  private GetBugdetResetDate(prefs: IUserPreferencesModel): Date {
    let date = new Date();
    date.setDate(prefs.monthlyBudgetStartDay);
    date.setHours(0, 0, 0, 0);

    return date.getDate() >= prefs.monthlyBudgetStartDay ? add(date, { months: 1 }) : date;
  }
}
