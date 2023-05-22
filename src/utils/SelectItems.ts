import { TransactionBank, Currency, TransactionStatusFilter, AmountFilter, Sort } from "@utils/Types";
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

export const currencySelect: SelectItemsObject<Currency> = {
  USD: "USD",
  EUR: "EUR",
  GBP: "GBP",
};

export const transactionStatusFilterSelect: SelectItemsObject<TransactionStatusFilter> = {
  active: "Active",
  inactive: "Inactive",
};

const sortSelect: SelectItemsObject<Sort> = {
  asc: "Ascending",
  desc: "Descending",
};

export const amountFilterSelect: SelectItemsObject<AmountFilter> = {
  incomeOnly: "Income only",
  spendingOnly: "Spending only",
  moreThan10Spent: ">10 spent",
  moreThan25Spent: ">25 spent",
  moreThan50Spent: ">50 spent",
  moreThan100Spent: ">100 spent",
  moreThan250Spent: ">250 spent",
};

const yearSelect: SelectItemsObject<string> = {
  "2020": "Year 2020",
  "2021": "Year 2021",
  "2022": "Year 2022",
  "2023": "Year 2023",
  "2024": "Year 2024",
  "2025": "Year 2025",
  "2026": "Year 2026",
};

export const categotyPreset: SelectItem[] = Object.keys(Categories).map((
  key,
) => ({
  label: Categories[key].name,
  value: key,
}));

export const searchCategoryPreset: SelectItem[] = [{
  label: "Not investment",
  value: "notInvestments"
}, ...categotyPreset];

export const yearsPreset = toSelectItems(yearSelect);
export const amountFilterPreset = toSelectItems(amountFilterSelect);
export const bankNamesPreset = toSelectItems(bankNamesSelect);
export const currencyPreset = toSelectItems(currencySelect);
export const sortPreset = toSelectItems(sortSelect);
export const transactionStatusPreset = toSelectItems(transactionStatusFilterSelect);
