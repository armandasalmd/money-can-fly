import { SelectItem } from "@atoms/Select/SelectMenu";
import Categories from "@atoms/CategoryIcon/TransactionCategories";

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
