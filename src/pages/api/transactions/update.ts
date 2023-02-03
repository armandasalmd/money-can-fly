import { IsMongoId } from "class-validator";
import { validatedApiRoute } from "@server/core";
import { TransactionManager } from "@server/managers";
import { CreateTransactionRequest } from "@endpoint/transactions/create";

export class UpdateTransactionRequest extends CreateTransactionRequest  {
  @IsMongoId()
  id: string;
}

export default validatedApiRoute("PATCH", UpdateTransactionRequest, async (request, response, user) => {
  const manager = new TransactionManager(user);
  const result = await manager.UpdateTransaction(request.body);

  return response.status(200).json(result);
});
