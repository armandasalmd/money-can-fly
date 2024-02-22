import { format } from "date-fns";
import { atom, selector } from "recoil";

import { DisplayModelResponse } from "@endpoint/dashboard/displayModel";
import { getOneMonthRange, dateFromNow } from "@utils/Date";
import { amountFilterSelect, currencySelect, searchCategoryPreset, transactionStatusFilterSelect } from "@utils/SelectItems";
import { DateRange, TransactionForm } from "@utils/Types";

export const DEFAULT_FILTER_FORM: TransactionForm = {
  amountFilter: undefined,
  statusFilter: undefined,
  category: "notInvestments",
  currency: undefined,
  dateRange: {
    from: dateFromNow(-365 * 5),
    to: dateFromNow(1),
  },
  searchTerm: "",
  importId: undefined,
};

export const dashboardData = atom<DisplayModelResponse>({
  key: "dashboardData",
  default: null,
});

export const balanceChartDateRange = atom<DateRange>({
  key: "balanceChartDateRange",
  default: null,
});

export const spendingChartDateRanges = atom<DateRange[]>({
  key: "spendingChartDateRanges",
  default: [getOneMonthRange(undefined, -2), getOneMonthRange(undefined, -1), getOneMonthRange()],
});

export const filterFormState = atom<TransactionForm>({
  key: "dashboardFilterForm",
  default: DEFAULT_FILTER_FORM
});

export const selectedFilterTags = selector<string[]>({
  key: "selectedFilterTags",
  get: ({ get }) => {
    const state = get(filterFormState);
    const tags: string[] = [];

    if (state.dateRange && state.dateRange.to) {
      tags.push(`${format(state.dateRange.from, "yyyy.MM.dd")} - ${format(state.dateRange.to, "yyyy.MM.dd")}`);
    }

    if (state.category) {
      tags.push(searchCategoryPreset.find(o => o.value === state.category)?.label);
    }

    if (state.currency) {
      tags.push(currencySelect[state.currency]);
    }

    if (state.statusFilter) {
      tags.push(transactionStatusFilterSelect[state.statusFilter]);
    }

    if (state.amountFilter) {
      tags.push(amountFilterSelect[state.amountFilter]);
    }

    if (state.searchTerm) {
      tags.push(`Match: ${state.searchTerm}`);
    }

    return tags;
  }
});

export const transactionsCount = atom<number>({
  key: "transactionsCount",
  default: 0,
});
