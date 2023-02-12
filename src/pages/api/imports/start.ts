import constants from "@server/utils/Constants";
import { Currency, TransactionBank } from "@utils/Types";
import { IsBoolean, IsDefined, IsIn, IsOptional, IsString } from "class-validator";
import { validatedApiRoute } from "@server/core";
import { ImportManager } from "@server/managers";

export class StartImportRequest{
  @IsBoolean()
  alterBalance: boolean;
  @IsDefined()
  @IsString()
  csvData: string;
  @IsDefined()
  @IsString()
  csvFileName: string;
  @IsIn(constants.allowed.sources)
  bank: TransactionBank;
  @IsOptional()
  @IsString()
  ignoreDescriptionPattern: string;
  @IsIn(constants.allowed.currencies)
  defaultCurrency: Currency;
  @IsOptional()
  @IsString()
  categoryColumn?: string;
  @IsDefined()
  @IsString()
  transactionDateColumn: string;
  @IsDefined()
  @IsString()
  descriptionColumn: string;
  @IsDefined()
  @IsString()
  amountColumn: string;
  @IsOptional()
  @IsString()
  currencyColumn?: string;
  @IsOptional()
  @IsString()
  transactionFeeColumn?: string;
}

export default validatedApiRoute("POST", StartImportRequest, async (request, response, user) => {
  // this route is not protected by middleware, so we need to check if user is logged in
  // middleware cannot handle big payloads in body
  if (!user) return response.status(401).json({ success: false, message: "Unauthorized" });

  const importManager = new ImportManager(user);
  const newImport = await importManager.RunImportBackgroundProcess(request.body);

  return response.status(200).json({ success: true, import: newImport });
});