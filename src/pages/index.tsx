import { useState } from "react";
import { useRecoilValue } from "recoil";

import { SidebarHeaderProps } from "@atoms/index";
import { TransactionSidebar } from "@organisms/index";
import { AppLayout, DashboardBody } from "@templates/index";
import { transactionsCount } from "@recoil/dashboard/atoms";

export default function DashboardPage() {
  const [searchFormOpen, setSearchFormOpen] = useState(true);
  const count = useRecoilValue(transactionsCount);

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
