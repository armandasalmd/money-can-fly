import { useState } from "react";

import { Message, UploadArea, Card, FileState, MessageColor } from "@atoms/index";
import { ImportSettingsDrawer } from "@molecules/index";
import { ImportConfigForm } from "@organisms/index";
import { ImportFormState } from "@organisms/ImportConfigForm/ImportPresets";
import { StartImportRequest } from "@endpoint/imports/start";
import { ImportCsvReader } from "@utils/CsvReader";
import { GearSix } from "phosphor-react";
import { postRequest } from "@utils/Api";

interface ImportsBodyProps {
  onImportStarted: (importId: string) => void;
}

export default function ImportsBody(props: ImportsBodyProps) {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<MessageColor>("info");
  const [file, setFile] = useState<File>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  function onSubmitFile(filesState: FileState) {
    if (Object.keys(filesState).find((o) => true)) {
      setFile(filesState[Object.keys(filesState)[0]]);
    } else {
      setFile(null);
    }
  }

  async function onStartImport(formState: ImportFormState) {
    const reader = new ImportCsvReader();
    const csvData = await reader.readRaw(file);
    const request: StartImportRequest = {
      csvData,
      csvFileName: file.name,
      ...formState,
    };

    const data = await postRequest<any>("/api/imports/start", request);

    if (data?.success) {
      setMessageType("info");
      setMessage("Import process successfully started. Check import history.");

      props.onImportStarted(data.import?._id);
    } else {
      setMessageType("error");
      setMessage(`Error. ${data.message}}`);  
    }

    setFile(null);
  }

  return (
    <div className="importsBody">
      {message && (
        <Message fadeIn colorType={messageType} messageStyle="card" onDismiss={() => setMessage("")}>
          {message}
        </Message>
      )}
      <Card
        noDivider
        header={{
          title: "Step 1. Upload CSV statement",
          description: "Select a file to use for import",
        }}
        headerActions={[
          {
            text: "",
            onClick: () => setSettingsOpen(true),
            type: "default",
            icon: GearSix,
            tooltip: "File parsing settings",
          }
        ]}
      >
        <UploadArea
          multiple={false}
          accept=".csv"
          name="importFile"
          maxFileSizeInMb={1}
          onSubmit={onSubmitFile}
          submitButtonText="Go to next step"
        />
      </Card>
      <ImportConfigForm importFile={file} onStartImport={onStartImport} onClose={() => setFile(null)} />
      {settingsOpen && <ImportSettingsDrawer open={true} onClose={() => setSettingsOpen(false)} />}
    </div>
  );
}
