import { IsIn, IsDateString, IsString, MinLength, IsNumber, IsPositive, IsOptional, IsBoolean } from "class-validator";
import { Currency, Category, TransactionBank, Money } from "@utils/Types";
import { validatedApiRoute } from "@server/core";
import constants from "@server/utils/Constants";
import { TransactionManager } from "@server/managers";

export class CreateTransactionRequest implements Money {
  @IsNumber()
  @IsPositive({
    message: "Enter a positive amount",
  })
  amount: number;
  @IsIn(constants.allowed.currencies)
  currency: Currency;
  @IsIn(constants.allowed.categories)
  category: Category;
  @IsDateString()
  date: string;
  @IsString()
  @MinLength(1, {
    message: "Enter description",
  })
  description: string;
  @IsIn(constants.allowed.sources)
  source: TransactionBank;
  @IsOptional()
  @IsBoolean()
  isInvestment?: boolean;
  @IsOptional()
  @IsBoolean()
  alterBalance?: boolean;
}

export default validatedApiRoute("POST", CreateTransactionRequest, async (request, response, user) => {
  const manager = new TransactionManager(user);
  const result = await manager.CreateTransaction(request.body);

  return response.status(200).json(result);
});
