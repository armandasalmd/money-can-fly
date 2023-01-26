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
  if (!text || text === "") {
      return 0;
  } else if (text.startsWith("-")) {
      return onlyPositive ? NaN : 0;
  } else if (text.match(/(\d|\.|\,)$/)) {
      text = text.replace(",", ".");

      let commaCount = text.match(/\./g);

      if (commaCount && commaCount.length > 1) {
          return NaN;
      }
      
      const parsed = parseFloat(text);
      const rounded = Math.floor(parsed * 100) / 100;

      return rounded === parsed ? parsed : NaN;
  }

  return NaN;
}