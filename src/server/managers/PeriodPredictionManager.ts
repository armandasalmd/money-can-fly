import { PeriodPredictionModel, IPeriodPredictionModel, PeriodPredictionDocument } from "@server/models";
import { CookieUser } from "@server/core";
import { SetPeriodRequest } from "@endpoint/predictions/setPeriod";
import { Currency, Money, MonthPrediction } from "@utils/Types";
import { CurrencyRateManager } from "./CurrencyRateManager";

interface ITotalSpendingResult extends Money {
  monthDate: Date;
} 

export class PeriodPredictionManager {

  public constructor(private user: CookieUser) {}

  public async GetPredictions(year?: number): Promise<MonthPrediction[]> {
    let result: PeriodPredictionDocument[] = [];
    
    if (year) {
      const from = new Date(year, 0, 1);
      const to = new Date(year, 11, 31);

      result = await PeriodPredictionModel.find({ userUID: this.user.userUID, monthDate: { $gte: from, $lte: to } });
    } else {
      result = await PeriodPredictionModel.find({ userUID: this.user.userUID });
    }

    return result.map((x) => {
      return {
        id: x.id,
        totalChange: x.predictions.reduce((a, b) => a + b.moneyIn - b.moneyOut, 0),
        currency: x.currency,
        periodMonth: x.monthDate.toISOString(),
        predictions: x.predictions,
        period: {
          from: x.monthDate,
          to: x.monthDate,
        }
      };
    });
  }

  public async GetPredictionByMonth(month: Date): Promise<MonthPrediction> {
    const result = await PeriodPredictionModel.findOne({ userUID: this.user.userUID, monthDate: month });

    if (!result) return null;

    return {
      id: result.id,
      totalChange: result.predictions.reduce((a, b) => a + b.moneyIn - b.moneyOut, 0),
      currency: result.currency,
      predictions: result.predictions,
      period: {
        from: result.monthDate,
        to: result.monthDate,
      }
    };
  }

  public async GetTotalSpending(months: Date[], targetCurrency: Currency): Promise<ITotalSpendingResult[]> {
    const spendingResults = await PeriodPredictionModel.aggregate<ITotalSpendingResult>([
      {
        $match: { 
          userUID: this.user.userUID,
          monthDate: { $in: months }
        }
      },
      {
        $set: {
          amount: {
            $sum: "$predictions.moneyOut"
          }
        }
      },
      {
        $project: {
          amount: 1,
          currency: 1,
          monthDate: 1
        }
      }
    ]);

    const rateManager = CurrencyRateManager.getInstance();

    for (const spending of spendingResults) {
      const convertedSpending = await rateManager.convertMoney(spending, targetCurrency);

      spending.amount = convertedSpending.amount;
      spending.currency = convertedSpending.currency;
    }

    return spendingResults;
  }

  public async SetPeriod(request: SetPeriodRequest): Promise<IPeriodPredictionModel> {
    const model: IPeriodPredictionModel = {
      userUID: this.user.userUID,
      currency: request.currency,
      monthDate: new Date(request.periodMonth),
      predictions: request.predictions,
    };

    const existing = await PeriodPredictionModel.findOne({ userUID: this.user.userUID, monthDate: model.monthDate });

    if (existing) {
      existing.predictions = model.predictions;
      existing.currency = model.currency;
      await existing.save();

      return existing.toJSON<IPeriodPredictionModel>();
    } else {
      await PeriodPredictionModel.create(model);
    }

    return model;
  }

  public async ResetPeriod(predictionId: string): Promise<boolean> {
    const a = await PeriodPredictionModel.deleteOne({ userUID: this.user.userUID, _id: predictionId });

    return a.deletedCount > 0;
  }
}
