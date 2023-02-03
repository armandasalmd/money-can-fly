import { apiRoute } from "@server/core";
import { BalanceManager, PreferencesManager } from "@server/managers";
import { PreferencesForm } from "@recoil/preferences/atoms";

export default apiRoute("GET", async (_, response, user) => {
  const preferencesManager = new PreferencesManager(user);
  const balanceManager = new BalanceManager(user);

  const preferences = await preferencesManager.GetPreferences();
  const balances = await balanceManager.GetBalances();
  
  const result = {
    defaultCurrency: preferences.defaultCurrency || "USD",
    monthlyBudget: preferences.monthlyBudget || 0,
    monthlyBudgetStartDay: preferences.monthlyBudgetStartDay || 1,
    balanceChartBreakpoints: preferences.balanceChartBreakpoints || 12,
    forecastPivotValue: preferences.forecastPivotValue || 0,
    forecastPivotDate: preferences.forecastPivotDate || new Date(),
    balances: {
      ...balances.balances
    }
  } as PreferencesForm;

  return response.status(200).json(result);
});