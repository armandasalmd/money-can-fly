import { apiRoute } from "@server/core";
import { CalibrationManager } from "@server/managers";
import { isMoney } from "@server/utils/Currency";

export default apiRoute("POST", async (request, response, user) => response.status(200).json(isMoney(request.body) && await new CalibrationManager(user).ApplyTrendFix(request.body)));
