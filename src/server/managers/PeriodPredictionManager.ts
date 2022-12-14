import { PeriodPredictionModel, IPeriodPredictionModel, PeriodPredictionDocument } from "@server/models";
import { CookieUser } from "@server/core";
import { SetPeriodRequest } from "@endpoint/predictions/setPeriod";
import { MonthPrediction } from "@utils/Types";

export class PeriodPredictionManager {
  public async GetPredictions(user: CookieUser, year?: number): Promise<MonthPrediction[]> {
    let result: PeriodPredictionDocument[] = [];
    
    if (year) {
      const from = new Date(year, 0, 1);
      const to = new Date(year, 11, 31);

      result = await PeriodPredictionModel.find({ userUID: user.userUID, monthDate: { $gte: from, $lte: to } });
    } else {
      result = await PeriodPredictionModel.find({ userUID: user.userUID }).sort({ "period.from": -1 });
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

  public async SetPeriod(request: SetPeriodRequest, user: CookieUser): Promise<IPeriodPredictionModel> {
    const model: IPeriodPredictionModel = {
      userUID: user.userUID,
      currency: request.currency,
      monthDate: new Date(request.periodMonth),
      predictions: request.predictions,
    };

    const existing = await PeriodPredictionModel.findOne({ userUID: user.userUID, monthDate: model.monthDate });

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

  public async ResetPeriod(predictionId: string, user: CookieUser): Promise<boolean> {
    const a = await PeriodPredictionModel.deleteOne({ userUID: user.userUID, _id: predictionId });

    return a.deletedCount > 0;
  }
}
