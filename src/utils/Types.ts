import { ForwardRefExoticComponent, RefAttributes } from "react";
import { IconProps } from "phosphor-react";

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

export type Currency = "USD" | "EUR" | "GBP";
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
  | "trendUp"
  | "trendDown";
export type ImportState = "running" | "success" | "error" | "undo";
export type TransactionBank = "barclays" | "revolut" | "cash";
export type ImportPresetType = Exclude<TransactionBank, "cash"> | "custom";
export type TransactionStatusFilter = "active" | "inactive";
export type AmountFilter = "incomeOnly" | "moreThan10Spent" | "moreThan25Spent" | "moreThan50Spent" | "moreThan100Spent" | "moreThan250Spent";

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
  inserted: Date;
  category: Category;
  description: string;
  source: TransactionBank;
  isActive: boolean;
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