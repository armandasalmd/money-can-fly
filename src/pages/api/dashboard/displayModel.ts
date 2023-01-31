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
import { IsArray, IsIn, IsNotEmptyObject, IsOptional } from "class-validator";

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
    new PreferencesManager().GetPreferences(user),
    loadInvestments ? investmentsManager.GetInvestments(user) : null,
  ]);

  // Requires default currency, thus loaded separately
  const [investmentsValue, cashValue] = await Promise.all([
    loadInvestmentValue ? investmentsManager.GetTotalMoneyValue(prefs.defaultCurrency, investments) : null,
    loadCashValue ? new BalanceManager().GetBalanceSummary(user, prefs.defaultCurrency) : null,
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
    result.balanceAnalysis = await new BalanceAnalysisManager(prefs, cashValue, investmentsValue).GetBalanceAnalysis(
      user,
      body.balanceAnalysisDateRange,
      investments
    );
  }

  /**
   * CategoryAnalysis section
   */
  if (sections.includes(DisplaySections.CategoryAnalysis)) {
    result.categoryAnalysis = await new CategoryAnalysisManager(prefs.defaultCurrency).GetCategoryAnalysis(
      user,
      body.categoryAnalysisDateRange
    );
  }

  return response.status(200).json(result);
});
