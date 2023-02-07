import { CookieUser } from "@server/core";
import { UserPreferencesModel, IUserPreferencesModel } from "@server/models";

export class PreferencesManager {
  public constructor(private user: CookieUser) {}

  public async UpdatePreferences(model: IUserPreferencesModel): Promise<IUserPreferencesModel> {
    const preferences = await UserPreferencesModel.findOneAndUpdate(
      { userUID: this.user.userUID },
      {
        $set: {
          ...model,
          userUID: this.user.userUID,
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
