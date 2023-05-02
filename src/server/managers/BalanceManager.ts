import { IUserBalanceModel, UserBalanceModel, UserBalanceDocument } from "@server/models";
import { CookieUser } from "@server/core";
import { Currency, Money } from "@utils/Types";
import { CurrencyRateManager } from "./CurrencyRateManager";
import constants from "@server/utils/Constants";

export class BalanceManager {

  constructor(private user: CookieUser) {}

  public async UpdateBalances(model: IUserBalanceModel): Promise<IUserBalanceModel> {
    const existing = await UserBalanceModel.findOne({ userUID: this.user.userUID });
    let result: UserBalanceDocument = null;

    if (existing) {
      if (model && model.balances) {
        existing.balances = model.balances;

        result = await existing.save();
      }
    } else {
      result = await UserBalanceModel.create(model);
    }

    return result?.toJSON<IUserBalanceModel>();
  }

  private InitBalances(): Promise<IUserBalanceModel> {
    const result: IUserBalanceModel = {
      balances: {} as any,
      userUID: this.user.userUID,
    };

    for (const currency of Object.values<Currency>(constants.allowed.currencies as [Currency])) {
      result.balances[currency] = {
        amount: 0,
        currency,
      };
    }

    return this.UpdateBalances(result);
  }

  public async GetBalances(): Promise<IUserBalanceModel> {
    const result = await UserBalanceModel.findOne({ userUID: this.user.userUID });
    if (!result) return this.InitBalances();

    return result.toJSON<IUserBalanceModel>();
  }

  public async CommitMoney(money: Money): Promise<boolean> {
    if (money === null || typeof money !== "object") return false;
    console.log("CMM", money);
    const update = await UserBalanceModel.updateOne({
      userUID: this.user.userUID,
    }, {
      $inc: {
        [`balances.${money.currency}.amount`]: money.amount,
      },
    }, { upsert: true });

    return update.modifiedCount > 0;
  }

  public async CommitMixedMoneyList(moneyList: Money[]): Promise<boolean> {
    if (!moneyList || !Array.isArray(moneyList)) return false;
    if (moneyList.length === 0) return true;

    const update = await UserBalanceModel.updateOne({
      userUID: this.user.userUID,
    }, {
      $inc: moneyList.reduce((prev, curr) => {
        const key = `balances.${curr.currency}.amount`;
        prev[key] = prev[key] ? prev[key] + curr.amount : curr.amount;

        return prev;
      }, {} as any),
    }, { upsert: true });

    return update.modifiedCount > 0;
  }

  public async GetBalanceSummary(currency: Currency): Promise<Money> {
    const balances = await this.GetBalances();
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
