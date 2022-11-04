import { Currency, Money, Transaction } from "./Types";

const currencyLocales: { [key in Currency]: string } = {
  USD: "en-US",
  EUR: "de-DE",
  GBP: "en-GB",
};

export function amountForDisplay(money: Money | Transaction): string {
  return new Intl.NumberFormat(currencyLocales[money.currency], {
    style: "currency",
    currency: money.currency,
  }).format(money.amount);
}

export function percentForDisplay(percent: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: 2,
  }).format(percent);
}
