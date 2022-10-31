import { useState } from "react";

import { Message, UploadArea, Card, FileState } from "@atoms/index";
import { ImportConfigForm } from "@organisms/index";
import { ImportFormState } from "@organisms/ImportConfigForm/ImportPresets";

export default function ImportsBody() {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File>(null);

  function onSubmitFile(filesState: FileState) {
    if (Object.keys(filesState).find((o) => true)) {
      setFile(filesState[Object.keys(filesState)[0]]);
    } else {
      setFile(null);
    }
  }

  function onStartImport(formState: ImportFormState) {
    console.log("Import started", formState);

    // read csv string here
    setFile(null);
    
    setTimeout(() => {
      setMessage("Import process successfully started. Check import history.");
    }, 1000);
  }

  return (
    <div className="importsBody">
      {message && (
        <Message fadeIn colorType="success" messageStyle="card" onDismiss={() => setMessage("")}>
          {message}
        </Message>
      )}
      <Card
        noDivider
        header={{
          title: "Upload CSV statement",
          description: "Select CSV file to unlock next step",
        }}
      >
        <UploadArea
          multiple={false}
          accept=".csv"
          name="importFile"
          maxFileSizeInMb={4}
          onSubmit={onSubmitFile}
          submitButtonText="Go to next step"
        />
      </Card>
      <ImportConfigForm importFile={file} onStartImport={onStartImport} onClose={() => setFile(null)} />
    </div>
  );
}
