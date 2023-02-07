import { CookieUser } from "@server/core";
import { IImportSettingsModel, ImportSettingsModel, defaultCategoryFallbacks } from "@server/models";

export class ImportSettingsManager {
  public constructor(private user: CookieUser) {}

  public async UpdateSettings(model: Omit<IImportSettingsModel, "userUID">): Promise<IImportSettingsModel> {
    const preferences = await ImportSettingsModel.findOneAndUpdate(
      { userUID: this.user.userUID },
      {
        $set: {
          ...model,
          userUID: this.user.userUID,
        },
      },
      { upsert: true, new: true }
    );

    return preferences.toJSON<IImportSettingsModel>();
  }

  private InitSettings(): Promise<IImportSettingsModel> {
    return this.UpdateSettings({
      ignoreTerms: [],
      categoryFallbacks: defaultCategoryFallbacks,
    });
  }

  public async GetSettings(): Promise<IImportSettingsModel> {
    const result = await ImportSettingsModel.findOne({ userUID: this.user.userUID });
    if (!result) return this.InitSettings();

    return result.toJSON<IImportSettingsModel>();
  }
}
