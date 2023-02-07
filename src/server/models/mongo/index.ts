import { default as UserBalanceModel, MoneyDocument, UserBalanceDocument } from "./userBalance/UserBalanceModel";
import {
  default as PeriodPredictionModel,
  PeriodPredictionDocument,
  WeekPredictionDocument,
} from "./periodPrediction/PeriodPredictionModel";
import { default as ImportModel, ImportDocument } from "./import/ImportModel";
import { default as ImportSettingsModel, ImportSettingsDocument } from "./importSettings/ImportSettingsModel";
import { default as UserPreferencesModel, UserPreferencesDocument } from "./userPreferences/UserPreferencesModel";
import { default as TransactionModel, TransactionDocument } from "./transaction/TransactionModel";
import { default as CurrencyRateModel, CurrencyRateDocument } from "./currencyRate/CurrencyRateModel";
import { default as InvestmentModel, InvestmentDocument } from "./investment/InvestmentModel";

export { type ICurrencyRateModel } from "./currencyRate/ICurrencyRateModel";
export { type ITransactionModel } from "./transaction/ITransactionModel";
export { type IUserPreferencesModel } from "./userPreferences/IUserPreferencesModel";
export { type IImportModel } from "./import/IImportModel";
export { type IImportSettingsModel, defaultCategoryFallbacks } from "./importSettings/IImportSettingsModel";
export { type IInvestmentModel } from "./investment/IInvestmentModel";
export { type IInvestmentEventModel } from "./investment/IInvestmentEventModel";
export { type IPeriodPredictionModel } from "./periodPrediction/IPeriodPredictionModel";
export { type IUserBalanceModel } from "./userBalance/IUserBalanceModel";

export {
  CurrencyRateModel,
  UserBalanceModel,
  PeriodPredictionModel,
  ImportModel,
  ImportSettingsModel,
  InvestmentModel,
  UserPreferencesModel,
  TransactionModel,
  type CurrencyRateDocument,
  type MoneyDocument,
  type UserBalanceDocument,
  type PeriodPredictionDocument,
  type WeekPredictionDocument,
  type ImportDocument,
  type ImportSettingsDocument,
  type UserPreferencesDocument,
  type TransactionDocument, 
  type InvestmentDocument
};
