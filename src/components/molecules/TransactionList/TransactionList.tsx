import { Transaction } from "@utils/Types";
import TransactionItem from "./TransactionItem";
import { Empty } from "@atoms/index";

export interface TransactionListProps {
  transactions: Transaction[];
  onDelete?: (id: string) => void;
}

export default function TransactionList(props: TransactionListProps) {
  return (
    <div className="tList">
      {props.transactions.map((transaction) => (
        <TransactionItem
          key={transaction.id}
          transaction={transaction}
          onDelete={props.onDelete}
        />
      ))}
      {props.transactions.length === 0 && <Empty />}
    </div>
  );
}
