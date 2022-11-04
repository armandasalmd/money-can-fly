import { useState } from "react";
import { Message } from "@atoms/index";
import { CreateUpdatePredictionForm } from "@components/molecules";
import { MonthPrediction } from "@utils/Types";

export default function CreateTransactionSidebar() {
  const [success, setSuccess] = useState("Prediction created sucessfully.");
  const [editPrediction, setEditPrediction] =
    useState<MonthPrediction | null>(null);

  function onFormSubmit(prediction: MonthPrediction) {
    console.log(prediction);
  }

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
      <CreateUpdatePredictionForm
        prediction={editPrediction}
        onSubmit={onFormSubmit}
      />
    </div>
  );
}
