import { BaseModel } from "../BaseModel";
import { IBalanceAnalysisSection } from "./IBalanceAnalysisSection";
import { IGeneralSection } from "./IGeneralSection";

export interface IUserPreferencesModel extends BaseModel {
  balanceAnalysisSection: IBalanceAnalysisSection;
  generalSection: IGeneralSection;
}

export type IGeneralPreferences = Omit<IUserPreferencesModel, "balanceAnalysisSection">;