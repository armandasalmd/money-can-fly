import { IsArray, IsMongoId } from "class-validator";
import { validatedApiRoute } from "@server/core";
import { TransactionManager } from "@server/managers";

export class DeleteBulkTransactionsRequest {
  @IsArray()
  @IsMongoId({
    each: true,
  })
  ids: string[];
}

export default validatedApiRoute("DELETE", DeleteBulkTransactionsRequest, async (request, response, user) => {
  const deletedIds = await new TransactionManager(user).BulkDeleteTransactions(request.body.ids);

  return response.status(200).json({ success: true, deletedIds });
});