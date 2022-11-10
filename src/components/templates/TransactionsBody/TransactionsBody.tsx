import { useState } from "react";
import { Card, CardHeaderAction } from "@atoms/index";
import { TransactionFullList, TransactionSearchForm } from "@molecules/index";

export default function TransactionsBody() {
  const [loading, setLoading] = useState(false);
  const deleteAction: CardHeaderAction = {
    text: "Delete selected",
    onClick: () => console.log("Delete"),
    type: "danger",
  };

  return (
    <div className="transactionsBody">
      <div className="transactionsBody__filters">
        <Card
          noDivider
          noContentPaddingX
          noContentPaddingY
          loading={loading}
          loadingText="Filtering transactions..."
          header={{
            title: "Filters",
            color: "primary",
          }}
        >
          <TransactionSearchForm onSubmit={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 3000);
          }} />
        </Card>
      </div>
      <div className="transactionsBody__transactions">
        <Card
          className="transactionsBody__header"
          headerActions={[deleteAction]}
          noDivider
          header={{
            title: "Transactions",
            description: "Showing 1-20 of 1251",
            color: "primary",
          }}
          noContentPaddingX
          noContentPaddingY
        />
        <TransactionFullList />
      </div>
    </div>
  );
}
