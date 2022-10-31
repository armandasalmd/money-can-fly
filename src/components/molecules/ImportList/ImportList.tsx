import { Import } from "@utils/Types";
import ImportItem from "./ImportItem";

export interface ImportListProps {
  items: Import[];
}

export default function ImportList(props: ImportListProps) {
  return (
    <div className="iList">
      {props.items.map((a) => (
        <ImportItem key={a.id} {...a} />
      ))}
    </div>
  );
}
