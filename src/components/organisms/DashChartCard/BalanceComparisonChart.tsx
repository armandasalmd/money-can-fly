import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { BalanceAnalysisModel } from "@server/models";
import { Empty } from "@atoms/index";

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController
);

const options = {
  plugins: {
    filler: {
      propagate: false,
    },
  },
  scales: {
    y: {
      min: 0,
    },
  }
};

interface BalanceComparisonChartProps {
  apiModel: BalanceAnalysisModel;
}

export default function BalanceComparisonChart(props: BalanceComparisonChartProps) {
  if (!props.apiModel || props.apiModel.errorMessage) {
    return <Empty text={props?.apiModel?.errorMessage} />;
  }

  const data = {
    labels: props.apiModel.chartLabels,
    datasets: [
      {
        type: "line" as const,
        label: "Total worth",
        borderColor: "rgb(214, 162, 17)",
        borderWidth: 2,
        cubicInterpolationMode: "monotone",
        data: props.apiModel.totalWorthDataset,
      },
      {
        type: "line" as const,
        label: "Projection",
        borderColor: "rgb(214, 162, 17)",
        borderWidth: 2,
        cubicInterpolationMode: "monotone",
        data: props.apiModel.projectionDataset,
        borderDash: [10, 8],
      },
      {
        type: "line" as const,
        label: "Expected worth",
        borderWidth: 2,
        borderColor: "rgb(121, 181, 148)",
        cubicInterpolationMode: "monotone",
        data: props.apiModel.expectedWorthDataset,
        borderDash: [10, 8],
      },
      {
        type: "bar" as const,
        label: "Investments",
        backgroundColor: "rgba(54, 118, 191, 0.5)",
        borderColor: "rgb(19, 121, 168)",
        borderWidth: 1,
        barThickness: 36,
        data: props.apiModel.investmentsDataset,
      },
    ],
  };
  return <Chart height="90px" className="invertColors" type="bar" data={data as any} options={options} />;
}
