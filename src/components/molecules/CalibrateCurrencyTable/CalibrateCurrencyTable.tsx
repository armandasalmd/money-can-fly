import TableRow from "./CalibrateCurrencyRow";
import { CalibrateCurrencyRow } from "@utils/Types";
import { Empty } from "@atoms/index";

interface CalibrateCurrencyTableProps {
  rows: CalibrateCurrencyRow[];
  onClick?(currency: CalibrateCurrencyRow): void;
}

export default function CalibrateCurrencyTable(props: CalibrateCurrencyTableProps) {
  if (!Array.isArray(props.rows)) {
    return <Empty text="Currency table is empty" />
  }

  return (
    <div className="calibrateTable">
      {props.rows.map((o) => (
        <TableRow key={o.inApp.currency} data={o} onClick={props.onClick} />
      ))}
    </div>
  );
}
