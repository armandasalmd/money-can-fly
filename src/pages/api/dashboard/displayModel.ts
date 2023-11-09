import { IsArray, IsIn, IsNotEmptyObject, IsOptional, isDateString } from "class-validator";

import { validatedApiRoute } from "@server/core";
import {
  InvestmentsManager,
  UserSettingsManager,
  InsightsManager,
  BalanceAnalysisManager,
  CategoryAnalysisManager,
  BalanceManager,
  InvestmentChartManager,
  SpendingAnalysisManager
} from "@server/managers";
import { BalanceAnalysisModel, CategoryAnalysisModel, InsightsModel, InvestmentsModel, SpendingAnalysisModel } from "@server/models";
import { DateRange, DisplaySections } from "@utils/Types";
import { toUTCDate } from "@utils/Date";
import { getDefaultDateRangeFromSettings } from "@server/utils/DateRange";

export class DisplayModelRequest {
  @IsArray()
  @IsIn(Object.values(DisplaySections), {
    each: true,
  })
  sections: DisplaySections[];
  @IsOptional()
  @IsNotEmptyObject({
    nullable: true,
  })
  balanceAnalysisDateRange: Required<DateRange>;
  @IsOptional()
  @IsNotEmptyObject({
    nullable: true,
  })
  categoryAnalysisDateRange: Required<DateRange>;
  @IsOptional()
  spendingChartRanges: Required<DateRange>[];
}

export class DisplayModelResponse {
  balanceAnalysis: BalanceAnalysisModel;
  categoryAnalysis: CategoryAnalysisModel;
  insights: InsightsModel;
  investments: InvestmentsModel;
  spendingAnalysis: SpendingAnalysisModel;
}

export default validatedApiRoute("POST", DisplayModelRequest, async (request, response, user) => {
  const body = request.body as DisplayModelRequest;
  const sections = body.sections;
  const result: Partial<DisplayModelResponse> = {};
  const investmentsManager = new InvestmentsManager();
  const balanceManager = new BalanceManager(user);

  const loadInvestments =
    sections.includes(DisplaySections.Investments) ||
    sections.includes(DisplaySections.Insights) ||
    sections.includes(DisplaySections.BalanceAnalysis);
  const loadCashValue =
    sections.includes(DisplaySections.Insights) || sections.includes(DisplaySections.BalanceAnalysis);

  const [userSettings, investments, balances] = await Promise.all([
    new UserSettingsManager(user).ReadFull(),
    loadInvestments ? investmentsManager.GetBasicInvestments(user) : null,
    loadCashValue ? balanceManager.GetBalances() : null
  ]);
  const defaultCurrency = userSettings.generalSection.defaultCurrency;

  // Requires default currency, thus loaded separately
  const [investmentsValue, cashValue] = await Promise.all([
    loadInvestments ? investmentsManager.GetTotalMoneyValue(defaultCurrency, investments) : null,
    loadCashValue ? new BalanceManager(user).GetBalanceSummary(balances, defaultCurrency) : null,
  ]);

  /**
   * Investments section
   */
  if (sections.includes(DisplaySections.Investments)) {
    result.investments = {
      totalValue: investmentsValue,
      investments: investmentsManager.ToSummary(investments),
      profitChart: await new InvestmentChartManager(defaultCurrency).CalculateProfitChart(investments)
    };
  }

  /**
   * Insights section
   */
  if (sections.includes(DisplaySections.Insights)) {
    result.insights = await new InsightsManager(cashValue).GetInsights(user, investmentsValue, userSettings);
  }
  
  /**
   * BalanceAnalysis section
   */
  if (sections.includes(DisplaySections.BalanceAnalysis)) {
    let dateRange = body.balanceAnalysisDateRange || getDefaultDateRangeFromSettings(userSettings.balanceAnalysisSection);

    if (isDateString(dateRange.from)) dateRange.from = toUTCDate(new Date(dateRange.from));
    if (isDateString(dateRange.to)) dateRange.to = toUTCDate(new Date(dateRange.to));

    result.balanceAnalysis = await new BalanceAnalysisManager(user, userSettings).GetBalanceAnalysis(
      dateRange,
      cashValue,
      investmentsValue,
      investments
    );
  }
  
  /**
   * CategoryAnalysis section
   */
  if (sections.includes(DisplaySections.CategoryAnalysis)) {
    const dateRange = body.categoryAnalysisDateRange;

    if (!dateRange) return response.status(400).json({ error: "Missing date range" });
    if (isDateString(dateRange.from)) dateRange.from = new Date(dateRange.from);
    if (isDateString(dateRange.to)) dateRange.to = new Date(dateRange.to);

    result.categoryAnalysis = await new CategoryAnalysisManager(defaultCurrency).GetCategoryAnalysis(
      user,
      body.categoryAnalysisDateRange
    );
  }
  
  /**
   * SpendingAnalysis section
   */
  if (sections.includes(DisplaySections.SpendingAnalysis)) {
    result.spendingAnalysis = await new SpendingAnalysisManager(user, userSettings).Calculate(body.spendingChartRanges);
  }

  return response.status(200).json(result);
});
