import { BaseModel } from "../BaseModel";
import { IBalanceAnalysisSection } from "./IBalanceAnalysisSection";
import { IGeneralSection } from "./IGeneralSection";

export interface IUserSettingsModel extends BaseModel {
  balanceAnalysisSection: IBalanceAnalysisSection;
  generalSection: IGeneralSection;
}
