import { useState, useRef } from "react";
import classNames from "classnames";
import { FileArrowUp } from "phosphor-react";

import { Button, Message } from "@atoms/index";
import { callIfFunction } from "@utils/Global";
import FileCard from "./FileCard";

export interface UploadAreaProps {
  accept: string;
  name: string;
  maxFileSizeInMb: number;
  multiple?: boolean;
  submitButtonText?: string;
  onChange?: (filesState: FileState) => void;
  onSubmit?: (filesState: FileState) => void;
}

export type FileState = {
  [fileName: string]: File;
};

export default function UploadArea(props: UploadAreaProps) {
  const classes = classNames("uploadArea", {});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileState>({});
  const [warning, setWarning] = useState("");

  function onClick() {
    fileInputRef.current?.click();
  }

  function handleNewFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const newFiles = Array.from(fileInputRef.current?.files);

    if (!newFiles) return;

    const hasInvalidFiles = newFiles.some((file) => file.type.match(props.accept) === null);

    if (hasInvalidFiles) {
      setWarning("Invalid file type found. Upload again");
      return;
    } else {
      setWarning("");
    }

    const hasOversidedFiles = newFiles.some((file) => file.size > props.maxFileSizeInMb * 1024 * 1024);

    if (hasOversidedFiles) {
      setWarning("File size is too big. Upload again");
      return;
    }

    const filesState = Array.from(newFiles).reduce((acc, file) => {
      acc[file.name] = file;

      return acc;
    }, {} as FileState);

    if (props.multiple) {
      const newState = { ...files, ...filesState };
      setFiles(newState);
      callIfFunction(props.onChange, newState);
    } else {
      setFiles(filesState);
      callIfFunction(props.onChange, filesState);
    }
  }

  function onRemove(fileName: string) {
    const newState = { ...files };
    delete newState[fileName];
    setFiles(newState);
    callIfFunction(props.onChange, newState);
  }

  function onSubmit() {
    callIfFunction(props.onSubmit, files);
    setFiles({})
  }

  return (
    <div className={classes}>
      <div className="uploadArea__box" onClick={onClick}>
        <div className="uploadArea__content">
          <div className="uploadArea__icon">
            <FileArrowUp size={48} weight="duotone" color="var(--color-information)" />
          </div>
          <h3 className="uploadArea__title">
            Drag and drop a file, or <span>Browse</span>
          </h3>
          <p className="uploadArea__subtitle">
            Only csv files supported {"("}Max {props.maxFileSizeInMb} Mb{")"}
          </p>
        </div>
        <input
          onChange={handleNewFileUpload}
          multiple={props.multiple}
          accept={props.accept}
          type="file"
          name={props.name}
          ref={fileInputRef}
        />
      </div>
      {warning && (
        <Message colorType="warning" messageStyle="card" onDismiss={() => setWarning("")}>
          {warning}
        </Message>
      )}
      <div className="uploadArea__selections">
        {Object.values(files).map((file) => (
          <FileCard file={file} key={file.name} onRemove={onRemove} />
        ))}
      </div>
      {Object.values(files).length > 0 && (
        <div>
          <Button wrapContent tall type="primary" onClick={onSubmit}>
            {props.submitButtonText || "Submit and upload"}
          </Button>
        </div>
      )}
    </div>
  );
}
