import { useState } from "react";
import { Message } from "@atoms/index";
import { CreateUpdateTransactionForm } from "@components/molecules";
import { Transaction } from "@utils/Types";

export default function CreateTransactionSidebar() {
  const [success, setSuccess] = useState("Transaction created sucessfully.");
  const [editTransaction, setEditTransaction] =
    useState<Transaction | null>(null);

  function onFormSubmit(transaction: Transaction) {
    console.log(transaction);
  }
  // TODO: Delete this component. Looks like its not used.

  return (
    <div style={{ background: "var(--shade0)", height: "100%" }}>
      <div style={{ background: "var(--bg-card)" }}>
        <Message
          colorType="success"
          messageStyle="bordered"
          onDismiss={() => setSuccess("")}
          fadeIn
        >
          {success}
        </Message>
      </div>
      {/* <CreateUpdateTransactionForm

        onSubmit={onFormSubmit}
      /> */}
    </div>
  );
}
