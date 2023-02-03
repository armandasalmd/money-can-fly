import { IsIn, IsMongoId, IsNotEmptyObject, IsOptional, Max, Min, MinLength, ValidateIf } from "class-validator";

import { validatedApiRoute } from "@server/core";
import { TransactionManager } from "@server/managers";
import constants from "@server/utils/Constants";
import { ITransactionModel } from "@server/models";
import { TransactionForm, Category, Currency, TransactionStatusFilter, AmountFilter, DateRange } from "@utils/Types";

const { allowed } = constants;

export class SearchRequest implements TransactionForm {
  @IsOptional()
  @IsIn([...allowed.amountFilters, ""])
  amountFilter?: AmountFilter;

  @IsOptional()
  @IsIn([...allowed.transactionStatusFilters, ""])
  statusFilter?: TransactionStatusFilter;

  @IsOptional()
  @IsIn([...allowed.categories, ""])
  category?: Category;

  @IsOptional()
  @IsIn([...allowed.currencies, ""])
  currency?: Currency;

  @IsOptional()
  @IsNotEmptyObject()
  dateRange: DateRange;

  @IsOptional()
  @MinLength(0)
  searchTerm: string;

  @IsOptional()
  @ValidateIf(o => o.importId !== "")
  @IsMongoId()
  importId?: string;

  @Min(0)
  skip: number;
  @Min(1)
  @Max(100)
  take: number;
}

export class SearchResponse {
  items: ITransactionModel[];
  total: number;
}

export default validatedApiRoute("POST", SearchRequest, async (request, response, user) => {
  if (request.body.dateRange) {
    if (typeof request.body.dateRange.from === "string") {
      request.body.dateRange.from = new Date(request.body.dateRange.from);
    }
    
    if (typeof request.body.dateRange.to === "string") {
      request.body.dateRange.to = new Date(request.body.dateRange.to);
    }
  }
  
  const manager = new TransactionManager(user);
  const result = await manager.Search(request.body);

  return response.status(200).json({
    success: true,
    end: request.body.skip + request.body.take >= result.total,
    ...result,
  });
});
