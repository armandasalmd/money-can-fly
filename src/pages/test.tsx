import "@utils/ChartJsInit";
import "@utils/ChartJsDateAdapter";

import { ChartConfiguration } from "chart.js";
import { enGB } from "date-fns/locale";
import { Chart } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { ChartColor, DateRange, DisplaySections } from "@utils/Types";
import { DisplayModelRequest } from "@endpoint/dashboard/displayModel";
import { getBorderColor, getBackgroundColor } from "@utils/ChartColors";

function buildDataset(label: string, data: any, color: ChartColor, fill: boolean = true, opacity?: number, dashed?: boolean, hidden?: boolean) {
  return {
    backgroundColor: getBackgroundColor(color, opacity),
    borderColor: getBorderColor(color),
    borderWidth: 2,
    borderDash: dashed ? [10, 5] : undefined,
    cubicInterpolationMode: "monotone",
    radius: 0,
    fill,
    hidden,
    data,
    label,
  };
}

const config: ChartConfiguration = {
  type: "line",
  data: {
    datasets: [
      buildDataset("Total worth", [], "blue"),
      buildDataset("Prediction", [], "grey", false, undefined, true),
      buildDataset("Investment value", [], "yellow", true, 0.2, false, true),
    ],
  },
  options: {
    interaction: {
      intersect: false,
    },
    parsing: false,
    scales: {
      x: {
        type: "time",
        time: {
          tooltipFormat: "MMMM dd, HH:mm",
          isoWeekday: 1,
        },
        adapters: {
          date: {
            locale: enGB,
          },
        },
        ticks: {
          maxRotation: 0,
          major: {
            enabled: true,
          },
          font: function (context) {
            if (context.tick && context.tick.major) {
              return {
                weight: "bold",
              };
            }
          },
        },
      },
      y: {
        ticks: {
          // Include a dollar sign in the ticks
          callback: (value) => "$" + value
        },
      },
    },
  },
};

export default function TestPage() {
  const [response, setResponse] = useState<any>();

  useEffect(() => {
    const monthDateRange: Required<DateRange> = {
      from: new Date(2021, 10, 15), //dateFromNow(-1200),
      to: new Date(2023, 11, 26), //dateFromNow(365)
    };
    const monthCaseBalanceSection: DisplayModelRequest = {
      balanceAnalysisDateRange: monthDateRange,
      categoryAnalysisDateRange: monthDateRange,
      sections: [DisplaySections.BalanceAnalysis],
      spendingChartRanges: [],
    };

    let requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(monthCaseBalanceSection),
    };

    async function loadFn() {
      let response = await fetch("/api/dashboard/displayModel", requestOptions);
      let body = await response.json();
      setResponse(body);
    }

    loadFn();
  }, []);

  let data = [];

  if (response) {
    config.data.datasets[0].data = response.balanceAnalysis.balanceDataset;
    config.data.datasets[1].data = response.balanceAnalysis.expectationDataset;
    config.data.datasets[2].data = response.balanceAnalysis.investmentDataset;
  }

  return (
    <div>
      {/* {data.map(o => <p key={o.i}>{new Date(o.x).toISOString()} = {o.y}</p>)} */}
      <p style={{ color: "white" }}>{response?.balanceAnalysis?.cardDescription ?? "Loading..."}</p>
      {response && <Chart height={100} className="invertColors" type="line" data={config.data as any} options={config.options as any} />}
    </div>
  );
}

{
  /* <Chart height={360} className="invertColors" type="bar" data={data as any} options={{
    maintainAspectRatio: false
  }} /> */
}
