import { Schema } from "mongoose";
import { Money } from "@utils/Types";

export const MoneySchema = new Schema<Money>({
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
});

export interface MoneyDocument extends Money, Document {}
