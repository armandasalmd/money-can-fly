import { Currency, Money } from "@utils/Types";
import { ICurrencyRateModel, CurrencyRateModel } from "@server/models";
import { round } from "@server/utils/Global";

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
  private constructor() {}
  private static instance: CurrencyRateManager;
  private static inmemoryCache: ICurrencyRateModel[] = [];

  public static getInstance(): CurrencyRateManager {
    if (!CurrencyRateManager.instance) {
      CurrencyRateManager.instance = new CurrencyRateManager();
    }

    return CurrencyRateManager.instance;
  }

  private readonly ENDPOINT = "https://api.currencyapi.com/v3/historical";

  private toRateDay(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  private async tryGetCachedRate(date: Date): Promise<ICurrencyRateModel | undefined> {
    const inmemId = CurrencyRateManager.inmemoryCache.findIndex((x) => x.rateDay === this.toRateDay(date));

    let rate: ICurrencyRateModel =
      inmemId !== -1
        ? CurrencyRateManager.inmemoryCache[inmemId]
        : await CurrencyRateModel.findOne({ rateDay: this.toRateDay(date) });

    if (!rate) return undefined;

    rate.fromCache = true;

    if (inmemId === -1) CurrencyRateManager.inmemoryCache.push(rate);

    return rate;
  }

  private async saveToCache(rate: ICurrencyRateModel): Promise<void> {
    await CurrencyRateModel.create(rate);
  }

  public async getRate(date: Date): Promise<ICurrencyRateModel> {
    const today = new Date();

    if (date >= new Date()) {
      date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
    }

    const cached = await this.tryGetCachedRate(date);

    if (cached) return cached;

    const response = await fetch(
      `${this.ENDPOINT}?apikey=${process.env.CURRENCY_API_KEY}&currencies=EUR%2CGBP&date=${this.toRateDay(date)}`
    );
    const data: ExternalCurrencyRate = await response.json();

    if (data.data) {
      const result: ICurrencyRateModel = {
        baseCurrency: "USD",
        data: data.data,
        rateDay: this.toRateDay(date),
        fromCache: !!cached,
      };

      if (!cached) {
        await this.saveToCache(result);
      }

      return result;
    } else {
      const result = await CurrencyRateModel.findOne();

      return result.toJSON<ICurrencyRateModel>();
    }
  }

  public async convert(amount: number, from: Currency, to: Currency, date: Date = new Date()): Promise<number> {
    if (from === to) {
      return amount;
    }

    const rates = await this.getRate(date);

    if (from === rates.baseCurrency) {
      return round(amount * rates.data[to].value);
    }

    if (to === rates.baseCurrency) {
      return round(amount / rates.data[from].value);
    }

    return round((amount * rates.data[to].value) / rates.data[from].value);
  }

  public async convertMoney(money: Money, to: Currency, date: Date = new Date()): Promise<Money> {
    return money.currency === to
      ? money
      : {
          amount: await this.convert(money.amount, money.currency, to, date),
          currency: to,
        };
  }
}
