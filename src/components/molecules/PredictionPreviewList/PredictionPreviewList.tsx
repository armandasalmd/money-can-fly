import { useState } from "react";

import PredictionPreviewListItem from "./PredictionPreviewListItem";
import { MonthPrediction } from "@utils/Types";
import { Empty } from "@atoms/index";

export interface PredictionPreviewListProps {
  predictions: MonthPrediction[];
  onSelect: (prediction: MonthPrediction | null) => void;
  selectedPrediction: MonthPrediction | null;
}

export default function PredictionPreviewList(
  props: PredictionPreviewListProps
) {
  const { predictions } = props;

  function onSelect(prediction: MonthPrediction) {
    props.onSelect(prediction);
  }

  return (
    <div className="predictionList">
      {Array.isArray(predictions) && predictions.map((prediction) => (
        <PredictionPreviewListItem
          key={prediction.period.from.toISOString()}
          prediction={prediction}
          isSelected={props.selectedPrediction === prediction}
          onClick={onSelect}
        />
      ))}
      {(predictions?.length ?? 0) === 0 && <Empty text="No expectations set yet!" />}
    </div>
  );
}
