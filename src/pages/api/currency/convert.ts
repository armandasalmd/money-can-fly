import { withUser } from "@server/core";
import { CurrencyRateManager } from "@server/managers";
import { Currency } from "@utils/Types";

interface ConvertRequest {
  from: Currency;
  to: Currency;
  amount: number;
  date: Date;
}

export default withUser("POST", async (request, response) => {
  const manager = new CurrencyRateManager();
  const body: ConvertRequest = request.body;
  const result = await manager.convert(body.amount, body.from, body.to, new Date(body.date));

  return response.status(200).json(result);
});
