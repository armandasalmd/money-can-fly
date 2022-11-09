import { MonthPrediction } from "@utils/Types";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
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

export const options = {
  responsive: true,
  interaction: {
    mode: "index" as const,
    intersect: false,
  },
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};

const labels = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];

function toChartData(p: MonthPrediction): ChartData<"bar", number[], unknown> {
  if (!p) return { labels, datasets: [] };

  return {
    labels,
    datasets: [
      {
        label: "Income",
        backgroundColor: "rgb(75, 192, 192)",
        data: p.predictions.map((w) => w.moneyIn),
      },
      {
        label: "Expenses",
        backgroundColor: "rgb(255, 99, 132)",
        data: p.predictions.map((w) => -w.moneyOut),
      },
    ],
  };
}

export interface WeeklyPredictionsChartProps {
  prediction: MonthPrediction;
}

export default function WeeklyPredictionsChart(
  props: WeeklyPredictionsChartProps
) {
  return <Bar className="invertColors" options={options} data={toChartData(props.prediction)} />;
}
