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
import { faker } from "@faker-js/faker";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  indexAxis: "y" as const,
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
  elements: {
    bar: {
      borderWidth: 2,
      borderRadius: 8,
    }
  },
};

const labels = ["Food", "Entertainment", "Hobbies", "Bills", "Other", "Games", "Gifts", "Health", "Travel", "Clothing", "Transport"];

export const data = {
  labels,
  datasets: [
    {
      label: "Result",
      data: labels.map(() => -faker.datatype.number({ min: -380, max: -200 })),
      backgroundColor: "rgba(54, 118, 191, 0.5)",
      borderColor: "rgba(54, 118, 191, 1)",
    },
    {
      label: "Average",
      data: labels.map(() => -faker.datatype.number({ min: -300, max: 0 })),
      backgroundColor: "rgba(156, 150, 142, 0.5)",
      borderColor: "rgba(156, 150, 142, 0.8)",
    }
  ],
};

export default function CategoryChart() {
  return <Bar className="invertColors" height="256px" options={options} data={data} />;
}
