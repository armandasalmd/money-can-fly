import { InvestmentEventType, Money } from "@utils/Types";

export interface IInvestmentEventModel {
  eventDate: Date;
  type: InvestmentEventType;
  valueChange: Money;
  title: string;
}