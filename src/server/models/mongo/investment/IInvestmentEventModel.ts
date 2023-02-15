import { InvestmentEventType, Money } from "@utils/Types";
import { ObjectId } from "mongoose";

export interface IInvestmentEventModel {
  eventDate: Date;
  type: InvestmentEventType;
  valueChange: Money;
  title: string;
  transaction?: string | ObjectId;
}