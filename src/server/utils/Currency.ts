import { Money } from "@utils/Types";
import Constants from "./Constants";

export function isMoney(money: Money): boolean {
  return money && typeof money.amount === "number" && Constants.allowed.currencies.includes(money.currency);
}
