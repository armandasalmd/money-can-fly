
import { Card, CardHeaderAction } from "@atoms/index";
import { TransactionFullList } from "@components/molecules";

export default function TransactionsBody() {

  const deleteAction: CardHeaderAction = {
    text: "Delete selected",
    onClick: () => console.log("Delete"),
    type: "danger",
  }

  return (
    <div className="transactionsBody">
      <div className="transactionsBody__transactions">
        <Card
          headerActions={[deleteAction]}
          noDivider
          header={{
            title: "All transactions",
            description: "Total 1,658 transactions",
            color: "success",
          }}
          noContentPaddingX
          noContentPaddingY
        >
          <TransactionFullList />
        </Card>
      </div>
    </div>
  );
}