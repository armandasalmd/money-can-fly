import { atom, selector } from "recoil";

import { IRecoilPaginationState } from "@hooks/useRecoilPagination";
import { Transaction, TransactionForm, TransactionWithOptions } from "@utils/Types";
import { dateFromNow } from "@utils/Date";
import constants from "@utils/Constants";

export const pagedTransactionsState = atom<IRecoilPaginationState<Transaction>>({
  key: "pagedTransactions",
  default: {
    currentPage: 1,
    totalItems: 0,
    itemsPerPage: constants.defaultPageSize,
    displayedItems: [],
    loading: null,
  },
});

export const selectedTransactionsState = atom<Transaction[]>({
  key: "selectedTransactions",
  default: [],
});

export const filterFormState = atom<TransactionForm>({
  key: "filterForm",
  default: {
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
  }
});

export const addEditTransactionState = atom<TransactionWithOptions>({
  key: "addEditTransaction",
  default: {
    amount: 0,
    currency: "USD",
    category: "other",
    date: new Date(),
    description: "",
    isActive: true,
    source: "cash",
    dateUpdated: new Date(),
    alterBalance: true
  }
});

export const paginationLabelState = selector<string>({
  key: "paginationLabel",
  get: ({ get }) => {
    const state = get(pagedTransactionsState);
    if (state.loading) return "Loading...";
    if (state.totalItems === 0) return "No transactions found";
    const from = (state.currentPage - 1) * state.itemsPerPage + 1;
    const to = Math.min(from + state.itemsPerPage - 1, state.totalItems);
    return `Showing ${from}-${to} of ${state.totalItems}`;
  }
});
