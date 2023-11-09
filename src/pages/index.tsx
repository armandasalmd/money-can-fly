import { useState, useEffect } from "react";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { Funnel } from "phosphor-react";

import "@utils/ChartJsInit";
import { SidebarHeaderProps } from "@atoms/index";
import { TransactionSidebar } from "@organisms/index";
import { transactionsCount, dashboardData } from "@recoil/dashboard/atoms";
import { AppLayout, DashboardBody } from "@templates/index";

export default function DashboardPage() {
  const [searchFormOpen, setSearchFormOpen] = useState(false);
  const count = useRecoilValue(transactionsCount);

  const reset1 = useResetRecoilState(transactionsCount);
  const reset2 = useResetRecoilState(dashboardData);

  const header: SidebarHeaderProps = {
    title: "Transactions",
    subtitle: `${count} results in total`,
    actionButton: {
      children: "Filter",
      icon: Funnel,
      wrapContent: true,
      tall: true,
      onClick: () => setSearchFormOpen(!searchFormOpen),
    },
  };

  useEffect(() => {
    return () => {
      reset1();
      reset2();
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
