import "@utils/ChartJsInit";
import "@utils/ChartJsDateAdapter";

import { ChartConfiguration } from "chart.js";
import { Chart } from "react-chartjs-2";
import { BalanceAnalysisModel } from "@server/models";
import { ChartColor } from "@utils/Types";
import { Empty } from "@atoms/index";
import { getBackgroundColor, getBorderColor } from "@utils/ChartColors";
import { amountForDisplay } from "@utils/Currency";
import { enGB } from "date-fns/locale";

interface DashChartProps {
  apiModel: BalanceAnalysisModel;
}

export default function DashChart(props: DashChartProps) {
  if (!props.apiModel || props.apiModel.errorMessage) {
    return <Empty />;
  }

  return <Chart height={100} className="invertColors" {...buildConfig(props.apiModel)} />;
}

function buildConfig(apiModel: BalanceAnalysisModel): ChartConfiguration {
  return {
    type: "line",
    data: {
      datasets: [
        buildDataset("Expectation", apiModel.expectationDataset, apiModel.settings.predictionColor, false, undefined, true),
        buildDataset("Investment value", apiModel.investmentDataset, apiModel.settings.investmentColor, true, 0.2, false, apiModel.settings.hideInvestmentsOnLoad),
        buildDataset("Total worth", apiModel.balanceDataset, apiModel.settings.totalWorthColor),
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
            callback: (value) => amountForDisplay({
              currency: "USD",
              amount: value as number
            })
          },
        },
      },
    },
  };
}

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
