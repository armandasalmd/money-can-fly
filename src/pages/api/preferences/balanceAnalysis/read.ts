import { apiRoute } from "@server/core";
import { PreferencesManager } from "@server/managers";
import { IBalanceAnalysisSection } from "@server/models";

export default apiRoute("GET", async (_, response, user) => {
  const balanceAnalysisPreferences: IBalanceAnalysisSection = await new PreferencesManager(user).GetGeneralPreferences();
  
  return response.status(200).json(balanceAnalysisPreferences);
});