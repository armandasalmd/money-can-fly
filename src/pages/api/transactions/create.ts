import { IsPositive, IsIn, IsDateString, IsString, MinLength } from "class-validator";
import { Currency, Category, TransactionBank, Money } from "@utils/Types";
import { validatedApiRoute } from "@server/core";
import constants from "@server/utils/Constants";
import { TransactionManager } from "@server/managers";

export class CreateTransactionRequest implements Money {
  @IsPositive()
  amount: number;
  @IsIn(constants.allowed.currencies)
  currency: Currency;
  @IsIn(constants.allowed.categories)
  category: Category;
  @IsDateString()
  date: string;
  @IsString()
  @MinLength(1)
  description: string;
  @IsIn(constants.allowed.sources)
  source: TransactionBank;
}

export default validatedApiRoute("POST", CreateTransactionRequest, async (request, response, user) => {
  const manager = new TransactionManager();
  const result = await manager.CreateTransaction(request.body, user);

  return response.status(200).json(result);
});
