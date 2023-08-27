import { Balances } from "@utils/Types";
import { BaseModel } from "../BaseModel";

export interface IUserBalanceModel extends BaseModel {
  balances: Balances;
}