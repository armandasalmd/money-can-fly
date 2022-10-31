import { TransactionBank, Currency } from "@utils/Types";
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

const defaultCurrencySelect: SelectItemsObject<Currency> = {
  USD: "USD",
  EUR: "EUR",
  GBP: "GBP",
};

export const categotyPreset: SelectItem[] = Object.keys(Categories).map((
  key,
) => ({
  label: Categories[key].name,
  value: key,
}));

export const currencyPreset: SelectItem[] = [
  {
    label: "USD",
    value: "USD",
  },
  {
    label: "EUR",
    value: "EUR",
  },
  {
    label: "GBP",
    value: "GBP",
  },
];

export const bankNames = toSelectItems(bankNamesSelect);
export const defaultCurrency = toSelectItems(defaultCurrencySelect);
