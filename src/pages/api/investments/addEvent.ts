import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  Matches,
} from "class-validator";
import { validatedApiRoute } from "@server/core";
import { Money, CreateInvestmentEvent, InvestmentEventType } from "@utils/Types";
import { InvestmentsManager } from "@server/managers";
import Constants from "@server/utils/Constants";

export class AddEventRequest implements CreateInvestmentEvent {
  @Matches(Constants.objectIdRegex)
  investmentId: string;
  @IsDateString()
  eventDate: string;
  @IsString()
  @IsIn(Constants.allowed.investmentEventTypes)
  type: InvestmentEventType;
  @IsNotEmptyObject()
  valueChange: Money;
  @IsOptional()
  @IsBoolean()
  subtractFromBalance?: boolean;
}

export default validatedApiRoute("POST", AddEventRequest, async (request, response, user) => {
  const investmentsManager = new InvestmentsManager();
  const { investmentId, ...rest } = request.body as AddEventRequest;
  const message = await investmentsManager.AddEvent(user, investmentId, rest);

  return response.status(200).json({
    success: !message,
    message
  });
});
