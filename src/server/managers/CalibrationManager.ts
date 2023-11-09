import { AvailableFixesResponse } from "@endpoint/calibrate/availableFixes";
import { CookieUser } from "@server/core";
import constants from "@server/utils/Constants";
import { round } from "@server/utils/Global";
import { CalibrateCurrencyRow, ExchangeFix, Money } from "@utils/Types";
import { BalanceManager } from "./BalanceManager";
import { CurrencyRateManager } from "./CurrencyRateManager";
import { TransactionManager } from "./TransactionManager";

export class CalibrationManager {


  public constructor(private readonly user: CookieUser) {}

  public async GetAvailableFixes(targets: CalibrateCurrencyRow[]): Promise<AvailableFixesResponse> {
    
    if (!targets.length || targets.length > constants.allowed.currencies.length) {
      return {
        exchangeFixes: [],
        trendFixes: []
      };
    }
    
    const trendFixes = targets.filter(o => o.status === "fail").map(o => ({
      amount: round(o.target.amount - o.inApp.amount),
      currency: o.inApp.currency
    })).filter(o => o.amount);

    return {
      trendFixes,
      exchangeFixes: await this.GetExchangeFixes(trendFixes)
    };
  }

  public async ApplyExchangeFix(data: ExchangeFix): Promise<boolean> {
    data.rateDate = data.rateDate ? new Date(data.rateDate) : new Date();

    const balanceManager = new BalanceManager(this.user);
    const exchangeTo = await CurrencyRateManager.getInstance().convertMoney(data.from, data.to.currency, data.rateDate);
    const model = await balanceManager.GetBalances();

    model.balances[data.to.currency].amount += Math.abs(exchangeTo.amount);
    model.balances[data.from.currency].amount -= Math.abs(data.from.amount);

    return !!await balanceManager.UpdateBalances(model.balances);
  }

  public async ApplyTrendFix(trend: Money): Promise<boolean> {
    return !!await new TransactionManager(this.user).CreateTransaction({
      ...trend,
      category: trend.amount < 0 ? "trendDown" : "trendUp",
      date: new Date(),
      description: `Balance ${trend.amount < 0 ? "down" : "up"}`,
      source: "cash",
      alterBalance: true
    });
  }

  private async GetExchangeFixes(trendFixes: Money[]): Promise<ExchangeFix[]> {
    if (trendFixes.length < 2) return [];

    const positives = trendFixes.filter(o => o.amount > 0);
    const negatives: Money[] = trendFixes.filter(o => o.amount < 0).map(o => ({
      amount: round(Math.abs(o.amount)),
      currency: o.currency
    }));

    if (positives.length === trendFixes.length || negatives.length === trendFixes.length) return [];

    // at least 1 positive and 1 negative exists
    const rateManager = CurrencyRateManager.getInstance();
    const now = new Date();

    let results: ExchangeFix[] = [];

    for (const negative of negatives) {
      for (const positive of positives) {
        const counterNegative = await rateManager.convertMoney(negative, positive.currency, now);
        const exchangeTo = {
          amount: Math.min(counterNegative.amount, positive.amount),
          currency: positive.currency
        };

        results.push({
          from: await rateManager.convertMoney(exchangeTo, negative.currency),
          rateDate: now,
          to: exchangeTo
        });
      }
    }

    return results;
  }

}