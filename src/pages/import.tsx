import { Button, SidebarHeaderProps } from "@atoms/index";
import { AppLayout } from "@templates/index";

export default function ImportPage() {
  const header: SidebarHeaderProps = {
    title: "Import history",
    subtitle: "Last import 1 month ago • Total 22 imports",
  };

  return (
    <AppLayout header={header}>
      <AppLayout.Sidebar>
        <h1>Dashboard sidebar</h1>
      </AppLayout.Sidebar>
      <AppLayout.Content>
        <div>
          <Button wrapContent centerText>
            Welcome to import page!
          </Button>
        </div>
      </AppLayout.Content>
    </AppLayout>
  );
}
