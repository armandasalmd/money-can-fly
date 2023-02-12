import { ForwardRefExoticComponent, RefAttributes } from "react";
import { IconProps } from "phosphor-react";

export enum DisplaySections {
  BalanceAnalysis = "balanceAnalysis",
  CategoryAnalysis = "categoryAnalysis",
  Insights = "insights",
  Investments = "investments",
}

export type DateRange = {
  from: Date | undefined;
  to?: Date | undefined;
}

export type IconComponentType = ForwardRefExoticComponent<
  IconProps & RefAttributes<SVGSVGElement>
>;

export type ActionColor = "success" | "warning" | "error" | "info";
export type CheckState = "checked" | "unchecked" | "indeterminate";
export type ColorType = "primary" | "secondary";
export type Size = "small" | "medium" | "large";
export type Sort = "asc" | "desc";
export type CategoryFallbacks = Record<Category, string[]>;
export type Theme = "light" | "dark";
export type Currency = "USD" | "EUR" | "GBP";
export type ImportState = "running" | "success" | "error" | "undo";
export type TransactionBank = "barclays" | "revolut" | "cash";
export type ImportPresetType = Exclude<TransactionBank, "cash"> | "custom";
export type TransactionStatusFilter = "active" | "inactive";
export type AmountFilter = "incomeOnly" | "moreThan10Spent" | "moreThan25Spent" | "moreThan50Spent" | "moreThan100Spent" | "moreThan250Spent";
export type InvestmentEventType = "deposit" | "adjustment" | "withdrawal" | "created";

export type Category =
  | "food"
  | "shopping"
  | "transport"
  | "health"
  | "entertainment"
  | "education"
  | "home"
  | "bills"
  | "gifts"
  | "other"
  | "deposits"
  | "salary"
  | "investments"
  | "trendUp"
  | "trendDown";

export interface Money {
  amount: number;
  currency: Currency;
}

export interface Borrowing {
  id?: string;
  description: string;
  date?: string;
  money: Money;
}

export interface Transaction extends Money {
  _id?: string;
  date: Date;
  dateUpdated: Date;
  category: Category;
  description: string;
  source: TransactionBank;
  isActive: boolean;
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
  category?: Category;
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

export type FieldErrors<T> = Partial<{
  [key in keyof T]: string;
}>