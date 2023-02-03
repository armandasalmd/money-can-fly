import { validatedApiRoute } from "@server/core";
import {
  InvestmentsManager,
  PreferencesManager,
  InsightsManager,
  BalanceAnalysisManager,
  CategoryAnalysisManager,
  BalanceManager,
} from "@server/managers";
import { BalanceAnalysisModel, CategoryAnalysisModel, InsightsModel, InvestmentsModel } from "@server/models";
import { DateRange, DisplaySections } from "@utils/Types";
import { IsArray, IsIn, IsNotEmptyObject, IsOptional, isDateString } from "class-validator";

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
}

export class DisplayModelResponse {
  balanceAnalysis: BalanceAnalysisModel;
  categoryAnalysis: CategoryAnalysisModel;
  insights: InsightsModel;
  investments: InvestmentsModel;
}

export default validatedApiRoute("POST", DisplayModelRequest, async (request, response, user) => {
  const body = request.body as DisplayModelRequest;
  const sections = body.sections;
  const result: Partial<DisplayModelResponse> = {};
  const investmentsManager = new InvestmentsManager();

  const loadInvestments =
    sections.includes(DisplaySections.Investments) ||
    sections.includes(DisplaySections.Insights) ||
    sections.includes(DisplaySections.BalanceAnalysis);
  const loadCashValue =
    sections.includes(DisplaySections.Insights) || sections.includes(DisplaySections.BalanceAnalysis);
  const loadInvestmentValue = loadInvestments;

  const [prefs, investments] = await Promise.all([
    new PreferencesManager(user).GetPreferences(),
    loadInvestments ? investmentsManager.GetInvestments(user) : null,
  ]);

  // Requires default currency, thus loaded separately
  const [investmentsValue, cashValue] = await Promise.all([
    loadInvestmentValue ? investmentsManager.GetTotalMoneyValue(prefs.defaultCurrency, investments) : null,
    loadCashValue ? new BalanceManager(user).GetBalanceSummary(prefs.defaultCurrency) : null,
  ]);

  /**
   * Investments section
   */
  if (sections.includes(DisplaySections.Investments)) {
    result.investments = {
      totalValue: investmentsValue,
      investments,
    };
  }

  /**
   * Insights section
   */
  if (sections.includes(DisplaySections.Insights)) {
    result.insights = await new InsightsManager(cashValue).GetInsights(user, investmentsValue, prefs);
  }

  /**
   * BalanceAnalysis section
   */
  if (sections.includes(DisplaySections.BalanceAnalysis)) {
    const dateRange = body.balanceAnalysisDateRange;

    if (!dateRange) return response.status(400).json({ error: "Missing date range" });
    if (isDateString(dateRange.from)) dateRange.from = new Date(dateRange.from);
    if (isDateString(dateRange.to)) dateRange.to = new Date(dateRange.to);

    result.balanceAnalysis = await new BalanceAnalysisManager(prefs, cashValue, investmentsValue).GetBalanceAnalysis(
      user,
      dateRange,
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

    result.categoryAnalysis = await new CategoryAnalysisManager(prefs.defaultCurrency).GetCategoryAnalysis(
      user,
      body.categoryAnalysisDateRange
    );
  }

  return response.status(200).json(result);
});
