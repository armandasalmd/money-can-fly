import { IsMongoId } from "class-validator";
import { validatedApiRoute } from "@server/core";
import { InvestmentsManager } from "@server/managers";

export class CreateInvestmentRequest {
  @IsMongoId()
  eventId: string;
}

export default validatedApiRoute("DELETE", CreateInvestmentRequest, async (request, response, user) => {
  const investmentsManager = new InvestmentsManager();
  const success = await investmentsManager.DeleteEvent(user, request.body.eventId);

  return response.status(200).json({
    success,
  });
});
