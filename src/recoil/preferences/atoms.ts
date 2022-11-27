import { atom } from "recoil";
import { Currency, OtherAsset } from "@utils/Types";

export interface PreferencesForm {
  defaultCurrency: Currency;
  monthlyBudget: number;
  monthlyBudgetStartDay: number;
  balances: {
    [key in Currency]: number;
  };
  otherAssets: {
    [key in OtherAsset]: number;
  };
}

export const preferencesState = atom<PreferencesForm>({
  key: "preferences",
  default: {
    defaultCurrency: "GBP",
    monthlyBudget: 0,
    monthlyBudgetStartDay: 1,
    balances: {
      GBP: 0,
      EUR: 0,
      USD: 0,
    },
    otherAssets: {
      crypto: 0,
      stocks: 0,
    }
  }
});