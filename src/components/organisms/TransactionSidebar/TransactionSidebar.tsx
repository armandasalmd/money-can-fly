import classNames from "classnames";
import { TransactionSearchForm, TransactionList, mockTransactions } from "@molecules/index";

export interface TransactionSidebarProps {
  searchFormOpen: boolean;
}

export default function TransactionSidebar(props: TransactionSidebarProps) {
  const classes = classNames("tSidebar", {});

  return <div className={classes}>
    {props.searchFormOpen && <TransactionSearchForm />}
    <TransactionList transactions={mockTransactions} />
  </div>;
}
