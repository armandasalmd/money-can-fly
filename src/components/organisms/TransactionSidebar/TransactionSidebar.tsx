import { useEffect, useRef } from "react";
import { useRecoilValue, useRecoilState } from "recoil";

import { TransactionList } from "@molecules/index";
import { filterFormState, transactionsCount, balanceChartDateRange } from "@recoil/dashboard/atoms";
import { subscribe, unsubscribe } from "@utils/Events";
import { DisplaySections, Transaction, TransactionForm } from "@utils/Types";
import useDashboardData from "@hooks/useDashboardData";
import FilterSection from "./FilterSection";
import { deleteRequest, postRequest } from "@utils/Api";
import { useInfiniteScroll } from "@hooks/index";

function dateConverter(items: Transaction[]) {
  if (Array.isArray(items)) {
    return items.map((item: Transaction) => {
      item.date = new Date(item.date);
      return item;
    });
  } else return [];
}

const PAGE_SIZE = 25;

export interface TransactionSidebarProps {
  searchFormOpen: boolean;
  setSearchFormOpen(open: boolean): void;
}

export default function TransactionSidebar(props: TransactionSidebarProps) {
  const observerTarget = useRef(null);

  const balanceDateRange = useRecoilValue(balanceChartDateRange);
  const [searchForm, setSearchForm] = useRecoilState(filterFormState);
  const [_, setTotalCount] = useRecoilState(transactionsCount);
  const { mutate: dashMutate } = useDashboardData();

  const { mutate, items, loading, empty } = useInfiniteScroll<Transaction>(observerTarget, async function (page) {
    let { total, items } = await postRequest<{ total: number; items: Transaction[] }>("/api/transactions/search", {
      ...searchForm,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    });

    setTotalCount(total);

    return dateConverter(items);
  });

  function apiDeleteTransaction(id: string) {
    deleteRequest("/api/transactions/deleteBulk", {
      ids: [id],
    }).then(() => {
      mutate();
      dashMutate([DisplaySections.BalanceAnalysis, DisplaySections.Insights], {
        balanceAnalysisDateRange: balanceDateRange,
      });
    });
  }

  useEffect(() => {
    function onFilter(e: CustomEvent) {
      if (typeof e?.detail === "object") {
        setSearchForm({
          ...searchForm,
          ...e.detail,
        });
        setTimeout(mutate);
      } else {
        mutate();
      }
    }

    subscribe("transactionSearchFormSubmit", onFilter);
    return () => unsubscribe("transactionSearchFormSubmit", onFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="tSidebar">
      <FilterSection open={props.searchFormOpen} setOpen={props.setSearchFormOpen} />
      <TransactionList showSkeletons={loading} showEmpty={empty} transactions={items} onDelete={apiDeleteTransaction} />
      <div ref={observerTarget} className="pixel" />
    </div>
  );
}
