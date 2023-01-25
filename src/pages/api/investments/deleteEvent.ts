import { Matches } from "class-validator";
import { validatedApiRoute } from "@server/core";
import { InvestmentsManager } from "@server/managers";
import Constants from "@server/utils/Constants";

export class CreateInvestmentRequest {
  @Matches(Constants.objectIdRegex)
  eventId: string;
}

export default validatedApiRoute("DELETE", CreateInvestmentRequest, async (request, response, user) => {
  const investmentsManager = new InvestmentsManager();
  const success = await investmentsManager.DeleteEvent(user, request.body.eventId);

  return response.status(200).json({
    success,
  });
});
