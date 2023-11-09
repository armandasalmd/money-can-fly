import { atom } from "recoil";
import { Balances } from "@utils/Types";
import { IGeneralSection } from "@server/models/mongo";

export interface PreferencesForm extends IGeneralSection {
  balances: Balances;
}

export const preferencesState = atom<Omit<PreferencesForm, "userUID">>({
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