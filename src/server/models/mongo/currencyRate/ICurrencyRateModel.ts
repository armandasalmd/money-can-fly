import { Currency } from "@utils/Types";

export interface ICurrencyRateModel {  
  fromCache?: boolean;
  baseCurrency: Currency;
  data: {
    [key in Exclude<Currency, "USD">]: {
      code: Currency;
      value: number;
    };
  };
  rateDay: string;
}