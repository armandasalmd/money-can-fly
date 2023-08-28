import { useEffect, useState } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import format from "date-fns/format";
import useSWR from "swr";

import { Card, CardHeaderAction, Empty, HeaderProps, Select } from "@atoms/index";
import { PredictionPreviewList } from "@components/molecules";
import { MonthPrediction } from "@utils/Types";
import WeeklyPredictionsChart from "./WeeklyPredictionsChart";
import { amountForDisplay } from "@utils/Currency";
import { yearsPreset } from "@utils/SelectItems";
import { editorChartToolState, chartToolState, monthPredictionFormState, getDefaultWeekPredictions } from "@recoil/predictions/atoms";
import { subscribe, unsubscribe } from "@utils/Events";
import { deleteRequest } from "@utils/Api";

function getCardHeader(p: MonthPrediction, editorChartOverride: boolean): HeaderProps {
  if (editorChartOverride) {
    return {
      title: "Interactive chart",
      description: "Edit form on the right to update chart",
    };
  }

  if (!p) {
    return {
      title: "Please select monthly prediction",
    };
  }

  return {
    title: "Prediction for " + format(p.period.from, "yyyy MMMM"),
    description: `Total change ${amountForDisplay({
      currency: p.currency,
      amount: p.totalChange || 0,
    })}`,
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
  const yearNowString = new Date().getFullYear().toString();
  const [selectedYear, setSelectedYear] = useState(yearsPreset.find((o) => o.value === yearNowString).value);
  const { data: predictions, mutate } = useSWR(`/api/predictions/read?year=${selectedYear}`, fetcher);

  const editorChartTool = useRecoilValue(editorChartToolState);
  const [chartTool, setChartTool] = useRecoilState(chartToolState);
  const displayEditorChart = editorChartTool !== null;
  const [formState, setFormState] = useRecoilState(monthPredictionFormState);

  const copyAction: CardHeaderAction = {
    text: "Copy",
    onClick: () => {
      const d = getDefaultWeekPredictions();
      const weekPredCopy = chartTool.predictions.map((o, index) => ({ ...o, label: d[index].label }));

      setFormState({
        ...formState,
        predictions: weekPredCopy,
      });
    },
    type: "default",
    tooltip: "Copy selected values to the form ->",
  };

  const deleteAction: CardHeaderAction = {
    text: "Delete",
    onClick: () => {
      const id = chartTool?.id;

      deleteRequest<any>("/api/predictions/resetPeriod", { predictionId: id }).then((data) => {
        if (data.success) {
          setChartTool(null);
          mutate();
        }
      });
    },
    type: "danger",
    popConfirm: {
      placement: "bottomRight",
      description: "Delete prediction for selected month",
      onConfirm: () => {},
    },
  };

  function onYearChange(year: string) {
    setSelectedYear(year);
    setChartTool(null);
  }

  function onSelect(prediction: MonthPrediction) {
    if (prediction === chartTool) {
      setChartTool(null);
    } else {
      setChartTool(prediction);
    }
  }

  useEffect(() => {
    function onPredictionUpdated(/*{detail: newPrediction}*/) {
      mutate();
    }

    subscribe("predictionsUpdated", onPredictionUpdated);

    return () => {
      unsubscribe("predictionsUpdated", onPredictionUpdated);
    };
  }, [mutate]);

  return (
    <div className="predictionsBody">
      <div className="predictionsBody__periods">
        <Card
          noDivider
          header={{
            title: "Preview expectations",
            description: displayEditorChart ? "Disable chart tool to preview existing" : "Select monthly period to preview",
            color: displayEditorChart ? "warning" : "primary",
          }}
          noContentPaddingX
          noContentPaddingY
        >
          {!displayEditorChart && (
            <div className="predictionsBody__yearSelect">
              <Select required items={yearsPreset} placeholder="Filter by year" value={selectedYear} onChange={onYearChange} />
            </div>
          )}
          {!displayEditorChart && <PredictionPreviewList selectedPrediction={chartTool} onSelect={onSelect} predictions={predictions} />}
        </Card>
      </div>
      <div className="predictionsBody__chart">
        <Card
          noDivider
          header={getCardHeader(chartTool, displayEditorChart)}
          headerActions={chartTool && !displayEditorChart ? [copyAction, deleteAction] : undefined}
        >
          {(chartTool || displayEditorChart) && <WeeklyPredictionsChart prediction={displayEditorChart ? editorChartTool : chartTool} />}
          {!chartTool && !displayEditorChart && <Empty />}
        </Card>
      </div>
    </div>
  );
}
