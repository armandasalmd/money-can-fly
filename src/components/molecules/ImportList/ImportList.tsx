import { Import } from "@utils/Types";
import ImportItem from "./ImportItem";
import { SkeletonItem, Button, Empty } from "@atoms/index";

export interface ImportListProps {
  items: Import[];
  showSkeletons: boolean;
  showLoadMore: boolean;
  showEmpty: boolean;
  onLoadMore: () => void;
  onUndo: (id: string) => void;
}

export default function ImportList(props: ImportListProps) {
  let items = props.items.map((item) => (
    <ImportItem key={item._id} {...item} onUndo={props.onUndo} />
  ));

  if (props.showSkeletons) {
    for (let i = 0; i < 5; i++) {
      items.push(<SkeletonItem key={i} template="import" borderBottom />);
    }
  }

  if (props.showEmpty) {
    return (<div className="iList iList--empty">
      <Empty text="No imports" />
    </div>);
  }

  return (
    <div className="iList">
      {items}
      {props.showLoadMore && <div className="iList__loadMore"><Button centerText onClick={props.onLoadMore}>Load more</Button></div>}
    </div>
  );
}
