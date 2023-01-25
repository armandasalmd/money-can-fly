import { Investment, Money } from "@utils/Types";

export interface InvestmentsModel {
  totalValue: Money;
  investments: Investment[];
}
