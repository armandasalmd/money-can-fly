import { IsBoolean, IsNotEmpty } from "class-validator";
import { validatedApiRoute } from "@server/core";
import { Money } from "@utils/Types";
import { InvestmentsManager } from "@server/managers";

export class CreateInvestmentRequest {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  initialDeposit: Money;
  @IsBoolean()
  subtractFromBalance: boolean;
}

export default validatedApiRoute("POST", CreateInvestmentRequest, async (request, response, user) => {
  const investmentsManager = new InvestmentsManager();
  const investment = await investmentsManager.CreateInvestment(user, request.body);

  return response.status(200).json({
    success: investment != null,
    investment,
  });
});
