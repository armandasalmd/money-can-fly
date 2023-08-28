import { DateRange, Investment } from "@utils/Types";
import { atom } from "recoil";
import { DisplayModelResponse } from "@endpoint/dashboard/displayModel";
import { getOneMonthRange } from "@utils/Date";

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
  default: getOneMonthRange(),
});

export const spendingChartDateRanges = atom<DateRange[]>({
  key: "spendingChartDateRanges",
  default: [getOneMonthRange(undefined, -2), getOneMonthRange(undefined, -1), getOneMonthRange()],
});