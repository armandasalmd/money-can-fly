import { Chart } from "react-chartjs-2";
import { BalanceAnalysisModel } from "@server/models";
import { Empty } from "@atoms/index";

interface BalanceComparisonChartProps {
  apiModel: BalanceAnalysisModel;
}

export default function BalanceComparisonChart(props: BalanceComparisonChartProps) {
  if (!props.apiModel || props.apiModel.errorMessage) {
    return <Empty />;
  }

  const data = {
    labels: [], //props.apiModel.chartLabels,
    datasets: [
      {
        type: "line" as const,
        label: "Total worth",
        borderColor: "rgb(19, 121, 168)",
        borderWidth: 2,
        cubicInterpolationMode: "monotone",
        data: [] //props.apiModel.totalWorthDataset
      },
      {
        type: "line" as const,
        label: "Projection",
        borderColor: "rgb(19, 121, 168)",
        borderWidth: 2,
        cubicInterpolationMode: "monotone",
        data: [],// props.apiModel.projectionDataset,
        borderDash: [10, 8],
      },
      {
        type: "line" as const,
        label: "Expected worth",
        borderWidth: 2,
        borderColor: "rgb(121, 181, 148)",
        cubicInterpolationMode: "monotone",
        data: [],// props.apiModel.expectedWorthDataset,
        borderDash: [10, 8]
      },
      {
        type: "line" as const,
        label: "Investments",
        borderColor: "rgb(214, 162, 17)",
        backgroundColor: "rgba(214, 162, 17, 0.2)",
        borderWidth: 2,
        cubicInterpolationMode: "monotone",
        data: [], //props.apiModel.investmentsDataset,
        fill: "origin",
        pointStyle: "triangle",
        pointRadius: 6
      },
    ],
  };
  return <Chart height={360} className="invertColors" type="line" data={data as any} options={{
    maintainAspectRatio: false
  }} />;
}
