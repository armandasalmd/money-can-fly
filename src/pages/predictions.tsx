import "@utils/ChartJsInit";

import { useEffect } from "react";
import { useResetRecoilState } from "recoil";

import { SidebarHeaderProps } from "@atoms/index";
import { ExpectationsSidebar } from "@components/organisms";
import { AppLayout, ExpectationsBody } from "@templates/index";
import { selectedMonthExpectation } from "@recoil/expectations/atoms";

export default function PredictionsPage() {
  const reset1 = useResetRecoilState(selectedMonthExpectation);

  const header: SidebarHeaderProps = {
    title: "Monthly expectations",
    subtitle: "Select month to set target budget",
  };

  useEffect(() => {
    return () => {
      reset1();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppLayout header={header}>
      <AppLayout.Sidebar>
        <ExpectationsSidebar />
      </AppLayout.Sidebar>
      <AppLayout.Content>
        <ExpectationsBody />
      </AppLayout.Content>
    </AppLayout>
  );
}
