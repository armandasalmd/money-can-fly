import { Schema, model, Document, models, Model } from "mongoose";
import { ITransactionModel } from "./ITransactionModel";

export const TransactionSchema = new Schema<ITransactionModel>({
  category: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  dateUpdated: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
  isImported: {
    type: Boolean,
    required: true,
  },
  isInvestment: {
    type: Boolean,
    required: false,
    default: false,
  },
  investmentEventType: {
    type: String,
    required: false,
  },
  source: {
    type: String,
    required: true,
  },
  usdValueWhenExecuted: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  userUID: {
    type: String,
    required: true,
    unique: false,
    index: true
  },
  importId: {
    type: Schema.Types.ObjectId,
    ref: "import",
  },
  importHash: {
    type: Number,
    required: false
  }
});

export interface TransactionDocument extends ITransactionModel, Document {}
export default (models.transaction || model<ITransactionModel & Document>("transaction", TransactionSchema)) as Model<ITransactionModel>;