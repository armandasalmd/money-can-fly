import { IsMongoId } from "class-validator";
import { validatedApiRoute } from "@server/core";
import { PeriodPredictionManager } from "@server/managers";

export class ResetPeriodRequest {
  @IsMongoId()
  predictionId: string;
}

export default validatedApiRoute("DELETE", ResetPeriodRequest, async (request, response, user) => {
  const periodPredictionManager = new PeriodPredictionManager(user);
  const success = await periodPredictionManager.ResetPeriod(request.body.predictionId);

  return response.status(200).json({
    success
  });
});