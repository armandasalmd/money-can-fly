import { apiRoute } from "@server/core";
import { ImportSettingsManager } from "@server/managers";

export default apiRoute("GET", async (_, response, user) => {
  return response.status(200).json(await new ImportSettingsManager(user).GetSettings());
});