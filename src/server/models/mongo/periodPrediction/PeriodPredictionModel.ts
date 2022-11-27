import { Schema, model, Document, models, Model } from "mongoose";
import { IPeriodPredictionModel } from "./IPeriodPredictionModel";
import { IWeekPredictionModel } from "./IWeekPredictionModel";

const WeekPredictionSchema = new Schema<IWeekPredictionModel>({
  week: {
    type: Number,
    required: true,
  },
  moneyIn: {
    type: Number,
    required: true,
  },
  moneyOut: {
    type: Number,
    required: true,
  }
});

const PeriodPredictionSchema = new Schema<IPeriodPredictionModel>({
  userUID: {
    type: String,
    required: true,
  },
  monthDate: {
    type: Date,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  predictions: [WeekPredictionSchema]
});

export interface WeekPredictionDocument extends IWeekPredictionModel, Document {}
export interface PeriodPredictionDocument extends IPeriodPredictionModel, Document {}
export default (models.periodPrediction || model<IPeriodPredictionModel & Document>("periodPrediction", PeriodPredictionSchema)) as Model<IPeriodPredictionModel>;