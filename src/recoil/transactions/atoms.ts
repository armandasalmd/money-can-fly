import { atom, selector } from "recoil";

import { Transaction, TransactionForm } from "@utils/Types";
import { dateFromNow } from "@utils/Global";
import { IRecoilPaginationState } from "@hooks/useRecoilPagination";
import constants from "@utils/Constants";
import { getDefaultMoney } from "@utils/Currency";

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
    category: undefined,
    currency: undefined,
    dateRange: {
      from: dateFromNow(-365 * 5),
      to: dateFromNow(1),
    },
    searchTerm: "",
    importId: undefined,
  }
});

export const addEditTransactionState = atom<Transaction>({
  key: "addEditTransaction",
  default: {
    ...getDefaultMoney(false),
    category: "other",
    date: new Date(),
    description: "",
    isActive: true,
    source: "cash",
    inserted: new Date(),
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