import { IsDefined, Matches } from "class-validator";
import { validatedApiRoute } from "@server/core";
import { ImportManager } from "@server/managers";
import { IImportModel } from "@server/models";
import constants from "@server/utils/Constants";

class UndoRequest {
  @IsDefined()
  @Matches(constants.objectIdRegex)
  importId: string;
}

export default validatedApiRoute("DELETE", UndoRequest, async (request, response, user) => {
  const importManager = new ImportManager();
  const result: IImportModel = await importManager.RunUndoImportBackgroundProcess(request.body.importId, user);

  return response.status(200).json({
    success: !!result,
    ...result,
  });
});
