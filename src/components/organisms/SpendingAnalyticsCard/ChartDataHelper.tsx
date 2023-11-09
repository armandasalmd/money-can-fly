import { ChartData, ChartDataset } from "chart.js";
import { format } from "date-fns";
import { MonthlySpendingDataset } from "@server/models";
import { getBackgroundColor, getBorderColor } from "@utils/ChartColors";

export interface SelectedPoint {
  datasetIndex: number;
  index: number;
}

const colors = {
  datasets: [getBorderColor("green"), getBorderColor("blue"), getBorderColor("orange")],
  datasetsbg: [getBackgroundColor("green"), getBackgroundColor("blue"), getBackgroundColor("orange")],
};

const baseSpendingLineStyle = (target: number) => ({
  cubicInterpolationMode: "monotone",
  fill: { above: "rgba(245,100,100,0.25)", below: "rgba(0,0,0,0)", target: { value: target } },
  pointRadius: 6,
  pointHoverRadius: 12,
});

function createBudgetLimit(apiDatasets: MonthlySpendingDataset[]): ChartDataset {
  return {
    label: "Budget limit",
    data: apiDatasets.flatMap((d) => Array(d.dateLine.length).fill(d.budgetLimit)),
    borderColor: "rgb(140,100,100,0.5)",
    pointRadius: 0,
    pointHoverRadius: 0,
    borderWidth: 2,
    borderDash: [12, 9],
    stepped: true,
  };
}

function createSpendingLine(apiData: MonthlySpendingDataset, index: number, offsetWithNaN: number): ChartDataset {
  if (index >= colors.datasets.length) {
    return { data: [] };
  } // out of range

  const data = Array(offsetWithNaN).fill(NaN);

  data.push(apiData.spendingLine);

  return {
    ...baseSpendingLineStyle(apiData.budgetLimit),
    label: apiData.label,
    borderColor: colors.datasets[index],
    backgroundColor: colors.datasetsbg[index],
    data: data.flat(),
  };
}

function highlight(fromLabel: string, toLabel: string, datasetIndex: number): ChartDataset {
  return {
    backgroundColor: "rgba(70,180,255,0.5)",
    borderWidth: 0,
    data: [
      { x: fromLabel as any, y: 0 },
      { x: toLabel as any, y: 0 },
    ],
    fill: datasetIndex,
    label: "Search range",
    pointRadius: 0,
  };
}

// Note: this fixes the bug with +1 timezone difference
function parseDate (iso: string) {
  if (!iso) return;
  const [year, month, day] = iso.split("T")[0].split("-");
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
}

export function generate(apiDatasets: MonthlySpendingDataset[], selected?: SelectedPoint): ChartData {
  const result = { labels: [], datasets: [] };

  if (!Array.isArray(apiDatasets) || !apiDatasets.length) return result;

  try {
    result.labels = apiDatasets.flatMap((d) => d.dateLine.map((l) => format(parseDate(l as any as string), "MMM d")));

    let offsetWithNaN = 0;
    const offsetMap = {};

    for (let i = 0; i < apiDatasets.length; i++) {
      const lineData = createSpendingLine(apiDatasets[i], i, offsetWithNaN);

      offsetMap[i] = offsetWithNaN;
      offsetWithNaN = lineData.data.length - 1;
      result.datasets.push(lineData);
    }

    result.datasets.push(createBudgetLimit(apiDatasets));

    if (selected && selected.index > 0) {
      const labelIndex = offsetMap[selected.datasetIndex] + selected.index;

      result.datasets.push(highlight(result.labels[labelIndex - 1], result.labels[labelIndex], selected.datasetIndex));
    }
  } catch (e) {
    console.error(e);
    return null;
  }

  return result;
}
