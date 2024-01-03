import { Transaction } from "@utils/Types";
import TransactionItem from "./TransactionItem";
import { Empty, SkeletonItem } from "@atoms/index";

export interface TransactionListProps {
  transactions: Transaction[];
  onDelete?: (id: string) => void;
  showSkeletons: boolean;
  showEmpty: boolean;
}

export default function TransactionList(props: TransactionListProps) {
  let items = props.transactions?.map((transaction) => <TransactionItem key={transaction._id} transaction={transaction} onDelete={props.onDelete} />);

  if (!Array.isArray(items)) {
    items = [];
  }

  if (props.showSkeletons) {
    for (let i = 0; i < 14; i++) {
      items.push(<SkeletonItem borderTop key={i} template="transaction" />);
    }
  }

  return (
    <div className="tList">
      {items}
      {props.showEmpty && <Empty />}
    </div>
  );
}
