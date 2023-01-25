import { validatedApiRoute } from "@server/core";
import {
  InvestmentsManager,
  PreferencesManager,
  InsightsManager,
  BalanceAnalysisManager,
  CategoryAnalysisManager,
} from "@server/managers";
import { BalanceAnalysisModel, CategoryAnalysisModel, InsightsModel, InvestmentsModel } from "@server/models";
import { DateRange } from "@utils/Types";
import { IsArray, IsIn, IsNotEmptyObject, IsOptional } from "class-validator";

enum DisplaySections {
  BalanceAnalysis = "balanceAnalysis",
  CategoryAnalysis = "categoryAnalysis",
  Insights = "insights",
  Investments = "investments",
}

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
  const defaultCurrency = await preferencesManager.GetDefaultCurrency(user);

  if (sections.includes(DisplaySections.Investments) || sections.includes(DisplaySections.Insights)) {
    const investmentsManager = new InvestmentsManager();
    const investments = await investmentsManager.GetInvestments(user);
    const investmentsValue = await investmentsManager.GetTotalMoneyValue(user, investments);

    if (sections.includes(DisplaySections.Investments)) {
      result.investments = {
        totalValue: investmentsValue,
        investments,
      };
    }

    const insightsManager = new InsightsManager(defaultCurrency);

    if (sections.includes(DisplaySections.Insights)) {
      result.insights = await insightsManager.GetInsights(user, investmentsValue);
    }
  }

  if (sections.includes(DisplaySections.BalanceAnalysis)) {
    const balanceAnalysisManager = new BalanceAnalysisManager(defaultCurrency);

    result.balanceAnalysis = await balanceAnalysisManager.GetBalanceAnalysis(
      user,
      body.balanceAnalysisDateRange
    );
  }

  if (sections.includes(DisplaySections.CategoryAnalysis)) {
    const categoryAnalysisManager = new CategoryAnalysisManager(defaultCurrency);

    result.categoryAnalysis = await categoryAnalysisManager.GetCategoryAnalysis(
      user,
      body.categoryAnalysisDateRange
    );
  }

  return response.status(200).json(result);
});
