import { apiRoute } from "@server/core";
import { BalanceManager } from "@server/managers";

export default apiRoute("GET", async (_, response, user) => response.status(200).json((await new BalanceManager(user).GetBalances()).balances));
