import { IsNumberString } from "class-validator";
import { validatedApiRoute } from "@server/core";
import { ImportManager } from "@server/managers";
import { IImportModel } from "@server/models";

class ReadImportsRequest {
  @IsNumberString()
  skip: number;
  @IsNumberString()
  take: number;
}

export class ReadImportsResponse {
  items: IImportModel[];
  total: number;
}

export default validatedApiRoute("GET", ReadImportsRequest, async (request, response, user) => {
  const skip = parseInt(request.query.skip as string);
  const take = parseInt(request.query.take as string);
  
  const result = await new ImportManager(user).ReadImports(skip, take);

  return response.status(200).json({
    success: true,
    ...result,
  });
});