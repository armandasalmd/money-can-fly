import { Line } from "react-chartjs-2";
import { Empty } from "@atoms/index";
import { InvestmentProfitChart } from "@server/models/display/Investments";
import { getBackgroundColor } from "@utils/ChartColors";

export default function Component(props: InvestmentProfitChart) {
  if (!props || !props.labels || props.labels.length === 0) {
    return <Empty />;
  }

  const data = {
    labels: props.labels,
    datasets: [
      {
        label: "Adjustments profit",
        borderColor: "rgb(214, 162, 17)",
        borderWidth: 2,
        borderRadius: 2,
        cubicInterpolationMode: "monotone",
        data: props.values,
        fill: {above: getBackgroundColor("orange"), below: getBackgroundColor("grey"), target: {value: 0}}
      }
    ],
  };

  return <Line className="invertColors" data={data as any} height={300} options={{
    maintainAspectRatio: false
  }} />;
}