import { ForwardRefExoticComponent, RefAttributes } from "react";
import { IconProps } from "phosphor-react";

export type IconComponentType = ForwardRefExoticComponent<
  IconProps & RefAttributes<SVGSVGElement>
>;

export type ActionColor = "success" | "warning" | "error" | "info";
export type ColorType = "primary" | "secondary";
export type Size = "small" | "medium" | "large";

export type Currency = "USD" | "EUR" | "GBP";
export type Category = "food" | "shopping" | "transport" | "health" | "entertainment" | "education" | "home" | "bills" | "gifts" | "other" | "deposits" | "salary";

export interface Transaction {
  id: string;
  date: string;
  category: Category;
  amount: number;
  currency: Currency;
  description: string;
}