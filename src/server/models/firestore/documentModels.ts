import { Currency, Category, ImportState, TransactionBank, Money, DateRange, WeekPrediction, OtherAsset } from "@utils/Types";

export interface BaseModel {
  UID?: string;
  dateCreated?: Date;
  dateChanged?: Date;
}

export interface BaseUserModel {
  userUID: string;
}

export interface BorrowingModel extends BaseUserModel, Money {
  description: string;
}

export interface CurrencyRateModel extends BaseModel {
  fromCache?: boolean;
  baseCurrency: Currency;
  data: {
    [key in Exclude<Currency, "USD">]: {
      code: Currency;
      value: number;
    };
  };
  rateDay: string;
}

export interface PeriodPredictionModel extends BaseUserModel {
  period: DateRange;
  currency: Currency;
  predictions: WeekPrediction[];
}

export interface TransactionModel extends BaseUserModel, Money {
  category: Category;
  date: Date;
  description: string;
  isActive: boolean;
  isImported: boolean;
  isDeleted: boolean;
  source: TransactionBank;
  usdValueWhenExecuted: number;
}

export interface UserBalanceModel extends BaseUserModel {
  accounts: {
    [key in Currency]: Money;
  };
  otherAssets: {
    [key in OtherAsset]: Money;
  };
}

export interface UserPreferencesModel extends BaseUserModel {
  defaultCurrency: Currency;
  montlyBudget: number;
  montlyBudgetStart: Date;
}

export interface ImportModel extends BaseUserModel {
  importState: ImportState;
  message: string;
  source: TransactionBank;
  transactions: TransactionModel[];
}
