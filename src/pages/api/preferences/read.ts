import { apiRoute } from "@server/core";
import { BalanceManager, PreferencesManager } from "@server/managers";
import { PreferencesForm } from "@recoil/preferences/atoms";

export default apiRoute("GET", async (_, response, user) => {
  const preferencesManager = new PreferencesManager(user);
  const balanceManager = new BalanceManager(user);

  const [preferences, balances] = await Promise.all(
    preferencesManager.GetGeneralPreferences(),
    balanceManager.GetBalances());

  return response.status(200).json({
    ...preferences,
    balances: {
      ...balances.balances
    }
  } as PreferencesForm);
});