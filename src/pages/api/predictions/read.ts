import { IsNumberString, IsOptional } from "class-validator";
import { validatedApiRoute } from "@server/core";
import { PeriodPredictionManager } from "@server/managers";

class ReadPredictionsRequest {
  @IsOptional()
  @IsNumberString()
  year: number;
}

export default validatedApiRoute("GET", ReadPredictionsRequest, async (request, response, user) => {
  let year = undefined;

  if (request.query.year) {
    year = parseInt(request.query.year as string);
  }
  
  const periodPredictionManager = new PeriodPredictionManager(user);
  const result = await periodPredictionManager.GetPredictions(year);

  return response.status(200).json(result);
});