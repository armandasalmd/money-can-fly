import { IUserBalanceModel, UserBalanceModel, UserBalanceDocument } from "@server/models";
import { CookieUser } from "@server/core";

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
    return (
      (await UserBalanceModel.findOne({ userUID: user.userUID }))?.toJSON<IUserBalanceModel>() || null
    );
  }
}
