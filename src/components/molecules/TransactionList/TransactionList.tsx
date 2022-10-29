import { Transaction } from "@utils/Types";
import TransactionItem from "./TransactionItem";

export interface TransactionListProps {
  transactions: Transaction[];
}

export default function TransactionList(props: TransactionListProps) {
  return (
    <div className="tList">
      {props.transactions.map((transaction) => (
        <TransactionItem key={transaction.id} {...transaction} />
      ))}
    </div>
  );
}
