import { apiRoute } from "@server/core";
import { BalanceManager, PreferencesManager } from "@server/managers";

export default apiRoute("GET", async (request, response, user) => {
  const preferencesManager = new PreferencesManager();
  const balanceManager = new BalanceManager();
  
  const preferences = await preferencesManager.GetPreferences(user);
  const balances = await balanceManager.GetBalances(user);
  
  const result = {
    ...preferences,
    ...balances
  } as any;

  return response.status(200).json(result);
});