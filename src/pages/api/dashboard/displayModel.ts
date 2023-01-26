import { validatedApiRoute } from "@server/core";
import {
  InvestmentsManager,
  PreferencesManager,
  InsightsManager,
  BalanceAnalysisManager,
  CategoryAnalysisManager,
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

  const preferencesManager = new PreferencesManager();
  const allPreferences = await preferencesManager.GetPreferences(user);
  const defaultCurrency = allPreferences.defaultCurrency;

  if (sections.includes(DisplaySections.Investments) || sections.includes(DisplaySections.Insights)) {
    const investmentsManager = new InvestmentsManager();
    const investments = await investmentsManager.GetInvestments(user);
    const investmentsValue = await investmentsManager.GetTotalMoneyValue(user, investments);
    
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
      const insightsManager = new InsightsManager();

      result.insights = await insightsManager.GetInsights(user, investmentsValue, allPreferences);
    }
  }

  /**
   * BalanceAnalysis section
   */
  if (sections.includes(DisplaySections.BalanceAnalysis)) {
    const balanceAnalysisManager = new BalanceAnalysisManager(defaultCurrency);

    result.balanceAnalysis = await balanceAnalysisManager.GetBalanceAnalysis(
      user,
      body.balanceAnalysisDateRange
    );
  }

  /**
   * CategoryAnalysis section
   */
  if (sections.includes(DisplaySections.CategoryAnalysis)) {
    const categoryAnalysisManager = new CategoryAnalysisManager(defaultCurrency);

    result.categoryAnalysis = await categoryAnalysisManager.GetCategoryAnalysis(
      user,
      body.categoryAnalysisDateRange
    );
  }

  return response.status(200).json(result);
});
