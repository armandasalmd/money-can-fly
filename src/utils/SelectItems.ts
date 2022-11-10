import { TransactionBank, Currency, TransactionStatusFilter } from "@utils/Types";
import Categories from "@atoms/CategoryIcon/TransactionCategories";

export type SelectItemsObject<T extends string> = { [key in T]: string };

export interface SelectItem {
  label: string;
  value: string;
}

function toSelectItems(keyValueObject: SelectItemsObject<any>): SelectItem[] {
  return Object.entries(keyValueObject).map(([value, label]) => ({ value, label }));
}

// Select value(as key): select label(as value)
const bankNamesSelect: SelectItemsObject<TransactionBank> = {
  barclays: "Barclays",
  revolut: "Revolut",
  cash: "Cash",
};

const currencySelect: SelectItemsObject<Currency> = {
  USD: "USD",
  EUR: "EUR",
  GBP: "GBP",
};

const transactionStatusFilterSelect: SelectItemsObject<TransactionStatusFilter> = {
  active: "Active",
  inactive: "Inactive",
};

const amountFilterSelect: SelectItemsObject<any> = {
  incomeOnly: "Income only",
  moneyOutMoreThan10: ">10 spent",
  moneyOutMoreThan25: ">25 spent",
  moneyOutMoreThan50: ">50 spent",
  moneyOutMoreThan100: ">100 spent",
  moneyOutMoreThan250: ">250 spent",
}

export const categotyPreset: SelectItem[] = Object.keys(Categories).map((
  key,
) => ({
  label: Categories[key].name,
  value: key,
}));

export const amountFilterPreset = toSelectItems(amountFilterSelect);
export const bankNamesPreset = toSelectItems(bankNamesSelect);
export const currencyPreset = toSelectItems(currencySelect);
export const transactionStatusPreset = toSelectItems(transactionStatusFilterSelect);
