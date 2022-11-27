import { IsNumberString, IsOptional } from "class-validator";
import { validatedApiRoute } from "@server/core";
import { PeriodPredictionManager } from "@server/managers";

class ReadPredictionsRequest {
  @IsOptional()
  @IsNumberString()
  year: number;
}

export default validatedApiRoute("GET", ReadPredictionsRequest, async (request, response, user) => {
  const periodPredictionManager = new PeriodPredictionManager();
  let year = undefined;

  if (request.query.year) {
    year = parseInt(request.query.year as string);
  }

  const result = await periodPredictionManager.GetPredictions(user, year);

  return response.status(200).json(result);
});