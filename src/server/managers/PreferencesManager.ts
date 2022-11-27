import { UserPreferencesModel, IUserPreferencesModel } from "@server/models";
import { CookieUser } from "@server/core";

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
        },
      },
      { upsert: true, new: true }
    );

    const newPreferences = preferences.toJSON<IUserPreferencesModel>();

    return newPreferences;
  }

  public async GetPreferences(user: CookieUser): Promise<IUserPreferencesModel> {
    return (
      (await UserPreferencesModel.findOne({ userUID: user.userUID }))?.toJSON<IUserPreferencesModel>() ||
      ({} as IUserPreferencesModel)
    );
  }
}
