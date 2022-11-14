import { atom, selector } from "recoil";
import { DateRange } from "react-day-picker/dist/index";

import { Category, Currency, TransactionStatusFilter, Transaction } from "@utils/Types";
import { dateFromNow } from "@utils/Global";
import { IRecoilPaginationState } from "@hooks/useRecoilPagination";
import constants from "@utils/Constants";

export interface TransactionForm {
  amountFilter: string | undefined;
  statusFilter: TransactionStatusFilter | undefined;
  category: Category | undefined;
  currency: Currency | undefined;
  dateRange: DateRange | undefined;
  searchTerm: string;
}

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
      from: dateFromNow(-7),
      to: dateFromNow(0),
    },
    searchTerm: "",
  }
});

export const paginationLabelState = selector<string>({
  key: "paginationLabel",
  get: ({ get }) => {
    const state = get(pagedTransactionsState);
    const from = (state.currentPage - 1) * state.itemsPerPage + 1;
    const to = Math.min(from + state.itemsPerPage - 1, state.totalItems);
    return `Showing ${from}-${to} of ${state.totalItems}`;
  }
});