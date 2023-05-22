import { useState, useEffect } from "react";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { Chart as ChartJS, CategoryScale, PointElement, LineElement, BarController, LinearScale, BarElement, Title, Tooltip, Legend, Filler, LineController } from "chart.js";
import { Funnel } from "phosphor-react";

import { SidebarHeaderProps } from "@atoms/index";
import { TransactionSidebar } from "@organisms/index";
import { transactionsCount, selectedInvestment, dashboardData } from "@recoil/dashboard/atoms";
import { AppLayout, DashboardBody } from "@templates/index";

ChartJS.register(
  PointElement,
  BarController,
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Filler,
  LineController,
  LineElement,
  Legend);

export default function DashboardPage() {
  const [searchFormOpen, setSearchFormOpen] = useState(false);
  const count = useRecoilValue(transactionsCount);

  const reset1 = useResetRecoilState(transactionsCount);
  const reset2 = useResetRecoilState(selectedInvestment);
  const reset3 = useResetRecoilState(dashboardData);

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
      reset3();
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
