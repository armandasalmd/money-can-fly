import { apiRoute } from "@server/core";
import { BalanceManager, PreferencesManager } from "@server/managers";
import { PreferencesForm } from "@recoil/preferences/atoms";

export default apiRoute("GET", async (_, response, user) => {
  const preferencesManager = new PreferencesManager();
  const balanceManager = new BalanceManager();

  const preferences = await preferencesManager.GetPreferences(user);
  const balances = await balanceManager.GetBalances(user);
  
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