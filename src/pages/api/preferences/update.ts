import { IsPositive, IsIn, IsObject, Max } from "class-validator";
import { Currency } from "@utils/Types";
import { validatedApiRoute } from "@server/core";
import constants from "@server/utils/Constants";
import { BalanceManager, PreferencesManager } from "@server/managers";
import { PreferencesForm } from "@recoil/preferences/atoms";

type BalancesMap = {
  [key in Currency]: number;
}

export class UpdatePreferencesRequest {
  @IsIn(constants.allowed.currencies)
  defaultCurrency: Currency;
  @IsPositive()
  monthlyBudget: number;
  @IsPositive()
  @Max(31)
  monthlyBudgetStartDay: number;
  @IsObject()
  balances: BalancesMap;
}

export default validatedApiRoute("PUT", UpdatePreferencesRequest, async (request, response, user) => {
  const preferencesManager = new PreferencesManager();
  const balanceManager = new BalanceManager();
  
  const preferences = await preferencesManager.UpdatePreferences({
    defaultCurrency: request.body.defaultCurrency,
    monthlyBudget: request.body.monthlyBudget,
    monthlyBudgetStartDay: request.body.monthlyBudgetStartDay,
    userUID: user.userUID,
  }, user);
  
  const balances = await balanceManager.UpdateBalances({
    balances: request.body.balances,
    userUID: user.userUID,
  }, user);

  return response.status(200).json({
    defaultCurrency: preferences.defaultCurrency || "USD",
    monthlyBudget: preferences.monthlyBudget || 0,
    monthlyBudgetStartDay: preferences.monthlyBudgetStartDay || 1,
    balances: {
      ...balances.balances
    }
  } as PreferencesForm);
});