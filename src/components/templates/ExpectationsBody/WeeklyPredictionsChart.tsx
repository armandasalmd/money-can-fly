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
import { Chart } from "react-chartjs-2";

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

function toChartData(
  p: MonthPrediction
): ChartData<"bar" | "line", number[], unknown> {
  if (!p) return { labels, datasets: [] };

  const accumulatedTotal = [];
  let sum = 0;

  for (let i = 0; i < p.predictions.length; i++) {
    const change = p.predictions[i].moneyIn - p.predictions[i].moneyOut;
    sum += change;
    accumulatedTotal.push(sum);
  }

  return {
    labels,
    datasets: [
      {
        type: "line" as const,
        label: "Total change",
        borderColor: "rgb(48, 100, 150)",
        borderWidth: 2,
        data: accumulatedTotal,
      },
      {
        type: "bar" as const,
        label: "Income",
        backgroundColor: "rgb(139, 168, 50)",
        data: p.predictions.map((w) => w.moneyIn),
      },
      {
        type: "bar" as const,
        label: "Expenses",
        backgroundColor: "rgb(227, 98, 134)",
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
  return (
    <Chart
      type="bar"
      className="invertColors"
      options={options}
      data={toChartData(props.prediction)}
    />
  );
}
