import { Currency, Money, Transaction } from "./Types";

const currencyLocales: { [key in Currency]: string } = {
  USD: "en-US",
  EUR: "de-DE",
  GBP: "en-GB",
};

export function amountForDisplay(money: Money | Transaction): string {
  if (!money) return "0.00";

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

export function parseCurrency(text: string, onlyPositive: boolean): number {
  text = text || "";

  if (onlyPositive && text.startsWith("-")) {
    return NaN;
  } else if (text === "" || text === "-") {
    return 0;
  } else if (text.length <= 10 && text.match(/^-?\d+(\.|,)?\d{0,2}$/)) {
    text = text.replace(",", ".");

    if (text.lastIndexOf("-") > 0) {
      const isNegative = text[0] === "-";

      text = (isNegative ? "-" : "") + text.replace("-", "");
    }

    return parseFloat(text.replace(",", ".")) || NaN;
  }

  return NaN;
}
