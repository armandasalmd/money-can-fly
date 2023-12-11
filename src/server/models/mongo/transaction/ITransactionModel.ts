import { ObjectId } from "mongoose";
import { BaseModel } from "../BaseModel";
import { Category, TransactionBank, Money, Currency, InvestmentEventType } from "@utils/Types";

export interface ITransactionModel extends BaseModel, Money {
  category: Category;
  date: Date;
  dateUpdated: Date;
  description: string;
  isActive: boolean;
  isImported: boolean;
  isInvestment: boolean;
  investmentEventType?: InvestmentEventType;
  source: TransactionBank;
  usdValueWhenExecuted: number;
  currency: Currency;
  amount: number;
  importId?: string | ObjectId;
  importHash?: number;
}