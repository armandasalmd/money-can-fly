import { CookieUser } from "@server/core";
import { IBalanceAnalysisSection, IGeneralSection, IUserSettingsModel, UserSettingsDocument, UserSettingsModel } from "@server/models";
import { round } from "@server/utils/Global";
import { Currency } from "@utils/Types";

export class UserSettingsManager {
  public constructor(private user: CookieUser) {}

  public async GetDefaultCurrency(): Promise<Currency> {
    const result: Partial<IUserSettingsModel> = await UserSettingsModel.findOne({ userUID: this.user.userUID }, { "generalSection.defaultCurrency": 1 });

    return result?.generalSection?.defaultCurrency ?? null;
  }

  private InitGeneralSection(): Promise<IGeneralSection> {
    return this.UpdateGeneralSection({
      defaultCurrency: "USD",
      monthlyBudget: 0,
      monthlyBudgetStartDay: 1,
    });
  }

  private InitBalanceAnalysisSection(): Promise<IBalanceAnalysisSection> {
    return this.UpdateBalanceAnalysisSection({
      defaultDaysAfterNow: 30,
      defaultDaysBeforeNow: 60,
      forecastPivotDate: new Date(),
      forecastPivotValue: 0,
      hideInvestmentsOnLoad: false,
      investmentColor: "yellow",
      predictionColor: "grey",
      totalWorthColor: "blue",
    });
  }

  public async MultiplyForecastPivotValue(multiplier: number): Promise<void> {
    const result: UserSettingsDocument = await UserSettingsModel.findOne({ userUID: this.user.userUID }, { balanceAnalysisSection: 1 });

    if (result?.balanceAnalysisSection) {
      result.balanceAnalysisSection.forecastPivotValue = round(result.balanceAnalysisSection.forecastPivotValue * multiplier);
      await result.save();
    }
  }

  public async ReadFull(): Promise<IUserSettingsModel> {
    const result = await UserSettingsModel.findOne({ userUID: this.user.userUID });

    if (!result) {
      return {
        balanceAnalysisSection: await this.InitBalanceAnalysisSection(),
        generalSection: await this.InitGeneralSection(),
        userUID: this.user.userUID
      };
    }
    
    return result.toJSON<IUserSettingsModel>();
  }

  public async ReadBalanceAnalysisSection(): Promise<IBalanceAnalysisSection> {
    const result = await UserSettingsModel.findOne({ userUID: this.user.userUID }, { balanceAnalysisSection: 1 });

    if (!result) return this.InitBalanceAnalysisSection();

    return result.toJSON().balanceAnalysisSection;
  }

  public async ReadGeneralSection(): Promise<IGeneralSection> {
    const result = await UserSettingsModel.findOne({ userUID: this.user.userUID }, { generalSection: 1 });

    if (!result) return this.InitGeneralSection();

    return result.toJSON().generalSection;
  }

  public async UpdateBalanceAnalysisSection(model: IBalanceAnalysisSection): Promise<IBalanceAnalysisSection> {
    const result = await UserSettingsModel.findOneAndUpdate(
      { userUID: this.user.userUID },
      { $set: { balanceAnalysisSection: { ...model } } },
      { upsert: true, new: true }
    );

    return result ? result.balanceAnalysisSection : null;
  }

  public async UpdateGeneralSection(model: IGeneralSection): Promise<IGeneralSection> {
    const result = await UserSettingsModel.findOneAndUpdate(
      { userUID: this.user.userUID },
      { $set: { generalSection: { ...model } } },
      { upsert: true, new: true }
    );

    return result ? result.toJSON().generalSection : null;
  }
}
