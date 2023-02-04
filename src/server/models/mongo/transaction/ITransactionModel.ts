import { ObjectId } from "mongoose";
import { BaseModel } from "../BaseModel";
import { Category, TransactionBank, Money, Currency } from "@utils/Types";

export interface ITransactionModel extends BaseModel, Money {
  category: Category;
  date: Date;
  description: string;
  isActive: boolean;
  isImported: boolean;
  isInvestment: boolean;
  isDeleted: boolean;
  source: TransactionBank;
  usdValueWhenExecuted: number;
  currency: Currency;
  amount: number;
  importId?: string | ObjectId;
}