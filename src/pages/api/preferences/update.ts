import { IsPositive, IsIn, IsObject, Max } from "class-validator";
import { Currency, OtherAsset } from "@utils/Types";
import { validatedApiRoute } from "@server/core";
import constants from "@server/utils/Constants";
import { BalanceManager, PreferencesManager } from "@server/managers";

type BalancesMap = {
  [key in Currency]: number;
}

type OtherAssetsMap = {
  [key in OtherAsset]: number;
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
  @IsObject()
  otherAssets: OtherAssetsMap;
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
    otherAssets: request.body.otherAssets,
    userUID: user.userUID,
  }, user);

  return response.status(200).json({
    preferences,
    balances,
  });
});