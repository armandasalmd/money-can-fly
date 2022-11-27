import { Money, Currency, OtherAsset } from "@utils/Types";
import { BaseModel } from "../BaseModel";

export interface IUserBalanceModel extends BaseModel {
  balances: {
    [key in Currency]: Money;
  };
  otherAssets: {
    [key in OtherAsset]: Money;
  };
}