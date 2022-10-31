import { ForwardRefExoticComponent, RefAttributes } from "react";
import { IconProps } from "phosphor-react";

export type IconComponentType = ForwardRefExoticComponent<
  IconProps & RefAttributes<SVGSVGElement>
>;

export type ActionColor = "success" | "warning" | "error" | "info";
export type CheckState = "checked" | "unchecked" | "indeterminate";
export type ColorType = "primary" | "secondary";
export type Size = "small" | "medium" | "large";

export type Currency = "USD" | "EUR" | "GBP";
export type Category = "food" | "shopping" | "transport" | "health" | "entertainment" | "education" | "home" | "bills" | "gifts" | "other" | "deposits" | "salary";
export type ImportState = "running" | "success" | "error";
export type TransactionBank = "barclays" | "revolut" | "cash";
export type ImportPresetType = Exclude<TransactionBank, "cash"> | "custom";

export interface Transaction {
  id: string;
  date: string;
  category: Category;
  amount: number;
  currency: Currency;
  description: string;
}

export interface Import {
  id: string;
  date: Date;
  bank: TransactionBank;
  state: ImportState;
  message: string;
}