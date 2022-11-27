import { Matches, IsBoolean } from "class-validator";
import { validatedApiRoute } from "@server/core";
import constants from "@server/utils/Constants";
import { TransactionManager } from "@server/managers";

export class SetActiveRequest {
  @Matches(constants.objectIdRegex)
  id: string;
  @IsBoolean()
  active: boolean;
}

export default validatedApiRoute("PATCH", SetActiveRequest, async (request, response, user) => {
  const manager = new TransactionManager();
  const success = await manager.SetActive(request.body.id, request.body.active, user);

  return response.status(200).json({ success });
});