import { Currency } from "@utils/Types";
import { CurrencyRate } from "@server/core";
import { CurrencyRateModel } from "@server/models";

interface ExternalCurrencyRate {
  meta: {
    last_updated_at: string;
  };
  data: {
    [key in Currency]: {
      code: Currency;
      value: number;
    };
  };
}

export class CurrencyRateManager {
  private readonly ENDPOINT = "https://api.currencyapi.com/v3/historical";

  private toRateDay(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  private async tryGetCachedRate(date: Date): Promise<CurrencyRateModel | undefined> {
    const snapshot = await CurrencyRate.where("rateDay", "==", this.toRateDay(date)).get();

    if (snapshot.empty) {
      return undefined;
    }

    const result = snapshot.docs[0].data() as CurrencyRateModel;
    
    result.fromCache = true;

    return result;
  }

  private async saveToCache(rate: CurrencyRateModel): Promise<void> {
    await CurrencyRate.add(rate);
  }

  public async getRate(date: Date): Promise<CurrencyRateModel> {
    const today = new Date();

    if (date >= new Date()) {
      date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
    }

    const cached: CurrencyRateModel | undefined = await this.tryGetCachedRate(date);

    if (cached) {
      return cached;
    }

    const response = await fetch(
      `${this.ENDPOINT}?apikey=${process.env.CURRENCY_API_KEY}&currencies=EUR%2CGBP&date=${this.toRateDay(date)}`
    );
    const data: ExternalCurrencyRate = await response.json();
    const result: CurrencyRateModel = {
      baseCurrency: "USD",
      data: data.data,
      rateDay: this.toRateDay(date),
      fromCache: !!cached,
    };

    if (!cached) {
      await this.saveToCache(result);
    }

    return result;
  }

  public async convert(
    amount: number,
    from: Currency,
    to: Currency,
    date: Date = new Date()
  ): Promise<number> {
    const rates = await this.getRate(date);

    if (from === to) {
      return amount;
    }

    if (from === rates.baseCurrency) {
      return amount * rates.data[to].value;
    }

    if (to === rates.baseCurrency) {
      return amount / rates.data[from].value;
    }

    return (amount * rates.data[to].value) / rates.data[from].value;
  }
}
