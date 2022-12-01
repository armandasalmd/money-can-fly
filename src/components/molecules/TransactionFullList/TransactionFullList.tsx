import { useRecoilState, useRecoilValue } from "recoil";
import { useCallback, useEffect } from "react";

import TransactionFullListItem from "./TransactionFullListItem";
import { Pagination } from "@molecules/index";
import { useRecoilPagination, IRecoilPaginationFetchResponse } from "@hooks/index";
import { Transaction } from "@utils/Types";
import { Empty, Loader } from "@atoms/index";
import { pagedTransactionsState, filterFormState } from "@recoil/transactions/atoms";
import { subscribe, unsubscribe } from "@utils/Events";

export interface PredictionPreviewListProps {
  selectedTransactions: Transaction[];
  setSelectedTransactions: (transactions: Transaction[]) => void;
  scrollToTop: () => void;
  onEdit: (transaction: Transaction) => void;
}

export default function TransactionFullList(props: PredictionPreviewListProps) {
  const { selectedTransactions, setSelectedTransactions } = props;
  const filterForm = useRecoilValue(filterFormState);
  const { currentData, currentPage, maxPage, jump, isEmpty, reset } = useRecoilPagination<Transaction>(
    pagedTransactionsState,
    transactionsFetcher,
    postPageChange
  );

  const [displayState, setDisplayState] = useRecoilState(pagedTransactionsState);
  const { loading } = displayState;

  function onSelect(t: Transaction) {
    if (selectedTransactions.includes(t)) {
      setSelectedTransactions([...selectedTransactions.filter((st) => st._id !== t._id)]);
    } else {
      setSelectedTransactions([...selectedTransactions, t]);
    }
  }

  async function transactionsFetcher(
    page: number,
    size: number,
    extra: any
  ): Promise<IRecoilPaginationFetchResponse<Transaction>> {
    return fetch("/api/transactions/search", {
      method: "POST",
      body: JSON.stringify({
        skip: (page - 1) * size,
        take: size,
        ...(extra ? extra : filterForm),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => response.json());
  }

  function postPageChange() {
    setSelectedTransactions([]);
    props.scrollToTop();
  }

  function onSearch(event: CustomEvent) {
    reset(event.detail);
  }

  function toggleActive(transaction: Transaction) {
    fetch("/api/transactions/setActive", {
      method: "PATCH",
      body: JSON.stringify({
        id: transaction._id,
        active: !transaction.isActive,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          const itemIdx = displayState.displayedItems.findIndex((t) => t._id === transaction._id)
          
          if (itemIdx > -1) {
            const newItems = [...displayState.displayedItems];

            newItems[itemIdx] = {
              ...newItems[itemIdx],
              isActive: !newItems[itemIdx].isActive,
            };

            setDisplayState({
              ...displayState,
              displayedItems: newItems,
            });
          }
        }
      });
  }

  const onSearchCallback = useCallback(onSearch, [reset]);

  useEffect(() => {
    subscribe("transactionSearchFormSubmit", onSearchCallback);
    subscribe("mutateTransactions", onSearchCallback);

    return () => {
      unsubscribe("transactionSearchFormSubmit", onSearchCallback);
      unsubscribe("mutateTransactions", onSearchCallback);
    };
  }, [onSearchCallback]);

  return (
    <div className="tFullList">
      <div className="tFullList__items">
        {currentData?.map((t, index) => (
          <TransactionFullListItem
            onEdit={props.onEdit}
            onToggleActive={toggleActive}
            onSelect={onSelect}
            selected={selectedTransactions.includes(t)}
            transaction={t}
            key={index}
          />
        ))}
        {isEmpty && !loading ? (
          <div className="tFullList__empty">
            <Empty text="No transactions found" />
          </div>
        ) : null}
        {isEmpty && loading && <Loader hasMarginY text="Getting transactions" />}
      </div>
      {maxPage > 0 && !isEmpty && (
        <div className="tFullList__pagination">
          <Pagination jump={jump} maxPage={maxPage} currentPage={currentPage} />
        </div>
      )}
    </div>
  );
}
