import { IsIn, IsPositive, Min, Max, IsArray, IsDateString, ArrayMaxSize, ArrayMinSize } from "class-validator";

import { validatedApiRoute } from "@server/core";
import { Currency } from "@utils/Types";
import constants from "@server/utils/Constants";
import { PeriodPredictionManager } from "@server/managers";

export class PeriodWeekRequest {
  @Min(1)
  @Max(5)
  week: number;
  @IsPositive()
  moneyIn: number;
  @IsPositive()
  moneyOut: number;
}

export class SetPeriodRequest {
  @IsDateString()
  periodMonth: string;
  @IsIn(constants.allowed.currencies)
  currency: Currency;
  @IsArray()
  @ArrayMinSize(4)
  @ArrayMaxSize(5)
  predictions: PeriodWeekRequest[];
}

export default validatedApiRoute("PUT", SetPeriodRequest, async (request, response, user) => {
  const periodPredictionManager = new PeriodPredictionManager();
  const success = await periodPredictionManager.SetPeriod(request.body, user);

  return response.status(200).json({
    success
  });
});