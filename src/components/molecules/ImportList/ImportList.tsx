import { Import } from "@utils/Types";
import ImportItem from "./ImportItem";
import { SkeletonItem, Empty } from "@atoms/index";

export interface ImportListProps {
  items: Import[];
  showSkeletons: boolean;
  showEmpty: boolean;
  onUndo: (id: string) => void;
  onClick?: (item: Import) => void;
}

export default function ImportList(props: ImportListProps) {
  let items = props.items.map((item) => (
    <ImportItem key={item._id} {...item} onUndo={props.onUndo} onClick={() => props.onClick(item)} />
  ));

  if (props.showSkeletons) {
    for (let i = 0; i < 5; i++) {
      items.push(<SkeletonItem key={i} template="import" borderBottom />);
    }
  }

  if (!props.showSkeletons && props.showEmpty) {
    return (<div className="iList iList--empty">
      <Empty text="No imports" />
    </div>);
  }

  return (
    <div className="iList">
      {items}
    </div>
  );
}
