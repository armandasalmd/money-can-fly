import { IsBooleanString, IsOptional } from "class-validator";
import { validatedApiRoute } from "@server/core";
import { BalanceManager, UserSettingsManager } from "@server/managers";
import { IBalanceAnalysisSection, IGeneralSection, IUserBalanceModel } from "@server/models";

export class ReadUserSettingsRequest {
  @IsOptional()
  @IsBooleanString()
  balanceAnalysis: string | boolean;
  @IsOptional()
  @IsBooleanString()
  general: string | boolean;
}

export interface ReadUserSettingsResponse {
  balanceAnalysis: IBalanceAnalysisSection;
  general: IGeneralSection & IUserBalanceModel;
}

export default validatedApiRoute("GET", ReadUserSettingsRequest, async (request, response, user) => {
  const includeBalanceAnalysis = request.query.balanceAnalysis === "true";
  const includeGeneral = request.query.general === "true";

  const settingsManager = new UserSettingsManager(user);

  const [balanceAnalysisResult, generalResult, userBalanceResult] = await Promise.all([
    includeBalanceAnalysis ? settingsManager.ReadBalanceAnalysisSection() : undefined,
    includeGeneral ? settingsManager.ReadGeneralSection() : undefined,
    includeGeneral ? new BalanceManager(user).GetBalances() : undefined,
  ]);

  const result: Partial<ReadUserSettingsResponse> = {};

  if (balanceAnalysisResult) {
    result.balanceAnalysis = balanceAnalysisResult;
  }

  if (generalResult && userBalanceResult) {
    result.general = {
      ...generalResult,
      balances: { ...userBalanceResult.balances },
      userUID: null
    };
  }

  return response.status(200).json(result);
});
