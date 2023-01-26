import { IUserBalanceModel, UserBalanceModel, UserBalanceDocument } from "@server/models";
import { CookieUser } from "@server/core";
import { Currency, Money } from "@utils/Types";
import { CurrencyRateManager } from "./CurrencyRateManager";

export class BalanceManager {
  public async UpdateBalances(model: IUserBalanceModel, user: CookieUser): Promise<IUserBalanceModel> {
    const existing = await UserBalanceModel.findOne({ userUID: user.userUID });
    let result: UserBalanceDocument = null;

    if (existing) {
      if (model) {
        if (model.balances) {
          existing.balances = model.balances;
        }

        result = await existing.save();
      }
    } else {
      result = await UserBalanceModel.create(model);
    }

    return result.toJSON<IUserBalanceModel>();
  }

  public async GetBalances(user: CookieUser): Promise<IUserBalanceModel> {
    return (await UserBalanceModel.findOne({ userUID: user.userUID }))?.toJSON<IUserBalanceModel>() || null;
  }

  public async CommitMoney(user: CookieUser, money: Money): Promise<boolean> {
    const balances = await UserBalanceModel.findOne({ userUID: user.userUID });

    if (!balances) {
      return false;
    }

    const existing = balances.balances[money.currency];

    if (!existing) {
      return false;
    }

    existing.amount += money.amount;
    await balances.save();

    return true;
  }

  public async GetBalanceSummary(user: CookieUser, currency: Currency): Promise<Money> {
    const balances = await this.GetBalances(user);
    const rateManager = CurrencyRateManager.getInstance();
    const total: Money = {
      amount: 0,
      currency,
    };

    for (const item of Object.values(balances.balances)) {
      total.amount += await rateManager.convert(item.amount, item.currency, currency);
    }

    return total;
  }
}