import { IsPositive, IsIn, IsObject, Max, IsNumber, Min, IsDateString } from "class-validator";
import { Currency } from "@utils/Types";
import { validatedApiRoute } from "@server/core";
import constants from "@server/utils/Constants";
import { BalanceManager, PreferencesManager } from "@server/managers";
import { PreferencesForm } from "@recoil/preferences/atoms";

type BalancesMap = {
  [key in Currency]: number;
}

const breakpointsErrorMessage = "Value must be between 6 and 16";

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
  @IsNumber()
  @Min(6, {
    message: breakpointsErrorMessage,
  })
  @Max(16, {
    message: breakpointsErrorMessage,
  })
  balanceChartBreakpoints: number;
  @IsNumber()
  @Min(0)
  forecastPivotValue: number;
  @IsDateString()
  forecastPivotDate: Date;
}

export default validatedApiRoute("PUT", UpdatePreferencesRequest, async (request, response, user) => {
  const preferencesManager = new PreferencesManager();
  const balanceManager = new BalanceManager();
  
  const preferences = await preferencesManager.UpdatePreferences({
    defaultCurrency: request.body.defaultCurrency,
    monthlyBudget: request.body.monthlyBudget,
    monthlyBudgetStartDay: request.body.monthlyBudgetStartDay,
    userUID: user.userUID,
    balanceChartBreakpoints: request.body.balanceChartBreakpoints,
    forecastPivotDate: new Date(request.body.forecastPivotDate),
    forecastPivotValue: request.body.forecastPivotValue,
  }, user);
  
  const balances = await balanceManager.UpdateBalances({
    balances: request.body.balances,
    userUID: user.userUID,
  }, user);

  return response.status(200).json({
    ...preferences,
    balances: {
      ...balances.balances
    }
  } as PreferencesForm);
});