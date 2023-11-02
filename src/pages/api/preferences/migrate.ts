import { apiRoute } from "@server/core";
import { PreferencesManager } from "@server/managers";

export default apiRoute("GET", async (_, response, user) => {
  const preferencesManager = new PreferencesManager(user);

  const status = await preferencesManager.MigrateAll();
  
  return response.status(200).json(status);
});