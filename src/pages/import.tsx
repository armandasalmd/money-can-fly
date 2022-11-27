import { ImportSidebar } from "@organisms/index";
import { AppLayout, ImportsBody } from "@templates/index";
import { useState } from "react";

export default function ImportPage() {
  const [subtitle, setSubtitle] = useState("Loading...");
  const [runningImportId, setRunningImportId] = useState("");

  return (
    <AppLayout
      header={{
        title: "Import history",
        subtitle,
      }}
    >
      <AppLayout.Sidebar>
        <ImportSidebar
          setSubtitle={setSubtitle}
          runningImportId={runningImportId}
          setRunningImportId={setRunningImportId}
        />
      </AppLayout.Sidebar>
      <AppLayout.Content>
        <ImportsBody onImportStarted={setRunningImportId} />
      </AppLayout.Content>
    </AppLayout>
  );
}
