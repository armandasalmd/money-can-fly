import { SidebarHeaderProps } from "@atoms/index";
import { CreateTransactionSidebar } from "@components/organisms";
import { AppLayout, TransactionsBody } from "@templates/index";

export default function TransactionsPage() {
  const header: SidebarHeaderProps = {
    title: "Create transaction",
    subtitle: "Last addition just now",
  };

  return (
    <AppLayout header={header}>
      <AppLayout.Sidebar>
        <CreateTransactionSidebar />
      </AppLayout.Sidebar>
      <AppLayout.Content>
        <TransactionsBody />
      </AppLayout.Content>
    </AppLayout>
  );
}
