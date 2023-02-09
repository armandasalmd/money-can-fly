import { IsDateString, IsNumberString, IsOptional } from "class-validator";
import { validatedApiRoute } from "@server/core";
import { PeriodPredictionManager } from "@server/managers";

class ReadPredictionsRequest {
  @IsOptional()
  @IsNumberString()
  year: number;
  @IsOptional()
  @IsDateString()
  month: Date;
}

export default validatedApiRoute("GET", ReadPredictionsRequest, async (request, response, user) => {
  const periodPredictionManager = new PeriodPredictionManager(user);
  
  if (request.query.year) {
    return response.status(200).json(await periodPredictionManager.GetPredictions(parseInt(request.query.year as string)));
  } else if (request.query.month) {
    return response.status(200).json(await periodPredictionManager.GetPredictionByMonth(new Date(request.query.month as string)));
  }

  return response.status(400).json({ error: "Invalid request" });
});