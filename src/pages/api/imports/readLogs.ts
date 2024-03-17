import { IsMongoId } from "class-validator";
import { validatedApiRoute } from "@server/core";
import { ImportManager } from "@server/managers";
import { ImportState, Transaction } from "@utils/Types";

class ReadLogsRequest {
  @IsMongoId()
  importId: string;
}

export class ReadLogsResponse {
  logs: string[];
  message: string;
  date: Date;
  balanceWasAltered: boolean;
  source: string;
  fileName: string;
  importState: ImportState;
  importId: string;
  importItems: Transaction[];
}

export default validatedApiRoute("GET", ReadLogsRequest, async (request, response, user) => {
  const result = await new ImportManager(user).ReadLogs(request.query.importId as string);

  return response.status(200).json({
    success: !!result,
    data: result,
  });
});
