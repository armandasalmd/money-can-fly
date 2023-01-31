import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

import { Empty } from "@atoms/index";
import { CategoryAnalysisModel } from "@server/models";

const options = {
  indexAxis: "y" as const,
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
  }
};

interface CategoryChartProps {
  apiModel: CategoryAnalysisModel;
}

export default function CategoryChart(props: CategoryChartProps) {
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
        borderRadius: 2
      },
      {
        label: "Last 3 months average",
        data: props.apiModel.averageSpendingDataset,
        backgroundColor: "rgba(200, 200, 200, 0.7)",
        borderWidth: 0
      }
    ],
  };

  return <Bar className="invertColors" height={264} options={options} data={data} />;
}
