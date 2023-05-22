import React, { useRef } from "react";
import { Bar, getElementAtEvent } from "react-chartjs-2";

import Categories from "@atoms/CategoryIcon/TransactionCategories";

import { Empty } from "@atoms/index";
import { CategoryAnalysisModel } from "@server/models";
import { Category } from "@utils/Types";

interface CategoryChartProps {
  apiModel: CategoryAnalysisModel;
  onCaterogyClick?(category: Category): void;
}

export default function CategoryChart(props: CategoryChartProps) {
  const chartRef = useRef();

  if (!props.apiModel || props.apiModel.errorMessage || props.apiModel.chartLabels.length === 0) {
    return <Empty />;
  }

  const data = {
    labels: props.apiModel.chartLabels,
    datasets: [
      {
        label: "Money spent",
        data: props.apiModel.categorySpendingDataset,
        backgroundColor: "rgba(54, 118, 191, 0.5)",
        borderColor: "rgb(19, 121, 168)",
        borderWidth: 2,
        borderRadius: 2,
      },
      {
        label: "Last 3 months average",
        data: props.apiModel.averageSpendingDataset,
        backgroundColor: "rgba(200, 200, 200, 0.7)",
        borderWidth: 0,
      },
    ],
  };

  const onClick = (event: any) => {
    const [item] = getElementAtEvent(chartRef.current, event);

    if (item && item.datasetIndex === 0) {
      const label = props.apiModel.chartLabels[item.index];
      const category = Object.entries(Categories).find(([_, c]) => c.name === label);

      if (category) {
        props.onCaterogyClick(category[0] as Category);
      }
    }
  };

  return (
    <Bar
      ref={chartRef}
      onClick={onClick}
      className="invertColors"
      height={340}
      data={data}
      options={{
        maintainAspectRatio: false,
      }}
    />
  );
}
