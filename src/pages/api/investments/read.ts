import { IsMongoId } from "class-validator";
import { validatedApiRoute } from "@server/core";
import { InvestmentsManager } from "@server/managers";

class ReadInvestmentRequest {
  @IsMongoId()
  investmentId: string;
}

export default validatedApiRoute("GET", ReadInvestmentRequest, async (request, response, user) => {
  const result = await new InvestmentsManager().GetInvestment(user, (request.query as any).investmentId);
  return response.status(200).json(result);
});