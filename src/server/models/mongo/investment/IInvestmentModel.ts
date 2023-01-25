import { IInvestmentEventModel } from "./IInvestmentEventModel";
import { BaseModel } from "../BaseModel";

export interface IInvestmentModel extends BaseModel {
  title: string;
  dateModified: Date;
  dateCreated: Date;
  timelineEvents: IInvestmentEventModel[];
}