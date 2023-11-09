import { Currency } from "@utils/Types";

export interface IGeneralSection {
  defaultCurrency: Currency;
  monthlyBudget: number;
  monthlyBudgetStartDay: number;
}