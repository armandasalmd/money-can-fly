import { IsDefined, IsMongoId } from "class-validator";
import { validatedApiRoute } from "@server/core";
import { UndoImportProcessManager } from "@server/managers/importProcess";

class UndoRequest {
  @IsDefined()
  @IsMongoId()
  importId: string;
}

export default validatedApiRoute("DELETE", UndoRequest, async (request, response, user) => {
  const result = await new UndoImportProcessManager(user, request.body.importId).StartProcess();

  return response.status(200).json({
    success: !!result,
    ...result,
  });
});
