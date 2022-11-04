import { useState } from "react";

import { SidebarHeaderProps } from "@atoms/index";
import { TransactionSidebar } from "@organisms/index";
import { AppLayout, DashboardBody } from "@templates/index";

export default function DashboardPage() {
  const [searchFormOpen, setSearchFormOpen] = useState(true);

  const header: SidebarHeaderProps = {
    title: "Transactions",
    subtitle: "132 results",
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
