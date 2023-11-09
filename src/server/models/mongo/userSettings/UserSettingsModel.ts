import { Schema, model, Document, models, Model } from "mongoose";
import { IUserSettingsModel, IBalanceAnalysisSection } from "@server/models/mongo";
import { IGeneralSection } from "./IGeneralSection";

const REQUIRED_NUMBER = {
  type: Number,
  required: true
};

const REQUIRED_STRING = {
  type: String,
  required: true
};

const BalanceAnalysisSectionSchema = new Schema<IBalanceAnalysisSection>({
  defaultDaysAfterNow: REQUIRED_NUMBER,
  defaultDaysBeforeNow: REQUIRED_NUMBER,
  forecastPivotDate: {
    type: Date,
    required: false,
  },
  forecastPivotValue: {
    type: Number,
    required: false,
  },
  hideInvestmentsOnLoad: {
    type: Boolean,
    default: true
  },
  investmentColor: REQUIRED_STRING,
  predictionColor: REQUIRED_STRING,
  totalWorthColor: REQUIRED_STRING
});

const GeneralSectionSchema = new Schema<IGeneralSection>({
  defaultCurrency: REQUIRED_STRING,
  monthlyBudget: REQUIRED_NUMBER,
  monthlyBudgetStartDay: REQUIRED_NUMBER,
});

const UserSettingsSchema = new Schema<IUserSettingsModel>({
  userUID: REQUIRED_STRING,
  balanceAnalysisSection: BalanceAnalysisSectionSchema,
  generalSection: GeneralSectionSchema
});

export interface UserSettingsDocument extends IUserSettingsModel, Document {}
export interface BalanceAnalysisSectionDocument extends IBalanceAnalysisSection, Document {}
export interface GeneralSectionDocument extends IGeneralSection, Document {}
export default (models.userSettings || model<IUserSettingsModel & Document>("userSettings", UserSettingsSchema)) as Model<IUserSettingsModel>;