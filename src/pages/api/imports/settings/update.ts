import { IsArray, IsString, IsNotEmptyObject, Validate } from "class-validator";

import { CategoryFallbacks } from "@utils/Types";
import { validatedApiRoute } from "@server/core";
import { ImportSettingsManager } from "@server/managers";
import { IImportSettingsModel } from "@server/models";
import { IsCategoryMap } from "@server/core/validation";

export class UpdateSettingsRequest implements Omit<IImportSettingsModel, "userUID"> {
  @IsArray()
  @IsString({ each: true })
  ignoreTerms: string[];
  @IsNotEmptyObject()
  @Validate(IsCategoryMap)
  categoryFallbacks: CategoryFallbacks;
}

export default validatedApiRoute("PUT", UpdateSettingsRequest, async (request, response, user) => {
  return response.status(200).json(await new ImportSettingsManager(user).UpdateSettings(request.body));
});