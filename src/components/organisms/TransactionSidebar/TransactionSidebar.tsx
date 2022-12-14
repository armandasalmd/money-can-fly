import { useEffect, useRef } from "react";
import classNames from "classnames";
import useSWRInfinite from "swr/infinite";
import { useRecoilValue, useRecoilState } from "recoil";

import { TransactionSearchForm, TransactionList } from "@molecules/index";
import { filterFormState, transactionsCount } from "@recoil/dashboard/atoms";
import { subscribe, unsubscribe } from "@utils/Events";
import { Transaction, TransactionForm } from "@utils/Types";

const fetcher = (url: string, filters: TransactionForm, setTotal: (n: number) => void) => {
  const q = new URLSearchParams(url.substring(url.indexOf("?") + 1));

  return fetch(url, {
    method: "POST",
    body: JSON.stringify({
      ...filters,
      skip: parseInt(q.get("skip")) || 0,
      take: parseInt(q.get("take")) || 12,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res) => {
      setTotal(res.total);

      if (Array.isArray(res.items)) {
        return res.items.map((item: Transaction) => {
          item.date = new Date(item.date);
          return item;
        });
      } else {
        return [];
      }
    });
}
const PAGE_SIZE = 25;

export interface TransactionSidebarProps {
  searchFormOpen: boolean;
}

export default function TransactionSidebar(props: TransactionSidebarProps) {
  const classes = classNames("tSidebar", {});
  const thisRef = useRef<HTMLDivElement>(null);
  const searchForm = useRecoilValue(filterFormState);
  const [_, setTotalCount] = useRecoilState(transactionsCount);
  const { data, error, size, setSize, mutate } = useSWRInfinite<Transaction>(
    (index) => `/api/transactions/search?skip=${index * PAGE_SIZE}&take=${PAGE_SIZE}`,
    (url: string) => fetcher(url, searchForm, setTotalCount)
  );

  function onLoadMore() {
    setSize(size + 1);
  }

  const t: Transaction[] = data ? [].concat(...data) : [];

  const isLoadingInitialData = !data && !error;
  const isLoading = isLoadingInitialData || (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = t.length === 0;
  const lastFetch: Transaction[] = data ? data[data?.length - 1] : ([] as any);
  const isEnd = isEmpty || t.length < PAGE_SIZE || lastFetch?.length < PAGE_SIZE;

  function apiDeleteTransaction(id: string) {
    fetch(`/api/transactions/deleteBulk`, {
      method: "DELETE",
      body: JSON.stringify({
        ids: [id],
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => {
      mutate();
    });
  }

  useEffect(() => {
    function onFilter() {
      mutate();
    }

    subscribe("transactionSearchFormSubmit", onFilter);

    return () => {
      unsubscribe("transactionSearchFormSubmit", onFilter);
    };
  }, []);

  return (
    <div className={classes} ref={thisRef}>
      {props.searchFormOpen && <TransactionSearchForm />}
      <TransactionList showLoadMore={!isEnd} showSkeletons={isLoading} transactions={t} onLoadMore={onLoadMore} onDelete={apiDeleteTransaction} />
    </div>
  );
}
