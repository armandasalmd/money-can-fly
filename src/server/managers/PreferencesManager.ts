import { UserPreferencesModel, IUserPreferencesModel } from "@server/models";
import { CookieUser } from "@server/core";

export class PreferencesManager {

  public constructor(private user: CookieUser) {}

  public async UpdatePreferences(model: IUserPreferencesModel): Promise<IUserPreferencesModel> {
    const preferences = await UserPreferencesModel.findOneAndUpdate(
      { userUID: this.user.userUID },
      {
        $set: {
          userUID: this.user.userUID,
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

  private InitPreferences(): Promise<IUserPreferencesModel> {
    return this.UpdatePreferences({
      userUID: this.user.userUID,
      defaultCurrency: "USD",
      monthlyBudget: 0,
      monthlyBudgetStartDay: 1,
      balanceChartBreakpoints: 12,
      forecastPivotDate: new Date(),
      forecastPivotValue: 0,
    });
  }

  public async GetPreferences(): Promise<IUserPreferencesModel> {
    const result = await UserPreferencesModel.findOne({ userUID: this.user.userUID });
    if (!result) return this.InitPreferences();

    return result.toJSON<IUserPreferencesModel>();
  }
}
