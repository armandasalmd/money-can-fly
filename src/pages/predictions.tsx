import { Button, SidebarHeaderProps } from "@atoms/index";
import { CreatePredictionSidebar } from "@components/organisms";
import { AppLayout } from "@templates/index";

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
        <div>
          <Button wrapContent>Welcome to Predictions page! Hehe</Button>
        </div>
      </AppLayout.Content>
    </AppLayout>
  );
}
