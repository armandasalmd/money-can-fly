import { IsBoolean, IsDateString, IsNotEmpty, MaxDate,  } from "class-validator";
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
  @IsDateString()
  startDate: Date;
}

export default validatedApiRoute("POST", CreateInvestmentRequest, async (request, response, user) => {
  const investmentsManager = new InvestmentsManager();

  request.body.startDate = new Date(request.body.startDate);

  const investment = await investmentsManager.CreateInvestment(user, request.body);

  return response.status(200).json({
    success: investment != null,
    investment,
  });
});
