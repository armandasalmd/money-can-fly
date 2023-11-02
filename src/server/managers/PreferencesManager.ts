import { CookieUser } from "@server/core";
import { UserPreferencesModel, IUserPreferencesModel } from "@server/models";
import { IBalanceAnalysisSection, IGeneralSection, UserPreferencesDocument } from "@server/models/mongo";

export class PreferencesManager {
  public constructor(private user: CookieUser) {}

  public async MigrateAll(): Promise<boolean> {
    const prefsDb: UserPreferencesDocument = await UserPreferencesModel.findOne({ userUID: 'rbjra0rxn3TnmdQXk5QANgrbsL23' });

    if (!prefsDb) {
      return false;
    }

    const prefs = prefsDb.toJSON<IUserPreferencesModel>();
    
    const newState: IUserPreferencesModel = {
      userUID: prefs.userUID,
      balanceAnalysisSection: {
        defaultDaysAfterNow: 30,
        defaultDaysBeforeNow: 60,
        forecastPivotDate: prefs['forecastPivotDate'],
        forecastPivotValue: prefs['forecastPivotValue'],
        hideInvestmentsOnLoad: false,
        investmentColor: 'yellow',
        predictionColor: 'grey',
        totalWorthColor: 'blue'
      },
      generalSection: {
        defaultCurrency: prefs['defaultCurrency'],
        monthlyBudget: prefs['monthlyBudget'],
        monthlyBudgetStartDay: prefs['monthlyBudgetStartDay']
      }
    };

    const success = await UserPreferencesModel.create(newState);
    console.log(success);

    if (success) {
      return (await UserPreferencesModel.deleteOne({ userUID: prefs.userUID })).deletedCount > 0;
    }
    
    return false;
  } 

  public async UpdateGeneralPreferences(model: IGeneralSection): Promise<IUserPreferencesModel> {
    const preferences = await UserPreferencesModel.findOneAndUpdate(
      { userUID: this.user.userUID },
      { $set: { ...model } },
      { upsert: true, new: true }
    );

    return preferences.toJSON<IUserPreferencesModel>();
  }

  public async UpdateBalanceAnalysisPreferences(model: IBalanceAnalysisSection): Promise<IBalanceAnalysisSection> {
    const preferences = await UserPreferencesModel.findOneAndUpdate(
      { userUID: this.user.userUID },
      { $set: { ...model } },
      { upsert: true, new: true }
    );

    return preferences.toJSON<IBalanceAnalysisSection>();
  }

  private InitGeneralPreferences(): Promise<IUserPreferencesModel> {
    return this.UpdateGeneralPreferences({
      userUID: this.user.userUID,
      defaultCurrency: "USD",
      monthlyBudget: 0,
      monthlyBudgetStartDay: 1
    });
  }

  public async GetGeneralPreferences(): Promise<IUserPreferencesModel> {
    const result = await UserPreferencesModel.findOne({ userUID: this.user.userUID }, {
      balanceAnalysisSection: 0
    });
    if (!result) return this.InitGeneralPreferences();
    
    return result.toJSON<IUserPreferencesModel>();
  }
  
  public async GetBalanceAnalysisPreferences(): Promise<IBalanceAnalysisSection> {
    const result = await UserPreferencesModel.findOne({ userUID: this.user.userUID }, {
      balanceAnalysisSection: 1
    });
    if (!result) return this.InitBalanceAnalysisPreferences();

    return result.toJSON<IBalanceAnalysisSection>();
  }

  private InitBalanceAnalysisPreferences(): Promise<IBalanceAnalysisSection> {
    return this.UpdateBalanceAnalysisPreferences({
      defaultDaysAfterNow: 30,
      defaultDaysBeforeNow: 60,
      forecastPivotDate: new Date(),
      forecastPivotValue: 0,
      hideInvestmentsOnLoad: false,
      investmentColor: "yellow",
      predictionColor: "grey",
      totalWorthColor: "blue"
    });
  }
}
