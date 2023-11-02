import { Schema, model, Document, models, Model } from "mongoose";
import { IUserPreferencesModel, IBalanceAnalysisSection } from "@server/models/mongo";
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

const UserPreferencesSchema = new Schema<IUserPreferencesModel>({
  userUID: REQUIRED_STRING,
  balanceAnalysisSection: BalanceAnalysisSectionSchema,
  generalSection: GeneralSectionSchema
});

export interface UserPreferencesDocument extends IUserPreferencesModel, Document {}
export interface BalanceAnalysisSectionDocument extends IBalanceAnalysisSection, Document {}
export interface GeneralSectionDocument extends IGeneralSection, Document {}
export default (models.userPreferences || model<IUserPreferencesModel & Document>("userPreferences", UserPreferencesSchema)) as Model<IUserPreferencesModel>;