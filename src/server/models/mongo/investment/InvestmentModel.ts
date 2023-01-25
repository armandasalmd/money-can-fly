import { Schema, model, Document, models, Model } from "mongoose";
import { IInvestmentModel } from "./IInvestmentModel";
import { IInvestmentEventModel } from "./IInvestmentEventModel";
import { MoneySchema } from "../MoneySchema";

export const InvestmentEventSchema = new Schema<IInvestmentEventModel>({
  eventDate: {
    type: Date,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  valueChange: MoneySchema,
  title: {
    type: String,
    required: true,
  },
});

export const InvestmentSchema = new Schema<IInvestmentModel>({
  title: {
    type: String,
    required: true,
  },
  dateModified: {
    type: Date,
    required: true,
  },
  dateCreated: {
    type: Date,
    required: true,
  },
  timelineEvents: [InvestmentEventSchema],
  userUID: {
    type: String,
    required: true,
  },
});

export interface InvestmentDocument extends IInvestmentModel, Document {}
export interface InvestmentEventDocument extends IInvestmentEventModel, Document {}
export default (models.investment ||
  model<IInvestmentModel & Document>("investment", InvestmentSchema)) as Model<IInvestmentModel>;
