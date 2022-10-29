import classNames from "classnames";
import { TransactionSearchForm, TransactionList, mockTransactions } from "@molecules/index";
import { TransactionForm } from "@molecules/TransactionSearchForm/TransactionSearchForm";

export interface TransactionSidebarProps {
  searchFormOpen: boolean;
}

export default function TransactionSidebar(props: TransactionSidebarProps) {
  const classes = classNames("tSidebar", {});

  function handleSubmit(form: TransactionForm) {
    console.log(form);
  }

  return <div className={classes}>
    {props.searchFormOpen && <TransactionSearchForm onSubmit={handleSubmit} />}
    <TransactionList transactions={mockTransactions} />
  </div>;
}
