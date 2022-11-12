import { useState } from "react";
import { Button } from "@atoms/index";
import { TransactionFullList, TransactionSearchForm } from "@molecules/index";

export default function TransactionsBody() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="transactionsBody">
      <div className="transactionsBody__filters">
        <div>
          <h2 className="transactionsBody__filtersHeader">Filters</h2>
          <TransactionSearchForm
            onSubmit={() => {
              setLoading(true);
              setTimeout(() => setLoading(false), 3000);
            }}
          />
        </div>
      </div>
      <div className="transactionsBody__transactions">
        <div className="transactionsBody__header">
          <div className="transactionsBody__headerTitle">
            <h2>Transactions</h2>
            <p className="transactionsBody__Subtitle">Showing 1-20 of 1251</p>
          </div>
          <div className="transactionsBody__headerActions">
            <Button type="danger">Delete selected (5)</Button>
          </div>
        </div>
        <TransactionFullList />
      </div>
    </div>
  );
}
