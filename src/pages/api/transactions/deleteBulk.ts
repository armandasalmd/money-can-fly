import { Matches, IsArray } from "class-validator";
import { validatedApiRoute } from "@server/core";
import constants from "@server/utils/Constants";
import { TransactionManager } from "@server/managers";

export class DeleteBulkTransactionsRequest {
  @IsArray()
  @Matches(constants.objectIdRegex, {
    each: true,
  })
  ids: string[];
}

export default validatedApiRoute("DELETE", DeleteBulkTransactionsRequest, async (request, response, user) => {
  const manager = new TransactionManager();
  const deletedIds = await manager.BulkDeleteTransactions(request.body.ids, user);

  return response.status(200).json({ success: true, deletedIds });
});