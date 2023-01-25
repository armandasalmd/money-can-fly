import { apiRoute } from "@server/core";
import { InvestmentsManager } from "@server/managers";

// TODO: remove this endpoint and join investments info into dashboard/displayModel
export default apiRoute("GET", async (request, response, user) => {
  const investmentsManager = new InvestmentsManager();
  const investments = await investmentsManager.GetInvestments(user);

  return response.status(200).json({
    totalValue: await investmentsManager.GetTotalMoneyValue(user, investments),
    investments,
  });
});
