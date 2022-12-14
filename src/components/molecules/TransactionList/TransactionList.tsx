import { Transaction } from "@utils/Types";
import TransactionItem from "./TransactionItem";
import { Button, Empty, SkeletonItem } from "@atoms/index";

export interface TransactionListProps {
  transactions: Transaction[];
  onDelete?: (id: string) => void;
  showSkeletons: boolean;
  showLoadMore: boolean;
  onLoadMore: () => void;
}

export default function TransactionList(props: TransactionListProps) {
  let items = props.transactions?.map((transaction) => (
    <TransactionItem key={transaction._id} transaction={transaction} onDelete={props.onDelete} />
  ));

  if (!Array.isArray(items)) {
    items = [];
  }

  if (props.showSkeletons) {
    for (let i = 0; i < 8; i++) {
      items.push(<SkeletonItem borderTop key={i} template="transaction" />);
    }
  }

  return (
    <div className="tList">
      {items}
      {props.showLoadMore && (
        <div className="tList__loadMore">
          <Button type="easy" centerText onClick={props.onLoadMore}>Load more</Button>
        </div>
      )}
      {!props.transactions || (props.transactions.length === 0 && !props.showSkeletons && <Empty />)}
    </div>
  );
}
