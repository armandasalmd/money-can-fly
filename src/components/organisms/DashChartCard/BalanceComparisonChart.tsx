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
import { faker } from "@faker-js/faker";

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

const labels = ["January", "February", "March", "April", "May", "June", "July"];
const actualData = labels.map(() => faker.datatype.number({ min: 2000, max: 5000 }));
actualData[actualData.length - 1] = NaN;

const projectionData = labels.map(() => NaN);
projectionData[actualData.length - 1] = faker.datatype.number({ min: 2000, max: 5000 });
projectionData[actualData.length - 2] = actualData[actualData.length - 2];

export const data = {
  labels,
  datasets: [
    {
      type: "line" as const,
      label: "Actual",
      borderColor: "rgb(55, 111, 179)",
      borderWidth: 2,
      fill: "origin",
      cubicInterpolationMode: "monotone",
      data: actualData,
    },
    {
      type: "line" as const,
      label: "Projection",
      borderColor: "rgb(55, 111, 179)",
      borderWidth: 2,
      fill: false,
      cubicInterpolationMode: "monotone",
      data: projectionData,
      borderDash: [6, 6],
    },
    {
      type: "line" as const,
      label: "Expected",
      fill: true,
      borderWidth: 2,
      borderColor: "rgb(119, 189, 189)",
      cubicInterpolationMode: "monotone",
      data: labels.map(() => faker.datatype.number({ min: 0, max: 5645 })),
      borderDash: [6, 6],
    },
  ],
};

const options = {
  plugins: {
    filler: {
      propagate: false,
    },
  },
  scales: {
    y: {
      min: 0
    }
  },
  interaction: {
    intersect: true,
  }
};

export default function BalanceComparisonChart() {
  return <Chart height="170px" className="invertColors" type="bar" data={data as any} options={options} />;
}
