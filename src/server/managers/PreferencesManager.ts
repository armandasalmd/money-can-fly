import { UserPreferencesModel, IUserPreferencesModel } from "@server/models";
import { CookieUser } from "@server/core";
import { Currency } from "@utils/Types";

export class PreferencesManager {
  public async UpdatePreferences(model: IUserPreferencesModel, user: CookieUser): Promise<IUserPreferencesModel> {
    const preferences = await UserPreferencesModel.findOneAndUpdate(
      { userUID: user.userUID },
      {
        $set: {
          userUID: user.userUID,
          defaultCurrency: model.defaultCurrency,
          monthlyBudget: model.monthlyBudget,
          monthlyBudgetStartDay: model.monthlyBudgetStartDay,
          balanceChartBreakpoints: model.balanceChartBreakpoints,
          forecastPivotDate: model.forecastPivotDate,
          forecastPivotValue: model.forecastPivotValue,
        },
      },
      { upsert: true, new: true }
    );

    return preferences.toJSON<IUserPreferencesModel>();
  }

  public InitPreferences(user: CookieUser): Promise<IUserPreferencesModel> {
    return this.UpdatePreferences({
      userUID: user.userUID,
      defaultCurrency: "USD",
      monthlyBudget: 0,
      monthlyBudgetStartDay: 1,
      balanceChartBreakpoints: 12,
      forecastPivotDate: new Date(),
      forecastPivotValue: 0,
    }, user);
  }

  public async GetPreferences(user: CookieUser): Promise<IUserPreferencesModel> {
    const result = await UserPreferencesModel.findOne({ userUID: user.userUID });

    if (!result) {
      return this.InitPreferences(user);
    }

    return result.toJSON<IUserPreferencesModel>();
  }

  public async GetDefaultCurrency(user: CookieUser): Promise<Currency> {
    const preferences = await UserPreferencesModel.findOne(
      { userUID: user.userUID },
      {
        defaultCurrency: 1,
      }
    );

    return preferences?.defaultCurrency || "USD";
  }
}
