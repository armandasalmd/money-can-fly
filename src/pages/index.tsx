import { useState, useEffect } from "react";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { Funnel, NoteBlank } from "phosphor-react";

import "@utils/ChartJsInit";
import { SidebarHeaderProps } from "@atoms/index";
import { TransactionSidebar } from "@organisms/index";
import { dashboardData, balanceChartDateRange, spendingChartDateRanges, transactionsCount, filterFormState } from "@recoil/dashboard/atoms";
import { AppLayout, DashboardBody } from "@templates/index";
import { publish } from "@utils/Events";

export default function DashboardPage() {
  const [searchFormOpen, setSearchFormOpen] = useState(false);
  const countLabel = useRecoilValue(transactionsCount);

  const resetBalanceChart = useResetRecoilState(balanceChartDateRange);
  const resetDashboardData = useResetRecoilState(dashboardData);
  const resetSpendingChart = useResetRecoilState(spendingChartDateRanges);
  const resetFilters = useResetRecoilState(filterFormState);

  const header: SidebarHeaderProps = {
    title: "Transactions",
    subtitle: `${countLabel} results in total`,
    actionButtons: [
      {
        tooltip: "Show filters",
        icon: Funnel,
        wrapContent: true,
        tall: true,
        onClick: () => setSearchFormOpen(!searchFormOpen),
      },
      {
        icon: NoteBlank,
        tall: true,
        onClick: () => publish("searchFormSubmit", null),
        wrapContent: true,
        tooltip: "Clear filters"
      },
    ],
  };

  useEffect(() => {
    return () => {
      resetBalanceChart();
      resetDashboardData();
      resetSpendingChart();
      resetFilters();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppLayout header={header} alwaysScroll>
      <AppLayout.Sidebar>
        <TransactionSidebar searchFormOpen={searchFormOpen} setSearchFormOpen={setSearchFormOpen} />
      </AppLayout.Sidebar>
      <AppLayout.Content>
        <DashboardBody />
      </AppLayout.Content>
    </AppLayout>
  );
}
