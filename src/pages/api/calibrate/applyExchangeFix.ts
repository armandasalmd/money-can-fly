import { apiRoute } from "@server/core";
import { CalibrationManager } from "@server/managers";
import { isMoney } from "@server/utils/Currency";

export default apiRoute("POST", async (request, response, user) => response.status(200).json(request.body && isMoney(request.body.from) && isMoney(request.body.to) && await new CalibrationManager(user).ApplyExchangeFix(request.body)));
