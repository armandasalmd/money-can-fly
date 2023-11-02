import { ForwardRefExoticComponent, RefAttributes } from "react";
import { IconProps } from "phosphor-react";

import { type Category, type SearchCategory, CategoryMetaData } from "./Category"; 
export { type Category, type SearchCategory, type CategoryMetaData };

export enum DisplaySections {
  BalanceAnalysis = "balanceAnalysis",
  CategoryAnalysis = "categoryAnalysis",
  Insights = "insights",
  Investments = "investments",
  SpendingAnalysis = "spendingAnalysis"
}

export type ChartColor = "red" | "green" | "blue" | "orange" | "yellow" | "purple" | "grey";

export type DateRange = {
  from: Date | undefined;
  to?: Date | undefined;
}

export type IconComponentType = ForwardRefExoticComponent<
  IconProps & RefAttributes<SVGSVGElement>
>;

export type ActionColor = "success" | "warning" | "error" | "info";
export type AmountFilter = "incomeOnly" | "spendingOnly" | "moreThan10Spent" | "moreThan25Spent" | "moreThan50Spent" | "moreThan100Spent" | "moreThan250Spent";
export type CalibrationStatus = "unset" | "pass" | "fail";
export type CategoryFallbacks = Record<Category, string[]>;
export type CheckState = "checked" | "unchecked" | "indeterminate";
export type ColorType = "primary" | "secondary";
export type Currency = "USD" | "EUR" | "GBP";
export type Size = "small" | "medium" | "large";
export type Sort = "asc" | "desc";
export type ImportPresetType = Exclude<TransactionBank, "cash"> | "custom";
export type InvestmentEventType = "deposit" | "adjustment" | "withdrawal" | "created";
export type ImportState = "running" | "success" | "error" | "undo";
export type Theme = "light" | "dark";
export type TransactionBank = "barclays" | "revolut" | "cash";
export type TransactionStatusFilter = "active" | "inactive";

export type Balances = {
  [key in Currency]: Money;
}

export interface Money {
  amount: number;
  currency: Currency;
}

export interface CalibrateCurrencyRow {
  status: CalibrationStatus;
  target: Money;
  inApp: Money;
}

export interface ExchangeFix {
  rateDate: Date;
  from: Money;
  to: Money;
}

export interface Transaction extends Money {
  _id?: string;
  date: Date;
  dateUpdated: Date;
  category: Category;
  description: string;
  source: TransactionBank;
  isActive: boolean;
  isInvestment?: boolean;
  investmentEventType?: InvestmentEventType;
}

export interface TransactionWithOptions extends Transaction {
  alterBalance?: boolean;
}

export interface Import {
  _id: string;
  date: string;
  source: TransactionBank;
  message: string;
  importState: ImportState;
}

export interface WeekPrediction {
  label?: string;
  week: number;
  moneyIn: number;
  moneyOut: number;
}

export interface MonthPrediction {
  id?: string;
  period: DateRange;
  currency: Currency;
  predictions: WeekPrediction[];
  totalChange?: number;
}

export interface TransactionForm {
  amountFilter?: AmountFilter;
  statusFilter?: TransactionStatusFilter;
  category?: SearchCategory;
  currency?: Currency;
  dateRange?: DateRange;
  searchTerm: string;
  importId?: string;
}

export interface InvestmentEvent {
  _id?: string;
  eventDate: Date;
  type: InvestmentEventType;
  valueChange: Money;
  total?: Money;
  title: string;
}

export interface CreateInvestmentEvent {
  eventDate: Date | string;
  type: InvestmentEventType;
  valueChange: Money;
  updateBalance?: boolean;
  updateNote?: string;
}

export interface Investment {
  id?: string;
  title: string;
  currentValue: Money;
  dateModified: Date;
  dateCreated: Date;
  timelineEvents: InvestmentEvent[];
}

export interface InvestmentSummary {
  id: string;
  title: string;
  dateModified: Date;
  currentValue: Money;
  timelineEventsCount: number;
}

export type FieldErrors<T> = Partial<{
  [key in keyof T]: string;
}>