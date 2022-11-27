import { Matches } from "class-validator";
import { validatedApiRoute } from "@server/core";
import constants from "@server/utils/Constants";
import { TransactionManager } from "@server/managers";
import { CreateTransactionRequest } from "@endpoint/transactions/create";

export class UpdateTransactionRequest extends CreateTransactionRequest  {
  @Matches(constants.objectIdRegex)
  id: string;
}

export default validatedApiRoute("PATCH", UpdateTransactionRequest, async (request, response, user) => {
  const manager = new TransactionManager();
  const result = await manager.UpdateTransaction(request.body, user);

  return response.status(200).json(result);
});
