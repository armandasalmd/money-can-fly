import { CookieUser } from "@server/core";
import { ITransactionModel, InsightsModel, TransactionModel } from "@server/models";
import { BalanceManager } from "./BalanceManager";
import { Currency, Money } from "@utils/Types";
import { CurrencyRateManager } from "./CurrencyRateManager";

export class InsightsManager {
  constructor(private defaultCurrency: Currency) {}

  public async GetInsights(user: CookieUser, investmentValue: Money): Promise<InsightsModel> {
    const balanceManager = new BalanceManager();
    
    // TODO: join Promises to .All

    const cashValue = await balanceManager.GetBalanceSummary(user, this.defaultCurrency);
    const mockMoney = {
      amount: 0,
      currency: this.defaultCurrency
    };

    return {
      availableBalance: cashValue,
      totalWorth: {
        amount: cashValue.amount + investmentValue.amount,
        currency: this.defaultCurrency
      },
      spentInLastWeek: await this.GetSpentInLastWeek(user),
      budgetRecommendedDaysLeft: 0,
      budgetRecommendedPerDay: mockMoney,
      budgetRemaining: mockMoney,
      budgetResetDate: new Date(),
      lastMonth: "",
      lastMonthProfit: mockMoney
    };
  }

  private async GetSpentInLastWeek(user: CookieUser): Promise<Money> {
    const rateManager = CurrencyRateManager.getInstance();
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const transactions = await TransactionModel.find({
      userUID: user.userUID,
      amount: {
        $lt: 0
      },
      date: {
        $gte: lastWeek,
        $lte: new Date()
      }
    }, {
      amount: 1,
      currency: 1,
      date: 1
    });

    let total = 0;

    for (const transaction of transactions) {
      total += await rateManager.convert(transaction.amount, transaction.currency, this.defaultCurrency, transaction.date);
    }

    return {
      amount: total,
      currency: this.defaultCurrency
    };
  }
}
