import { FileCsv, Trash } from "phosphor-react";

interface FileCardProps {
  file: File;
  onRemove: (fileName: string) => void;
}

export default function FileCard(props: FileCardProps) {
  function handleRemove() {
    props.onRemove(props.file.name);
  }

  return (
    <div className="fileCard">
      <div className="fileCard__name">
        <FileCsv className="fileCard__icon" size={24} color="var(--color-success)" weight="duotone" />
        <p>{props.file.name}</p>
      </div>
      <Trash className="fileCard__remove" onClick={handleRemove} size={24} color="var(--shade50)" />
    </div>
  );
}
