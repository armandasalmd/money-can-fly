import { Money, Currency } from "@utils/Types";
import { BaseModel } from "../BaseModel";

export interface IUserBalanceModel extends BaseModel {
  balances: {
    [key in Currency]: Money;
  };
}