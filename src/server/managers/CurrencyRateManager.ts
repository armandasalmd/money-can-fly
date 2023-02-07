import { Currency, Money } from "@utils/Types";
import { ICurrencyRateModel, CurrencyRateModel } from "@server/models";
import { round } from "@server/utils/Global";
import { addDays } from "date-fns";

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
    const rateDay = this.toRateDay(date);
    const inmemRate = CurrencyRateManager.inmemoryCache.find((x) => x.rateDay === rateDay);

    if (inmemRate) {
      return inmemRate;
    }

    let dbRate = await CurrencyRateModel.findOne({ rateDay });

    if (!dbRate) return undefined;

    dbRate.fromCache = true;

    CurrencyRateManager.inmemoryCache.push(dbRate.toObject());

    return dbRate;
  }

  private async saveToCache(rate: ICurrencyRateModel): Promise<void> {
    CurrencyRateManager.inmemoryCache.push(rate);
    await CurrencyRateModel.findOneAndUpdate(
      {
        rateDay: rate.rateDay,
      },
      {
        $set: rate,
      },
      { upsert: true, new: true }
    );
  }

  public async getRate(date: Date): Promise<ICurrencyRateModel> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date >= today) date = addDays(today, -1);

    const cached = await this.tryGetCachedRate(date);

    if (cached) return cached;

    const response = await fetch(
      `${this.ENDPOINT}?apikey=${process.env.CURRENCY_API_KEY}&currencies=EUR%2CGBP&date=${this.toRateDay(date)}`
    );
    const data: ExternalCurrencyRate = await response.json();

    if (data && data.data) {
      const result: ICurrencyRateModel = {
        baseCurrency: "USD",
        data: data.data,
        rateDay: this.toRateDay(date),
        fromCache: !!cached,
      };

      await this.saveToCache(result);

      return result;
    } else {
      const result = (await CurrencyRateModel.findOne()).toObject();
      CurrencyRateManager.inmemoryCache.push({
        ...result,
        rateDay: this.toRateDay(date),
      });
      return result;
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

  public async sumMoney(moneys: Money[], to: Currency, date: Date = new Date()): Promise<Money> {
    const result: Money = { amount: 0, currency: to };

    for (const money of moneys) {
      result.amount +=
        money.currency === to ? money.amount : await this.convert(money.amount, money.currency, to, date);
    }

    return result;
  }
}
