import { BaseModel } from "../BaseModel";
import { IWeekPredictionModel } from "./IWeekPredictionModel";
import { Currency } from "@utils/Types";

export interface IPeriodPredictionModel extends BaseModel {  
  monthDate: Date;
  currency: Currency;
  predictions: IWeekPredictionModel[];
}