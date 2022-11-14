import { useState } from "react";
import format from "date-fns/format";

import { Card, CardHeaderAction, Empty, HeaderProps } from "@atoms/index";
import { PredictionPreviewList } from "@components/molecules";
import { MonthPrediction } from "@utils/Types";
import MockPredictions from "./MockPredictions";
import WeeklyPredictionsChart from "./WeeklyPredictionsChart";
import { amountForDisplay } from "@utils/Currency";

function getCardHeader(p: MonthPrediction): HeaderProps {
  if (!p) {
    return {
      title: "Please select montly prediction",
      color: "info",
    };
  }

  return {
    title: "Prediction for " + format(p.period.from, "yyyy MMMM"),
    description: `Total change ${amountForDisplay({
      currency: p.currency,
      amount: p.totalChange || 0,
    })}`,
    color: "info",
  };
}

export default function PredictionsBody() {
  const [selectedPred, setSelectedPred] =
    useState<MonthPrediction | null>(null);

  const editAction: CardHeaderAction = {
    text: "Change",
    onClick: () => console.log("Change"),
    type: "default",
  };

  const deleteAction: CardHeaderAction = {
    text: "Reset",
    onClick: () => console.log("Reset"),
    type: "danger",
  };

  return (
    <div className="predictionsBody">
      <div className="predictionsBody__periods">
        <Card
          noDivider
          header={{
            title: "Preview predictions",
            description: "Select monthly period to preview",
            color: "info",
          }}
          noContentPaddingX
          noContentPaddingY
        >
          <PredictionPreviewList
            onSelect={setSelectedPred}
            predictions={MockPredictions}
          />
        </Card>
      </div>

      <Card
        className="predictionsBody__chart"
        noDivider
        header={getCardHeader(selectedPred)}
        headerActions={selectedPred ? [deleteAction, editAction] : undefined}
      >
        {selectedPred && <WeeklyPredictionsChart prediction={selectedPred} />}
        {!selectedPred && <Empty />}
      </Card>
    </div>
  );
}
