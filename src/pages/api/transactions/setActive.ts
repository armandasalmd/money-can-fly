import { IsMongoId, IsBoolean } from "class-validator";
import { validatedApiRoute } from "@server/core";
import { TransactionManager } from "@server/managers";

export class SetActiveRequest {
  @IsMongoId()
  id: string;
  @IsBoolean()
  active: boolean;
}

export default validatedApiRoute("PATCH", SetActiveRequest, async (request, response, user) => {
  const manager = new TransactionManager(user);
  const success = await manager.SetActive(request.body.id, request.body.active);

  return response.status(200).json({ success });
});