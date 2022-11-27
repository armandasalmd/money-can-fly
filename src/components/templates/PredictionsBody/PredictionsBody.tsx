import { useState } from "react";
import format from "date-fns/format";

import { Card, CardHeaderAction, Empty, HeaderProps, Select } from "@atoms/index";
import { PredictionPreviewList } from "@components/molecules";
import { MonthPrediction } from "@utils/Types";
import WeeklyPredictionsChart from "./WeeklyPredictionsChart";
import { amountForDisplay } from "@utils/Currency";
import { yearsPreset } from "@utils/SelectItems";
import useSWR, { mutate } from "swr";

function getCardHeader(p: MonthPrediction): HeaderProps {
  if (!p) {
    return {
      title: "Please select monthly prediction",
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

const fetcher = (url: string) =>
  fetch(url).then(async (res) => {
    const data = await res.json();
    if (Array.isArray(data)) {
      data.forEach((item) => {
        item.period.from = new Date(item.period.from);
        item.period.to = new Date(item.period.to);
      });
    }
    return data;
  });

export default function PredictionsBody() {
  const [selectedPred, setSelectedPred] = useState<MonthPrediction | null>(null);
  const [selectedYear, setSelectedYear] = useState(yearsPreset.find((o) => true).value);
  const { data: predictions, mutate } = useSWR(`/api/predictions/read?year=${selectedYear}`, fetcher);

  const editAction: CardHeaderAction = {
    text: "Change",
    onClick: () => console.log("Change"),
    type: "default",
  };

  const deleteAction: CardHeaderAction = {
    text: "Reset",
    onClick: () => {
      const id = selectedPred?.id;

      fetch("/api/predictions/resetPeriod", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ predictionId: id }),
      }).then((res) => {
        return res.json();
      }).then((data) => {
        if (data.success) {
          setSelectedPred(null);
          mutate();
        }
      });
    },
    type: "danger",
  };

  function onYearChange(year: string) {
    setSelectedYear(year);
    setSelectedPred(null);
  }

  function onSelect(prediction: MonthPrediction) {
    if (prediction === selectedPred) {
      setSelectedPred(null);
    } else {
      setSelectedPred(prediction);
    }
  }

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
          <div className="predictionsBody__yearSelect">
            <Select
              required
              items={yearsPreset}
              placeholder="Filter by year"
              value={selectedYear}
              onChange={onYearChange}
            />
          </div>
          <PredictionPreviewList selectedPrediction={selectedPred} onSelect={onSelect} predictions={predictions} />
        </Card>
      </div>
      <div className="predictionsBody__chart">
        <Card
          noDivider
          header={getCardHeader(selectedPred)}
          headerActions={selectedPred ? [deleteAction, editAction] : undefined}
        >
          {selectedPred && <WeeklyPredictionsChart prediction={selectedPred} />}
          {!selectedPred && <Empty />}
        </Card>
      </div>
    </div>
  );
}
