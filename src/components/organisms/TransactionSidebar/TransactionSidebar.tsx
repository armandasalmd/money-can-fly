import { useEffect, useRef } from "react";
import { useRecoilValue, useRecoilState } from "recoil";

import { TransactionList } from "@molecules/index";
import { filterFormState, transactionsCount, balanceChartDateRange, DEFAULT_FILTER_FORM } from "@recoil/dashboard/atoms";
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
  const [, setTotalCount] = useRecoilState(transactionsCount);
  const [, setFilterForm] = useRecoilState(filterFormState);
  const { mutate: dashMutate } = useDashboardData();

  const { mutate, items, loading, empty } = useInfiniteScroll<Transaction>(observerTarget, filterFormState, async function (page, detail) {
    let newFilters = {
      ...DEFAULT_FILTER_FORM,
      ...(detail || {})
    };
    
    let { total, items } = await postRequest<{ total: number; items: Transaction[] }>("/api/transactions/search", {
      ...newFilters,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE
    });

    setFilterForm(newFilters);
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
    function onFilter(e: CustomEvent<TransactionForm>) {
      mutate(e.detail);
      props.setSearchFormOpen(false);
    }

    subscribe("searchFormSubmit", onFilter);
    return () => unsubscribe("searchFormSubmit", onFilter);
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
