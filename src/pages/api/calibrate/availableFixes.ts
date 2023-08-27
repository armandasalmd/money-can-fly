import { IsArray } from "class-validator";

import { validatedApiRoute } from "@server/core";
import { CalibrationManager } from "@server/managers";
import { CalibrateCurrencyRow, ExchangeFix, Money } from "@utils/Types";

class AvailableFixesRequest {
  @IsArray()
  targets: CalibrateCurrencyRow[];
}

export class AvailableFixesResponse {
  exchangeFixes: ExchangeFix[];
  trendFixes: Money[];
}

export default validatedApiRoute("POST", AvailableFixesRequest, async (request, response, user) => {
  response.status(200).json(await new CalibrationManager(user).GetAvailableFixes(request.body?.targets ?? []));
});
