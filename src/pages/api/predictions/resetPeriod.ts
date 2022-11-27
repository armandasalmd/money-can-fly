import { validatedApiRoute } from "@server/core";
import { PeriodPredictionManager } from "@server/managers";
import constants from "@server/utils/Constants";
import { Matches } from "class-validator";

export class ResetPeriodRequest {
  @Matches(constants.objectIdRegex)
  predictionId: string;
}

export default validatedApiRoute("DELETE", ResetPeriodRequest, async (request, response, user) => {
  const periodPredictionManager = new PeriodPredictionManager();
  const success = await periodPredictionManager.ResetPeriod(request.body.predictionId, user);

  return response.status(200).json({
    success
  });
});