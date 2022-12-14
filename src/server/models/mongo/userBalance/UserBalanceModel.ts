import { Money } from "@utils/Types";
import { Schema, model, Document, models, Model } from "mongoose";
import { IUserBalanceModel } from "./IUserBalanceModel";

const MoneySchema = new Schema<Money>({
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  }
});

const UserBalanceSchema = new Schema<IUserBalanceModel>({
  userUID: {
    type: String,
    required: true,
  },
  balances: {
    type: Map,
    of: MoneySchema,
    required: true,
  }
});

export interface MoneyDocument extends Money, Document {}
export interface UserBalanceDocument extends IUserBalanceModel, Document {}
export default (models.userBalance || model<IUserBalanceModel & Document>("userBalance", UserBalanceSchema)) as Model<IUserBalanceModel>;