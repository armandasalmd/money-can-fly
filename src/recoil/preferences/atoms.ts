import { atom } from "recoil";
import { Currency, Money } from "@utils/Types";

export interface PreferencesForm {
  defaultCurrency: Currency;
  monthlyBudget: number;
  monthlyBudgetStartDay: number;
  balances: {
    [key in Currency]: Money;
  };
}

export const preferencesState = atom<PreferencesForm>({
  key: "preferences",
  default: {
    defaultCurrency: "GBP",
    monthlyBudget: 0,
    monthlyBudgetStartDay: 1,
    balances: {
      GBP: {
        amount: 0,
        currency: "GBP",
      },
      EUR: {
        amount: 0,
        currency: "EUR",
      },
      USD: {
        amount: 0,
        currency: "USD",
      },
    }
  }
});