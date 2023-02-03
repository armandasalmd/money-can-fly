import { useState, useEffect } from "react";
import { useRecoilValue, useResetRecoilState } from "recoil";

import { SidebarHeaderProps } from "@atoms/index";
import { TransactionSidebar } from "@organisms/index";
import { AppLayout, DashboardBody } from "@templates/index";
import { transactionsCount, selectedInvestment, dashboardData } from "@recoil/dashboard/atoms";

export default function DashboardPage() {
  const [searchFormOpen, setSearchFormOpen] = useState(true);
  const count = useRecoilValue(transactionsCount);
  
  const reset1 = useResetRecoilState(transactionsCount);
  const reset2 = useResetRecoilState(selectedInvestment);
  const reset3 = useResetRecoilState(dashboardData);

  const header: SidebarHeaderProps = {
    title: "Transactions",
    subtitle: `${count} results in total`,
    actionButton: {
      children: "Filter",
      type: searchFormOpen ? "easy" : "default",
      wrapContent: true,
      tall: true,
      onClick: () => setSearchFormOpen(!searchFormOpen),
    },
  };

  useEffect(() => {
    return () => {
      reset1();
      reset2();
      reset3();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppLayout header={header}>
      <AppLayout.Sidebar>
        <TransactionSidebar searchFormOpen={searchFormOpen} />
      </AppLayout.Sidebar>
      <AppLayout.Content>
        <DashboardBody />
      </AppLayout.Content>
    </AppLayout>
  );
}
