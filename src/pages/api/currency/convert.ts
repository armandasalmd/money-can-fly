import { IsIn, IsPositive, IsDateString } from "class-validator";

import { validatedApiRoute } from "@server/core";
import { CurrencyRateManager } from "@server/managers";
import { Currency } from "@utils/Types";
import constants from "@server/utils/Constants";

class ConvertRequest {
  @IsIn(constants.allowed.currencies)
  from: Currency;
  @IsIn(constants.allowed.currencies)
  to: Currency;
  @IsPositive()
  amount: number;
  @IsDateString()
  date: string;
}

export default validatedApiRoute("POST", ConvertRequest, async (request, response) => {
  const body: ConvertRequest = request.body;
  const result = await CurrencyRateManager.getInstance().convert(body.amount, body.from, body.to, new Date(body.date));

  return response.status(200).json(result);
});
