import { IsDateString } from "class-validator";

import { validatedApiRoute } from "@server/core";
import { CurrencyRateManager } from "@server/managers";

class GetRateRequest {
  @IsDateString()
  date: string;
}

export default validatedApiRoute("GET", GetRateRequest, async (request, response) => {
  const result = await CurrencyRateManager.getInstance().getRate(new Date(request.query.date as string));

  return response.status(200).json(result);
});
