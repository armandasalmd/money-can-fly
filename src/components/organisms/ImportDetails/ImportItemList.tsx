import { Transaction } from "@utils/Types";
import { Empty } from "@atoms/index";
import { ImportTransactionItem } from "@components/molecules";

interface ImportItemListProps {
  importItems: Transaction[];
  onSetActive(importItem: Transaction): void;
}

export default function ImportItemList(props: ImportItemListProps) {
  if (!props.importItems?.length) {
    return <Empty text="No import items" />;
  }

  const elements = props.importItems.map((item) => <ImportTransactionItem key={item._id} transaction={item} onSetActive={props.onSetActive} />);

  return <div className="importDetails__list">{elements}</div>;
}
