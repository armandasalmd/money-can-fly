import "@utils/ChartJsInit";

import { SidebarHeaderProps } from "@atoms/index";
import { SetPredictionSidebar } from "@components/organisms";
import { AppLayout, PredictionsBody } from "@templates/index";

import { useRecoilValue, useResetRecoilState } from "recoil";
import { monthPredictionFormState, editorChartToolState, chartToolState } from "@recoil/predictions/atoms";
import { useEffect } from "react";

export default function PredictionsPage() {
  const setFormState = useRecoilValue(monthPredictionFormState);
  const isEditing = !!setFormState.id;

  const reset1 = useResetRecoilState(editorChartToolState);
  const reset2 = useResetRecoilState(chartToolState);
  const reset3 = useResetRecoilState(monthPredictionFormState);

  const header: SidebarHeaderProps = {
    title: isEditing ? "Override existing expectation" : "Create new expectation",
    subtitle: isEditing ? "Values for selected period exists" : "Values for selected period does not exist",
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
        <SetPredictionSidebar />
      </AppLayout.Sidebar>
      <AppLayout.Content>
        <PredictionsBody />
      </AppLayout.Content>
    </AppLayout>
  );
}
