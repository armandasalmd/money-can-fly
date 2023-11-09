import { add } from "date-fns";
import { FilterQuery } from "mongoose";

import { CookieUser } from "@server/core";
import { IUserSettingsModel, InsightsModel, TransactionModel, ImportModel, IImportModel } from "@server/models";
import { Currency, Money } from "@utils/Types";
import { CurrencyRateManager } from "./CurrencyRateManager";
import { round } from "@server/utils/Global";
import { capitalise } from "@utils/Global";
import { toDisplayDate, toUTCDate } from "@utils/Date";
import { PeriodPredictionManager } from "./PeriodPredictionManager";

export class InsightsManager {
  private defaultCurrency: Currency;

  constructor(private balanceSummary: Money) {}

  public async GetInsights(
    user: CookieUser,
    investmentValue: Money,
    settings: IUserSettingsModel
  ): Promise<InsightsModel> {
    this.defaultCurrency = settings.generalSection.defaultCurrency;
    const now = toUTCDate(new Date());

    const firstOfThisMonth = new Date(now);
    firstOfThisMonth.setUTCDate(1);
    firstOfThisMonth.setUTCHours(0, 0, 0, 0);

    const budgetResetDate = this.GetBugdetResetDate(settings);
    const previousMonth = add(now, { months: -1 });
    previousMonth.setUTCDate(1);
    previousMonth.setUTCHours(0, 0, 0, 0);

    const budgetStartDate = add(budgetResetDate, { months: -1 });
    const budgetDaysLeft = this.GetBudgetDaysLeft(budgetResetDate);
    const cashValue = this.balanceSummary;

    const [amountSpentThisPeriod, spentInLastWeek, lastMonthProfit, lastImportMessage, expectedSpendings] = await Promise.all([
      this.GetAmountChange(user, budgetStartDate, budgetResetDate, false),
      this.GetAmountChange(user, previousMonth, now, false),
      this.GetAmountChange(user, previousMonth, add(previousMonth, { months: 1, seconds: -1 }), true),
      this.GetLastImportSummary(user),
      settings.generalSection.monthlyBudgetStartDay === 1 ? new PeriodPredictionManager(user).GetTotalSpending([firstOfThisMonth], settings.generalSection.defaultCurrency) : Promise.resolve()
    ]);

    amountSpentThisPeriod.amount = -amountSpentThisPeriod.amount;
    spentInLastWeek.amount = -spentInLastWeek.amount;

    const budgetRemaining = {
      amount: settings.generalSection.monthlyBudget - amountSpentThisPeriod.amount,
      currency: this.defaultCurrency,
    };

    if (expectedSpendings && expectedSpendings[0]) {
        budgetRemaining.amount = expectedSpendings[0].amount - amountSpentThisPeriod.amount;
    }

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
      lastMonth: previousMonth.getFullYear() + " " + previousMonth.toLocaleString("default", { month: "long" }),
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
      isActive: true,
      isInvestment: {
        $ne: true,
      },
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

    const result: Money[] = await TransactionModel.aggregate([
      {
        $match: matcher,
      },
      {
        $group: {
          _id: "$currency",
          amount: {
            $sum: "$amount",
          },
        },
      },
      {
        $addFields: {
          currency: "$_id",
        }
      }
    ]);

    return await CurrencyRateManager.getInstance().sumMoney(result, this.defaultCurrency);
  }

  private GetBudgetDaysLeft(resetDate: Date): number {
    const date = new Date();
    date.setUTCHours(0, 0, 0, 0);

    return Math.round((resetDate.getTime() - date.getTime()) / 86400000);
  }

  private GetBugdetResetDate(settings: IUserSettingsModel): Date {
    let date = new Date();
    date.setDate(settings.generalSection.monthlyBudgetStartDay);
    date.setUTCHours(0, 0, 0, 0);

    return date.getDate() >= settings.generalSection.monthlyBudgetStartDay ? add(date, { months: 1 }) : date;
  }
}
