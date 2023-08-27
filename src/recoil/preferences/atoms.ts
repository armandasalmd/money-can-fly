import { atom } from "recoil";
import { Balances } from "@utils/Types";
import { IUserPreferencesModel } from "@server/models";

export interface PreferencesForm extends Omit<IUserPreferencesModel, "userUID"> {
  balances: Balances;
}

export const preferencesState = atom<PreferencesForm>({
  key: "preferences",
  default: {
    defaultCurrency: "GBP",
    monthlyBudget: 0,
    monthlyBudgetStartDay: 1,
    balanceChartBreakpoints: 12,
    forecastPivotDate: new Date(),
    forecastPivotValue: 0,
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