import { withUser } from "@server/core";
import { CurrencyRateManager } from "@server/managers";

export default withUser("GET", async (request, response) => {
  const { date } = request.query;
  
  if (!Array.isArray(date) && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const manager = new CurrencyRateManager();
    const result = await manager.getRate(new Date(date));

    return response.status(200).json(result);
  }

  return response.status(400).json({ success: false, message: "Bad Request" });
});
