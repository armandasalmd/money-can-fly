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
export type OtherAsset = "crypto" | "stocks";
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
export type ImportState = "running" | "success" | "error";
export type TransactionBank = "barclays" | "revolut" | "cash";
export type ImportPresetType = Exclude<TransactionBank, "cash"> | "custom";
export type FormMode = "create" | "update";
export type TransactionStatusFilter = "active" | "inactive";

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
  id?: string;
  date: Date;
  inserted: Date;
  category: Category;
  description: string;
  source: TransactionBank;
  active: boolean;
}

export interface Import {
  id: string;
  date: Date;
  bank: TransactionBank;
  state: ImportState;
  message: string;
}

export interface WeekPrediction {
  label?: string;
  week: number;
  moneyIn: number;
  moneyOut: number;
}

export interface MonthPrediction {
  period: DateRange;
  currency: Currency;
  predictions: WeekPrediction[];
  totalChange?: number;
}
