import { SidebarHeaderProps } from "@atoms/index";
import { ImportSidebar } from "@organisms/index";
import { AppLayout, ImportsBody } from "@templates/index";

export default function ImportPage() {
  const header: SidebarHeaderProps = {
    title: "Import history",
    subtitle: "Last import 1 month ago • Total 22 imports",
  };

  return (
    <AppLayout header={header}>
      <AppLayout.Sidebar>
        <ImportSidebar />
      </AppLayout.Sidebar>
      <AppLayout.Content>
        <ImportsBody />
      </AppLayout.Content>
    </AppLayout>
  );
}
