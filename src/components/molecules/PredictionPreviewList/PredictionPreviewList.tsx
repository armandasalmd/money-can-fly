import { useState } from "react";

import PredictionPreviewListItem from "./PredictionPreviewListItem";
import { MonthPrediction } from "@utils/Types";
import { Empty } from "@atoms/index";

export interface PredictionPreviewListProps {
  predictions: MonthPrediction[];
  onSelect: (prediction: MonthPrediction) => void;
}

export default function PredictionPreviewList(
  props: PredictionPreviewListProps
) {
  const { predictions } = props;
  const [selectedPred, setSelectedPred] =
    useState<MonthPrediction | null>(null);

  function onSelect(prediction: MonthPrediction) {
    if (prediction === selectedPred) {
      setSelectedPred(null);
      props.onSelect(null);
    } else {
      setSelectedPred(prediction);
      props.onSelect(prediction);
    }
  }

  return (
    <div className="predictionList">
      {predictions.map((prediction) => (
        <PredictionPreviewListItem
          key={prediction.period.from.toISOString()}
          prediction={prediction}
          isSelected={selectedPred === prediction}
          onClick={onSelect}
        />
      ))}
      {predictions.length === 0 && <Empty text="No predictions set yet!" />}
    </div>
  );
}
