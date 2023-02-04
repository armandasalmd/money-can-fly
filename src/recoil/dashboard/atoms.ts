import { DateRange, Investment } from "@utils/Types";
import { atom } from "recoil";
import { DisplayModelResponse } from "@endpoint/dashboard/displayModel";
import { getPeriodNow } from "@utils/Global";

export { filterFormState } from "@recoil/transactions/atoms";

export const transactionsCount = atom<number>({
  key: "transactionsCount",
  default: 0,
});

export const selectedInvestment = atom<Investment>({
  key: "selectedInvestment",
  default: null,
});

export const dashboardData = atom<DisplayModelResponse>({
  key: "dashboardData",
  default: null,
});

export const balanceChartDateRange = atom<DateRange>({
  key: "balanceChartDateRange",
  default: getPeriodNow(),
});