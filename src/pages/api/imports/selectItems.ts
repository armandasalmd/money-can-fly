import { apiRoute } from "@server/core";
import { ImportManager } from "@server/managers";

export default apiRoute("GET", async (request, response, user) => {
  const manager = new ImportManager(user);
  
  return response.status(200).json({
    success: true,
    items: await manager.GetImportsAsSelectItems(),
  });
});