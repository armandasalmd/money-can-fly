import { IsDefined, IsMongoId } from "class-validator";
import { validatedApiRoute } from "@server/core";
import { ImportManager } from "@server/managers";
import { IImportModel } from "@server/models";

class UndoRequest {
  @IsDefined()
  @IsMongoId()
  importId: string;
}

export default validatedApiRoute("DELETE", UndoRequest, async (request, response, user) => {
  const importManager = new ImportManager(user);
  const result: IImportModel = await importManager.RunUndoImportBackgroundProcess(request.body.importId);

  return response.status(200).json({
    success: !!result,
    ...result,
  });
});
