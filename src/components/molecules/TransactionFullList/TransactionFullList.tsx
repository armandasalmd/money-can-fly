import { useState } from "react";
import { Transaction } from "@utils/Types";
import TransactionFullListItem from "./TransactionFullListItem";
import { Pagination, mockTransactions } from "@molecules/index";
import { usePagination } from "@hooks/index";

// 1. Delete selected should should select count (<count>). Also this button should be hidden if no transactions are selected.
// 2. Clicking edit action, should transfer Transaction object to "Create/Edit Transaction sidebar".
// 3. Card header UX design should change. That bar is not looking cool
// 4. Pagination should work with mock transaction data list

export interface PredictionPreviewListProps {}

export default function TransactionFullList(props: PredictionPreviewListProps) {
  const [selectedTransactions, setSelectedTransactions] = useState<
    Transaction[]
  >([]);
  const { currentData, maxPage, jump } = usePagination<Transaction>(
    mockTransactions,
    20
  );

  function onSelect(t: Transaction) {
    if (selectedTransactions.includes(t)) {
      setSelectedTransactions([
        ...selectedTransactions.filter((st) => st.id !== t.id),
      ]);
    } else {
      setSelectedTransactions([...selectedTransactions, t]);
    }
  }

  return (
    <div className="tFullList">
      <div className="tFullList__items">
        {currentData()?.map((t, index) => (
          <TransactionFullListItem
            onSelect={onSelect}
            selected={selectedTransactions.includes(t)}
            transaction={t}
            key={index}
          />
        ))}
      </div>
      {maxPage > 0 && (
        <div className="tFullList__pagination">
          <Pagination pageCount={maxPage} onChange={jump} />
        </div>
      )}
    </div>
  );
}
