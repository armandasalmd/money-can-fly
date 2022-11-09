import { SidebarHeaderProps } from "@atoms/index";
import { CreatePredictionSidebar } from "@components/organisms";
import { AppLayout, PredictionsBody } from "@templates/index";

export default function PredictionsPage() {
  const header: SidebarHeaderProps = {
    title: "Set expected spending",
    subtitle: "Targets used for comparison",
  };

  return (
    <AppLayout header={header}>
      <AppLayout.Sidebar>
        <CreatePredictionSidebar />
      </AppLayout.Sidebar>
      <AppLayout.Content>
        <PredictionsBody />
      </AppLayout.Content>
    </AppLayout>
  );
}
