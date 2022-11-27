import { Schema, model, Document, models, Model } from "mongoose";
import { ICurrencyRateModel } from "./ICurrencyRateModel";

const CurrencyRateSchema = new Schema<ICurrencyRateModel>({
  baseCurrency: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
  rateDay: {
    type: String,
    required: true,
  }
});

export interface CurrencyRateDocument extends ICurrencyRateModel, Document {}
export default (models.currencyRate || model<ICurrencyRateModel & Document>("currencyRate", CurrencyRateSchema)) as Model<ICurrencyRateModel>;