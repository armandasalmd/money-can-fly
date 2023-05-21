import { useMemo, useRef, useState, useEffect } from "react";
import { Chart, getElementAtEvent } from "react-chartjs-2";

import { Empty } from "@atoms/index";
import { MonthlySpendingDataset } from "@server/models/index";
import { generate, SelectedPoint } from "./ChartDataHelper";
import { DateRange } from "@utils/Types";

interface SpendingChartProps {
  datasets?: MonthlySpendingDataset[];
  onSearch(dateRange: Required<DateRange> | null): void;
}

export default function SpendingChart(props: SpendingChartProps) {
  const chartRef = useRef();
  const [selected, setSelected] = useState<SelectedPoint>(null);
  const chartData = useMemo(() => (Array.isArray(props.datasets) ? generate(props.datasets, selected) : null), [props.datasets, selected]);

  useEffect(() => {
    if (props.datasets) setSelected(null);
  }, [props.datasets]);
  
  if (chartData === null) return <Empty />;

  const onClick = (event: any) => {
    const [item] = getElementAtEvent(chartRef.current, event);

    if (item) {
      const antiOffsetIndex = item.index - props.datasets
        .filter((_, index) => index < item.datasetIndex)
        .reduce((acc, item) => acc + item.dateLine.length, 0);
      const isAlreadySelected = selected && selected.datasetIndex === item.datasetIndex && selected.index === antiOffsetIndex;

      if (isAlreadySelected) {
        setSelected(null);
        props.onSearch(null);
      } else if (antiOffsetIndex > 0) {
        const dateLine = props.datasets[item.datasetIndex].dateLine;

        if (dateLine[antiOffsetIndex]) {
          props.onSearch({
            from: new Date(dateLine[antiOffsetIndex - 1]),
            to: new Date(dateLine[antiOffsetIndex])
          });
          setSelected({
            datasetIndex: item.datasetIndex,
            index: antiOffsetIndex
          });
        }
      }
    }
  };

  return <Chart type="line" ref={chartRef} onClick={onClick} className="invertColors" height={100} data={chartData} />;
}
