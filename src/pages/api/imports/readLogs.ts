import { validatedApiRoute } from "@server/core";
import { ImportManager } from "@server/managers";
import { IsMongoId } from "class-validator";

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
}

export default validatedApiRoute("GET", ReadLogsRequest, async (request, response, user) => {
  const result = await new ImportManager(user).ReadLogs(request.query.importId as string);

  return response.status(200).json({
    success: !!result,
    result,
  });
});
