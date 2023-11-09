import { CookieUser } from "@server/core";
import { IBalanceAnalysisSection, IGeneralSection, IUserSettingsModel, UserSettingsModel } from "@server/models";

export class UserSettingsManager {
  public constructor(private user: CookieUser) {}

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
