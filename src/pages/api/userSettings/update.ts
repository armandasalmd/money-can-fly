import { IsPositive, IsIn, IsObject, Max, IsNumber, Min, IsDateString, IsBoolean, IsNotEmpty } from "class-validator";
import { Balances, ChartColor, Currency } from "@utils/Types";
import { validatedApiRoute, validate, toFieldErrors } from "@server/core";
import constants from "@server/utils/Constants";
import { BalanceManager, CurrencyRateManager, UserSettingsManager } from "@server/managers";
import { PreferencesForm } from "@recoil/preferences/atoms";
import { IBalanceAnalysisSection, IGeneralSection } from "@server/models/mongo";
import { capitalise } from "@utils/Global";

export class UpdateBalanceAnalysisSettingsRequest implements IBalanceAnalysisSection {
  @IsNumber()
  @Min(1)
  @Max(365)
  defaultDaysAfterNow: number;
  @IsNumber()
  @Min(1)
  @Max(365)
  defaultDaysBeforeNow: number;
  @IsNumber()
  @Min(0)
  forecastPivotValue: number;
  @IsDateString()
  forecastPivotDate: Date;
  @IsBoolean()
  hideInvestmentsOnLoad: boolean;
  @IsNotEmpty()
  investmentColor: ChartColor;
  @IsNotEmpty()
  predictionColor: ChartColor;
  @IsNotEmpty()
  totalWorthColor: ChartColor;
}

export class UpdateGeneralSettingsRequest implements IGeneralSection {
  @IsIn(constants.allowed.currencies)
  defaultCurrency: Currency;
  @IsPositive()
  monthlyBudget: number;
  @IsPositive()
  @Max(31)
  monthlyBudgetStartDay: number;
  @IsObject()
  balances: Balances;  
}

export class UpdateUserSettingsRequest {
  balanceAnalysis: UpdateBalanceAnalysisSettingsRequest;
  general: UpdateGeneralSettingsRequest;
}

export default validatedApiRoute("PATCH", UpdateUserSettingsRequest, async (request, response, user) => {
  const body = request.body as UpdateUserSettingsRequest;

  if (!body || !Object.values(body).some(o => o !== undefined)) return response.status(400).json({ message: "Bad request" });
  
  const settingsManager = new UserSettingsManager(user);

  let errors = body.balanceAnalysis && validate(UpdateBalanceAnalysisSettingsRequest, body.balanceAnalysis);

  if (body.balanceAnalysis && errors.length === 0) {
    const updatedModel = await settingsManager.UpdateBalanceAnalysisSection({
      ...body.balanceAnalysis,
      forecastPivotDate: body.balanceAnalysis.forecastPivotDate
    });

    return response.status(200).json(updatedModel);
  }

  if (body.general) {
    errors = validate(UpdateGeneralSettingsRequest, body.general);
  }
  
  if (body.general && errors.length === 0) {
    const previousDefaultCurrency = await settingsManager.GetDefaultCurrency();
    if (previousDefaultCurrency !== body.general.defaultCurrency) {
      let multiplier = (await CurrencyRateManager.getInstance().convert(10000, previousDefaultCurrency, body.general.defaultCurrency)) / 10000;
      
      await settingsManager.MultiplyForecastPivotValue(multiplier);
    }

    // Update balances
    const userBalanceModel = await new BalanceManager(user).UpdateBalances(body.general.balances);

    // Update general settings
    const generalResult = await settingsManager.UpdateGeneralSection(body.general);

    return response.status(200).json({
      ...generalResult,
      balances: userBalanceModel.balances
    } as PreferencesForm);
  }
  
  return response.status(400).json({ message: capitalise(Object.values(toFieldErrors(errors))[0]) });
});